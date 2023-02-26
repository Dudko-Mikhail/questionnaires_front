export abstract class FieldType {
  abstract hasOptions(): boolean

  abstract inputType(): string

  abstract viewName(): string

  apiName(): string {
    return this.viewName().toLowerCase()
  }
}
