export function createCatalogController(service) {
  return {
    async list(req, res) { res.json(await service.list(req.validated.query)); },
    async detail(req, res) { res.json(await service.detail(req.validated.params.id)); },
    async catalog(_req, res) { res.json(await service.catalog()); },
  };
}
