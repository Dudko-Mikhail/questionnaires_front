import {FieldType} from "./FieldType";

export class CheckBox extends FieldType {
  override hasOptions(): boolean {
    return false;
  }

  override inputType(): string {
    return "checkbox";
  }

  override viewName(): string {
    return "Checkbox";
  }

}
