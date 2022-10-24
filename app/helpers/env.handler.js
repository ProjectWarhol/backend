/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */

exports.updateEnvVariables = (keys) => {
  keys.map((key) => {
    return delete process.env[key];
  });
};
