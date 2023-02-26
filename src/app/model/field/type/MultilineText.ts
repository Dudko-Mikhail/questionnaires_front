import {FieldType} from "./FieldType";

export class MultilineText extends FieldType {
  override hasOptions(): boolean {
    return false;
  }

  override inputType(): string {
    return "textarea";
  }

  override viewName(): string {
    return "Multiline text";
  }
}
