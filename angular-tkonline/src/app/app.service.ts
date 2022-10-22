import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import * as $ from 'jquery';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

export interface DSachGoiSDepElement {
  maGoi: string;
  tenGoi: string;
  phi: string; 
  gchu: string; 
}

export interface DSachSDepElement {
  soTKhoan: string;    
  phi: number;  
}

export interface DsachDVuNHangElement {
  maDVu: string;
  tenDVu: string;  
}

export interface DsachCNhanhElement {
  tinhThanh: string;
  quanHuyen: string;   
  phuongXa: string;
  chiTiet: string;     
}

export interface GToTThanElement {
  quocTich: string;
  soCmt: string;   
  hoVaTen: string;
  namSinh: string;      
  queQuan: string;      
  noiTru: string;      
  dacDiemNhanDang: string;      
  ngayCap2: string;      
  noiCap: string;      
  ngayHetHan: string;      
  gioiTinh2: string;      
}

const ELEMENT_DS_GOI_SDEP_DATA: DSachGoiSDepElement[] = [];
const ELEMENT_DS_SDEP_DATA: DSachSDepElement[] = [];
const ELEMENT_DS_DVUNHANG_DATA: DsachDVuNHangElement[] = [];
const ELEMENT_DS_CNHANH_DATA: DsachCNhanhElement[] = [];
const ELEMENT_GTTT_DATA: GToTThanElement[] = [];

//const baseApiURL = 'http://10.15.119.73:8090/kie-server/services/rest';
//const baseApiURL = 'http://103.9.0.210/kie-server/services/rest';
const baseApiURL = 'https://fpt.aeyes.online/kie-server/services/rest';

//const configApiURL = 'http://103.9.0.210/ekyc/config';
const configApiURL = 'https://fpt.aeyes.online/ekyc/config';

@Injectable({
  providedIn: 'root'
})

export class AppService {

    base_api_url = '';    
    containerId = 'fis.onboarding.process.banking_1.0';
    processId = 'fis.onboarding.process.banking.motkhoanprocess';
    username = 'customer';
    password = 'customer123';
    
    errsStep = false;
    errsStepNhanGTTT = false;
    errsStepXNhanGTTT = false;
    errsStepNhanTTinKMat = false;
    currFinishStep = 0;        
    
    params: Array<any> = [
      { 
        otp: '', 
        chonSDep: '', 
        duoiSDep: '', 
        sdep: '',          
        kquaXThuc: '', 
      }     
    ]; 
    
    taskInstanceIds: Array<any> = [
      { 
        NhanOTP: '', 
        ChonSDep: '', 
        ChonDuoiSDep: '', 
        NhanGTTT: '', 
        XNhanGTTT: '', 
        NhanTTinKMat: '', 
        ChonDVuCNhanh: '', 
      }     
    ];    

    //Table  
    dataDSachGoiSDep = ELEMENT_DS_GOI_SDEP_DATA;
    dataDSachSDep = ELEMENT_DS_SDEP_DATA;
    datatDsachDVuNHang = ELEMENT_DS_DVUNHANG_DATA;
    datatDsachCNhanh = ELEMENT_DS_CNHANH_DATA;
    datatGToTThan = ELEMENT_GTTT_DATA;

    constructor(private httpClient: HttpClient) {}

    swalAlert(title: any, text: any, type: any) {
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

    curlData(mod: string, data: any, method = 'get', serv = 'default'): Observable<any> {
        if (!serv || serv == 'default') {
            this.base_api_url = baseApiURL;
        } else if (serv == 'config') {
            this.base_api_url = configApiURL;
        }

        let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });   
        headers = headers.set('accept', 'application/json');     
        headers = headers.set('Authorization', 'Basic ' + btoa(`${this.username}:${this.password}`));     
              
