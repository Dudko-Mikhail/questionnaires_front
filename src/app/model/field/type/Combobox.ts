import {FieldType} from "./FieldType";

export class Combobox extends FieldType {
  override hasOptions(): boolean {
    return true
  }

  override inputName(): string {
    return "select";
  }

  override viewName(): string {
    return "Combobox";
  }
}
