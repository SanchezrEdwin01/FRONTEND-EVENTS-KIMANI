import React from 'react';
import fallback from '../../assets/images/user.png';
import IconBase, { IconBaseProps } from '../IconBase';
import { User } from '@/types';
import { generateFileURL } from '@/utils/utils';

interface Props extends IconBaseProps<User> {
  status?: boolean;
  override?: string;
  showServerIdentity?: boolean;
}

export function useStatusColour(user?: User) {
  return user?.online && user?.status?.presence !== 'Invisible'
    ? user?.status?.presence === 'Idle'
      ? '#808080'
      : user?.status?.presence === 'Focus'
        ? '#2196F3'
        : user?.status?.presence === 'Busy'
          ? '#FF9800'
          : '#2196F3'
    : '#3ABF7E';
}

export default function UserIcon(
  props: Props &
    Omit<JSX.SVGAttributes<SVGSVGElement>, keyof Props | 'children' | 'as'>
) {
  const {
    target,
    attachment,
    size,
    status,
    animate,
    mask,
    hover,
    showServerIdentity,
    masquerade,
    innerRef,
    override,
    ...svgProps
  } = props;

  let { url } = props;
  url =
    generateFileURL(
      override ?? target?.avatar ?? attachment ?? undefined,
      { max_side: 256 },
      animate
    ) ?? (target ? target.defaultAvatarURL : fallback);

  return (
    <IconBase
      {...svgProps}
      ref={innerRef}
      width={size}
      height={size}
      hover={hover}
      borderRadius="--border-radius-user-icon"
      aria-hidden="true"
      viewBox="0 0 32 32"
    >
      <foreignObject
        x="0"
        y="0"
        width="32"
        height="32"
        className="icon"
        mask={mask ?? (status ? 'url(#user)' : undefined)}
      >
        {<img src={url} draggable={false} loading="lazy" />}
      </foreignObject>
      {props.status && (
        <circle cx="27" cy="27" r="5" fill={useStatusColour(target)} />
      )}
    </IconBase>
  );
}
