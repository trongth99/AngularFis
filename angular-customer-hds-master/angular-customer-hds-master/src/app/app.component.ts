import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TokenStorageService } from './_services/token-storage.service';
import { EventBusService } from './_shared/event-bus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  deviceInfo!: any;
  isMobile = false;
  isTablet = false;
  isDesktopDevice = false;

  title = 'Hợp Đồng Online';  
  isLoggedIn = false;  
  username?: string;
  eventBusSub?: Subscription;

  //OTP
  conf_otp_input = { length: 6, inputStyles: { width: "30px", height: "30px", } };

  constructor(       
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef    
  ) { }

  ngOnInit() {    
    this.loadLogin();
    this.device();
  }
  
  ngAfterContentChecked() {
    this.cdr.detectChanges(); 
    this.loadLogin();                        
  }

  ngOnDestroy(): void {
    if (this.eventBusSub)
      this.eventBusSub.unsubscribe();
  }

  device() {    
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();     
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.redirectPage();
  }

  loadLogin() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();            
      this.username = user;           
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  redirectPage(): void {        
    this.router.navigate(['/login']); 
  }

}
