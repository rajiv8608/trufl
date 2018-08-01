import {XHRBackend, Http, RequestOptions} from "@angular/http";
import {InterceptedHttp} from "./http.interceptor";
import {LoaderService} from "../loader-component/loader-component.service";

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, loaderService: LoaderService): Http {
  return new InterceptedHttp(xhrBackend, requestOptions, loaderService);
}
