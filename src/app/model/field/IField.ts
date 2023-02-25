import {FieldType} from "./type/FieldType";

export interface IField {
  id?: number
  label: string
  type: string | FieldType
  options: string[] | null
  isRequired: boolean
  isActive: boolean
  order?: number
}
