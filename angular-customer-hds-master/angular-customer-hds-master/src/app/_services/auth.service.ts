import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private common: CommonService) { }  

  login(username: string, password: string, captcha: string, token: string): Observable<any> {
    let mod = `public/login?username=${username}&password=${password}&captcha=${captcha}&token=${token}`;    
    return this.common.curlData(mod, '', '', 'post', 'auth');
  }

  refreshToken(token: string) {
    let mod = `public/refresh-token`;
    let data = {
      refreshToken: token
    };
    return this.common.curlData(mod, data, '', 'post', 'auth');
  }  

  forgot(username: string): Observable<any> {
    let mod = `public/forgot-pasword`;
    let data = {
      username: username
    };
    return this.common.curlData(mod, data, '', 'post', 'auth');
  }

  updatePwd(username: string, pwd: string, otp: string) : Observable<any> {
    let mod = `public/update-password`;
    let data = {
      username: username,
      password: pwd,
      otp: otp
    };
    return this.common.curlData(mod, data, '', 'post', 'auth');
  }

  changePwd(oldpwd: string, newpwd: string, authorization: any) : Observable<any> {
    let mod = `public/change-password`;
    let data = {
      password: newpwd,
      oldPassword: oldpwd            
    };
    return this.common.curlData(mod, data, authorization, 'post', 'auth');
  }

  captCha() {
    let mod = `public/all/get-captcha`;
    return this.common.curlData(mod, '', '', 'get', 'auth');
  }
}