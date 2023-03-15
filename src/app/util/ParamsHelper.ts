import {HttpParams} from "@angular/common/http";

export class ParamsHelper {
  public static addPageAndSize(params: HttpParams, page?: number, size?: number) {
    params = ParamsHelper.addParamIfValuePresent(params, "page", page)
    params = ParamsHelper.addParamIfValuePresent(params, "size", size)
    return params
  }

  public static addParamIfValuePresent(params: HttpParams, paramName: string,
                                       paramValue?: string | number | boolean): HttpParams {
    if (paramValue !== undefined) {
      return params.set(paramName, paramValue)
    }
    return params
  }

  public static addParam(params: HttpParams, paramName: string, paramValue: string | number | boolean): HttpParams {
    return params.set(paramName, paramValue)
  }

  public static fillWithObjectData(params: HttpParams, object: { [key: string]: string | number | boolean }): HttpParams {
    if (object !== null && object !== undefined) {
      for (const key in object) {
        params = params.set(key, object[key])
      }
    }
    return params
  }

  private constructor() {
  }
}
