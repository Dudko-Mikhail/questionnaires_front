import {IField} from "./IField";
import {FieldType} from "./type/FieldType";

export class FieldResponse implements IField {
  id: number;
  isActive: boolean;
  isRequired: boolean;
  label: string;
  options: string[] | null;
  type: FieldType;
  order: number
}
