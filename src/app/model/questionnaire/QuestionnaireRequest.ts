export class QuestionnaireRequest {
  constructor(public title: string, public description: string | null, public active: boolean) {
  }
}
