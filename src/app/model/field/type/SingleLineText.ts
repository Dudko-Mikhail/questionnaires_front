import {FieldType} from "./FieldType";

export class SingleLineText extends FieldType {
  override hasOptions(): boolean {
    return false
  }

  override inputName(): string {
    return "text"
  }

  override viewName(): string {
    return "Single line text"
  }

}
