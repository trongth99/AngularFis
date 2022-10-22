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
  title = 'Đăng ký tài khoản tại quầy';

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

  checked = true;
  checkedTT = true;

  _0FormGroup!: FormGroup;
  _1FormGroup!: FormGroup;
  _2FormGroup!: FormGroup;
  _3FormGroup!: FormGroup;
  _4FormGroup!: FormGroup;
  _5FormGroup!: FormGroup;
  _6FormGroup!: FormGroup;
  _7FormGroup!: FormGroup;
  _8FormGroup!: FormGroup;
  _9FormGroup!: FormGroup;
  _10FormGroup!: FormGroup;

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

  //form number
  configSteps = [
    {
      step: 'step1',
      status: 1,
      title: 'Xác Thực Giấy Tờ Tùy Thân',
      isFormGroup: this.is1FormGroup,
      doneFormGroup: this.done1FormGroup
    },
    {
      step: 'step2',
      status: 1,
      title: 'Xác Nhận Thông Tin',
      isFormGroup: this.is2FormGroup,
      doneFormGroup: this.done2FormGroup
    },
    {
      step: 'step3',
      status: 1,
      title: 'Xác Thực Khuôn Mặt',
      isFormGroup: this.is3FormGroup,
      doneFormGroup: this.done3FormGroup
    },
    {
      step: 'step4',
      status: 1,
      title: 'Nhập Đơn Đăng Ký',
      isFormGroup: this.is4FormGroup,
      doneFormGroup: this.done4FormGroup
    },
    {
      step: 'step5',
      status: 1,
      title: 'Nhập Đơn Đăng Ký',
      isFormGroup: this.is5FormGroup,
      doneFormGroup: this.done5FormGroup
    },
    {
      step: 'step6',
      status: 1,
      title: 'Nhập Đơn Đăng Ký',
      isFormGroup: this.is6FormGroup,
      doneFormGroup: this.done6FormGroup
    },
    {
      step: 'step7',
      status: 1,
      title: 'Nhập Đơn Đăng Ký',
      isFormGroup: this.is7FormGroup,
      doneFormGroup: this.done7FormGroup
    },
    {
      step: 'step8',
      status: 1,
      title: 'Nhập Đơn Đăng Ký',
      isFormGroup: this.is8FormGroup,
      doneFormGroup: this.done8FormGroup
    },
    {
      step: 'step9',
      status: 1,
      title: 'Xem Đơn Đăng Ký',
      isFormGroup: this.is9FormGroup,
      doneFormGroup: this.done9FormGroup
    },
    {
      step: 'step10',
      status: 1,
      title: 'Kết Thúc',
      isFormGroup: this.is10FormGroup,
      doneFormGroup: this.done10FormGroup
    }
  ];
  steps = [0,1,2,3,4,5,6,7,8,9,10];
  currIdxStep = 0;
  params = this.appService.params;
  titleStep = this.configSteps[0].title;

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

  tongSoTrang = 5;
  pageActive = 1;
  pdfDonDKy = this.appService.pdfDonDKy;
  htmlDonDKy = '';
  htmlDonDKy1 = '';
  htmlDonDKy2 = '';
  htmlDonDKy3 = '';
  htmlDonDKy4 = '';
  htmlDonDKy5 = '';

  ttaiCIF = false;
  pcrtHit = false;

  gtNamChecked = false;
  gtNuChecked = false;
  strLoaiGToTThan = '';

  constructor(
    private _formBuilder: FormBuilder,
    public appService: AppService,
    private deviceService: DeviceDetectorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadForm();
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

  loadForm() {
    this._0FormGroup = this._formBuilder.group({

    });

    this._1FormGroup = this._formBuilder.group({

    });

    this._2FormGroup = this._formBuilder.group({
      xnhanGTTT: ['']
    });

    this._3FormGroup = this._formBuilder.group({

    });

    this._4FormGroup = this._formBuilder.group({

    });

    this._5FormGroup = this._formBuilder.group({

    });

    this._6FormGroup = this._formBuilder.group({

    });

    this._7FormGroup = this._formBuilder.group({

    });

    this._8FormGroup = this._formBuilder.group({

    });

    this._9FormGroup = this._formBuilder.group({

    });

    this._10FormGroup = this._formBuilder.group({

    });
  }

  loadData() {
    this.datatGToTThan = this.appService.datatGToTThan;
    if (this.datatGToTThan.length > 0) {
      this.ngayHetHan = this.datatGToTThan[0].ngayHetHan;
      this.noiTru = this.datatGToTThan[0].noiTru;
    }

    this.pdfDonDKy = this.appService.pdfDonDKy;

    if (this.appService.customerUser.gioiTinh == 0) {
      this.gtNamChecked = true;
      this.gtNuChecked = false;
    } else if (this.appService.customerUser.gioiTinh == 1) {
      this.gtNamChecked = false;
      this.gtNuChecked = true;
    }

    if (this.appService.customerUser.loaiGToTThan == 4) {
      this.strLoaiGToTThan = 'CCCD';
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
    this.createProcessInstance();
  }

  createProcessInstance() {
    let data = {
        "kquaKTraCIF": {
            "fis.onboarding.process.banking.model.KQuaKTraCIF": {
                "ttaiCIF": this.ttaiCIF
            }
        },
        "pcrtHit": this.pcrtHit
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
    this.checkProcessInstanceValue();
  }

  stepNext() {
    //this.loadcurrFinishStep();
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
    if (this.currIdxStep > 1) {
      this.titleStep = this.configSteps[this.steps[this.currIdxStep-1]].title;
    }

    if (step == 10) {
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
    let data = null;
    try {
      data = {
        gtoTThan: {
          "fis.onboarding.common.model.identity.GToTThan": {
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

    if (data !== null) {
      this.appService._completedNhanGTTT(this.processInstanceId, data);
    }
  }

  step3Handle() {
    let data = {
      xnhanGTTT: this._2FormGroup.value.xnhanGTTT
    }

    this.appService._completedXNhanGTTT(this.processInstanceId, data);
  }

  step4Handle() {
    if (this.khungHinh.length == 3) {
      let data = {
        ycXThucKMat: {
          "fis.onboarding.common.model.ekyc.xthuckmat.YCXThucKMat": {
            khungHinh: this.khungHinh
          }
        }
      }

      this.appService._completedNhanTTinKMat(this.processInstanceId, data);
    } else {
      if (!this.appService.taskInstanceIds[0].NhanKMat) {
        this.swalWarningStep('Cảnh Báo', 'Xác Thực Khuôn Mặt Không Thành Công!');
      }
    }
  }

  step5Handle() {
    this.htmlDonDKy1 = $("#p1").html().toString();
  }

  step6Handle() {
    this.htmlDonDKy2 = $("#p2").html().toString();
  }

  step7Handle() {
    this.htmlDonDKy3 = $("#p3").html().toString();
  }

  step8Handle() {
    this.htmlDonDKy4 = $("#p4").html().toString();
  }

  step9Handle() {
    let thoihancutru: any = $('#thoihancutru').val()?.toString();
    let thoigianodiachihientai: any = $('#thoigianodiachihientai').val()?.toString();

    let cutru = false;
    if ($('#cutru').is(":checked")) cutru = true;

    let maNNghiep = '';
    let tenNNghiep = '';
    let nghenghiepkhac: any = $('#text_nghenghiepkhac').val()?.toString();
    if ($('#nghenghiep1').is(":checked")) { maNNghiep = 'nghenghiep1'; tenNNghiep = 'Nhân viên văn phòng'; }
    if ($('#nghenghiep2').is(":checked")) { maNNghiep = 'nghenghiep2'; tenNNghiep = 'Bác sĩ, dược sĩ, y tá'; }
    if ($('#nghenghiep3').is(":checked")) { maNNghiep = 'nghenghiep3'; tenNNghiep = 'Công nhân viên chức'; }
    if ($('#nghenghiep4').is(":checked")) { maNNghiep = 'nghenghiep4'; tenNNghiep = 'Kỹ sư, công nhân xây dựng'; }
    if ($('#nghenghiep5').is(":checked")) { maNNghiep = 'nghenghiep5'; tenNNghiep = 'Lực lượng vũ trang'; }
    if ($('#nghenghiep6').is(":checked")) { maNNghiep = 'nghenghiep6'; tenNNghiep = 'Học sinh, sinh viên'; }
    if ($('#nghenghiepkhac').is(":checked")) { maNNghiep = 'nghenghiepkhac'; tenNNghiep = nghenghiepkhac; }

    let khongquoctich = false;
    if ($('#khongquoctich').is(":checked")) khongquoctich = true;

    let daquoctich = false;
    if ($('#daquoctich').is(":checked")) daquoctich = true;

    let congdanhoaky = false;
    if ($('#congdanhoaky').is(":checked")) congdanhoaky = true;

    let loaiTien = '';
    let loaitien_khac: any = $('#text_loaitien_khac').val()?.toString();
    if ($('#vnd').is(":checked")) loaiTien = 'VNĐ';
    if ($('#usd').is(":checked")) loaiTien = 'USD';
    if ($('#loaitien_khac').is(":checked")) loaiTien = loaitien_khac;

    let maLoaiTKhoan = '';
    let tenLoaiTKhoan = '';
    let loaitk_khac: any = $('#text_loaitk_khac').val()?.toString();
    if ($('#loaitk_thanhtoan').is(":checked")) { maLoaiTKhoan = 'loaitk_thanhtoan'; tenLoaiTKhoan = 'Thanh toán'; }
    if ($('#loaitk_thanhtoanchung').is(":checked")) { maLoaiTKhoan = 'loaitk_thanhtoanchung'; tenLoaiTKhoan = 'Thanh toán chung'; }
    if ($('#loaitk_khac').is(":checked")) { maLoaiTKhoan = 'loaitk_khac'; tenLoaiTKhoan = loaitk_khac; }

    let data = {
      customerUser: {
        "fis.onboarding.process.banking.model.CustomerUser": {
          cif: "",
          dvuNHang: {
            maDVu: "",
            tenDVu: "",
          },
          tkhoanTToan: [
            {
              loaiTKhoan: [
                {
                  maLoaiTKhoan: maLoaiTKhoan,
                  tenLoaiTKhoan: tenLoaiTKhoan,
                }
              ],
              soTKhoan: "",
              hmucGDich: 1,
              loaiTien: loaiTien,
            }
          ],
          customerProfile: {
            maSoThue: $('#masothuecanhan').val()?.toString(),
            cuTru: cutru,
            thanCTru: parseInt(thoihancutru),
            thiThuc: false,
            gtoMienTThuc: "",
            ngheNghiep: {
              maNNghiep: maNNghiep,
              tenNNghiep: tenNNghiep
            },
            chucVu: {
              maCVu: "",
              tenCVu: ""
            },
            dchiNNgoai: $('#diachinuocngoai').val()?.toString(),
            dchiHTai: $('#diachiohientai').val()?.toString(),
            tgianODChiHTai: parseInt(thoigianodiachihientai),
            ckyMau1: this.sign1.toDataURL(),
            ckyMau2: this.sign2.toDataURL(),
            ttinTThu: {
              khongQTich: khongquoctich,
              daQTich: daquoctich,
              qtichMy: congdanhoaky,
              mdichGDich: [
                {
                  maMDich: "",
                  tenMDich: "",
                }
              ]
            }
          }
        }
      }
    }

    let start_html = '<html>\
      <head>\
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"\ integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">\
      </head>\
      <body>\
      <div class="container">\
    ';

    let end_html = '</div>\
      </body>\
      </html>\
    ';

    this.htmlDonDKy5 = $("#p5").html().toString();

    this.htmlDonDKy = start_html + this.htmlDonDKy1 + this.htmlDonDKy2 + this.htmlDonDKy3 + this.htmlDonDKy4 + this.htmlDonDKy5 + end_html;

    this.appService._completedNhapDonDKy(this.processInstanceId, data, this.htmlTemp(this.htmlDonDKy));
  }

  step10Handle() {
    let data = {
      pdfDonDKy: ''
    }
    this.appService._completedXemDonDKy(this.processInstanceId, data);
  }

  retsetStep() {
    this.appService.errsStep = false;
    this.appService.errsStepNhanGTTT = false;
    this.appService.errsStepXNhanGTTT = false;
    this.appService.errsStepNhanTTinKMat = false;
    this.appService.errsStepNhapDonDKy = false;
    this.appService.errsStepTaoDonDKy = false;
    this.is0FormGroup = false;
    this.is1FormGroup = false;
    this.is2FormGroup = false;
    this.is3FormGroup = false;
    this.is4FormGroup = false;
    this.is5FormGroup = false;
    this.is6FormGroup = false;
    this.is7FormGroup = false;
    this.is8FormGroup = false;
    this.is9FormGroup = false;
    this.is10FormGroup = false;
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
      case 9:
        return this._9FormGroup.valid;
      case 10:
      return this._10FormGroup.valid;
      default:
        return false;
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

  counter(i: number) {
    return new Array(i);
  }

  getFormTT(page = 1) {
    this.pageActive = page;
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

  savePad(pad: SignaturePad) {
    const base64Data = pad.toDataURL();
    this.signatureImg = base64Data;
  }

  showBase64(str_base64: any) {
    if (str_base64) {
      str_base64 = 'data:application/pdf;base64,' + str_base64;
      return str_base64;
    }
    return '';
  }

  printPdf(basePdf: string) {
    let byteCharacters = atob(basePdf);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let file = new Blob([byteArray], {type: 'application/pdf;base64'});
    let fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }

  htmlTemp(html: string): string {
    html = html.replace('[hoTen]', this.appService.customerUser.hoTen);

    let gtNamChecked = '[ ]'
    if (this.gtNamChecked) gtNamChecked = '[X]';
    html = html.replace('[gtNamChecked]', gtNamChecked);

    let gtNuChecked = '[ ]'
    if (this.gtNuChecked) gtNuChecked = '[X]';
    html = html.replace('[gtNuChecked]', gtNuChecked);

    html = html.replace('[ngaySinh]', this.appService.customerUser.ngaySinh);
    html = html.replace('[quocTich]', this.appService.customerUser.quocTich);
    html = html.replace('[strLoaiGToTThan]', this.strLoaiGToTThan);
    html = html.replace('[noiCap]', this.appService.customerUser.noiCap);
    html = html.replace('[soGTo]', this.appService.customerUser.soGTo);
    html = html.replace('[ngayCap]', this.appService.customerUser.ngayCap);
    html = html.replace('[ngayHetHan]', this.ngayHetHan);
    html = html.replace('[noiTru]', this.noiTru);

    let cutru = '[ ]';
    if ($('#cutru').is(":checked")) cutru = '[X]';
    html = html.replace('[cutru]', cutru);

    let thoihancutru: any = $('#thoihancutru').val()?.toString();
    html = html.replace('[thoihancutru]', thoihancutru);

    let nghenghiep1 = '[ ]';
    if ($('#nghenghiep1').is(":checked")) nghenghiep1 = '[X]';
    html = html.replace('[nghenghiep1]', nghenghiep1);

    let nghenghiep2 = '[ ]';
    if ($('#nghenghiep2').is(":checked")) nghenghiep2 = '[X]';
    html = html.replace('[nghenghiep2]', nghenghiep2);

    let nghenghiep3 = '[ ]';
    if ($('#nghenghiep3').is(":checked")) nghenghiep3 = '[X]';
    html = html.replace('[nghenghiep3]', nghenghiep3);

    let nghenghiep4 = '[ ]';
    if ($('#nghenghiep4').is(":checked")) nghenghiep4 = '[X]';
    html = html.replace('[nghenghiep4]', nghenghiep4);

    let nghenghiep5 = '[ ]';
    if ($('#nghenghiep5').is(":checked")) nghenghiep5 = '[X]';
    html = html.replace('[nghenghiep5]', nghenghiep5);

    let nghenghiep6 = '[ ]';
    if ($('#nghenghiep6').is(":checked")) nghenghiep6 = '[X]';
    html = html.replace('[nghenghiep6]', nghenghiep6);

    let nghenghiepkhac = '[ ]';
    if ($('#nghenghiepkhac').is(":checked")) nghenghiepkhac = '[X]';
    html = html.replace('[nghenghiepkhac]', nghenghiepkhac);

    let text_nghenghiepkhac: any = $('#text_nghenghiepkhac').val()?.toString();
    html = html.replace('[text_nghenghiepkhac]', text_nghenghiepkhac);

    let diachinuocngoai: any = $('#diachinuocngoai').val()?.toString();
    html = html.replace('[diachinuocngoai]', diachinuocngoai);

    let diachiohientai: any = $('#diachiohientai').val()?.toString();
    html = html.replace('[diachiohientai]', diachiohientai);

    let thoigianodiachihientai: any = $('#thoigianodiachihientai').val()?.toString();
    html = html.replace('[thoigianodiachihientai]', thoigianodiachihientai);

    let email: any = $('#email').val()?.toString();
    html = html.replace('[email]', email);

    let dienthoai: any = $('#dienthoai').val()?.toString();
    html = html.replace('[dienthoai]', dienthoai);

    //

    let khongquoctich = '[ ]';
    if ($('#khongquoctich').is(":checked")) khongquoctich = '[X]';
    html = html.replace('[khongquoctich]', khongquoctich);

    let daquoctich = '[ ]';
    if ($('#daquoctich').is(":checked")) daquoctich = '[X]';
    html = html.replace('[daquoctich]', daquoctich);

    let congdanhoaky = '[ ]';
    if ($('#congdanhoaky').is(":checked")) congdanhoaky = '[X]';
    html = html.replace('[congdanhoaky]', congdanhoaky);

    let chusohuuhuongloi = '[ ]';
    if ($('#chusohuuhuongloi').is(":checked")) chusohuuhuongloi = '[X]';
    html = html.replace('[chusohuuhuongloi]', chusohuuhuongloi);

    let thoathuanphaply = '[ ]';
    if ($('#thoathuanphaply').is(":checked")) thoathuanphaply = '[X]';
    html = html.replace('[thoathuanphaply]', thoathuanphaply);

    let thanhtoan = '[ ]';
    if ($('#thanhtoan').is(":checked")) thanhtoan = '[X]';
    html = html.replace('[thanhtoan]', thanhtoan);

    let tietkiem = '[ ]';
    if ($('#tietkiem').is(":checked")) tietkiem = '[X]';
    html = html.replace('[tietkiem]', tietkiem);

    let vayvon = '[ ]';
    if ($('#vayvon').is(":checked")) vayvon = '[X]';
    html = html.replace('[vayvon]', vayvon);

    let ctientrongnuoc = '[ ]';
    if ($('#ctientrongnuoc').is(":checked")) ctientrongnuoc = '[X]';
    html = html.replace('[ctientrongnuoc]', ctientrongnuoc);

    let ctiennuocnoai = '[ ]';
    if ($('#ctiennuocnoai').is(":checked")) ctiennuocnoai = '[X]';
    html = html.replace('[ctiennuocnoai]', ctiennuocnoai);

    let ctienkhac = '[ ]';
    if ($('#ctienkhac').is(":checked")) ctienkhac = '[X]';
    html = html.replace('[ctienkhac]', ctienkhac);

    let text_ctienkhac: any = $('#text_ctienkhac').val()?.toString();
    html = html.replace('[text_ctienkhac]', text_ctienkhac);

    //

    let maSoThue: any = $('#masothuecanhan').val()?.toString();
    html = html.replace('[masothuecanhan]', maSoThue);

    html = html.replace('[tentk]', this.appService.customerUser.hoTen);

    let loaitk_thanhtoan = '[ ]';
    if ($('#loaitk_thanhtoan').is(":checked")) loaitk_thanhtoan = '[X]';
    html = html.replace('[loaitk_thanhtoan]', loaitk_thanhtoan);

    let loaitk_thanhtoanchung = '[ ]';
    if ($('#loaitk_thanhtoanchung').is(":checked")) loaitk_thanhtoanchung = '[X]';
    html = html.replace('[loaitk_thanhtoanchung]', loaitk_thanhtoanchung);

    let loaitk_khac = '[ ]';
    if ($('#loaitk_khac').is(":checked")) loaitk_khac = '[X]';
    html = html.replace('[loaitk_khac]', loaitk_khac);

    let text_loaitk_khac: any = $('#text_loaitk_khac').val()?.toString();
    html = html.replace('[text_loaitk_khac]', text_loaitk_khac);

    let loaitk_thanhtoansochon = '[ ]';
    if ($('#loaitk_thanhtoansochon').is(":checked")) loaitk_thanhtoansochon = '[X]';
    html = html.replace('[loaitk_thanhtoansochon]', loaitk_thanhtoansochon);

    let text_loaitk_thanhtoansochon: any = $('#text_loaitk_thanhtoansochon').val()?.toString();
    html = html.replace('[text_loaitk_thanhtoansochon]', text_loaitk_thanhtoansochon);

    let vnd = '[ ]';
    if ($('#vnd').is(":checked")) vnd = '[X]';
    html = html.replace('[vnd]', vnd);

    let usd = '[ ]';
    if ($('#usd').is(":checked")) usd = '[X]';
    html = html.replace('[usd]', usd);

    let loaitien_khac = '[ ]';
    if ($('#loaitien_khac').is(":checked")) loaitien_khac = '[X]';
    html = html.replace('[loaitien_khac]', loaitien_khac);

    let text_loaitien_khac: any = $('#text_loaitien_khac').val()?.toString();
    html = html.replace('[text_loaitien_khac]', text_loaitien_khac);

    let goitk_vcb_eco = '[ ]';
    if ($('#goitk_vcb_eco').is(":checked")) goitk_vcb_eco = '[X]';
    html = html.replace('[goitk_vcb_eco]', goitk_vcb_eco);

    let goitk_vcb_plus = '[ ]';
    if ($('#goitk_vcb_plus').is(":checked")) goitk_vcb_plus = '[X]';
    html = html.replace('[goitk_vcb_plus]', goitk_vcb_plus);

    let goitk_vcb_pro = '[ ]';
    if ($('#goitk_vcb_pro').is(":checked")) goitk_vcb_pro = '[X]';
    html = html.replace('[goitk_vcb_pro]', goitk_vcb_pro);

    let goitk_vcb_advanced = '[ ]';
    if ($('#goitk_vcb_advanced').is(":checked")) goitk_vcb_advanced = '[X]';
    html = html.replace('[goitk_vcb_advanced]', goitk_vcb_advanced);

    let goitk_khac = '[ ]';
    if ($('#goitk_khac').is(":checked")) goitk_khac = '[X]';
    html = html.replace('[goitk_khac]', goitk_khac);

    let text_goitk_khac: any = $('#text_goitk_khac').val()?.toString();
    html = html.replace('[text_goitk_khac]', text_goitk_khac);

    let dv_vcb_sms_banking = '[ ]';
    if ($('#dv_vcb_sms_banking').is(":checked")) dv_vcb_sms_banking = '[X]';
    html = html.replace('[dv_vcb_sms_banking]', dv_vcb_sms_banking);

    let dv_vcb_digibank = '[ ]';
    if ($('#dv_vcb_digibank').is(":checked")) dv_vcb_digibank = '[X]';
    html = html.replace('[dv_vcb_digibank]', dv_vcb_digibank);

    let dv_vcb_phone_banking = '[ ]';
    if ($('#dv_vcb_phone_banking').is(":checked")) dv_vcb_phone_banking = '[X]';
    html = html.replace('[dv_vcb_phone_banking]', dv_vcb_phone_banking);

    //

    let pthuc_smart_otp = '[ ]';
    if ($('#pthuc_smart_otp').is(":checked")) pthuc_smart_otp = '[X]';
    html = html.replace('[pthuc_smart_otp]', pthuc_smart_otp);

    let vcb_connect24_yes = '[ ]';
    if ($('#vcb_connect24_yes').is(":checked")) vcb_connect24_yes = '[X]';
    html = html.replace('[vcb_connect24_yes]', vcb_connect24_yes);

    let vcb_connect24_no = '[ ]';
    if ($('#vcb_connect24_no').is(":checked")) vcb_connect24_no = '[X]';
    html = html.replace('[vcb_connect24_no]', vcb_connect24_no);

    let vcb_connect24_nomal = '[ ]';
    if ($('#vcb_connect24_nomal').is(":checked")) vcb_connect24_nomal = '[X]';
    html = html.replace('[vcb_connect24_nomal]', vcb_connect24_nomal);

    let vcb_connect24_fast = '[ ]';
    if ($('#vcb_connect24_fast').is(":checked")) vcb_connect24_fast = '[X]';
    html = html.replace('[vcb_connect24_fast]', vcb_connect24_fast);

    let vcb_connect24_auto = '[ ]';
    if ($('#vcb_connect24_auto').is(":checked")) vcb_connect24_auto = '[X]';
    html = html.replace('[vcb_connect24_auto]', vcb_connect24_auto);

    let vcb_connect24_money = '[ ]';
    if ($('#vcb_connect24_money').is(":checked")) vcb_connect24_money = '[X]';
    html = html.replace('[vcb_connect24_money]', vcb_connect24_money);

    let vcb_connect24_visa_yes = '[ ]';
    if ($('#vcb_connect24_visa_yes').is(":checked")) vcb_connect24_visa_yes = '[X]';
    html = html.replace('[vcb_connect24_visa_yes]', vcb_connect24_visa_yes);

    let vcb_connect24_visa_no = '[ ]';
    if ($('#vcb_connect24_visa_no').is(":checked")) vcb_connect24_visa_no = '[X]';
    html = html.replace('[vcb_connect24_visa_no]', vcb_connect24_visa_no);

    let vcb_connect24_visa_nomal = '[ ]';
    if ($('#vcb_connect24_visa_nomal').is(":checked")) vcb_connect24_visa_nomal = '[X]';
    html = html.replace('[vcb_connect24_visa_nomal]', vcb_connect24_visa_nomal);

    let vcb_connect24_visa_fast = '[ ]';
    if ($('#vcb_connect24_visa_fast').is(":checked")) vcb_connect24_visa_fast = '[X]';
    html = html.replace('[vcb_connect24_visa_fast]', vcb_connect24_visa_fast);

    let vcb_connect24_visa_auto = '[ ]';
    if ($('#vcb_connect24_visa_auto').is(":checked")) vcb_connect24_visa_auto = '[X]';
    html = html.replace('[vcb_connect24_visa_auto]', vcb_connect24_visa_auto);

    let vcb_connect24_visa_money = '[ ]';
    if ($('#vcb_connect24_visa_money').is(":checked")) vcb_connect24_visa_money = '[X]';
    html = html.replace('[vcb_connect24_visa_money]', vcb_connect24_visa_money);

    let vcb_visa_debit_platinum_yes = '[ ]';
    if ($('#vcb_visa_debit_platinum_yes').is(":checked")) vcb_visa_debit_platinum_yes = '[X]';
    html = html.replace('[vcb_visa_debit_platinum_yes]', vcb_visa_debit_platinum_yes);

    let vcb_visa_debit_platinum_no = '[ ]';
    if ($('#vcb_visa_debit_platinum_no').is(":checked")) vcb_visa_debit_platinum_no = '[X]';
    html = html.replace('[vcb_visa_debit_platinum_no]', vcb_visa_debit_platinum_no);

    let vcb_visa_debit_platinum_nomal = '[ ]';
    if ($('#vcb_visa_debit_platinum_nomal').is(":checked")) vcb_visa_debit_platinum_nomal = '[X]';
    html = html.replace('[vcb_visa_debit_platinum_nomal]', vcb_visa_debit_platinum_nomal);

    let vcb_visa_debit_platinum_fast = '[ ]';
    if ($('#vcb_visa_debit_platinum_fast').is(":checked")) vcb_visa_debit_platinum_fast = '[X]';
    html = html.replace('[vcb_visa_debit_platinum_fast]', vcb_visa_debit_platinum_fast);

    let vcb_visa_debit_platinum_auto = '[ ]';
    if ($('#vcb_visa_debit_platinum_auto').is(":checked")) vcb_visa_debit_platinum_auto = '[X]';
    html = html.replace('[vcb_visa_debit_platinum_auto]', vcb_visa_debit_platinum_auto);

    let vcb_visa_debit_platinum_money = '[ ]';
    if ($('#vcb_visa_debit_platinum_money').is(":checked")) vcb_visa_debit_platinum_money = '[X]';
    html = html.replace('[vcb_visa_debit_platinum_money]', vcb_visa_debit_platinum_money);

    let vcb_mastercard_yes = '[ ]';
    if ($('#vcb_mastercard_yes').is(":checked")) vcb_mastercard_yes = '[X]';
    html = html.replace('[vcb_mastercard_yes]', vcb_mastercard_yes);

    let vcb_mastercard_no = '[ ]';
    if ($('#vcb_mastercard_no').is(":checked")) vcb_mastercard_no = '[X]';
    html = html.replace('[vcb_mastercard_no]', vcb_mastercard_no);

    let vcb_mastercard_nomal = '[ ]';
    if ($('#vcb_mastercard_nomal').is(":checked")) vcb_mastercard_nomal = '[X]';
    html = html.replace('[vcb_mastercard_nomal]', vcb_mastercard_nomal);

    let vcb_mastercard_fast = '[ ]';
    if ($('#vcb_mastercard_fast').is(":checked")) vcb_mastercard_fast = '[X]';
    html = html.replace('[vcb_mastercard_fast]', vcb_mastercard_fast);

    let vcb_mastercard_auto = '[ ]';
    if ($('#vcb_mastercard_auto').is(":checked")) vcb_mastercard_auto = '[X]';
    html = html.replace('[vcb_mastercard_auto]', vcb_mastercard_auto);

    let vcb_mastercard_money = '[ ]';
    if ($('#vcb_mastercard_money').is(":checked")) vcb_mastercard_money = '[X]';
    html = html.replace('[vcb_mastercard_money]', vcb_mastercard_money);

    let vcb_unionpay_yes = '[ ]';
    if ($('#vcb_unionpay_yes').is(":checked")) vcb_unionpay_yes = '[X]';
    html = html.replace('[vcb_unionpay_yes]', vcb_unionpay_yes);

    let vcb_unionpay_no = '[ ]';
    if ($('#vcb_unionpay_no').is(":checked")) vcb_unionpay_no = '[X]';
    html = html.replace('[vcb_unionpay_no]', vcb_unionpay_no);

    let vcb_unionpay_nomal = '[ ]';
    if ($('#vcb_unionpay_nomal').is(":checked")) vcb_unionpay_nomal = '[X]';
    html = html.replace('[vcb_unionpay_nomal]', vcb_unionpay_nomal);

    let vcb_unionpay_fast = '[ ]';
    if ($('#vcb_unionpay_fast').is(":checked")) vcb_unionpay_fast = '[X]';
    html = html.replace('[vcb_unionpay_fast]', vcb_unionpay_fast);

    let vcb_unionpay_auto = '[ ]';
    if ($('#vcb_unionpay_auto').is(":checked")) vcb_unionpay_auto = '[X]';
    html = html.replace('[vcb_unionpay_auto]', vcb_unionpay_auto);

    let vcb_unionpay_money = '[ ]';
    if ($('#vcb_unionpay_money').is(":checked")) vcb_unionpay_money = '[X]';
    html = html.replace('[vcb_unionpay_money]', vcb_unionpay_money);

    let vcb_cashback_plus_american_express_yes = '[ ]';
    if ($('#vcb_cashback_plus_american_express_yes').is(":checked")) vcb_cashback_plus_american_express_yes = '[X]';
    html = html.replace('[vcb_cashback_plus_american_express_yes]', vcb_cashback_plus_american_express_yes);

    let vcb_cashback_plus_american_express_no = '[ ]';
    if ($('#vcb_cashback_plus_american_express_no').is(":checked")) vcb_cashback_plus_american_express_no = '[X]';
    html = html.replace('[vcb_cashback_plus_american_express_no]', vcb_cashback_plus_american_express_no);

    let vcb_cashback_plus_american_express_nomal = '[ ]';
    if ($('#vcb_cashback_plus_american_express_nomal').is(":checked")) vcb_cashback_plus_american_express_nomal = '[X]';
    html = html.replace('[vcb_cashback_plus_american_express_nomal]', vcb_cashback_plus_american_express_nomal);

    let vcb_cashback_plus_american_express_fast = '[ ]';
    if ($('#vcb_cashback_plus_american_express_fast').is(":checked")) vcb_cashback_plus_american_express_fast = '[X]';
    html = html.replace('[vcb_cashback_plus_american_express_fast]', vcb_cashback_plus_american_express_fast);

    let vcb_cashback_plus_american_express_auto = '[ ]';
    if ($('#vcb_cashback_plus_american_express_auto').is(":checked")) vcb_cashback_plus_american_express_auto = '[X]';
    html = html.replace('[vcb_cashback_plus_american_express_auto]', vcb_cashback_plus_american_express_auto);

    let vcb_cashback_plus_american_express_money = '[ ]';
    if ($('#vcb_cashback_plus_american_express_money').is(":checked")) vcb_cashback_plus_american_express_money = '[X]';
    html = html.replace('[vcb_cashback_plus_american_express_money]', vcb_cashback_plus_american_express_money);

    let text_vcb_ghinokhac: any = $('#text_vcb_ghinokhac').val()?.toString();
    html = html.replace('[text_vcb_ghinokhac]', text_vcb_ghinokhac);

    let vcb_ghinokhac_yes = '[ ]';
    if ($('#vcb_ghinokhac_yes').is(":checked")) vcb_ghinokhac_yes = '[X]';
    html = html.replace('[vcb_ghinokhac_yes]', vcb_ghinokhac_yes);

    let vcb_ghinokhac_no = '[ ]';
    if ($('#vcb_ghinokhac_no').is(":checked")) vcb_ghinokhac_no = '[X]';
    html = html.replace('[vcb_ghinokhac_no]', vcb_ghinokhac_no);

    let vcb_ghinokhac_nomal = '[ ]';
    if ($('#vcb_ghinokhac_nomal').is(":checked")) vcb_ghinokhac_nomal = '[X]';
    html = html.replace('[vcb_ghinokhac_nomal]', vcb_ghinokhac_nomal);

    let vcb_ghinokhac_fast = '[ ]';
    if ($('#vcb_ghinokhac_fast').is(":checked")) vcb_ghinokhac_fast = '[X]';
    html = html.replace('[vcb_ghinokhac_fast]', vcb_ghinokhac_fast);

    let vcb_ghinokhac_auto = '[ ]';
    if ($('#vcb_ghinokhac_auto').is(":checked")) vcb_ghinokhac_auto = '[X]';
    html = html.replace('[vcb_ghinokhac_auto]', vcb_ghinokhac_auto);

    let vcb_ghinokhac_money = '[ ]';
    if ($('#vcb_ghinokhac_money').is(":checked")) vcb_ghinokhac_money = '[X]';
    html = html.replace('[vcb_ghinokhac_money]', vcb_ghinokhac_money);

    let phat_hanh_the_phu = '[ ]';
    if ($('#phat_hanh_the_phu').is(":checked")) phat_hanh_the_phu = '[X]';
    html = html.replace('[phat_hanh_the_phu]', phat_hanh_the_phu);

    //

    let cam_ket_cua_kh_1_yes = '[ ]';
    if ($('#cam_ket_cua_kh_1_yes').is(":checked")) cam_ket_cua_kh_1_yes = '[X]';
    html = html.replace('[cam_ket_cua_kh_1_yes]', cam_ket_cua_kh_1_yes);

    let cam_ket_cua_kh_1_no = '[ ]';
    if ($('#cam_ket_cua_kh_1_no').is(":checked")) cam_ket_cua_kh_1_no = '[X]';
    html = html.replace('[cam_ket_cua_kh_1_no]', cam_ket_cua_kh_1_no);

    let cam_ket_cua_kh_2_yes = '[ ]';
    if ($('#cam_ket_cua_kh_2_yes').is(":checked")) cam_ket_cua_kh_2_yes = '[X]';
    html = html.replace('[cam_ket_cua_kh_2_yes]', cam_ket_cua_kh_2_yes);

    let cam_ket_cua_kh_2_no = '[ ]';
    if ($('#cam_ket_cua_kh_2_no').is(":checked")) cam_ket_cua_kh_2_no = '[X]';
    html = html.replace('[cam_ket_cua_kh_2_no]', cam_ket_cua_kh_2_no);

    let cam_ket_cua_kh_3_yes = '[ ]';
    if ($('#cam_ket_cua_kh_3_yes').is(":checked")) cam_ket_cua_kh_3_yes = '[X]';
    html = html.replace('[cam_ket_cua_kh_3_yes]', cam_ket_cua_kh_3_yes);

    let cam_ket_cua_kh_3_no = '[ ]';
    if ($('#cam_ket_cua_kh_3_no').is(":checked")) cam_ket_cua_kh_3_no = '[X]';
    html = html.replace('[cam_ket_cua_kh_3_no]', cam_ket_cua_kh_3_no);

    let cam_ket_cua_kh_4_yes = '[ ]';
    if ($('#cam_ket_cua_kh_4_yes').is(":checked")) cam_ket_cua_kh_4_yes = '[X]';
    html = html.replace('[cam_ket_cua_kh_4_yes]', cam_ket_cua_kh_4_yes);

    let cam_ket_cua_kh_4_no = '[ ]';
    if ($('#cam_ket_cua_kh_4_no').is(":checked")) cam_ket_cua_kh_4_no = '[X]';
    html = html.replace('[cam_ket_cua_kh_4_no]', cam_ket_cua_kh_4_no);

    //

    let sign1 = '<img src="' + this.sign1.toDataURL() + '" />';
    html = html.replace('[chu_ky_mau_1]', sign1);

    let sign2 = '<img src="' + this.sign2.toDataURL() + '" />';
    html = html.replace('[chu_ky_mau_2]', sign2);

    return html;
  }

  reloadPage() {
    Swal.close();
    window.location.reload();
  }

}
