import {IField} from "./IField";

export class FieldRequest implements IField {
  isActive: boolean;
  isRequired: boolean;
  label: string;
  options: string[] | null;
  type: string;
  order?: number
}
