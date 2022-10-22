import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
  
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgOtpInputModule } from 'ng-otp-input';
import { WebcamModule } from 'ngx-webcam';
import { CameraComponent } from './camera/camera.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AppRoutingModule } from './app-routing.module';
import { PdftempComponent } from './pdftemp/pdftemp.component';
  
@NgModule({
  declarations: [
    AppComponent,
    CameraComponent,
    PdftempComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,   
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgOtpInputModule,
    SignaturePadModule,
    WebcamModule,
    PdfViewerModule,
    AppRoutingModule     
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }