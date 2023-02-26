import {FieldType} from "./FieldType";

export class RadioButton extends FieldType {
  override hasOptions(): boolean {
    return true;
  }

  override inputType(): string {
    return "radio";
  }

  override viewName(): string {
    return "Radio button";
  }
}
