import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { EventBusService } from '../_shared/event-bus.service';
import { Event } from '../_shared/event.class';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  deviceInfo!: any;
  isMobile = false;
  isTablet = false;
  isDesktopDevice = false;

  form: any = {
    username: null    
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = ''; 
  isLoading = false;
  
  show_button = false;
  show_eye = false;
  show_button1 = false;
  show_eye1 = false;
  show_button2 = false;
  show_eye2 = false;
  
  oldpwd = '';
  newpwd = '';
  renewpwd = '';

  constructor(
    private authService: AuthService, 
    private tokenStorage: TokenStorageService,
    private deviceService: DeviceDetectorService,    
    private toastr: ToastrService,
    private eventBusService: EventBusService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.device();
    
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;          
    }
  }

  showToast(title = '', message = '', type = 'success') {
    if (type == 'success') {
      this.toastr.success(title, message);
    } else if (type == 'error') {
      this.toastr.error(title, message);
    }    
  }

  showPassword(type = 0) {
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

  confirmPwd() {
    this.cNewPwd();
  }

  cNewPwd() {
    if (this.newpwd.includes(' ')) {
      this.errorMessage = 'Mật khẩu không được có dấu cách!';
      this.showToast(this.errorMessage, '', 'error');
      return;
    }

    if (this.newpwd.length < 6 || this.newpwd.length > 8) {
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
          if (err.status === 403 || err.status === 401 || err.status === 400) {          
            this.eventBusService.emit(new Event('logout', null));
          }
        }
      );       
    } else {  
      this.isLoading = false; 
      this.errorMessage = 'Mật khẩu mới và nhập lại mật khẩu mới không khớp!';    
      this.showToast(this.errorMessage, '', 'error');
    }
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

}
