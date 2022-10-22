import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import {Event} from "../_shared/event.class";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  deviceInfo!: any;
  isMobile = false;
  isTablet = false;
  isDesktopDevice = false;

  form: any = {
    username: null,
    password: null,
    captcha: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  isLoading = false;

  imgCaptcha = '';
  tokenCaptcha = '';
  isLoadingCaptcha = false;

  show_button = false;
  show_eye = false;

  show_button1 = false;
  show_eye1 = false;
  show_button2 = false;
  show_eye2 = false;

  oldpwd = '';
  newpwd = '';
  renewpwd = '';

  isShowCallSupport = false;
  isNewLogin = false;

  constructor(
    private sanitizer:DomSanitizer,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private deviceService: DeviceDetectorService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private recaptchaV3Service: ReCaptchaV3Service
    ) { }

  ngOnInit(): void {
    this.device();
    this.captCha();

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.redirectPage();
    }

    this.route.queryParams
      .subscribe(params => {
        if (JSON.stringify(params) !== '{}') {
          if (params.hasOwnProperty('u')) {
            let u = params['u'];
            if (u) {
              this.isNewLogin = true;
            }
          }
        }
      });
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onSubmit(): void {
    this.isLoading = true;
    const { username, password, captcha } = this.form;

    this.recaptchaV3Service.execute('importantAction')
      .subscribe((token: string) => {
        //console.debug(`Token [${token}] generated`);
        this.authService.login(username, password, token, '').subscribe(
          res => {
            if (res.status == 200 && res.data) {
              this.tokenStorage.saveLogin(res.data);
              this.tokenStorage.saveUser(username);
              this.isLoginFailed = false;
              this.isLoggedIn = true;
              this.isLoading = false;
              this.redirectPage();

            } else if (res.status == 400 && res.message.length > 0) {
              this.errorMessage = res.message;
              this.isLoginFailed = true;
              this.isLoading = false;
              //this.captCha();
            }
          },
          err => {
            this.errorMessage = err.error.message;
            this.isLoginFailed = true;
            this.isLoading = false;
            //this.captCha();
          }
        );
      });
  }

  redirectPage(): void {
    this.router.navigate(['/contracts']);
  }

  device() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
  }

  captCha() {
    this.isLoadingCaptcha = true;
    this.authService.captCha().subscribe(
      res => {
        if (res.status == 200 && res.data) {
          this.imgCaptcha = res.data.image;
          this.tokenCaptcha = res.data.token;
        }
        this.isLoadingCaptcha = false;
      },
      err => {
        this.isLoadingCaptcha = false;
      }
    );
  }

  recaptchaV3() {
    this.recaptchaV3Service.execute('importantAction')
    .subscribe((token: string) => {
      console.debug(`Token [${token}] generated`);
    });
  }

  showBase64(str_base64: any) {
    if (str_base64) {
      str_base64 = 'data:application/png;base64,' + str_base64;
      return this.sanitize(str_base64);
    }

    return '';
  }

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  showCallSupport() {
    this.isShowCallSupport = !this.isShowCallSupport;
  }

  confirmPwd() {
    this.cNewPwd();
  }

  cNewPwd() {
    if (this.newpwd.includes(' ')) {
      this.errorMessage = 'Mật khẩu không được có dấu cách!';
      this.showToast(this.errorMessage, '', 'error');
      return;
    }

    if (this.newpwd.length < 6 || this.newpwd.length > 12) {
      this.errorMessage = 'Mật khẩu phải có số ký tự lớn hơn 6 và nhỏ hơn hoặc bằng 8!';
      this.showToast(this.errorMessage, '', 'error');
      return;
    }

    if (this.newpwd === this.renewpwd) {
      this.isLoading = true;
      const { username } = this.form;
      this.authService.changePwd(this.oldpwd, this.newpwd, this.tokenStorage.getToken()).subscribe(
        res => {
          if (res.status == 200) {
            this.showToast('Bạn đã tạo mật khẩu mới thành công!');
            setTimeout( () => {
              this.isLoading = false;
              this.redirectPage();
            }, 3000);

          } else {
            this.isLoading = false;
            this.errorMessage = res.message;
            this.showToast(res.message, '', 'error');
          }
        },
        err => {
          this.isLoading = false;
          this.showToast('Lỗi hệ thống!', '', 'error');
        }
      );
    } else {
      this.isLoading = false;
      this.errorMessage = 'Mật khẩu mới và nhập lại mật khẩu mới không khớp!';
      this.showToast(this.errorMessage, '', 'error');
    }
  }

  showToast(title = '', message = '', type = 'success') {
    if (type == 'success') {
      this.toastr.success(title, message);
    } else if (type == 'error') {
      this.toastr.error(title, message);
    }
  }

  showNewPassword(type = 0) {
    if (type == 0) {
      this.show_button = !this.show_button;
      this.show_eye = !this.show_eye;
    }

    if (type == 1) {
      this.show_button1 = !this.show_button1;
      this.show_eye1 = !this.show_eye1;
    }

    if (type == 2) {
      this.show_button2 = !this.show_button2;
      this.show_eye2 = !this.show_eye2;
    }
  }
}
