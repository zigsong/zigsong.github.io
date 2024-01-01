import React from 'react';
import PropTypes from 'prop-types';

import RotateLinkImg from '../../RotateLinkImg';
import logoImg from './linkedIn.png';
import withThemeFlag from '../../../utils/withThemeFlag';

const LinkedIn = function ({ username, size }) {
  if (!username) return null;

  return (
    <RotateLinkImg
      href={`https://linkedin.com/in/${username}`}
      size={size}
      src={logoImg}
      aria-label="linkedIn link"
    />
  );
};

LinkedIn.propTypes = {
  username: PropTypes.string,
  size: PropTypes.number,
  // isLightTheme: PropTypes.bool,
};

LinkedIn.defaultProps = {
  username: null,
  size: 24,
  // isLightTheme: true,
};

export default withThemeFlag(LinkedIn);
