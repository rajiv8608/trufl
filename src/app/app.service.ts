import {Injectable} from "@angular/core";
@Injectable()
export class AppService {
  private username: string;
  private password: string;

  setUsername(username: string) {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }


  setPassword(username: string) {
    this.password = username;
  }

  getPassword(): string {
    return this.password;
  }


}
