/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */

exports.updateEnvVariables = (keys) => {
  for (const key of keys) {
    delete process.env[key];
  }
};
