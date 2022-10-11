exports.updateEnvVariables = (keys) => {
  for (const key of keys) {
    delete process.env[key];
  }
};
