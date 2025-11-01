import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { User } from '@/types';
import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode
} from 'react';
import { AxiosError } from 'axios';
import { getUrlParameter } from '@/utils/utils';
import { BASE_URL_KEY, DEFAULT_SERVER_ID } from '@/utils/constants';

const CACHE_KEY = 'currentUser';

type CurrentUserResult = { user: User; isAdmin: boolean } | null;

type UserCtx = {
  data: CurrentUserResult;
  isLoading: boolean;
  refresh: () => void;
};

const UserContextReact = createContext<UserCtx | undefined>(undefined);

function setBaseUrl() {
  const baseUrl = getUrlParameter('native');
  if (baseUrl !== null) localStorage.setItem(BASE_URL_KEY, baseUrl);
}

const ADMIN_RULES = {
  ownerIsAdmin: true,
  adminPermissionBit: 1 << 5,
  adminRoleIds: ['admin'],
  adminRoleNames: ['Admin']
};

type ServerDTO = {
  _id: string;
  owner: string;
  default_permissions: number;
  roles?: Record<string, { name?: string; permissions?: number }>;
};
type MemberDTO = { user_id: string; roles?: string[] };

function hasBit(mask: number, bit: number) {
  return (mask & bit) === bit;
}
function isAdminFrom(server: ServerDTO, member: MemberDTO): boolean {
  if (ADMIN_RULES.ownerIsAdmin && server.owner === member.user_id) return true;

  const memberRoleIds = member.roles ?? [];
  const roles = server.roles ?? {};

  if (
    ADMIN_RULES.adminRoleIds?.length &&
    memberRoleIds.some(id => ADMIN_RULES.adminRoleIds!.includes(id))
  ) {
    return true;
  }

  if (ADMIN_RULES.adminRoleNames?.length) {
    const wanted = ADMIN_RULES.adminRoleNames.map(n => n.toLowerCase());
    for (const rid of memberRoleIds) {
      const r = roles[rid];
      if (r?.name && wanted.includes(r.name.toLowerCase())) return true;
    }
  }

  if (typeof ADMIN_RULES.adminPermissionBit === 'number') {
    for (const rid of memberRoleIds) {
      const p = roles[rid]?.permissions ?? 0;
      if (hasBit(p, ADMIN_RULES.adminPermissionBit)) return true;
    }
  }
  return false;
}

/**
 * @param serverId
 *  - undefined: usa DEFAULT_SERVER_ID para calcular isAdmin
 *  - string: usa ese serverId
 *  - null | false: NO calcula isAdmin (solo current user)
 */
export const useUser = (serverId?: string | null | false) => {
  const queryClient = useQueryClient();

  const resolvedServerId =
    serverId === undefined ? DEFAULT_SERVER_ID : serverId ? serverId : null;

  return useQuery<CurrentUserResult>({
    queryKey: [CACHE_KEY, resolvedServerId ?? 'skip-admin'],
    queryFn: async () => {
      const urlToken = getUrlParameter('token');
      if (urlToken) {
        setBaseUrl();
        localStorage.setItem('token', urlToken);
        apiClient.defaults.headers.common['X-Session-Token'] = urlToken;
      }

      const headerToken = apiClient.defaults.headers.common['X-Session-Token'];
      const localStorageToken = localStorage.getItem('token');
      if (!urlToken && !headerToken && !localStorageToken) return null;

      try {
        const { data: user } = await apiClient.get<User>('/users/@me');

        if (!resolvedServerId) return { user, isAdmin: false };

        const { data: server } = await apiClient
          .get<ServerDTO>(`/servers/${resolvedServerId}`)
          .catch(err => {
            if (err?.response?.status === 404) {
              return { data: null as unknown as ServerDTO };
            }
            throw err;
          });
        if (!server) return { user, isAdmin: false };

        const userId = (user as any)?._id ?? (user as any)?.id;
        let member: MemberDTO | null = null;

        try {
          const { data } = await apiClient.get<MemberDTO>(
            `/servers/${resolvedServerId}/members/${encodeURIComponent(userId)}`
          );
          member = data;
        } catch (err: any) {
          const code = err?.response?.status;
          if (code === 404 || code === 405 || code === 400) {
            const { data } = await apiClient
              .get<MemberDTO>(`/servers/${resolvedServerId}/members/@me`, {
                validateStatus: s => (s >= 200 && s < 300) || s === 404
              })
              .then(resp =>
                resp.status === 404
                  ? { data: null as unknown as MemberDTO }
                  : resp
              );
            member = data;
          } else {
            throw err;
          }
        }

        if (!member) return { user, isAdmin: false };

        const isAdmin = isAdminFrom(server, member);

        if (isAdmin) {
          const uid = userId ?? 'unknown';
          // eslint-disable-next-line no-console
          console.info('[UserContext] Admin detected', {
            userId: uid,
            serverId: resolvedServerId,
            memberRoles: member?.roles ?? []
          });
        }

        return { user, isAdmin };
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          localStorage.removeItem('token');
          delete apiClient.defaults.headers.common['X-Session-Token'];
          queryClient.removeQueries({ queryKey: [CACHE_KEY] });
        }
      }
      return null;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: true
  });
};

export function UserProvider({
  children,
  serverId
}: {
  children: ReactNode;
  serverId?: string | null | false;
}) {
  const query = useUser(serverId);

  const value = useMemo<UserCtx>(
    () => ({
      data: query.data ?? null,
      isLoading: query.isFetching ?? false,
      refresh: () => {
        query.refetch?.();
      }
    }),
    [query.data, query.isFetching, query.refetch]
  );

  return (
    <UserContextReact.Provider value={value}>
      {children}
    </UserContextReact.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContextReact);
  if (!ctx)
    throw new Error('useUserContext must be used within <UserProvider>');
  return ctx;
}
