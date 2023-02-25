import {Injectable} from "@angular/core";
import {FieldType} from "../model/field/type/FieldType";
import {CheckBox} from "../model/field/type/CheckBox";
import {Combobox} from "../model/field/type/Combobox";
import {Date} from "../model/field/type/Date";
import {SingleLineText} from "../model/field/type/SingleLineText";
import {MultilineText} from "../model/field/type/MultilineText";
import {RadioButton} from "../model/field/type/RadioButton";
import {catchError, Observable, retry} from "rxjs";
import {environment} from "../../environments/environment";
import {ErrorService} from "./error.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class FieldTypeRegistry {
  private appFieldTypes = new Map<string, FieldType>()
  private apiFiledTypes = new Set<FieldType>()

  constructor(private errorService: ErrorService, private http: HttpClient) {
    this.fillAppFieldTypes();
    this.updateApiFieldTypes();
  }

  get apiFieldTypes(): Set<FieldType> {
    return this.apiFiledTypes;
  }

  updateApiFieldTypes(): void {
    this.getAllFieldTypes()
      .subscribe((filedTypes: string[]) => {
        filedTypes.forEach((type: string) => {
          const parsedType = this.parseApiFieldType(type)
          if (parsedType) {
            this.apiFiledTypes.add(parsedType)
          }
        })
      })
  }

  registerAppFieldType(fieldType: FieldType) {
    if (fieldType) {
      this.appFieldTypes.set(fieldType.apiName(), fieldType)
    }
  }

  private getAllFieldTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/api/fields/types`)
      .pipe(
        retry(3),
        catchError((err: HttpErrorResponse) => {
          this.errorService.handleAllErrors(err)
          throw err
        })
      )
  }

  parseFieldType(type: string): FieldType {
    const appType = this.appFieldTypes.get(type)
    if (appType && this.apiFiledTypes.has(appType)) {
      return appType
    }
    throw new Error(`Unknown field type: ${type}`)
  }

  private parseApiFieldType(type: string): FieldType | undefined {
    const apiFieldType = this.appFieldTypes.get(type)
    if (!apiFieldType) {
      console.error(`Unknown api field type: ${type}`)
    }
    return apiFieldType
  }

  private fillAppFieldTypes(): void {
    this.registerAppFieldType(new CheckBox())
    this.registerAppFieldType(new Combobox())
    this.registerAppFieldType(new Date())
    this.registerAppFieldType(new SingleLineText())
    this.registerAppFieldType(new MultilineText())
    this.registerAppFieldType(new RadioButton())
  }
}
