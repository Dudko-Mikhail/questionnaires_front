import {FieldType} from "./FieldType";

export class Field {
  id: number
  label: string
  type: FieldType
  isRequired: boolean
  isActive: boolean
}
