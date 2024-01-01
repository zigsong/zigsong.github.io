import React from 'react';
import PropTypes from 'prop-types';

import RotateLinkImg from '../../RotateLinkImg';
import emailImg from './email.png';
import withThemeFlag from '../../../utils/withThemeFlag';

const Email = function ({ mailLink, size }) {
  if (!mailLink) return null;

  return (
    <RotateLinkImg href={`mailto:${mailLink}`} size={size} src={emailImg} aria-label="mail link" />
  );
};

Email.propTypes = {
  mailLink: PropTypes.string,
  size: PropTypes.number,
  // isLightTheme: PropTypes.bool,
};

Email.defaultProps = {
  mailLink: null,
  size: 24,
  // isLightTheme: true,
};

export default withThemeFlag(Email);
