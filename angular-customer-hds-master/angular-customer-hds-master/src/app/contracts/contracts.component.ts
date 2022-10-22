import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ToastrService} from 'ngx-toastr';
import {TokenStorageService} from '../_services/token-storage.service';
import {ContractsService} from './contracts.service';
import {EventBusService} from '../_shared/event-bus.service';
import {Event} from '../_shared/event.class';
import * as $ from 'jquery';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})

export class ContractsComponent implements OnInit {
  deviceInfo!: any;
  isMobile = false;
  isTablet = false;
  isDesktopDevice = false;
  pdfStyle = 'width: 100%; height: 600px;';

  dataList = this.contractsServ.dataList;
  data$ = this.contractsServ.data$;
  dataRegSign = this.contractsServ.dataRegSign;

  total = 0;
  totalPage = 0;
  pageActive = 1;
  limit = 5;

  closeResult = '';
  _modal_title$!: string;
  isLoading = false;
  isView = false;
  isSign = false;
  checked1 = false;
  checked2 = false;
  checked3 = false;

  otpCorrect!: string;
  conf_otp_input = {
    length: 6, inputStyles: {
      width: "25px", height: "28px", "border-top": "#fff", "border-left": "#fff",
      "border-right": "#fff", "border-radius": "unset", "font-size": "16px"
    }
  };
  messOTP = '';
  tryNumOTP = 5;

  constructor(
    private tokenStorageService: TokenStorageService,
    private contractsServ: ContractsService,
    private modalService: NgbModal,
    private http: HttpClient,
    private deviceService: DeviceDetectorService,
    private eventBusService: EventBusService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.tokenStorageService.cLogin();
    this.device();
    this.getData();
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  device() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();

    if (this.isMobile) {
      this.pdfStyle = 'width: 350px; height: 600px;';
    }

    if (this.isTablet) {
      this.pdfStyle = 'width: 450px; height: 600px;';
    }
  }

  showToast(title = '', message = '', type = 'success') {
    if (type == 'success') {
      this.toastr.success(title, message);
    } else if (type == 'error') {
      this.toastr.error(title, message);
    }
  }

  getData(page = 1, limit = 5) {
    this.isLoading = true;
    this.pageActive = page;
    this.limit = limit;

    let data = {
      page,
      limit
    }

    let author = this.tokenStorageService.getToken();
    this.contractsServ.getData(data, author).subscribe(
      res => {
        if (res.status === 200) {
          this.dataList = res.data;
          this.total = parseInt(res.included.total);
          this.totalPage = parseInt(res.included.totalPage);
        } else if (res.status == 500) {
          this.showToast('Lỗi hệ thống!', '', 'error');
        }
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        if (err.status === 403 || err.status === 401 || err.status === 400) {
          this.eventBusService.emit(new Event('logout', null));
        }
      }
    );
  }

  getTrangThai(trangThai: string): any {
    if (trangThai == 'chuaky') return ['Chưa ký', 'Ký ngay'];
    if (trangThai == 'daky' || trangThai == '1') return ['Đã ký', 'Xem hợp đồng'];
    return ['Chưa ký', 'Ký ngay'];
  }

  getNgayKy(ngayKy: string): any {
    if (ngayKy == '' || !ngayKy) return 'Chưa xác định';
    return ngayKy;
  }

  counter(i: number) {
    return new Array(i);
  }

  readData(data: any) {
    this.isLoading = true;
    let author = this.tokenStorageService.getToken();
    this.contractsServ.readData(data, author).subscribe(
      res => {
        if (res.status == 200) {
          this.data$ = res.data;
          this._modal_title$ = res.data.tenHopDong;
        } else if (res.status == 500) {
          this.showToast('Lỗi hệ thống!', '', 'error');
        }

        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        this.showToast('Lỗi hệ thống!', '', 'error');
      }
    );
  }

