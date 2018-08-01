import {Injectable} from "@angular/core";
import {ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {LoaderService} from "../loader-component/loader-component.service";

@Injectable()
export class InterceptedHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private loaderService: LoaderService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    this.showLoader();
    url = this.updateUrl(url);
    return super.get(url, this.getRequestOptionArgs(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .finally(() => {
        this.onEnd();
      });
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    this.showLoader();
    url = this.updateUrl(url);
    return super.post(url, body, this.getRequestOptionArgs(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .finally(() => {
        this.onEnd();
      });
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    this.showLoader();
    url = this.updateUrl(url);
    return super.put(url, body, this.getRequestOptionArgs(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .finally(() => {
        this.onEnd();
      });
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    url = this.updateUrl(url);
    return super.delete(url, this.getRequestOptionArgs(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .finally(() => {
        this.onEnd();
      });
  }

  private updateUrl(req: string) {
    return req;
  }

  /* private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
   if (options == null) {
   options = new RequestOptions();
   }
   if (options.headers == null) {
   options.headers = new Headers();
   }
   options.headers.append('Content-Type', 'application/json');

   return options;
   }*/
  private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options && options.headers == null) {
      options.headers = new Headers();
      options.headers.append('Content-Type', 'application/json');
    }


    return options;
  }

  private response(res): Observable<Response> {
    return res;
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }

  private onSuccess(response) {
    return response;
  }

  private onError(error) {
    return error;
  }

  private onEnd() {
    this.hideLoader();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }
}
