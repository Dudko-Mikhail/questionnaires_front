import {FieldType} from "./FieldType";

export class Combobox extends FieldType {
  override hasOptions(): boolean {
    return true
  }

  override inputType(): string {
    return "select";
  }

  override viewName(): string {
    return "Combobox";
  }
}
