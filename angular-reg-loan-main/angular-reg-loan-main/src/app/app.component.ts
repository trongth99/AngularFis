import { Component, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebcamImage } from 'ngx-webcam';
import { AppService } from './app.service';
import Swal from 'sweetalert2';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as $ from 'jquery';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Đăng ký khoản vay';

  deviceInfo!: any;
  isMobile = false;
  isTablet = false;
  isDesktopDevice = false;
  pdfStyle = 'width: 100%; height: 600px;';

  signatureImg!: string;
  @ViewChild('sign1') sign1!: SignaturePad;
  @ViewChild('sign2') sign2!: SignaturePad;

  canvasWidth = 350;
  canvasHeight = 300;

  signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': this.canvasWidth,
    'canvasHeight': this.canvasHeight
  };

  is0FormGroup = true;
  is1FormGroup = false;
  is2FormGroup = false;
  is3FormGroup = false;
  is4FormGroup = false;
  is5FormGroup = false;
  is6FormGroup = false;
  is7FormGroup = false;
  is8FormGroup = false;
  is9FormGroup = false;
  is10FormGroup = false;
  is11FormGroup = false;
  is12FormGroup = false;
  is13FormGroup = false;
  is14FormGroup = false;
  is15FormGroup = false;
  is16FormGroup = false;
  is17FormGroup = false;
  is18FormGroup = false;
  is19FormGroup = false;
  is20FormGroup = false;
  is21FormGroup = false;
  is22FormGroup = false;
  is23FormGroup = false;
  is24FormGroup = false;
  is25FormGroup = false;
  is26FormGroup = false;
  is27FormGroup = false;
  is28FormGroup = false;
  is29FormGroup = false;
  is30FormGroup = false;
  isFinishedFormGroup = false;

  done1FormGroup = false;
  done2FormGroup = false;
  done3FormGroup = false;
  done4FormGroup = false;
  done5FormGroup = false;
  done6FormGroup = false;
  done7FormGroup = false;
  done8FormGroup = false;
  done9FormGroup = false;
  done10FormGroup = false;
  done11FormGroup = false;
  done12FormGroup = false;
  done13FormGroup = false;
  done14FormGroup = false;
  done15FormGroup = false;
  done16FormGroup = false;
  done17FormGroup = false;
  done18FormGroup = false;
  done19FormGroup = false;
  done20FormGroup = false;
  done21FormGroup = false;
  done22FormGroup = false;
  done23FormGroup = false;
  done24FormGroup = false;
  done25FormGroup = false;
  done26FormGroup = false;
  done27FormGroup = false;
  done28FormGroup = false;
  done29FormGroup = false;
  done30FormGroup = false;
  doneFinishedFormGroup = false;

  //form number
  configSteps = [
    {
      status: 1,
      title: 'Thông Tin Liên Hệ',
    },
    {
      status: 1,
      title: 'OTP',
    },
    {
      status: 1,
      title: 'Chọn Giấy Tờ Tùy Thân',
    },
    {
      status: 1,
      title: 'Chụp Giấy Tờ Tùy Thân',
    },
    {
      status: 1,
      title: 'Hướng Dẫn Xác Thực Khuôn Mặt',
    },
    {
      status: 1,
      title: 'Xác Thực Khuôn Mặt',
    },
    {
      status: 1,
      title: 'Chọn Sản Phẩm Vay',
    },
    {
      status: 1,
      title: 'Tải Các Giấy Tờ Liên Quan',
    },
    {
      status: 1,
      title: 'Thông Tin Chung',
    },
    {
      status: 1,
      title: 'Thông Tin Chung',
    },
    {
      status: 1,
      title: 'Thông Tin Chung',
    },
    {
      status: 1,
      title: 'Thông Tin Chung',
    },
    {
      status: 1,
      title: 'Thông Tin Chung',
    },
    {
      status: 1,
      title: 'Thông Tin Chung',
    },
    {
      status: 1,
      title: 'Thông Tin Chung',
    },
    {
      status: 1,
      title: 'Thông Tin Chung',
    },
    {
      status: 1,
      title: 'Thông Tin Chung',
    },
    {
      status: 1,
      title: 'Thông Tin Chung',
    },
    {
      status: 1,
      title: 'Tình Hình Thu Nhập',
    },
    {
      status: 1,
      title: 'Thông Tin Tham Chiếu',
    },
    {
      status: 1,
      title: 'Phương Án Sử Dụng Vốn',
    },
    {
      status: 1,
      title: 'Phương Án Sử Dụng Vốn',
    },
    {
      status: 1,
      title: 'Người Có Liên Quan',
    },
    {
      status: 1,
      title: 'Người Có Liên Quan Là Cá Nhân',
    },
    {
      status: 1,
      title: 'Người Có Liên Quan Là Tổ Chức',
    },
    {
      status: 1,
      title: 'Cam Đoan Và Cam Kết',
    },
    {
      status: 1,
      title: 'Chữ Ký',
    },
    {
      status: 1,
      title: 'Kết Thúc',
    },
  ];
  steps = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  currIdxStep = 0;
  params = this.appService.params;
  titleStep = this.configSteps[0].title;

  //OTP
  otpCorrect!: any;
  conf_otp_input = { length: 6, inputStyles: { width: "30px", height: "30px", }, };

  //Table
  datatGToTThan = this.appService.datatGToTThan;
  ngayHetHan = '';
  noiTru = '';

  webcamImageFront!: any;
  webcamImageBack!: any;
  webcamImagePP!: any;
  webcamImageFace!: any;
  isImgFront = true;
  isImgBack = true;

  isImgFrontGTTT = false;
  isImgBackGTTT = false;

  isImgPP = true;
  isImgFace = true;
  showStepNext = true;
  showBackStep = true;
  khungHinh:string[] = [];

  processInstanceId!: any;

  constructor(
    private _formBuilder: FormBuilder,
    public appService: AppService,
    private deviceService: DeviceDetectorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.device();
  }

  ngAfterContentChecked() {
    try {
      this.cdr.detectChanges();

      if (this.appService.errsStep && (this.appService.errsStepNhanGTTT || this.appService.errsStepXNhanGTTT)) {
        this.swalWarningStep('Cảnh Báo', 'Xác Thực Giấy Tờ Tùy Thân Không Thành Công!');
        return;
      }

      if (this.appService.errsStep && this.appService.errsStepNhanTTinKMat) {
        this.swalWarningStep('Cảnh Báo', 'Xác Thực Khuôn Mặt Không Thành Công!');
        return;
      }

      if (this.appService.errsStep) {
        this.swalWarningStep();
      }

      if (this.appService.errsStep || this.appService.errsStepNhanGTTT || this.appService.errsStepXNhanGTTT
        || this.appService.errsStepNhanTTinKMat || this.appService.errsStepNhapDonDKy || this.appService.errsStepTaoDonDKy) {
        this.backStep();
      }

      this.loadData();
    } catch (e) {
      //window.location.reload();
    }
  }

  device() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();

    if (this.isMobile) {
      this.canvasWidth = 350;
      this.pdfStyle = 'width: 350px; height: 600px;';
    } else {
      this.canvasWidth = 550;
    }
  }

  detectWebcam(callback: (arg0: boolean) => void) {
	  let md = navigator.mediaDevices;
	  if (!md || !md.enumerateDevices) return callback(false);
	  md.enumerateDevices().then(devices => {
	    callback(devices.some(device => 'videoinput' === device.kind));
	  })
	}

  CheckCamera() {
		this.detectWebcam(this.cWebcam);
	}

  cWebcam(hasWebcam: any) {
      if(hasWebcam) {
				AppComponent.swalAlert('Thông báo', 'Máy bạn có camera', 'success');
			} else {
				AppComponent.swalAlert('Thông báo', 'Máy bạn không có webcam', 'warning');
			}
		  console.log('Webcam: ' + (hasWebcam ? 'yes' : 'no'));
  }

  onOtpChange(value: any) {
    if (this.appService.xThucOtp(value)) {
      this.otpCorrect = value;
    } else {
      this.otpCorrect = '';
    }
  }

  static swalAlert(title: any, text: any, type: any) {
    Swal.fire(
        title,
        text,
        type
    );
  }

  swalWarning(title = 'Cảnh Báo', text = 'Hệ thống đang gặp sự cố', timer = 3000) {
    Swal.fire({
      title,
      text,
      icon: 'warning',
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      timer
    });
  }

  swalWarningStep(title = 'Cảnh Báo', text = 'Hệ thống đang gặp sự cố') {
    this.swalWarning(title, text);
    this.backStep();
  }

  loadData() {
    this.datatGToTThan = this.appService.datatGToTThan;
    if (this.datatGToTThan.length > 0) {
      this.ngayHetHan = this.datatGToTThan[0].ngayHetHan;
      this.noiTru = this.datatGToTThan[0].noiTru;
    }
  }

  checkProcessInstanceValue() {
    this.createProcessInstance();
  }

  createProcessInstance() {
    let data = {
    };
    this.appService.createProcessInstance(data).subscribe(
      res => {
        this.processInstanceId = res;
        //console.log(this.processInstanceId);
      },
      err => {
        //console.log(err);
        this.appService.errsStep = true;
      }
    );
  }

  startReg() {
    this.is0FormGroup = false;
    this.is1FormGroup = true;
    this.currIdxStep = 1;
    //this.checkProcessInstanceValue();
  }

  stepNext() {
    if (this.currIdxStep >= 0 && this.currIdxStep < this.steps.length) {
      let index = this.currIdxStep += 1;
      let step = this.steps[index];
      this.statusStep(step, 'next');
    }
  }

  backStep() {
    this.showStepNext = true;
    this.isFinishedFormGroup = false;
    if (this.currIdxStep >= 0 && this.currIdxStep < this.steps.length) {
      let index = this.currIdxStep -= 1;
      let step = this.steps[index];
      this.statusStep(step, 'back');
    }
  }

  statusStep(step: number, type: any) {
    this.retsetStep();
    this.loadIsFormGroup(this.currIdxStep, type);
    if (this.currIdxStep > 1) {
      this.titleStep = this.configSteps[this.steps[this.currIdxStep-1]].title;
    }

    if (step == this.steps.slice(-1)[0]) {
      this.isFinishedFormGroup = true;
      this.showStepNext = false;
      this.showBackStep = false;
      this.retsetStep();
    }
  }

  loadIsFormGroup(index: number, type: any) {
    let doneFormGroup = `done${this.steps[index-1]}FormGroup`;
    eval(`this.${doneFormGroup} = true;`);

    let minus_step = this.steps[index] - this.steps[index-1];
    let stepHandle = `step${this.steps[index]}Handle()`;
    if (minus_step > 1) {
      stepHandle = `step${this.steps[index-1] + 1}Handle()`;
    }
    if ((this.processInstanceId) && type == 'next') {
      eval(`this.${stepHandle};`);
    }

    let isFormGroup = `is${this.steps[index]}FormGroup`;
    eval(`this.${isFormGroup} = true;`);
  }

  step0Handle() {
    return '';
  }

  step1Handle() {
    return '';
  }

  step2Handle() {

  }

  step3Handle() {

  }

  step4Handle() {

  }

  step5Handle() {

  }

  step6Handle() {

  }

  step7Handle() {

  }

  step8Handle() {

  }

  step9Handle() {

  }

  step10Handle() {

  }

  step11Handle() {

  }

  step12Handle() {

  }

  step13Handle() {

  }

  step14Handle() {

  }

  step15Handle() {

  }

  step16Handle() {

  }

  step17Handle() {

  }

  step18Handle() {

  }

  step19Handle() {

  }

  retsetStep() {
    this.appService.errsStep = false;
    this.appService.errsStepNhanGTTT = false;
    this.appService.errsStepXNhanGTTT = false;
    this.appService.errsStepNhanTTinKMat = false;
    this.appService.errsStepNhapDonDKy = false;
    this.appService.errsStepTaoDonDKy = false;

    for (let i = 0; i < this.steps.length; i++) {
      eval(`this.is${this.steps[i]}FormGroup = false;`);
    }
  }

  handleImage(webcamImage: WebcamImage, type: any) {
    if (type == 'img_gttt') {
      if (this.isImgFrontGTTT) {
        this.webcamImageFront = webcamImage;
      } else if (this.isImgBackGTTT) {
        this.webcamImageBack = webcamImage;
      }
    } else if (type == 'img_front') {
      this.isImgFront = true;
      this.webcamImageFront = webcamImage;
      //console.log(this.webcamImageFront);
    } else if(type == 'img_back') {
      this.isImgBack = true;
      this.webcamImageBack = webcamImage;
      //console.log(this.webcamImageBack);
    } else if (type == 'img_pp') {
      this.isImgPP = true;
      this.webcamImagePP = webcamImage;
      //console.log(this.webcamImagePP);
    } else if (type == 'img_face') {
      this.isImgFace = true;
      this.webcamImageFace = webcamImage;
      //console.log(this.webcamImageFace);
      if (this.khungHinh.length >= 3) {
        this.khungHinh = [];
      }
      this.khungHinh.push(this.webcamImageFace._imageAsDataUrl.split('base64,')[1]);
    }
  }

  btnGTTTItem(value: string) {
    if (value == 'front') {
      this.isImgFrontGTTT = true;
      this.isImgBackGTTT = false;
    }

    if (value == 'back') {
      this.isImgFrontGTTT = false;
      this.isImgBackGTTT = true;
    }
  }

  //signaturePad
  drawComplete(pad: SignaturePad) {
    console.log(pad.toDataURL());
  }

  drawStart() {
    console.log('begin drawing');
  }

  clearSignature(pad: SignaturePad) {
    pad.clear();
  }

  showBase64(str_base64: any) {
    if (str_base64) {
      str_base64 = 'data:application/pdf;base64,' + str_base64;
      return str_base64;
    }
    return '';
  }

  reloadPage() {
    Swal.close();
    window.location.reload();
  }
}