        if (method == 'post') {          
          return this.httpClient.post(this.base_api_url + mod, data, { headers });
        } else if (method == 'put') {
          return this.httpClient.put(this.base_api_url + mod, data, { headers });
        } else if (method == 'delete') {
          return this.httpClient.delete(this.base_api_url + mod, data);
        } else {
          return this.httpClient.get(this.base_api_url + mod, { headers });
        }               
    }

    getConfig() {
      return this.curlData('', '', 'get', 'config');
    }

    checkProcessInstanceValue(varName: any, varValue: any, status = 2): Observable<any> {    
      let mod = `/server/queries/processes/instances/variables/${varName}?varValue=${varValue}&status=${status}&page=0&pageSize=10&sortOrder=true`;
      return this.curlData(mod, '');
    }  

    createProcessInstance(data: any) {   
        let mod = `/server/containers/${this.containerId}/processes/${this.processId}/instances`;
        return this.curlData(mod, data, 'post');
    }      

    xThucOtp(value: any) {
      if (value == '123456') {            
        return true;
        
      } else {
        return false;
      }      
    }

    guiOtp(mobile: any) {
      return '123456';
    }    

    xThucGTTT(data: any): Observable<any> {   
      let mod = '';    
      return this.curlData(mod, data, 'post');
    }

    xThucKMat(data: any): Observable<any> {   
      let mod = '';    
      return this.curlData(mod, data, 'post');
    }

    xThucAnhCDung(data: any): Observable<any> {   
      let mod = '';    
      return this.curlData(mod, data, 'post');
    }

    moTKhoan(data: any): Observable<any> {   
      let mod = '';    
      return this.curlData(mod, data, 'post');
    }

    getBackCompletedParams(processInstanceId: any) { 
      this.swalWarning('Kiểm Tra Thông Tin', 'Hệ thống đang xử lý ...', 60000);
      
      this._getVariables(processInstanceId).subscribe(
        res => {
          let currFinishSteps = []; 
          
          if (res.hasOwnProperty('dsachCNhanh')) {
            this.taskInstanceIds[0].NhanTTinKMat = true;
            this.getDsachCNhanh(processInstanceId);               
            currFinishSteps.push(7);                    
          }

          if (res.hasOwnProperty('dsachDVuNHang')) {  
            this.taskInstanceIds[0].NhanTTinKMat = true;          
            this.getDsachDVuNHang(processInstanceId); 
            currFinishSteps.push(7);                                  
          }

          if (res.hasOwnProperty('xnhanGTTT')) {
            this.taskInstanceIds[0].XNhanGTTT = true;                        
            currFinishSteps.push(6);                        
          }

          if (res.hasOwnProperty('kquaXThucGTTT')) {            
            this.getGtoTThan(processInstanceId);
            this.taskInstanceIds[0].NhanGTTT = true;            
            currFinishSteps.push(5);                                                
          }

          if (res.hasOwnProperty('sdep')) {
            this.params[0].sdep = res['sdep'];
            this.taskInstanceIds[0].ChonSDep = true;
            currFinishSteps.push(3);            
          }

          if (res.hasOwnProperty('dsachSDep')) {
            this.getDsachSDep(processInstanceId);                          
          }

          if (res.hasOwnProperty('dsachGoiSDep')) {
            this.getDsachGoiSDep(processInstanceId);                           
          }

          if (res.hasOwnProperty('duoiSDep')) {
            this.params[0].duoiSDep = res['duoiSDep'];
            this.taskInstanceIds[0].ChonDuoiSDep = true;                           
          }

          if (res.hasOwnProperty('chonSDep')) {
            this.params[0].chonSDep = res['chonSDep'];                                                  
          }
          
          if (res.hasOwnProperty('otp')) {
            this.params[0].otp = res['otp'];                      
          } 

          this.currFinishStep = currFinishSteps[0];
          
          Swal.close();
        },
        error => {          
          window.location.reload();
        }
      );
    }

    getDsachGoiSDep(processInstanceId: any) {
      this._getVariables(processInstanceId).subscribe(
        res => {                   
          let dsachGoiSDep = JSON.parse(res['dsachGoiSDep']);                            
          for (let i=0; i < dsachGoiSDep.length; i++) {
            this.dataDSachGoiSDep.push(dsachGoiSDep[i]);            
          } 
                             
          Swal.close();
        },
        error => {          
          this.errsStep = true;
        }
      );   
    }

    getDsachSDep(processInstanceId: any) {
      this._getVariables(processInstanceId).subscribe(
        res => {                   
          let dsachSDep = JSON.parse(res['dsachSDep']);                            
          for (let i=0; i < dsachSDep.length; i++) {
            this.dataDSachSDep.push(dsachSDep[i]);            
          } 
                    
          Swal.close();
        },
        error => {          
          this.errsStep = true;
        }
      );   
    }

    getDsachDVuNHang(processInstanceId: any) {
      this._getVariables(processInstanceId).subscribe(
        res => {                   
          let dsachDVuNHang = JSON.parse(res['dsachDVuNHang']);                            
          for (let i=0; i < dsachDVuNHang.length; i++) {
            this.datatDsachDVuNHang.push(dsachDVuNHang[i]);            
          } 
                    
          Swal.close();
        },
        error => {          
          this.errsStep = true;
        }
      );   
    }

    getDsachCNhanh(processInstanceId: any) {
      this._getVariables(processInstanceId).subscribe(
        res => {                   
          let dsachCNhanh = JSON.parse(res['dsachCNhanh']);                            
          for (let i=0; i < dsachCNhanh.length; i++) {
            this.datatDsachCNhanh.push(dsachCNhanh[i]);            
          }  
          
          Swal.close();                   
        },
        error => {          
          this.errsStep = true;
        }
      );   
    }

    getGtoTThan(processInstanceId: any) {
      this._getVariables(processInstanceId).subscribe(
        res => {                   
          let gtoTThan = res['kquaXThucGTTT']['fis.onboarding.common.model.ekyc.xthucgttt.KQuaXThucGTTT']['gtoTThan']['fis.onboarding.common.model.identity.GToTThan'];         
          this.datatGToTThan.push(gtoTThan);
          
          Swal.close();
        },
        error => {          
          this.errsStep = true;
        }
      );   
    }

    completedTask(taskInstanceId: any, data: any) {
      let mod = `/server/containers/${this.containerId}/tasks/${taskInstanceId}/states/completed?user=${this.username}&auto-progress=true`;
      return this.curlData(mod, data, 'put');
    }    

    _completedOtp(processInstanceId: any, otpCorrect: any, showStepTkSodep: boolean) {
      this.swalWarning('Xác Thực OTP', 'Hệ thống đang xử lý ...', 60000);

      this._getTaskInstanceId(processInstanceId).subscribe(
        res => { 
          let taskInstanceId = '';                       
          for (let i=0; i < res['active-user-tasks']['task-summary'].length; i++) {              
            if (res['active-user-tasks']['task-summary'][i]['task-name'] == 'NhanOTP') {    
              taskInstanceId = res['active-user-tasks']['task-summary'][i]['task-id'];
              break;
            }
          }
          if (taskInstanceId && !this.taskInstanceIds[0].NhanOTP) {                        
            let data = {
              otp: otpCorrect
            }
            this.completedTask(taskInstanceId, data).subscribe(   
              res => {
                this.taskInstanceIds[0].NhanOTP = taskInstanceId;

                if (showStepTkSodep) {
                  this.getDsachGoiSDep(processInstanceId);
                } else {
                  Swal.close();
                }                              
              },           
              error => {                
                this.errsStep = true;                
              }
            );
          } else {
            Swal.close();
          }          
        },
        error => {
          this.errsStep = true;
        }   
      );
    }

    _completedChonDuoiSDep(processInstanceId: any, duoiSDep: any, showStepTkSodep: boolean) {
      this.swalWarning('Chọn Đuôi Số Đẹp', 'Hệ thống đang xử lý ...', 60000);
      this._getTaskInstanceId(processInstanceId).subscribe(
        res => { 
          let taskInstanceId = '';                       
          for (let i=0; i < res['active-user-tasks']['task-summary'].length; i++) {              
            if (res['active-user-tasks']['task-summary'][i]['task-name'] == 'ChonDuoiSDep') {    
              taskInstanceId = res['active-user-tasks']['task-summary'][i]['task-id'];              
              break;
            }
          }
          if (taskInstanceId && !this.taskInstanceIds[0].ChonDuoiSDep) {            
            let data = {
              duoiSDep
            }
            this.completedTask(taskInstanceId, data).subscribe(
              res => {
                this.taskInstanceIds[0].ChonDuoiSDep = taskInstanceId;

                if (showStepTkSodep) {
                  this.getDsachSDep(processInstanceId);
                }                
              },
              error => {                
                this.errsStep = true;                
              }
            );
          } else {
            Swal.close();
          }          
        },
        error => {          
          this.errsStep = true;
        }   
      );
    }

    _completedChonSDep(processInstanceId: any, sdep: any) {
      this.swalWarning('Chọn Tài Khoản Số Đẹp', 'Hệ thống đang xử lý ...', 60000);

      this._getTaskInstanceId(processInstanceId).subscribe(
        res => {           
          let taskInstanceId = '';                       
          for (let i=0; i < res['active-user-tasks']['task-summary'].length; i++) {              
            if (res['active-user-tasks']['task-summary'][i]['task-name'] == 'ChonSDep') {    
              taskInstanceId = res['active-user-tasks']['task-summary'][i]['task-id'];              
              break;
            }
          }
          if (taskInstanceId && !this.taskInstanceIds[0].ChonSDep) {            
            let data = {
              sdep
            }
            this.completedTask(taskInstanceId, data).subscribe(
              res => { 
                this.taskInstanceIds[0].ChonSDep = taskInstanceId; 
                Swal.close();                            
              },
              error => {                
                this.errsStep = true;                
              }
            );
          } else {
            Swal.close();
          }          
        },
        error => {          
          this.errsStep = true;
        }   
      );
    }

    _completedNhanGTTT(processInstanceId: any, data: any) { 
      this.swalWarning('Xác Thực Giấy Tờ', 'Hệ thống đang xử lý ...', 60000);
      
      this._getTaskInstanceId(processInstanceId).subscribe(
        res => {                   
          let taskInstanceId = '';   
          if (res.hasOwnProperty('active-user-tasks')) {
            if (res['active-user-tasks'].hasOwnProperty('task-summary')) {
              for (let i=0; i < res['active-user-tasks']['task-summary'].length; i++) {              
                if (res['active-user-tasks']['task-summary'][i]['task-name'] == 'NhanGTTT') {    
                  taskInstanceId = res['active-user-tasks']['task-summary'][i]['task-id'];           
                  break;
                }
              }
            }
          }                       
          
          if (taskInstanceId && !this.taskInstanceIds[0].NhanGTTT) {                        
            this.completedTask(taskInstanceId, data).subscribe(
              res => {  
                //console.log(res);  
                this.taskInstanceIds[0].NhanGTTT = taskInstanceId;                                      
                
                this.getGtoTThan(processInstanceId);                                             
              },
              error => {                
                this.errsStep = true;                                         
              }
            );
          } else {
            Swal.close();
          }                    
        },
        error => {          
          this.errsStep = true;
        }   
      );
    }

    _completedXNhanGTTT(processInstanceId: any, data: any) {
      this.swalWarning('Xác Thực Giấy Tờ', 'Hệ thống đang xử lý ...', 60000);

      this._getTaskInstanceId(processInstanceId).subscribe(
        res => { 
          let taskInstanceId = '';
          if (res.hasOwnProperty('active-user-tasks')) {
            if (res['active-user-tasks'].hasOwnProperty('task-summary')) {
              for (let i=0; i < res['active-user-tasks']['task-summary'].length; i++) {              
                if (res['active-user-tasks']['task-summary'][i]['task-name'] == 'XNhanGTTT') {    
                  taskInstanceId = res['active-user-tasks']['task-summary'][i]['task-id'];
                  break;
                }
              }
            }
          }                       
          
          if (taskInstanceId && !this.taskInstanceIds[0].XNhanGTTT) {                                
            this.completedTask(taskInstanceId, data).subscribe(
              res => { 
                this.taskInstanceIds[0].XNhanGTTT = taskInstanceId;
                //this.swalAlert('Thông báo', 'Giấy tờ tùy thân của bạn đã được xác thực thành công!', 'success');
                if (data.hasOwnProperty('xnhanGTTT')) {
                  if (!data['xnhanGTTT']) {
                    window.location.reload();
                  } else {
                    Swal.close();
                  }
                }                
              },
              error => {                
                this.errsStep = true;
                this.errsStepXNhanGTTT = true;                
              }
            );
          } else {
            Swal.close();
          }          
        },
        error => {          
          this.errsStep = true;
        }   
      );
    }

    _completedNhanTTinKMat(processInstanceId: any, data: any) {
      this.swalWarning('Xác Thực Khuôn Mặt', 'Hệ thống đang xử lý ...', 60000);

      this._getTaskInstanceId(processInstanceId).subscribe(
        res => { 
          let taskInstanceId = '';
          if (res.hasOwnProperty('active-user-tasks')) {
            if (res['active-user-tasks'].hasOwnProperty('task-summary')) {
              for (let i=0; i < res['active-user-tasks']['task-summary'].length; i++) {              
                if (res['active-user-tasks']['task-summary'][i]['task-name'] == 'NhanTTinKMat') {    
                  taskInstanceId = res['active-user-tasks']['task-summary'][i]['task-id'];
                  break;
                }
              }
            }
          }                      
          
          if (taskInstanceId && !this.taskInstanceIds[0].NhanTTinKMat) {                                 
            this.completedTask(taskInstanceId, data).subscribe(
              res => {   
                this.taskInstanceIds[0].NhanTTinKMat = taskInstanceId;
                this.getDsachDVuNHang(processInstanceId);             
                this.getDsachCNhanh(processInstanceId);                            
              },
              error => {
                this.errsStep = true;
                this.errsStepNhanTTinKMat = true;               
              }
            );
          } else {
            Swal.close();
          }          
        },
        error => {          
          this.errsStep = true;
        }   
      );
    }

    _completedChonDVuCNhanh(processInstanceId: any, data: any) {
      this.swalWarning('Chọn Dịch Vụ & Chi Nhánh Ngân Hàng', 'Hệ thống đang xử lý ...', 60000);

      this._getTaskInstanceId(processInstanceId).subscribe(
        res => { 
          let taskInstanceId = '';
          if (res.hasOwnProperty('active-user-tasks')) {
            if (res['active-user-tasks'].hasOwnProperty('task-summary')) {
              for (let i=0; i < res['active-user-tasks']['task-summary'].length; i++) {              
                if (res['active-user-tasks']['task-summary'][i]['task-name'] == 'ChonDVuCNhanh') {    
                  taskInstanceId = res['active-user-tasks']['task-summary'][i]['task-id'];
                  break;
                }
              }
            }
          }                       
          
          if (taskInstanceId && !this.taskInstanceIds[0].ChonDVuCNhanh) {
            this.completedTask(taskInstanceId, data).subscribe(
              res => {  
                this.taskInstanceIds[0].ChonDVuCNhanh = taskInstanceId; 
                Swal.close();                             
              },
              error => {
                this.errsStep = true;                
              }
            );
          } else {
            Swal.close();
          }          
        },
        error => {          
          this.errsStep = true;
        }   
      );
    }

    _getTaskInstanceId(processInstanceId: any) {             
      let mod = `/server/containers/${this.containerId}/processes/instances/${processInstanceId}?withVars=false`;
      return this.curlData(mod, 'get');                            
    }

    _getVariables(processInstanceId: any) {             
      let mod = `/server/containers/${this.containerId}/processes/instances/${processInstanceId}/variables`;
      return this.curlData(mod, 'get');                            
    }
}