  //Modal
  open(content: any, type: any, contractCode: string) {
    this.isView = false;
    this.isSign = false;
    this.isLoading = true;
    this.data$ = this.contractsServ.data$;

    if (type == 'daky' || type == '1') {
      this.isView = true;
    } else if (type == 'chuaky') {
      this.isSign = true;
    }

    if (contractCode) {
      let data = {
        contractCode
      };

      this.readData(data);
    }

    this.openModal(content, 'lg');
  }

  openConfirmTerm(content_term: any, contractCode: string) {
    this.checked1 = false;
    this.checked2 = false;
    this.checked3 = false;
    let f_scroll = false;
    if (contractCode) {
      f_scroll = true;

      let data = {
        contractCode
      };

      this.readData(data);
    }

    this.openModal(content_term, 'lg');
  }

  openConfirmSign(content_confirm_sign: any) {
    this.openModal(content_confirm_sign);
  }

  openOtp(content_otp: any, contractCode: any) {
    this.dangKyChuKySo(contractCode);
    this.openModal(content_otp);
  }

  onOtpChange(value: string) {
    this.otpCorrect = value;
  }

  checkOtp(): boolean {
    if (this.otpCorrect.length == this.conf_otp_input.length && this.dataRegSign.otp.length == this.conf_otp_input.length) {
      if (this.otpCorrect == this.dataRegSign.otp) {
        return true;
      } else {
        this.tryNumOTP--;
        return false;
      }
    }
    return false;
  }

  openCompleted(content: any) {
    this.openModal(content, 'lg');
  }

  private openModal(content: any, size = 'sm') {
    this.modalService.open(content, {
      ariaLabelledBy: this._modal_title$, size: size, scrollable: false,
      backdrop: 'static', keyboard: false, windowClass: 'custom-modal'
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  dangKyChuKySo(contractCode: any) {
    this.isLoading = true;

    if (contractCode) {
      let data = {
        contractCode
      };

      let author = this.tokenStorageService.getToken();

      this.contractsServ.dangKyChuKySo(data, author).subscribe(
        res => {
          if (res.status == 200) {
            this.dataRegSign.agreementUUID = res.agreementUUID;
            this.dataRegSign.billCode = res.billCode;
            this.dataRegSign.otp = res.otp; // for test
          } else if (res.status == 500) {
            this.showToast('Lỗi hệ thống!', '', 'error');
          }
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
          this.showToast('Lỗi hệ thống!', '', 'error');
        }
      );
    }
  }

  kySo(contractCode: any, completed_sign: any) {
    if (this.tryNumOTP == 1) {
      $('#otp_close').trigger('click');
      this.tryNumOTP = 5;
      this.messOTP = '';
      return;
    }

    if (!this.checkOtp()) {
      this.messOTP = 'Sai mã OTP. Bạn còn ' + this.tryNumOTP + ' lần thử lại';
      return;
    }

    this.isLoading = true;

    if (contractCode) {
      let data = {
        contractCode,
        agreementUUID: this.dataRegSign.agreementUUID,
        billCode: this.dataRegSign.billCode,
        otp: this.otpCorrect
      };

      let author = this.tokenStorageService.getToken();

      this.contractsServ.kySo(data, author).subscribe(
        res => {
          if (res.status == 200) {
            this.isView = true;
            this.isSign = false;
            this.getData(this.pageActive, this.limit);

            let data = {
              contractCode
            };
            this.readData(data);

            this.openCompleted(completed_sign);

            this.isLoading = false;
            this.showToast('Bạn vừa ký số thành công!');
          } else if (res.status == 500) {
            this.isLoading = false;
            this.showToast('Lỗi hệ thống!', '', 'error');
          }
        },
        err => {
          this.isLoading = false;
          this.showToast('Lỗi hệ thống!', '', 'error');
        }
      );

      $('#otp_close').trigger('click');
    }
  }

  showBase64(str_base64: any) {
    if (str_base64) {
      str_base64 = 'data:application/pdf;base64,' + str_base64;
      return str_base64;
    }

    return '';
  }

  downloadPdf(base64String: any, fileName: any) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.pdf`
    link.click();
    this.showToast('Bạn vừa tải hợp đồng thành công!');
  }
}
