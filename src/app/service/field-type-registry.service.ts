import {Injectable} from "@angular/core";
import {FieldType} from "../model/field/type/FieldType";
import {CheckBox} from "../model/field/type/CheckBox";
import {Combobox} from "../model/field/type/Combobox";
import {Date} from "../model/field/type/Date";
import {SingleLineText} from "../model/field/type/SingleLineText";
import {MultilineText} from "../model/field/type/MultilineText";
import {RadioButton} from "../model/field/type/RadioButton";

@Injectable({
  providedIn: 'root'
})
export class FieldTypeRegistry {
  private appFieldTypes = new Map<string, FieldType>()

  constructor() {
    this.fillAppFieldTypes()
  }

  parseFieldType(type: string): FieldType {
    const appType = this.appFieldTypes.get(type)
    if (appType) {
      return appType
    }
    throw new Error(`Unknown field type: ${type}`)
  }

  private fillAppFieldTypes(): void {
    this.registerAppFieldType(new CheckBox())
    this.registerAppFieldType(new Combobox())
    this.registerAppFieldType(new Date())
    this.registerAppFieldType(new SingleLineText())
    this.registerAppFieldType(new MultilineText())
    this.registerAppFieldType(new RadioButton())
  }

  registerAppFieldType(fieldType: FieldType) {
    if (fieldType) {
      this.appFieldTypes.set(fieldType.apiName(), fieldType)
    }
  }
}
