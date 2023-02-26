import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, map, Observable, retry} from "rxjs";
import {environment} from "../../environments/environment";
import {AuthenticationService} from "./authentication.service";
import {PagedResponse} from "../model/PagedResponse";
import {ErrorService} from "./error.service";
import {FieldRequest} from "../model/field/FieldRequest";
import {FieldResponse} from "../model/field/FieldResponse";
import {IField} from "../model/field/IField";
import {FieldTypeRegistry} from "./field-type-registry.service";
import {FieldType} from "../model/field/type/FieldType";
import {ServiceErrorHandler} from "./serviceErrorHandler";

@Injectable({
  providedIn: 'root'
})
export class FieldService extends ServiceErrorHandler {
  constructor(errorService: ErrorService, private http: HttpClient, private auth: AuthenticationService,
              private fieldTypeRegistry: FieldTypeRegistry) {
    super(errorService)
  }

  findAllUserFields(id: number): Observable<FieldResponse[]> {
    return this.http.get<IField[]>(`${environment.apiUrl}/api/users/${id}/fields/all`)
      .pipe(
        retry(3),
        map(fields => fields.map(field => this.mapToFieldResponse(field))),
        catchError(this.handleUnknownAndServerErrors.bind(this))
      )
  }

  findSessionUserFields(page?: number, size?: number): Observable<PagedResponse<FieldResponse>> {
    return this.findFieldsByUserId(this.auth.getUserId(), page, size)
  }

  findFieldsByUserId(userId: number, page?: number, size?: number): Observable<PagedResponse<FieldResponse>> {
    let params = new HttpParams()
    if (page) {
      params = params.set('page', page)
    }
    if (size) {
      params = params.set('size', size)
    }
    return this.http.get<PagedResponse<IField>>(`${environment.apiUrl}/api/users/${userId}/fields`, {
      params: params
    })
      .pipe(
        retry(3),
        map(response => {
          return {
            content: response.content.map(this.mapToFieldResponse.bind(this)),
            metadata: response.metadata
          } as PagedResponse<FieldResponse>
        }),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  public findAllFieldTypes(): Observable<Set<FieldType>> {
    return this.http.get<string[]>(`${environment.apiUrl}/api/fields/types`)
      .pipe(
        retry(3),
        map(types => new Set(types.map(type => this.fieldTypeRegistry.parseFieldType(type)))),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  addField(field: FieldRequest): Observable<FieldResponse> {
    return this.http.post<IField>(`${environment.apiUrl}/api/users/${this.auth.getUserId()}/fields`, field)
      .pipe(
        retry(3),
        map(this.mapToFieldResponse.bind(this)),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  editField(id: number, field: FieldRequest): Observable<FieldResponse> {
    return this.http.put<IField>(`${environment.apiUrl}/api/fields/${id}`, field)
      .pipe(
        retry(3),
        map(this.mapToFieldResponse.bind(this)),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  deleteFieldById(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/fields/${id}`)
      .pipe(
        retry(3),
        catchError(this.handleAllErrors.bind(this))
      )
  }

  private mapToFieldResponse(fieldInfo: IField): FieldResponse {
    const field = new FieldResponse()
    if (fieldInfo.id) {
      field.id = fieldInfo.id
    }
    field.isRequired = fieldInfo.isRequired
    field.isActive = fieldInfo.isActive
    field.options = fieldInfo.options
    field.label = fieldInfo.label
    if (fieldInfo.order) {
      field.order = fieldInfo.order
    }
    field.type = this.fieldTypeRegistry.parseFieldType(<string>fieldInfo.type)
    return field
  }
}
