module.exports = {
  recursive: true,
  exit: true,
  require: 'test/hooks.js',
  checkLeaks: true,
  global: ['admin', 'adminData'],
};
