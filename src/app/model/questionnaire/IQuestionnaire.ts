export interface IQuestionnaire {
  id: number,
  userId: number,
  ownerEmail: string,
  title: string,
  description: string | null
  active: boolean
  fieldsCount: number
  responsesCount: number
}
