import {FieldType} from "./FieldType";

export class Date extends FieldType {
  override hasOptions(): boolean {
    return false;
  }

  override inputName(): string {
    return "date";
  }

  override viewName(): string {
    return "Date";
  }
}
