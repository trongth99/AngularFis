import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as $ from 'jquery';
import {Observable} from 'rxjs';
import Swal from 'sweetalert2';

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

const ELEMENT_GTTT_DATA: GToTThanElement[] = [];

//const baseApiURL = 'http://10.14.106.25:8091/kie-server-dev/services/rest';
//const baseApiURL = 'http://103.9.0.210/kie-server-dev/services/rest';
const baseApiURL = 'https://fpt.aeyes.online/kie-server-dev/services/rest';

//const configApiURL = 'http://103.9.0.210/ekyc/config';
const configApiURL = 'https://fpt.aeyes.online/ekyc/config';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  base_api_url = '';
  containerId = 'VCB-POC_1.0.0-SNAPSHOT';
  processId = 'fis.onboarding.process.banking.dangkykhoanvay';
  username = 'customer';
  password = 'customer123';

  errsStep = false;
  errsStepNhapTTLH = false;
  errsStepOTP = false;
  errsStepGTTT = false;
  errsStepKMat = false;
  errsStepChonSPVay = false;
  errsStepTaiGiayTo = false;
  errsStepNhapDonDKy = false;
  currFinishStep = 0;


  params: Array<any> = [
    {
      kquaXThuc: '',
    }
  ];

  taskInstanceIds: Array<any> = [
    {
      NhapTTLH: '',
      NhapOTP: '',
      ChupGTTT: '',
      ChupKMat: '',
      ChonSPVay: '',
      TaiGiayTo: '',
      NhapDonDKy: '',
      KTraHoSo: ''
    }
  ];

  ttinCNhan = {
    loaiGToTThan: 4,
    soGTo: '',
    ngayCap: '',
    noiCap: '',
    hoTen: '',
    ngaySinh: '',
    gioiTinh: '',
    diaChi: '',
    quocTich: '',
    dienThoai: '',
    email: '',
    noiTru: '',
    soCmt: ''
  }

  ttinMST = {
    maSoThue: ''
  }

  //Table
  datatGToTThan = ELEMENT_GTTT_DATA;
  pdfDonDKy = '';


  constructor(private httpClient: HttpClient) {
  }

  swalAlert(title: any, text: any, type: any) {
    Swal.fire(
      title,
      text,
      type,
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

  swalInfo(title = 'Thông Báo', text = '', timer = 3000) {
    Swal.fire({
      title,
      text,
      icon: 'info',
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

    let headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    headers = headers.set('accept', 'application/json');
    headers = headers.set('Authorization', 'Basic ' + btoa(`${this.username}:${this.password}`));

    if (method == 'post') {
      return this.httpClient.post(this.base_api_url + mod, data, {headers});
    } else if (method == 'put') {
      return this.httpClient.put(this.base_api_url + mod, data, {headers});
    } else if (method == 'delete') {
      return this.httpClient.delete(this.base_api_url + mod, data);
    } else {
      return this.httpClient.get(this.base_api_url + mod, {headers});
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
    if (value == '999999') {
      return true;
    } else {
      return false;
    }
  }

  guiOtp(mobile: any) {
    return '123456';
  }

  completedTask(taskInstanceId: any, data: any) {
    let mod = `/server/containers/${this.containerId}/tasks/${taskInstanceId}/states/completed?user=${this.username}&auto-progress=true`;
    return this.curlData(mod, data, 'put');
  }

  updateTask(processInstanceId: any, varName: any, data: any) {
    let mod = `/server/containers/${this.containerId}/processes/instances/${processInstanceId}/variable/${varName}`;
    return this.curlData(mod, data, 'put');
  }


  _completedNhapTTLH(processInstanceId: any, data: any) {
    this.swalWarning('', 'Hệ thống đang xử lý ...', 60000);

    this._getTaskInstanceId(processInstanceId).subscribe(
      res => {
        let taskInstanceId = this._getTaskId(res, 'NhapTTLH');
        if (taskInstanceId && !this.taskInstanceIds[0].NhapTTLH) {
          this.completedTask(taskInstanceId, data).subscribe(
            res => {
              this.taskInstanceIds[0].NhapTTLH = taskInstanceId;
              Swal.close();
            },
            error => {
              this.errsStep = true;
              this.errsStepNhapTTLH = true;
            }
          );
        } else if (this.taskInstanceIds[0].NhapTTLH) {
          this.updateTask(processInstanceId, 'ttinLHe', data['ttinLHe']['fis.onboarding.process.banking.model.TTinLHe']).subscribe(
            res => {
              Swal.close();
            },
            error => {
              this.errsStep = true;
              this.errsStepNhapTTLH = true;
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

  getOTP(processInstanceId: any) {
    this._getVariables(processInstanceId).subscribe(
      res => {
        try {
          if (res['process-instance-variables']['kquaXThucGTTT']['kquaXThuc']['maKQua'] == 200) {
            let gtoTThan = res['process-instance-variables']['kquaXThucGTTT']['gtoTThan'];

            if (res['process-instance-variables']['kquaXThucGTTT'].hasOwnProperty('fis.onboarding.common.model.ekyc.xthucgttt.KQuaXThucGTTT')) {
              gtoTThan = res['process-instance-variables']['kquaXThucGTTT']['fis.onboarding.common.model.ekyc.xthucgttt.KQuaXThucGTTT']['gtoTThan']['fis.onboarding.common.model.identity.GToTThan'];
            }

            this.datatGToTThan.push(gtoTThan);

            this.taskInstanceIds[0].ChupGTTT = true;
            this.ttinCNhan = gtoTThan;
            Swal.close();
          } else {
            this.errsStepGTTT = true;
            this.errsStep = true;
          }

        } catch (e) {
          this.errsStepGTTT = true;
          this.errsStep = true;
        }
      },
      error => {
        this.errsStep = true;
      }
    );
  }
  _completedOtp(processInstanceId: any, otpCorrect: any) {
    this.swalWarning('Xác Thực OTP', 'Hệ thống đang xử lý ...', 60000);

    this._getChildInstanceId(processInstanceId).subscribe(
      res => {
        let processChildInstanceId = this._getProcessChildInstanceId(res);

        if (processChildInstanceId) {
          this._getTaskInstanceId(processChildInstanceId).subscribe(
            res => {
              let taskInstanceId = this._getTaskId(res, 'NhapOTP');

              if (taskInstanceId && !this.taskInstanceIds[0].NhapOTP) {
                let data = {
                  otpInput: otpCorrect
                }
                this.completedTask(taskInstanceId, data).subscribe(
                  res => {
                    this.taskInstanceIds[0].NhapOTP = taskInstanceId;
                    Swal.close();
                  },
                  error => {
                    this.errsStep = true;
                    this.errsStepOTP = true;
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
      },
      err => {
        this.errsStep = true;
      }
    );
  }

  getGtoTThan(processInstanceId: any) {
    this._getVariables(processInstanceId).subscribe(
      res => {
        try {
          if (res['process-instance-variables']['kquaXThucGTTT']['kquaXThuc']['maKQua'] == 200) {
            let gtoTThan = res['process-instance-variables']['kquaXThucGTTT']['gtoTThan'];

            if (res['process-instance-variables']['kquaXThucGTTT'].hasOwnProperty('fis.onboarding.common.model.ekyc.xthucgttt.KQuaXThucGTTT')) {
              gtoTThan = res['process-instance-variables']['kquaXThucGTTT']['fis.onboarding.common.model.ekyc.xthucgttt.KQuaXThucGTTT']['gtoTThan']['fis.onboarding.common.model.identity.GToTThan'];
            }

            this.datatGToTThan.push(gtoTThan);

            this.taskInstanceIds[0].ChupGTTT = true;
            this.ttinCNhan = gtoTThan;
            Swal.close();
          } else {
            this.errsStepGTTT = true;
            this.errsStep = true;
          }

        } catch (e) {
          this.errsStepGTTT = true;
          this.errsStep = true;
        }
      },
      error => {
        this.errsStep = true;
      }
    );
  }

  _completedGTTT(processInstanceId: any, data: any) {
    this.swalWarning('', 'Hệ thống đang xử lý ...', 60000);
    this._getChildInstanceId(processInstanceId).subscribe(
      res => {
        let processChildInstanceId = this._getProcessChildInstanceId(res);
        if (processChildInstanceId) {
          this._getTaskInstanceId(processChildInstanceId).subscribe(
            res => {
              let taskInstanceId = this._getTaskId(res, 'ChupGTTT');
              console.log(11111111111);

              if (taskInstanceId && !this.taskInstanceIds[0].ChupGTTT) {
                console.log(2222222222);
                this.completedTask(taskInstanceId, data).subscribe(
                  res => {
                    this.getGtoTThan(processInstanceId);
                  },
                  error => {

                    this.errsStep = true;
                    this.errsStepGTTT = true;
                  }
                );
              } else {
                this.errsStepGTTT = true;
                Swal.close();
              }
            },
            error => {
              this.errsStep = true;
            }
          );
        }
      },
    );
  }

  kquaXThuc(processInstanceId: any) {
    this._getVariables(processInstanceId).subscribe(
      res => {
        try {
          let maKQua = res['process-instance-variables']['kquaXThuc']['maKQua'];

          if (res['process-instance-variables']['kquaXThuc'].hasOwnProperty('fis.onboarding.common.model.ekyc.KQuaXThuc')) {
            maKQua = res['process-instance-variables']['kquaXThuc']['fis.onboarding.common.model.ekyc.KQuaXThuc']['maKQua'];
          }

          if (maKQua == 200) {
            this.taskInstanceIds[0].ChupKMat = true;
            this.swalInfo('Thông báo', 'Xác Thực Khuôn Mặt Thành Công!', 3000);
          } else {
            this.swalWarning('Kiểm tra khuôn mặt', 'Khuôn Mặt Không Khớp Với GTTT', 3000);
          }

        } catch (e) {
          this.errsStepKMat = true;
          this.errsStep = true;
        }
      },
      error => {
        this.errsStep = true;
      }
    );
  }


  _completedKMat(processInstanceId: any, data: any) {
    this.swalWarning('Xác Thực Khuân Mặt', 'Hệ thống đang xử lý ...', 60000);

    this._getChildInstanceId(processInstanceId).subscribe(
      res => {
        let processChildInstanceId = this._getProcessChildInstanceId(res);
        if (processChildInstanceId) {
          this._getTaskInstanceId(processChildInstanceId).subscribe(
            res => {
              let taskInstanceId = this._getTaskId(res, 'ChupKMat');
              if (taskInstanceId && !this.taskInstanceIds[0].ChupKMat) {
                this.completedTask(taskInstanceId, data).subscribe(
                  res => {
                    this.kquaXThuc(processInstanceId);
                    Swal.close();
                  },
                  error => {
                    this.errsStepKMat = true;
                    this.errsStep = true;
                  }
                );
              } else {
                this.errsStepKMat = true;
                Swal.close();
              }
            },
            error => {
              this.errsStep = true;
            }
          );
        }
      }
    );

  }

  _completedChonSPVay(processInstanceId: any, data: any) {
    this.swalWarning('', 'Hệ thống đang xử lý ...', 60000);

    this._getTaskInstanceId(processInstanceId).subscribe(
      res => {
        let taskInstanceId = this._getTaskId(res, 'ChonSPVay');

        if (taskInstanceId && !this.taskInstanceIds[0].ChonSPVay) {
          this.completedTask(taskInstanceId, data).subscribe(
            res => {
              this.taskInstanceIds[0].ChonSPVay = taskInstanceId;
              Swal.close();
            },
            error => {
              this.errsStep = true;
              this.errsStepChonSPVay = true;
            }
          );
        } else if (this.taskInstanceIds[0].ChonSPVay) {
          this.updateTask(processInstanceId, 'spVay', data['spVay']['fis.onboarding.process.banking.model.SPVay']).subscribe(
            res => {
              Swal.close();
            },
            error => {
              this.errsStep = true;
              this.errsStepChonSPVay = true;
            }
          );

        }else {
          Swal.close();
        }
      },
      error => {
        this.errsStep = true;
      }
    );
  }

  array: any;

  _completedTaiGiayTo(processInstanceId: any, data: any) {
    this.swalWarning('', 'Hệ thống đang xử lý ...', 30000);

    this._getTaskInstanceId(processInstanceId).subscribe(
      res => {
        let taskInstanceId = this._getTaskId(res, 'TaiGiayTo');
        if (taskInstanceId && !this.taskInstanceIds[0].TaiGiayTo) {
          this.completedTask(taskInstanceId, data).subscribe(
            res => {
              this.taskInstanceIds[0].TaiGiayTo = taskInstanceId;
            },
            error => {
              this.errsStep = true;
              this.errsStepTaiGiayTo = true;
            }
          );
        } else if (this.taskInstanceIds[0].TaiGiayTo) {
          let arrayTaiGiayTo = ['cmTTinCNhan', 'cmNoiO', 'cmTTinVlam', 'cmTNhap', 'bangKeMDichSDungVon'];
          for (let i = 0; i < arrayTaiGiayTo.length; i++) {
            let name = arrayTaiGiayTo[i];
            this.updateTask(processInstanceId, name, data[name]['org.jbpm.document.service.impl.DocumentImpl']).subscribe(
              res => {
                Swal.close();
              },
              error => {
                this.errsStep = true;
                this.errsStepTaiGiayTo = true;
              }
            );
          }
        } else {
          Swal.close();
        }
      },
      error => {
        this.errsStep = true;
      }
    );
  }

  _completedNhapDonDKy(processInstanceId: any, data: any) {
    this.swalWarning('', 'Hệ thống đang xử lý ...', 30000);

    this._getTaskInstanceId(processInstanceId).subscribe(
      res => {
        let taskInstanceId = this._getTaskId(res, 'NhapDonDKy');

        if (taskInstanceId && !this.taskInstanceIds[0].NhapDonDKy) {
          this.completedTask(taskInstanceId, data).subscribe(
            res => {
              this.taskInstanceIds[0].NhapDonDKy = taskInstanceId;
            },
            error => {
              this.errsStep = true;
              this.errsStepNhapDonDKy = true;
            }
          );
        } else if (this.taskInstanceIds[0].NhapDonDKy) {
          let arrayNhapDonDangKy = ['ttinCNhan', 'ttBMat', 'ttVLam', 'ttinNCauVay'];
          let array = ['TTinCNhan', 'TTinBMat', 'TTinVLam', 'TTinNCauVay'];
          for (let i = 0; i < arrayNhapDonDangKy.length; i++) {
            let name = arrayNhapDonDangKy[i];
            this.updateTask(processInstanceId, name, data[name]['fis.onboarding.process.banking.model.' + array[i] + '']).subscribe(
              res => {
                Swal.close();
              },
              error => {
                this.errsStep = true;
                this.errsStepNhapDonDKy = true;
              }
            );
          }
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

  _getChildInstanceId(processInstanceId: any) {
    let mod = `/server/containers/${this.containerId}/processes/instances/${processInstanceId}/processes?status=1&page=0&pageSize=10&sortOrder=false`;
    return this.curlData(mod, 'get');
  }

  _getVariables(processInstanceId: any) {
    let mod = `/server/containers/${this.containerId}/processes/instances/${processInstanceId}?withVars=true`;
    return this.curlData(mod, 'get');
  }

  _getProcessChildInstanceId(res: any) {
    let processChildInstanceId = '';
    if ((typeof res !== "undefined" || res !== null) && res['process-instance']) {
      if (res['process-instance'].length > 0) {
        for (let i = 0; i < res['process-instance'].length; i++) {
          if (res['process-instance'][i].hasOwnProperty('process-instance-id')) {
            processChildInstanceId = res['process-instance'][i]['process-instance-id'];
            break;
          }
        }
      }
    }
    return processChildInstanceId;
  }

  _getTaskId(res: any, task_name: string) {
    let taskInstanceId = '';
    if ((typeof res !== "undefined" || res !== null) && res['active-user-tasks']) {
      if (res.hasOwnProperty('active-user-tasks')) {
        if (res['active-user-tasks'].hasOwnProperty('task-summary')) {
          for (let i = 0; i < res['active-user-tasks']['task-summary'].length; i++) {
            if (res['active-user-tasks']['task-summary'][i]['task-name'] == task_name) {
              taskInstanceId = res['active-user-tasks']['task-summary'][i]['task-id'];
              break;
            }
          }
        }
      }
    }
    return taskInstanceId;
  }

}
