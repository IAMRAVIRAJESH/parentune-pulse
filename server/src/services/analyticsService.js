export class AnalyticsService {
  constructor({ repository }) {
    this.repository = repository;
  }

  async summary() {
    return this.repository.stats();
  }
}
