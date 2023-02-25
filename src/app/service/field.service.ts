import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, map, Observable, retry, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {AuthenticationService} from "./authentication.service";
import {PagedResponse} from "../model/PagedResponse";
import {ErrorService} from "./error.service";
import {FieldRequest} from "../model/field/FieldRequest";
import {FieldResponse} from "../model/field/FieldResponse";
import {IField} from "../model/field/IField";
import {FieldTypeRegistry} from "./field-type-registry.service";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  constructor(private http: HttpClient, private auth: AuthenticationService, private errorService: ErrorService,
              private fieldTypeRegistry: FieldTypeRegistry) {
  }

  findAllUserFields(id: number): Observable<FieldResponse[]> { // todo add end-point
    return this.http.get<IField>(`${environment.apiUrl}/users/{id}/fields`)
      .pipe(
        map(this.mapToFieldResponse.bind(this)),
        retry(3),
        catchError(this.handleError.bind(this))
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
        map(response => {
          return {
            content: response.content.map(this.mapToFieldResponse.bind(this)),
            metadata: response.metadata
          } as PagedResponse<FieldResponse>
        }),
        retry(3),
        catchError(this.handleError.bind(this))
      )
  }

  deleteFieldById(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/fields/${id}`)
      .pipe(
        retry(3),
        catchError(this.handleError.bind(this))
      )
  }

  addField(field: FieldRequest): Observable<FieldResponse> {
    return this.http.post<IField>(`${environment.apiUrl}/api/users/${this.auth.getUserId()}/fields`, field)
      .pipe(
        map(this.mapToFieldResponse.bind(this)),
        retry(3),
        catchError(this.handleError.bind(this))
      )
  }

  editField(id: number, field: FieldRequest): Observable<FieldResponse> {
    return this.http.put<IField>(`${environment.apiUrl}/api/fields/${id}`, field)
      .pipe(
        map(this.mapToFieldResponse.bind(this)),
        retry(3),
        catchError(this.handleError.bind(this))
      )
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    this.errorService.handleAllErrors(err)
    return throwError(() => err)
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
