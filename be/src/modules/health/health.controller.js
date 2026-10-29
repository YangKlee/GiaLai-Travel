export function createHealthController({ database, logger }) {
  return {
    live(_req, res) { res.json({ status: 'ok', service: 'gialai-travel-api' }); },
    async ready(req, res) {
      res.setHeader('Cache-Control', 'no-store');
      try {
        if (!database) throw new Error('Database not configured');
        await database.checkReadiness();
        res.json({ status: 'ready', service: 'gialai-travel-api', checks: { database: 'up' } });
      } catch {
        logger.warn({ requestId: req.requestId }, 'database readiness failed');
        res.status(503).json({ status: 'not_ready', service: 'gialai-travel-api', checks: { database: 'down' }, requestId: req.requestId });
      }
    },
  };
}
