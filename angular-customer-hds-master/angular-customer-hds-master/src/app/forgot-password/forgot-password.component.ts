import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {
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

   closeResult = '';
  _modal_title$!: string;
  isLoading = false;

  otpCorrect!: any;
  conf_otp_input = { length: 6, inputStyles: { width: "25px", height: "28px", "border-top": "#fff", "border-left": "#fff",
      "border-right": "#fff", "border-radius": "unset", "font-size": "16px"} };

  show_button1 = false;
  show_eye1 = false;
  show_button2 = false;
  show_eye2 = false;

  newpwd = '';
  renewpwd = '';

  constructor(
    private authService: AuthService,
    private deviceService: DeviceDetectorService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.device();
  }

  showToast(title = '', message = '', type = 'success') {
    if (type == 'success') {
      this.toastr.success(title, message);
    } else if (type == 'error') {
      this.toastr.error(title, message);
    }
  }

  showPassword(type = 1) {
    if (type == 1) {
      this.show_button1 = !this.show_button1;
      this.show_eye1 = !this.show_eye1;
    }

    if (type == 2) {
      this.show_button2 = !this.show_button2;
      this.show_eye2 = !this.show_eye2;
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    const { username } = this.form;
    this.authService.forgot(username).subscribe(
      res => {
        if (res.status == 200 && res.data) {
          this.showToast('M?? OTP ???? ???????c g???i t???i s??? ??i???n tho???i c???a b???n!');

        } else if (res.status == 400 && res.message.length > 0) {
          this.errorMessage = res.message;
          this.showToast(res.message, '', 'error');
        }

        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        this.errorMessage = err.error.message;
        this.showToast('L???i h??? th???ng!', '', 'error');
      }
    );
  }

  openOtp(content_otp: any) {
    this.onSubmit();

    this.modalService.open(content_otp, { ariaLabelledBy: this._modal_title$, size: 'sm', scrollable: false,
      backdrop: 'static', keyboard: false, windowClass: 'custom-modal' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onOtpChange(value: any) {
    this.otpCorrect = value;
  }

  confirmPwd() {
    this.cNewPwd();
  }

  cNewPwd() {
    if (this.newpwd.includes(' ')) {
      this.showToast('M???t kh???u kh??ng ???????c c?? d???u c??ch!', '', 'error');
      return;
    }

    if (this.newpwd.length < 6 || this.newpwd.length > 8) {
      this.showToast('M???t kh???u ph???i c?? s??? k?? t??? l???n h??n 6 v?? nh??? h??n ho???c b???ng 8!', '', 'error');
      return;
    }

    if (this.newpwd === this.renewpwd) {
      this.isLoading = true;
      const { username } = this.form;
      this.authService.updatePwd(username, this.newpwd, this.otpCorrect).subscribe(
        res => {
          if (res.status == 200) {
            this.showToast('B???n ???? t???o m???t kh???u m???i th??nh c??ng!');

            setTimeout( () => {
                this.redirectPage();
                this.isLoading = false;
            }, 3000);

          } else {
            this.isLoading = false;
            this.errorMessage = res.message;
            this.showToast(res.message, '', 'error');
          }
        },
        err => {
          this.isLoading = false;
          this.showToast('L???i h??? th???ng!', '', 'error');
        }
      );
    } else {
      this.isLoading = false;
      this.showToast('M???t kh???u v?? nh???p l???i m???t kh???u kh??ng kh???p!', '', 'error');
    }
  }

  redirectPage(): void {
    this.modalService.dismissAll();
    this.router.navigate(['/login']);
  }

  device() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
