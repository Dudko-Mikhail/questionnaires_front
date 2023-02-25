export abstract class FieldType {
  abstract hasOptions(): boolean

  abstract inputName(): string

  abstract viewName(): string

  apiName(): string {
    return this.viewName().toLowerCase()
  }
}
