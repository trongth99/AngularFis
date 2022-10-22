import {Component, ChangeDetectorRef, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {WebcamImage} from 'ngx-webcam';
import {AppService} from './app.service';
import Swal from 'sweetalert2';
import {DeviceDetectorService} from 'ngx-device-detector';
import * as $ from 'jquery';
import {SignaturePad} from 'angular2-signaturepad';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Đăng ký mở thẻ tín dụng';

  deviceInfo!: any;
  isMobile = false;
  isTablet = false;
  isDesktopDevice = false;
  pdfStyle = 'width: 100%; height: 600px;';

  signatureImg!: string;
  @ViewChild('sign1') sign1!: SignaturePad;
  @ViewChild('sign2') sign2!: SignaturePad;

  canvasWidth = 600;
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
  _11FormGroup!: FormGroup;
  _12FormGroup!: FormGroup;
  _13FormGroup!: FormGroup;
  _14FormGroup!: FormGroup;
  _15FormGroup!: FormGroup;
  _16FormGroup!: FormGroup;


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


  //form number
  configSteps = [
    {
      status: 1,
      title: 'Nhập Thông Tin Liên Hệ',
    },
    {
      status: 1,
      title: 'Xác Nhận OTP',
    },
    {
      status: 1,
      title: 'Lựa chọn Giấy Tờ Tuỳ Thân',
    },
    {
      status: 1,
      title: 'Xác Thực Giấy Tờ Tùy Thân',
    },
    {
      status: 1,
      title: 'Hướng Dẫn Xác Thực Khuân Mặt',
    },
    {
      status: 1,
      title: 'Chọn Thẻ Tín Dụng',
    },
    {
      status: 1,
      title: 'Danh Sách Hồ Sơ Tải Lên'
    },
    {
      status: 1,
      title: 'Nhập Đơn Đăng Ký'
    },
    {
      status: 1,
      title: 'Đơn đăng ký thẻ tiến dùng'
    },
    {
      status: 1,
      title: 'Đơn đăng ký thẻ tiến dùng'
    },
    {
      status: 1,
      title: 'Đơn đăng ký thẻ tiến dùng'
    },
    {
      status: 1,
      title: 'Đơn đăng ký thẻ tiến dùng'
    },
    {
      status: 1,
      title: 'Đơn đăng ký thẻ tiến dùng'
    },
    {
      status: 1,
      title: 'Đơn đăng ký thẻ tiến dùng'
    },
    {
      status: 1,
      title: 'Trang Ký'
    },
    {
      status: 1,
      title: 'Hoàn Thành',
    }

  ];
  steps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,16];
  currIdxStep = 0;
  params = this.appService.params;
  titleStep = this.configSteps[0].title;

  //OTP
  conf_otp_input = {length: 6, inputStyles: {width: "30px", height: "30px",},};
  otpCorrect!: any;

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
  khungHinh: string[] = [];

  processInstanceId!: any;

  ///
  isCCCD = false;
  isPP = false;

  iconDeleteHSNT = false;
  iconDeleteHDLD = false;
  iconDeleteBangLuong = false;
  iconDeleteSKTKNN = false;
  iconDeleteDKKD = false;
  iconDeleteGPCC = false;
  iconDeleteXNCCCT = false;

  isHSNT = false;
  isHSCMTN = false;

  theTinDung = [
    {maLoaiThe: "visa", tenLoaiThe: "Thẻ tín dụng Visa"},
    {maLoaiThe: "mastercard", tenLoaiThe: "Thẻ tín dụng Mastercard"}
  ];
  maLoaiThe = '';
  tenLoaiThe = '';
  diaChiChiNhanh = '';
  phoneGioiThieu = '';

  fileHdld = '';
  fileNameHdld = '';
  fileBangLuong = '';
  fileNameBangLuong = '';
  fileSktknn = '';
  fileNameSktknn = '';
  fileDkkd = '';
  fileNameDkkd = '';
  fileGPCC = '';
  fileNameGPCC = '';
  fileXNCCCT = '';
  fileNameXNCCCT = '';
  fileHSNT = '';
  fileNameHSNT = '';

  contentBase64 = '';

  lastModifiedHdld: any;
  lastModifiedBangLuong: any;
  lastModifiedSktknn: any;
  lastModifiedDkkd: any;
  lastModifiedGPCC: any;
  lastModifiedXNCCCT: any;
  lastModifiedHSNT: any;

  isShowCMTT = false;
  isShowGTK = false;
  isShowHSNT = false;

  chiNhanh = [
    {maChiNhanh: "hn", tenChiNhanh: "Hà nội"},
    {maChiNhanh: "hcm", tenChiNhanh: "Hồ Chí Minh"}
  ];

  constructor(
    private _formBuilder: FormBuilder,
    public appService: AppService,
    private deviceService: DeviceDetectorService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.CheckCamera();
    this.loadForm();
    this.device();
  }

  ngAfterContentChecked() {
    try {
      this.cdr.detectChanges();

      if (this.appService.errsStep && (this.appService.errsStepGTTT)) {
        this.swalWarningStep('Cảnh Báo', 'Xác Thực Giấy Tờ Tùy Thân Không Thành Công!');
        return;
      }

      if (this.appService.errsStep && this.appService.errsStepKMat) {
        this.swalWarningStep('Cảnh Báo', 'Xác Thực Khuôn Mặt Không Thành Công!');
        return;
      }

      if (this.appService.errsStep) {
        this.swalWarningStep();
      }

      if (this.appService.errsStep || this.appService.errsStepGTTT || this.appService.errsStepKMat) {
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
    // this.detectWebcam(this.cWebcam);
    let $this = this;
    navigator.mediaDevices.getUserMedia({ audio: true, video: true})
      .then(function (stream) {
        if (stream.getVideoTracks().length > 0){
          // console.log('có webcam');
        } else {
          // console.log('khong webcam');
          $this.swalWarning('Thông báo', 'Máy bạn không có webcam', 0);
        }
      })
      .catch(function (error) {
        // console.log('khong webcam');
        $this.swalWarning('Thông báo', 'Máy bạn không có webcam', 0);
      });
  }

  cWebcam(hasWebcam: any) {
    if (hasWebcam) {
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
    if (!timer) {
      Swal.fire({
        title,
        text,
        icon: 'warning',
        showConfirmButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

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
    this._0FormGroup = this._formBuilder.group({});

    this._1FormGroup = this._formBuilder.group({
      hoTen: ['', Validators.required],
      soDienThoai: ['', Validators.required],
      email: ['', Validators.required],
      maKtra: ['', Validators.required]
    });

    this._2FormGroup = this._formBuilder.group({
      otp: ['', Validators.required],
    });

    this._3FormGroup = this._formBuilder.group({
      idGTTT: ['']
    });

    this._4FormGroup = this._formBuilder.group({});

    this._5FormGroup = this._formBuilder.group({});

    this._6FormGroup = this._formBuilder.group({
      diaChiChiNhanh: [''],
      phoneGioiThieu: ['']
    });

    this._7FormGroup = this._formBuilder.group({});

    this._8FormGroup = this._formBuilder.group({});

    this._9FormGroup = this._formBuilder.group({});

    this._10FormGroup = this._formBuilder.group({});
    this._11FormGroup = this._formBuilder.group({});
    this._12FormGroup = this._formBuilder.group({});
    this._13FormGroup = this._formBuilder.group({});
    this._14FormGroup = this._formBuilder.group({});
    this._15FormGroup = this._formBuilder.group({});
    this._16FormGroup = this._formBuilder.group({});
  }

  loadData() {
    this.datatGToTThan = this.appService.datatGToTThan;
    if (this.datatGToTThan.length > 0) {
      this.ngayHetHan = this.datatGToTThan[0].ngayHetHan;
      this.noiTru = this.datatGToTThan[0].noiTru;
    }
    if(this.appService.ttinCNhan.gioiTinh == '0') {
      this.appService.ttinCNhan.gioiTinh = 'Nam';
    } else if(this.appService.ttinCNhan.gioiTinh == '1') {
      this.appService.ttinCNhan.gioiTinh = 'Nữ';
    }
  }

  loadcurrFinishStep() {
    if (this.appService.currFinishStep > 1) {
      for (let i = 0; i < this.steps.length; i++) {
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
    this.checkProcessInstanceValue();
  }

  stepNext() {
    // this.loadcurrFinishStep();
    if (this.currIdxStep >= 0 && this.currIdxStep < this.steps.length) {
      let index = this.currIdxStep += 1;
      let step = this.steps[index];
      //console.log('idx ' + index);
      //console.log('step ' + step);
      this.statusStep(step, 'next');
    }
    /* this.isShowCMTT = false;
     this.isShowGTK = false;*/
  }

  backStep() {
    this.showStepNext = true;
    this.isFinishedFormGroup = false;
    if (this.currIdxStep >= 0 && this.currIdxStep < this.steps.length) {
      let index = this.currIdxStep -= 1;
      let step = this.steps[index];
      this.statusStep(step, 'back');
    }
    /* this.isShowCMTT = false;
     this.isShowGTK = false;*/
  }

  statusStep(step: number, type: any) {
    this.retsetStep();
    this.loadIsFormGroup(this.currIdxStep, type);
    if (this.currIdxStep > 1) {
      this.titleStep = this.configSteps[this.steps[this.currIdxStep - 1]].title;
    }


    if (step == 16) {

      this.isFinishedFormGroup = true;
      this.showStepNext = false;
      this.showBackStep = false;
      this.retsetStep();
    }
  }

  loadIsFormGroup(index: number, type: any) {
    let doneFormGroup = `done${this.steps[index - 1]}FormGroup`;
    eval(`this.${doneFormGroup} = true;`);

    let minus_step = this.steps[index] - this.steps[index - 1];
    let stepHandle = `step${this.steps[index]}Handle()`;
    if (minus_step > 1) {
      stepHandle = `step${this.steps[index - 1] + 1}Handle()`;
    }
    if ((this.processInstanceId) && type == 'next') {
      eval(`this.${stepHandle};`);
    }

    let isFormGroup = `is${this.steps[index]}FormGroup`;
    eval(`this.${isFormGroup} = true;`);

    //this.step13Handle();
  }


  step0Handle() {

  }

  step1Handle() {

  }

  step2Handle() {
    let data = {
      "ttinLHe": {
        "fis.onboarding.process.banking.model.TTinLHe": {
          "hoTen": this._1FormGroup.value.hoTen,
          "soDienThoai": this._1FormGroup.value.soDienThoai,
          "email": this._1FormGroup.value.email
        }
      }
    };
    this.appService._completedNhapTTLH(this.processInstanceId, data)
  }

  step3Handle() {
    //this.appService._completedOtp(this.processInstanceId, this.otpCorrect);
    /*this._1FormGroup.value.soDienThoai*/
    this.appService._completedOtp(this.processInstanceId, this.otpCorrect);
  }

  step4Handle() {

  }

  step5Handle() {
    let data = null;
    if (this.isCCCD) {
      data = {
        gtoTThan: {
          "fis.onboarding.common.model.identity.GToTThan": {
            "loaiGToTThan": 4,
            anhMTruoc: this.webcamImageFront._imageAsDataUrl.split('base64,')[1],
            anhMSau: this.webcamImageBack._imageAsDataUrl.split('base64,')[1]
          }
        }
      }
    } else if (this.isPP) {
      data = {
        gtoTThan: {
          "fis.onboarding.common.model.identity.GToTThan": {
            anhMTruoc: this.webcamImagePP._imageAsDataUrl.split('base64,')[1]
          }
        }
      }
    }

    if (data !== null) {
      this.appService._completedGTTT(this.processInstanceId, data);
    }
  }

  step6Handle() {
    if (this.khungHinh.length == 3) {
      let data = {
        ycXThucKMat: {
          "fis.onboarding.common.model.ekyc.xthuckmat.YCXThucKMat": {
            khungHinh: this.khungHinh
          }
        }
      }

      this.appService._completedKMat(this.processInstanceId, data);
    } else {
      if (!this.appService.taskInstanceIds[0].ChupKMat) {
        this.swalWarningStep('Cảnh Báo', 'Xác Thực Khuôn Mặt Không Thành Công!');
      }
    }
  }

  step7Handle() {

    let data = {
      "loaiTheTDung": {
        "fis.onboarding.process.banking.model.LoaiTheTDung": {
          "maLoaiThe": this.maLoaiThe,
          "tenLoaiThe": this.tenLoaiThe,
          "thongtin": ""

        }
      }

    };
    this.appService._completedChonTheTD(this.processInstanceId, data);

  }

  step8Handle() {

    let data = {
      "cmTTinCNhan": {
        "org.jbpm.document.service.impl.DocumentImpl": {
          "name": this.fileNameHSNT,
          "lastModified": this.lastModifiedHSNT,
          "content": this.fileHSNT
        }
      },
      "cmNoiO": {
        "org.jbpm.document.service.impl.DocumentImpl": {
          "name": "cmNoiO",
          "lastModified": 0,
          "content": ""
        }
      },
      "cmTTinVlam": {
        "org.jbpm.document.service.impl.DocumentImpl": {
          "name": "cmTTinVlam",
          "lastModified": 0,
          "content": ""
        }
      },
      "cmTNhap": {
        "org.jbpm.document.service.impl.DocumentImpl": {
          "name": this.fileNameHdld,
          "lastModified": this.lastModifiedHdld,
          "content": this.fileHdld
        }
      },
      "bangKeMDichSDungVon": {
        "org.jbpm.document.service.impl.DocumentImpl": {
          "name": "cmTTinCNhan",
          "lastModified": 0,
          "content": ""
        }
      }

    }
    console.log(this.fileHSNT);
    console.log(this.fileHdld);
    this.appService._completedTaiGiayTo(this.processInstanceId, data);
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
    let maLoaiThe: any = $('#loaiThe').val()?.toString();
    let tenLoaiThe: any = $('#loaiThe option:selected').text();
    /////
    let hoTen: any = $('#hoTen').val()?.toString();
    let gioiTinh: any = $('#gioiTinh').val()?.toString();
    let ngaySinh: any = $('#ngaySinh').val()?.toString();
    let dienThoai: any = $('#dienThoai').val()?.toString();
    let email: any = $('#email').val()?.toString();
    let soCmt: any = $('soCmt').val()?.toString();

    let ngayCap: any = $('#ngayCap').val()?.toString();
    let noiCap: any = $('#noiCap').val()?.toString();
    let quocTich: any = $('#quocTich').val()?.toString();
    ///
    let trinhDoHVan = '';
    if ($('#daihoc').is(":checked")) trinhDoHVan = 'Đại học';
    if ($('#trendaihoc').is(":checked")) trinhDoHVan = 'Trên đại học';
    if ($('#trungcap').is(":checked")) trinhDoHVan = 'Trung cấp';
    if ($('#duoitrungcap').is(":checked")) trinhDoHVan = 'Dưới trung cấp';
    if ($('#caodang').is(":checked")) trinhDoHVan = 'Cao đẳng';
    if ($('#trinhdohvan_khac').is(":checked")) trinhDoHVan = 'Khác';

    ////
    let tTrangHNhan = '';
    if ($('#docthan').is(":checked")) tTrangHNhan = 'Độc thân';
    if ($('#kethon').is(":checked")) tTrangHNhan = 'Kết hôn';
    if ($('#goa').is(":checked")) tTrangHNhan = 'Góa';
    if ($('#lythan').is(":checked")) tTrangHNhan = 'Ly thân';
    if ($('#lyhon').is(":checked")) tTrangHNhan = 'Ly hôn';
    if ($('#tinhtranghnhan_khac').is(":checked")) tTrangHNhan = 'Khác';
    ////

    let dChiNoiO: any = $('#dChiNoiO').val()?.toString();
    let dChiTTru: any = $('#dChiTTru').val()?.toString();
/////
    let tenCTy: any = $('#dChiNoiO').val()?.toString();
    let loaiHinhHDong = '';
    let loaiHinhHDong_Khac: any = $('#loaiHinhHDong_Khac').val()?.toString();
    if ($('#loaiHinhHD1').is(":checked")) loaiHinhHDong = 'Cơ quan Đảng, cơ quan Nhà nước (Bộ, Ban, Ngành...)';
    if ($('#loaiHinhHD2').is(":checked")) loaiHinhHDong = 'Tổ chức chính trị, xã hội, nghề nghiệp';
    if ($('#loaiHinhHD3').is(":checked")) loaiHinhHDong = 'Đơn vị lực lượng vũ trang';
    if ($('#loaiHinhHD4').is(":checked")) loaiHinhHDong = 'Đơn vị sự nghiệp công lập, cơ sở kinh doanh trực thuộc Cơ quan Đảng, cơ quan Nhà nước';
    if ($('#loaiHinhHD5').is(":checked")) loaiHinhHDong = 'Tập đoàn kinh tế Nhà nước, Tổng công ty 90/91, Tổng công ty Nhà nước đặc biệt';
    if ($('#loaiHinhHD6').is(":checked")) loaiHinhHDong = 'Doanh nghiệp Nhà nước';
    if ($('#loaiHinhHD7').is(":checked")) loaiHinhHDong = 'Cơ quan thuộc lĩnh vực tài chính';
    if ($('#loaiHinhHD8').is(":checked")) loaiHinhHDong = 'Doanh nghiệp có vốn đầu tư nước ngoài';
    if ($('#loaiHinhHD9').is(":checked")) loaiHinhHDong = 'Tập đoàn, Tổng công ty thuộc khu vực tư nhân, Đơn vị sự nghiệp ngoài công lập';
    if ($('#loaiHinhHD10').is(":checked")) loaiHinhHDong = 'Công ty TNHH tư nhân, doanh nghiệp cổ phần, công ty hợp danh';
    if ($('#loaiHinhHD11').is(":checked")) loaiHinhHDong = 'Doanh nghiệp tư nhân';
    if ($('#loaiHinhHD12').is(":checked")) loaiHinhHDong = 'Cơ quan, tổ chức hành chính nước ngoài tại Việt Nam (Đại sứ quán, Tổ chức phi chính phủ, Văn phòng đại diện)';
    if ($('#loaiHinhHD13').is(":checked")) loaiHinhHDong = 'Hộ kinh doanh cá thể, tiểu thương và cá nhân khác';
    if ($('#loaiHinhHDong_Khac').is(":checked")) loaiHinhHDong = loaiHinhHDong_Khac;

    let data = {
      "ttBMat": {
        "fis.onboarding.process.banking.model.TTinBMat": {
          "maCHoi": "",
          "cauHoiBMat": "",
          "cauTLoiBMat": ""
        }
      },
      "ttVLam": {
        "fis.onboarding.process.banking.model.TTinVLam": {
          "loaiCViec": "",
          tenCTy,
          "maCHoi": "",
          loaiHinhHDong,
          "chucVu": "",
          "linhVucHDong": "",
          "tGianLViec": "",
          "dienThoai": "",
          "diaChi": "",
          "thuNhap": "",
          "chiTieuHangThang": "",
          "maDKKDoanh": "",
          "ngayBDauKDoanh": ""
        }
      },
      "theTDung": {
        "fis.onboarding.process.banking.model.TheTDung": {
          "maTheTDung": "",
          "soTheTDung": "",
          "account": "",
          "hanMuc": "",
          "ngayHetHan": "",
          "tenKHangInTrenThe": "",
          "noiCap": "",
          "ngayCap": "",
          "hanMucOnline": "",
          "hangThe": {
            "maHangThe": "",
            "hangThe": "",
            "thongTin": ""
          },
          "loaiThe": {
            maLoaiThe,
            tenLoaiThe,
            "thongtin": ""
          }
        }
      },
      "ttinCNhan": {
        "fis.onboarding.process.banking.model.TTinCNhan": {
          hoTen,
          gioiTinh,
          ngaySinh,
          dienThoai,
          email,
          "loaiGTTThan": "",
          "soGTTThan": "",
          ngayCap,
          noiCap,
          quocTich,
          trinhDoHVan,
          tTrangHNhan,
          "soCon": "",
          dChiNoiO,
          dChiTTru
        }
      }
    };
    this.appService._completedNhapDonDKy(this.processInstanceId, data);
  }
  retsetStep() {
    this.appService.errsStep = false;
    this.appService.errsStepGTTT = false;
    this.appService.errsStepKMat = false;
    for (let i = 0; i < this.steps.length; i++) {
      eval(`this.is${this.steps[i]}FormGroup = false;`);
    }
  }

  cValid(index: number) {
    let step = this.steps[index];
    switch (step) {
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
      case 11:
        return this._11FormGroup.valid;
      case 12:
        return this._12FormGroup.valid;
      case 13:
        return this._13FormGroup.valid;
      case 14:
        return this._14FormGroup.valid;
      case 15:
        return this._15FormGroup.valid;
      case 16:
        return this._15FormGroup.valid;
      default:
        return false;
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

  onChangeLoaiTheTinDung(e: any) {
    let vals = e.target.value;
    if (vals) {
      this.maLoaiThe = vals.split('|')[0];
      this.tenLoaiThe = vals.split('|')[1];
    }
  }

  counter(i: number) {
    return new Array(i);
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

  reloadPage() {
    Swal.close();
    window.location.reload();
  }

  onOtpChange(value: any) {
    if (this.appService.xThucOtp(value)) {
      this.otpCorrect = value;

    } else {
      this.otpCorrect = '';
    }
  }

  checkTypeGTTT(type: string) {
    if (type == 'cccd') {
      this.isCCCD = true;
      this.isPP = false;
    } else {
      this.isCCCD = false;
      this.isPP = true;
    }
    this.stepNext();
  }



  checkGT() {
    this.isShowCMTT = !this.isShowCMTT;
  }

  checkGTK() {
    this.isShowGTK = !this.isShowGTK;
  }

  checkHSNT() {
    this.isShowHSNT = !this.isShowHSNT;
  }

  deleteFile(type: string) {
    if (type == 'file_hsnt') {
      this.fileHSNT = '';
      this.fileNameHSNT = '';
      this.lastModifiedHSNT = 0;
      this.iconDeleteHSNT = !this.iconDeleteHSNT;
    } else if (type == 'file_hdld') {
      this.fileHdld = '';
      this.fileNameHdld = '';
      this.lastModifiedHdld = 0;
      this.iconDeleteHDLD = !this.iconDeleteHDLD;
    } else if (type == 'file_bangluong') {
      this.fileBangLuong = '';
      this.fileNameBangLuong = '';
      this.lastModifiedBangLuong = 0;
      this.iconDeleteBangLuong = !this.iconDeleteBangLuong;
    } else if (type == 'file_sktknn') {
      this.fileSktknn = '';
      this.fileNameSktknn = '';
      this.lastModifiedSktknn = 0;
      this.iconDeleteSKTKNN = !this.iconDeleteSKTKNN;
    } else if (type == 'file_dkkd') {
      this.fileDkkd = '';
      this.fileNameDkkd = '';
      this.lastModifiedDkkd = 0;
      this.iconDeleteDKKD = !this.iconDeleteDKKD;
    } else if (type == 'file_gpcc') {
      this.fileGPCC = '';
      this.fileNameGPCC = '';
      this.lastModifiedGPCC = 0;
      this.iconDeleteGPCC = !this.iconDeleteGPCC;
    } else if (type == 'file_xnccct') {
      this.fileXNCCCT = '';
      this.fileNameXNCCCT = '';
      this.lastModifiedXNCCCT = 0;
      this.iconDeleteXNCCCT = !this.iconDeleteXNCCCT;
    }
  }


  onFileSelected(event: any, type: string) {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let content = reader.result?.toString();
        if (typeof content !== "undefined") {
          this.contentBase64 = content.split('base64,')[1];
          if (type == 'file_hdld') {
            this.fileHdld = this.contentBase64;
            this.fileNameHdld = file.name;
            this.lastModifiedHdld = file.lastModified;
            this.iconDeleteHDLD = !this.iconDeleteHDLD;

          } else if (type == 'file_bangluong') {
            this.fileBangLuong = this.contentBase64;
            this.fileNameBangLuong = file.name;
            this.lastModifiedBangLuong = file.lastModified;
            this.iconDeleteBangLuong = !this.iconDeleteBangLuong;
          } else if (type == 'file_sktknn') {
            this.fileSktknn = this.contentBase64;
            this.fileNameSktknn = file.name;
            this.lastModifiedSktknn = file.lastModified;
            this.iconDeleteSKTKNN = !this.iconDeleteSKTKNN;
          } else if (type == 'file_dkkd') {
            this.fileDkkd = this.contentBase64;
            this.fileNameDkkd = file.name;
            this.lastModifiedDkkd = file.lastModified;
            this.iconDeleteDKKD = !this.iconDeleteDKKD;
          } else if (type == 'file_gpcc') {
            this.fileGPCC = this.contentBase64;
            this.fileNameGPCC = file.name;
            this.lastModifiedGPCC = file.lastModified;
            this.iconDeleteGPCC = !this.iconDeleteGPCC;
          } else if (type == 'file_xnccct') {
            this.fileXNCCCT = this.contentBase64;
            this.fileNameXNCCCT = file.name;
            this.lastModifiedXNCCCT = file.lastModified;
            this.iconDeleteXNCCCT = !this.iconDeleteXNCCCT;
          } else if (type == 'file_hsnt') {
            this.fileHSNT = this.contentBase64;
            this.fileNameHSNT = file.name;
            this.lastModifiedHSNT = file.lastModified;
            this.iconDeleteHSNT = !this.iconDeleteHSNT;

          }

        }
      }

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
    } else if (type == 'img_back') {
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
      if (this.khungHinh.length >= 3) {
        this.khungHinh = [];
      }
      this.khungHinh.push(this.webcamImageFace._imageAsDataUrl.split('base64,')[1]);
    }
  }

}
