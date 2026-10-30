export function createCatalogController(service) {
  return {
    async list(req, res) {
      res.json(await service.list(req.validated.query));
    },
    async detail(req, res) {
      res.json(await service.detail(req.validated.params.id));
    },
    async catalog(_req, res) {
      res.json(await service.catalog());
    },
    async placeAudioGuides(req, res) {
      res.json(await service.placeAudioGuides(req.validated.params.id));
    },
    async listEvents(req, res) {
      res.json(await service.listEvents(req.validated.query));
    },
    async eventDetail(req, res) {
      res.json(await service.eventDetail(req.validated.params.id));
    },
    async listServices(req, res) {
      res.json(await service.listServices(req.validated.query));
    },
    async serviceDetail(req, res) {
      res.json(await service.serviceDetail(req.validated.params.id));
    },
  };
}
