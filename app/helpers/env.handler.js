/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable func-style */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable consistent-return */

export function updateEnvVariablesables(keys) {
  for (const key of keys) {
    delete process.env[key];
  }
}
