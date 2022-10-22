import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
  @Output() getPicture = new EventEmitter<WebcamImage>();
  @Output() btnGTTTEvent = new EventEmitter<string>();
  @Input() typecam = 'gttt';
  @Input() showbtn = true;

  deviceInfo!: any;
  isMobile = false;
  isTablet = false;
  isDesktopDevice = false;

  widthCam = 350;

  showWebcam = true;
  isCameraExist = true;
  isCheckingFace = false;

  errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.isCameraExist = mediaDevices && mediaDevices.length > 0;
      });
    
    this.device();  
  }

  device() {    
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
    
    if (this.isMobile) {
      this.widthCam = 350;
    } else {
      this.widthCam = 550;
    }    
  }

  swalAlert(title: any, text: any, type: any) {
    Swal.fire(
        title,
        text,
        type        
    );
  }

  takeSnapshot(): void {
    this.trigger.next();
  }

  takeSnapshots(): void {
    this.isCheckingFace = true;
    setTimeout(() => {
        this.takeSnapshot();        
    }, 1000);

    setTimeout(() => {
        this.takeSnapshot();        
    }, 2000);

    setTimeout(() => {
        this.takeSnapshot();
        this.isCheckingFace = false;
        this.swalAlert('Thông báo', 'Hệ thống đã thực hiện ghi hình khuôn mặt của bạn!', 'success');        
    }, 3000);
  }

  onOffWebCame() {
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  changeWebCame(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage) {
    this.getPicture.emit(webcamImage);
    //this.showWebcam = false;
  }

  btnGTTTItem(value: string) {
    this.btnGTTTEvent.emit(value);
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

}