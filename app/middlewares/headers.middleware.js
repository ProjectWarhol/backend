exports.setHeaders = (_req, res, next) => {
  res.set({
    'Content-Security-Policy': "default-src 'self'",
    'Strict-Transport-Security': 'max-age=31536000 ; includeSubDomains',
    'X-Frame-Options': 'deny',
    'X-Content-Type-Options': 'nosniff',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Referrer-Policy': 'no-referrer',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'X-XSS-Protection': '1; mode=block',
  });
  return next();
};
