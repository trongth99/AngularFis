import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebcamImage } from 'ngx-webcam';
import { AppService } from './app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Đăng ký tài khoản trực tuyến';
  checked = false;

  _0FormGroup!: FormGroup;
  _1FormGroup!: FormGroup;
  _2FormGroup!: FormGroup;
  _3FormGroup!: FormGroup;
  _4FormGroup!: FormGroup;
  _5FormGroup!: FormGroup;
  _6FormGroup!: FormGroup;
  _7FormGroup!: FormGroup;
  _8FormGroup!: FormGroup;

  is0FormGroup = true;
  is1FormGroup = false;
  is2FormGroup = false;
  is3FormGroup = false;
  is4FormGroup = false;
  is5FormGroup = false;
  is6FormGroup = false;
  is7FormGroup = false;
  is8FormGroup = false;
  isFinishedFormGroup = false;

  done1FormGroup = false;
  done2FormGroup = false;
  done3FormGroup = false;
  done4FormGroup = false;
  done5FormGroup = false;
  done6FormGroup = false;
  done7FormGroup = false;
  done8FormGroup = false;

  //form number
  configSteps = [
    {
      step: 'step1',
      status: 1,
      title: 'Thông tin liên hệ',
      isFormGroup: this.is1FormGroup,
      doneFormGroup: this.done1FormGroup
    },
    {
      step: 'step2',
      status: 1,
      title: 'Xác Nhận OTP',
      isFormGroup: this.is2FormGroup,
      doneFormGroup: this.done2FormGroup
    },
    {
      step: 'step3',
      status: 1,
      title: 'Chọn TK Số Đẹp',
      isFormGroup: this.is3FormGroup,
      doneFormGroup: this.done3FormGroup
    },
    {
      step: 'step4',
      status: 1,
      title: 'Chọn Giấy Tờ Tùy Thân',
      isFormGroup: this.is4FormGroup,
      doneFormGroup: this.done4FormGroup
    },
    {
      step: 'step5',
      status: 1,
      title: 'Xác Thực Giấy Tờ Tùy Thân',
      isFormGroup: this.is5FormGroup,
      doneFormGroup: this.done5FormGroup
    },
    {
      step: 'step6',
      status: 1,
      title: 'Xác Nhận Thông Tin',
      isFormGroup: this.is6FormGroup,
      doneFormGroup: this.done6FormGroup
    },
    {
      step: 'step7',
      status: 1,
      title: 'Xác Thực Khuôn Mặt',
      isFormGroup: this.is7FormGroup,
      doneFormGroup: this.done7FormGroup
    },
    {
      step: 'step8',
      status: 1,
      title: 'Chọn DV & Chi Nhánh',
      isFormGroup: this.is8FormGroup,
      doneFormGroup: this.done8FormGroup
    }
  ];
  steps = [0,1,2,3,4,5,6,7,8,9];
  currIdxStep = 0;
  params = this.appService.params;

  //OTP
  conf_otp_input = { length: 6, inputStyles: { width: "30px", height: "30px", }, };

  //Table
  dataDSachGoiSDep = this.appService.dataDSachGoiSDep;
  dataDSachSDep = this.appService.dataDSachSDep;
  datatDsachDVuNHang = this.appService.datatDsachDVuNHang;
  datatDsachCNhanh = this.appService.datatDsachCNhanh;
  datatGToTThan = this.appService.datatGToTThan;

  webcamImageFront!: any;
  webcamImageBack!: any;
  webcamImagePP!: any;
  webcamImageFace!: any;
  isImgFront = true;
  isImgBack = true;
  isImgPP = true;
  isImgFace = true;
  showStepTkSodep = true;
  showStepNext = true;
  showBackStep = true;
  showResultSDep = false;
  khungHinh:string[] = [];

  otpCorrect!: any;

  processInstanceId!: any;

  constructor(
    private _formBuilder: FormBuilder,
    private appService: AppService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadServConfig();
    this.loadForm();
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

      this.loadData();
      this.loadConfigSteps();
    } catch (e) {
      //window.location.reload();
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

  loadServConfig() {
    this.appService.getConfig().subscribe(
      res => {
        this.configSteps = res['configSteps'];
        this.loadConfigSteps();
      },
      error => {
        this.swalWarning();
      }
    );
  }

  loadConfigSteps() {
    this.configSteps.forEach((element, index) => {
      if (element.step == 'step1') {
        element.isFormGroup = this.is1FormGroup; element.doneFormGroup = this.done1FormGroup;
      }
      if (element.step == 'step2') {
        element.isFormGroup = this.is2FormGroup; element.doneFormGroup = this.done2FormGroup;
      }
      if (element.step == 'step3') {
        element.isFormGroup = this.is3FormGroup; element.doneFormGroup = this.done3FormGroup;
        if (!this.showStepTkSodep) {
          element.status = 0;
        }
      }
      if (element.step == 'step4') {
        element.isFormGroup = this.is4FormGroup; element.doneFormGroup = this.done4FormGroup;
      }
      if (element.step == 'step5') {
        element.isFormGroup = this.is5FormGroup; element.doneFormGroup = this.done5FormGroup;
      }
      if (element.step == 'step6') {
        element.isFormGroup = this.is6FormGroup; element.doneFormGroup = this.done6FormGroup;
      }
      if (element.step == 'step7') {
        element.isFormGroup = this.is7FormGroup; element.doneFormGroup = this.done7FormGroup;
      }
      if (element.step == 'step8') {
        element.isFormGroup = this.is8FormGroup; element.doneFormGroup = this.done8FormGroup;
      }

      if (element.status == 0) {
        this.configSteps.splice(index,1);
        this.steps.splice(index + 1,1);
      }
    });
  }

  loadForm() {
    this._0FormGroup = this._formBuilder.group({

    });

    this._1FormGroup = this._formBuilder.group({

    });

    this._2FormGroup = this._formBuilder.group({
      otp: ['', Validators.required],
    });


    this._3FormGroup = this._formBuilder.group({
      soDuoiTaiKhoan: [''],
      sdep: ['']
    });

    this._4FormGroup = this._formBuilder.group({
      idGTTT: ['']
    });

    this._5FormGroup = this._formBuilder.group({

    });

    this._6FormGroup = this._formBuilder.group({
      xnhanGTTT: ['']
    });

    this._7FormGroup = this._formBuilder.group({

    });

    this._8FormGroup = this._formBuilder.group({
      dVuNHang: [''],
      cnhanhGDich: ['']
    });
  }

  loadData() {
    this.dataDSachGoiSDep = this.appService.dataDSachGoiSDep;
    this.dataDSachSDep = this.appService.dataDSachSDep;
    this.datatDsachDVuNHang = this.appService.datatDsachDVuNHang;
    this.datatDsachCNhanh = this.appService.datatDsachCNhanh;
    this.datatGToTThan = this.appService.datatGToTThan;
  }

  loadParams() {
    if (this.appService.params[0].duoiSDep) {
      this.params[0].duoiSDep = this.appService.params[0].duoiSDep;
      this.chonDuoiSDep(this.params[0].duoiSDep);
    }
  }

  loadcurrFinishStep() {
    if (this.appService.currFinishStep > 1) {
      for (let i=0; i < this.steps.length; i++) {
        if (this.steps[i] == this.appService.currFinishStep) {
          this.currIdxStep = i;
          break;
        }
      }
      this.appService.currFinishStep = 0; //reset currFinishStep - important!
      //console.log(this.currIdxStep);
    }
  }

  checkProcessInstanceValue() {
    if (this._1FormGroup.value.chonSDep == true) {
      this.showStepTkSodep = true;
    } else {
      this.showStepTkSodep = false;
    }

    //this.createProcessInstance();

    //check completed
    this.appService.checkProcessInstanceValue('mobile', this._1FormGroup.value.mobile).subscribe(
      res => {
          if (res["process-instance"].length > 0) {
            this.swalWarningStep('Cảnh Báo', 'Số điện thoại này đã được đăng ký!');
          } else {
            //check active
            this.appService.checkProcessInstanceValue('mobile', this._1FormGroup.value.mobile, 1).subscribe(
              res => {
                  //console.log(res);
                  if (res["process-instance"].length == 0) {
                    this.createProcessInstance();
                  } else {
                      this.processInstanceId = res["process-instance"].slice(-1)[0]['process-instance-id'];
                      this.appService.getBackCompletedParams(this.processInstanceId);
                  }
              },
              error => {
                this.appService.errsStep = true;
              }
            );
          }
      },
      error => {
        this.appService.errsStep = true;
      }
    );
  }

  createProcessInstance() {
    let data = {
      mobile: this._1FormGroup.value.mobile,
      email: this._1FormGroup.value.email,
      chonSDep: this._1FormGroup.value.chonSDep
    };
    this.appService.createProcessInstance(data).subscribe(
      res => {
        this.processInstanceId = res;
        //console.log(this.processInstanceId);
      },
      error => {
        //console.log(error);
        this.appService.errsStep = true;
      }
    );
  }

  startReg() {
    this.is0FormGroup = false;
    this.is1FormGroup = true;
    this.currIdxStep = 1;
  }

  stepNext() {
    this.loadcurrFinishStep();
    if (this.currIdxStep >= 0 && this.currIdxStep < this.steps.length) {
      let index = this.currIdxStep += 1;
      let step = this.steps[index];
      //console.log('idx ' + index);
      //console.log('step ' + step);
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

    if (step == 9) {
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
    if ((this.processInstanceId || stepHandle == 'step2Handle()') && type == 'next') {
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
    this.checkProcessInstanceValue();
  }

  step3Handle() {
    this.appService._completedOtp(this.processInstanceId, this.otpCorrect, this.showStepTkSodep);
    this.loadParams();
  }

  step4Handle() {
    this.appService._completedChonSDep(this.processInstanceId, this._3FormGroup.value.sdep);
  }

  step5Handle() {
    return '';
  }

  step6Handle() {
    let data = null;
    if (this._4FormGroup.value.idGTTT == 'cccd') {
      try {
        data = {
          gtoTThan: {
            GToTThan: {
              anhMTruoc: this.webcamImageFront._imageAsDataUrl.split('base64,')[1],
              anhMSau: this.webcamImageBack._imageAsDataUrl.split('base64,')[1]
            }
          }
        }
      } catch (e) {
        if (!this.appService.taskInstanceIds[0].XNhanGTTT) {
          this.swalWarningStep('Cảnh Báo', 'Xác Thực Giấy Tờ Tùy Thân Không Thành Công!');
          return;
        }
      }
    } else if (this._4FormGroup.value.idGTTT == 'pp') {
      try {
        data = {
          gtoTThan: {
            GToTThan: {
              anhMTruoc: this.webcamImagePP._imageAsDataUrl.split('base64,')[1]
            }
          }
        }
      } catch (e) {
        if (!this.appService.taskInstanceIds[0].XNhanGTTT) {
          this.swalWarningStep('Cảnh Báo', 'Xác Thực Giấy Tờ Tùy Thân Không Thành Công!');
          return;
        }
      }
    }

    if (data !== null) {
      this.appService._completedNhanGTTT(this.processInstanceId, data);
    }
  }

  step7Handle() {
    let data = {
      xnhanGTTT: this._6FormGroup.value.xnhanGTTT
    }

    this.appService._completedXNhanGTTT(this.processInstanceId, data);
  }

  step8Handle() {
    if (this.khungHinh.length == 3) {
      let data = {
        ycXThucKMat: {
          YCXThucKMat: {
            khungHinh: this.khungHinh
          }
        }
      }

      this.appService._completedNhanTTinKMat(this.processInstanceId, data);
    } else {
      if (!this.appService.taskInstanceIds[0].NhanTTinKMat) {
        this.swalWarningStep('Cảnh Báo', 'Xác Thực Khuôn Mặt Không Thành Công!');
        return;
      }
    }
  }

  step9Handle() {
    let data = {
      dvuNHang: {
        DVuNHang: {
          maDVu: this._8FormGroup.value.dVuNHang.split('|')[0],
          tenDVu: this._8FormGroup.value.dVuNHang.split('|')[1]
        }
      },

      cnhanhGDich: {
        DiaChi: {
          tinhThanh: this._8FormGroup.value.cnhanhGDich.split('|')[0],
          quanHuyen: this._8FormGroup.value.cnhanhGDich.split('|')[1],
          phuongXa: this._8FormGroup.value.cnhanhGDich.split('|')[2],
          chiTiet: this._8FormGroup.value.cnhanhGDich.split('|')[3],
        }
      }
    }

    this.appService._completedChonDVuCNhanh(this.processInstanceId, data);
  }

  retsetStep() {
    this.appService.errsStep = false;
    this.appService.errsStepNhanGTTT = false;
    this.appService.errsStepXNhanGTTT = false;
    this.appService.errsStepNhanTTinKMat = false;
    this.is0FormGroup = false;
    this.is1FormGroup = false;
    this.is2FormGroup = false;
    this.is3FormGroup = false;
    this.is4FormGroup = false;
    this.is5FormGroup = false;
    this.is6FormGroup = false;
    this.is7FormGroup = false;
    this.is8FormGroup = false;
  }

  cValid(index: number) {
    let step = this.steps[index];
    switch(step) {
      case 0:
        return this._0FormGroup.valid;
      case 1:
        return this._1FormGroup.valid;
      case 2:
        return this._2FormGroup.valid;
      case 3:
        return this._3FormGroup.valid;
      case 4:
        return this._4FormGroup.valid;
      case 5:
        return this._5FormGroup.valid;
      case 6:
        return this._6FormGroup.valid;
      case 7:
        return this._7FormGroup.valid;
      case 8:
        return this._8FormGroup.valid;
      default:
        return false;
    }
  }

  onOtpChange(value: any) {
    if (this.appService.xThucOtp(value)) {
      this.otpCorrect = value;
    } else {
      this.otpCorrect = '';
    }
  }

  chonDuoiSDep(duoiSDep: any) {
    if (this.processInstanceId) {
      this.appService._completedChonDuoiSDep(this.processInstanceId, duoiSDep, this.showStepTkSodep);
      this.showResultSDep = true;
    }
  }

  cbSdepChecked(value: any) {
    if (value == this.appService.params[0].sdep) {
      return 'checked';
    }

    return '';
  }

  chonSDepChange(e: any) {
    this._3FormGroup.value.sdep = e.target.value;
  }

  chonDsachDVuNHang(e: any) {
    this._7FormGroup.value.dVuNHang = e.target.value;
  }

  chonDsachCNhanh(e: any) {
    this._7FormGroup.value.cnhanhGDich = e.target.value;
  }

  handleImage(webcamImage: WebcamImage, type: any) {
    if (type == 'img_front') {
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
      this.khungHinh.push(this.webcamImageFace._imageAsDataUrl.split('base64,')[1]);
    }
  }
}
