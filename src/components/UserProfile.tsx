import { XCircleIcon } from "@heroicons/react/24/outline";
import { HeartIcon, UserCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import { Message, Edit, UserX } from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import { UserPermission, API } from "revolt.js";
import styled from "styled-components";

import styles from "./UserProfile.module.scss";
import cn from "classnames";
import { Localizer, Text } from "preact-i18n";
import { useEffect, useLayoutEffect, useState, useMemo } from "preact/hooks";

import { IconButton, Modal } from "@revoltchat/ui";

import { chainedDefer } from "../../../../lib/defer";
import { internalEmit } from "../../../../lib/eventEmitter";
import { noop } from "../../../../lib/js";
import { stopPropagation } from "../../../../lib/stopPropagation";

import EmailIcon from "./assets/email.svg";
import FacebookIcon from "./assets/facebook.svg";
import GenderIcon from "./assets/gender.svg";
import InstagramIcon from "./assets/instagram.svg";
import LinkedinIcon from "./assets/linkedin.svg";
import XIcon from "./assets/x.svg";

import Tooltip from "../../../../components/common/Tooltip";
import Markdown from "../../../../components/markdown/Markdown";
import { useSession } from "../../../../controllers/client/ClientController";
import { modalController } from "../../../../controllers/modals/ModalController";
import { DEFAULT_SERVER } from "../../../../utils/constants";
import { ModalProps } from "../../types";

const StyledImg = styled.img`
    position: relative;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -ms-transform: translateZ(0);
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
`;
export const UserProfile = observer(
    ({
        user_id,
        isPlaceholder,
        placeholderProfile,
        ...props
    }: ModalProps<"user_profile">) => {
        const [profile, setProfile] = useState<
            undefined | null | API.UserProfile
        >(undefined);
        const [mutual, setMutual] = useState<
            undefined | null | API.MutualResponse
        >(undefined);
        const [isPublicBot, setIsPublicBot] = useState<
            undefined | null | boolean
        >();
        const [joinedDate, setJoinedAt] = useState(
            new Date().getFullYear().toString(),
        );

        const history = useHistory();
        const session = useSession()!;
        const client = session.client!;

        const user = client.users.get(user_id);
        if (!user) {
            if (props.onClose) useEffect(props.onClose, []);
            return null;
        }

        useLayoutEffect(() => {
            if (!user_id) return;
            if (typeof profile !== "undefined") setProfile(undefined);
            if (typeof mutual !== "undefined") setMutual(undefined);
            if (typeof isPublicBot !== "undefined") setIsPublicBot(undefined);
            // eslint-disable-next-line
        }, [user_id]);

        useEffect(() => {
            if (isPlaceholder) {
                setProfile(placeholderProfile);
            }
        }, [isPlaceholder, placeholderProfile]);

        useEffect(() => {
            if (isPlaceholder) return;
            if (session.state === "Online" && typeof mutual === "undefined") {
                setMutual(null);
                user.fetchMutual().then(setMutual);
            }
        }, [mutual, session.state, isPlaceholder, user]);

        useEffect(() => {
            if (isPlaceholder) return;
            if (session.state === "Online" && typeof profile === "undefined") {
                setProfile(null);

                if (user.permission & UserPermission.ViewProfile) {
                    user.fetchProfile().then(setProfile).catch(noop);
                }
            }
        }, [profile, session.state, isPlaceholder, user]);

        useEffect(() => {
            if (
                session.state === "Online" &&
                user.bot &&
                typeof isPublicBot === "undefined"
            ) {
                setIsPublicBot(null);
                client.bots
                    .fetchPublic(user._id)
                    .then(() => setIsPublicBot(true))
                    .catch(noop);
            }
        }, [isPublicBot, session.state, user, client.bots]);

        const avatarURL = useMemo(
            () =>
                user?.avatar &&
                client.generateFileURL(user.avatar as any, {}, true),
            [client],
        );

        useEffect(() => {
            const fetchMemberJoinedAt = async () => {
                const member = await client.members.getKey({
                    server: DEFAULT_SERVER,
                    user: user_id,
                });
                if (member?.joined_at)
                    setJoinedAt(member?.joined_at.getFullYear().toString());
            };
            fetchMemberJoinedAt();
        }, [client?.members, user_id]);

        const children = (
            <>
                {!isPlaceholder && (
                    <div
                        className={cn([
                            styles.cta,
                            {
                                [styles.isOpen]:
                                    profile && props.signal !== "close",
                            },
                        ])}>
                        {(user.relationship === "Friend" || user.bot) && (
                            <Localizer>
                                <Tooltip
                                    content={
                                        <Text id="app.context_menu.message_user" />
                                    }>
                                    <IconButton
                                        onClick={(ev) =>
                                            stopPropagation(
                                                ev,
                                                user
                                                    .openDM()
                                                    .then((channel) => {
                                                        props.onClose?.();
                                                        history.push(
                                                            `/channel/${channel._id}`,
                                                        );
                                                        chainedDefer(() =>
                                                            internalEmit(
                                                                "LeftSidebar",
                                                                "open",
                                                                false,
                                                            ),
                                                        );
                                                    }),
                                            )
                                        }>
                                        <Message size={30} />
                                    </IconButton>
                                </Tooltip>
                            </Localizer>
                        )}
                        {user.relationship === "User" && !isPlaceholder && (
                            <IconButton
                                onClick={() => {
                                    props.onClose?.();
                                    history.push(`/settings/profile`);
                                }}>
                                <Edit size={28} />
                            </IconButton>
                        )}
                        {!user.bot &&
                            (user.relationship === "Incoming" ||
                                user.relationship === "None" ||
                                user.relationship === null) && (
                                <IconButton onClick={() => user.addFriend()}>
                                    <StyledImg
                                        src={"/assets/add-friends.webp"}
                                        alt="Add friend"
                                        width={55}
                                    />
                                </IconButton>
                            )}
                        {user.relationship === "Outgoing" && (
                            <IconButton onClick={() => user.removeFriend()}>
                                <UserX size={28} />
                            </IconButton>
                        )}
                    </div>
                )}
                <div className={styles.profile_picture}>
                    <img
                        src={avatarURL}
                        onClick={() =>
                            user.avatar &&
                            modalController.push({
                                type: "image_viewer",
                                attachment: user.avatar,
                            })
                        }
                    />
                    {!isPlaceholder && (
                        <XCircleIcon
                            width={40}
                            height={40}
                            stroke="white"
                            fill="black"
                            strokeWidth={2} 
                            style={{
                                position: "absolute",
                                top: 10,
                                right: 5,
                                cursor: "pointer",
                            }}
                            onClick={() => props.onClose?.()}
                        />
                    )}
                    <div className={styles.social_media}>
                        {profile?.facebook && (
                            <a
                                target="_blank"
                                href={profile?.facebook}
                                className={styles.social_link}>
                                <img src={FacebookIcon} alt="Facebook page" />
                            </a>
                        )}
                        {user?.email && (
                            <a
                                target="_blank"
                                href={user?.email}
                                className={styles.social_link}>
                                <img src={EmailIcon} alt="Email" />
                            </a>
                        )}
                        {profile?.instagram && (
                            <a
                                target="_blank"
                                href={profile?.instagram}
                                className={styles.social_link}>
                                <img src={InstagramIcon} alt="Instagram page" />
                            </a>
                        )}
                        {profile?.x_account && (
                            <a
                                target="_blank"
                                href={profile?.x_account}
                                className={styles.social_link}>
                                <img src={XIcon} alt="X page" />
                            </a>
                        )}
                        {profile?.linkedin && (
                            <a
                                target="_blank"
                                href={profile?.linkedin}
                                className={styles.social_link}>
                                <img src={LinkedinIcon} alt="LinkedIn page" />
                            </a>
                        )}
                    </div>
                </div>
                <div className={styles.content}>
                    <h2
                        onClick={() =>
                            modalController.writeText(user.username)
                        }>
                        {user?.display_name || user?.username}
                    </h2>
                    <div className={styles.role}>
                        Member <StarIcon width={15} color={"#e3d021"} />
                    </div>
                    {profile?.city && profile?.country && (
                        <p>
                            {profile.city} | {profile.country}
                        </p>
                    )}
                    <div className={styles.badges}>
                        <div className={styles.badge}>
                            <UserCircleIcon width={20} />
                            <span>{joinedDate}</span>
                        </div>
                        <div className={styles.badge}>
                            <HeartIcon width={20} />
                            <span>{profile?.relationship_status || "N/A"}</span>
                        </div>
                        <div className={styles.badge}>
                            <img src={GenderIcon} width={20} alt="gender" />
                            <span>{profile?.gender || "N/A"}</span>
                        </div>
                    </div>
                    <div className={styles.profile}>
                        <h3>About Me</h3>
                        <div className={styles.grouped_content}>
                            <Markdown content={profile?.content} />
                            <h4>Occupation</h4>
                            <p>{profile?.occupation || "N/A"}</p>
                        </div>
                        <h3>Interests</h3>
                        <div className={styles.grouped_content}>
                            <h4>Likes attending to</h4>
                            <p>{profile?.likes_attending_to || "N/A"}</p>
                        </div>
                        <div className={styles.grouped_content}>
                            <h4>Favorite destinations</h4>
                            <p>{profile?.favorite_destinations || "N/A"}</p>
                        </div>
                        <div className={styles.grouped_content}>
                            <h4>Languages spoken</h4>
                            <p>{profile?.languages_spoken || "N/A"}</p>
                        </div>
                        <div className={styles.grouped_content}>
                            <h4>Passions & Hobbies</h4>
                            <p>{profile?.passions_and_hobbies || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </>
        );

        if (isPlaceholder) return <div>{children}</div>;

        return (
            <Modal
                {...props}
                nonDismissable={isPlaceholder}
                transparent
                style={{
                    position: "relative",
                    display: "block",
                    padding: "5px 0 10px",
                    maxHeight: "100%",
                }}>
                {children}
            </Modal>
        );
    },
);
