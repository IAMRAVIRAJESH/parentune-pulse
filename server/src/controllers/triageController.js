export function createTriageController(triageService) {
  return {
    async create(req, res, next) {
      try {
        res.status(201).json(await triageService.triage(req.body));
      } catch (err) {
        next(err);
      }
    },
    async history(_req, res, next) {
      try {
        res.json(await triageService.history());
      } catch (err) {
        next(err);
      }
    },
  };
}
