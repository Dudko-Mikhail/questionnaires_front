import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {PagedResponse} from "../model/PagedResponse";
import {FieldResponse} from "../model/field/FieldResponse";
import {FieldService} from "../service/field.service";

@Injectable({
  providedIn: 'root'
})
export class FieldsResolver implements Resolve<PagedResponse<FieldResponse>> {
  constructor(private fieldService: FieldService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<FieldResponse>> {
    return this.fieldService.findFieldsByQuestionnaireId(route.params?.['id'], route.queryParams?.['page'],
      route.queryParams?.['size'])
  }
}
