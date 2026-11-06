// Works without an API key so the whole pipeline can be built and tested first.
export class MockProvider {
  async triage({ concern, ageMonths }) {
    const fever = /fever|bukhar/i.test(concern);
    return {
      urgency: fever && ageMonths < 3 ? 'see_doctor' : 'instant',
      category: fever ? 'Fever' : 'General',
      summary: `Mock guidance for a ${ageMonths}-month-old.`,
      advice: ['This is placeholder advice from the mock provider.'],
      redFlags: ['Fever that keeps rising', 'Child is very drowsy or not feeding'],
      disclaimer: 'This is general guidance, not a medical diagnosis. Please consult a doctor.',
    };
  }
}
