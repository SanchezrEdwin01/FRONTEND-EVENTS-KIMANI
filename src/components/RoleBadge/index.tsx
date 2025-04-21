import * as React from 'react';
import * as PropTypes from 'prop-types';
import undefinedProfilePicture from '@/assets/images/undefined-profile-picture.jpg';
import './styles.scss';

interface IRoleBadgeProps {
  text: string;
  profilePicture?: string;
  alt?: string;
  userName?: string;
}

const defaultProps = {
  profilePicture: undefinedProfilePicture,
  alt: 'Profile Picture',
  userName: ''
};

const validateRoleBadgeProps = (props: IRoleBadgeProps): void => {
  if (!props.text?.trim()) {
    throw new Error('RoleBadge requires a non-empty text prop');
  }
};

const RoleBadge: React.FC<IRoleBadgeProps> = props => {
  const { text, profilePicture, alt, userName } = { ...defaultProps, ...props };

  validateRoleBadgeProps(props);

  return (
    <div className="badge" role="status" aria-label={`Role: ${text}`}>
      <span className="text">{text}</span>
      {profilePicture && (
        <img
          src={profilePicture}
          alt={alt}
          className="profilePicture"
          loading="lazy"
          title={userName || alt}
          aria-hidden={!userName}
        />
      )}
    </div>
  );
};

RoleBadge.propTypes = {
  text: PropTypes.string.isRequired,
  profilePicture: PropTypes.string,
  alt: PropTypes.string,
  userName: PropTypes.string
};
export default RoleBadge;
