import aj from '#config/arcjet.js';
import logger from '#config/logger.js';

const securityMiddleware = async (req, res, next) => {
  try {
    const isDev = process.env.NODE_ENV !== 'production';

    // 🔵 DEV BYPASS for testing tools
    const userAgent = req.get('User-Agent') || '';
    const isPostman = userAgent.includes('PostmanRuntime');

    if (isDev && isPostman) {
      return next();
    }

    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      const reason = decision.reason;

      if (reason.isBot?.()) {
        logger.warn('Bot blocked', { ip: req.ip });

        return res.status(403).json({
          error: 'Forbidden',
          message: 'Automated requests are not allowed',
        });
      }

      if (reason.isShield?.()) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Request blocked by security policy',
        });
      }

      if (reason.isRateLimit?.()) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
        });
      }
    }

    next();
  } catch (e) {
    console.error('Arcjet middleware error:', e);

    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export default securityMiddleware;