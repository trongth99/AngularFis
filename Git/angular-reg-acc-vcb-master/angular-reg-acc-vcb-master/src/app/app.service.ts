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

//const baseApiURL = 'http://10.15.119.73:8090/kie-server/services/rest';
//const baseApiURL = 'http://103.9.0.210/kie-server/services/rest';
const baseApiURL = 'https://fpt.aeyes.online/kie-server-dev/services/rest';

//const configApiURL = 'http://103.9.0.210/ekyc/config';
const configApiURL = 'https://fpt.aeyes.online/ekyc/config';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  base_api_url = '';
  containerId = 'VCB-POC_1.0.0-SNAPSHOT';
  processId = 'fisonboarding-template.VCBPOC';
  username = 'customer';
  password = 'customer123';

  errsStep = false;
  errsStepNhanGTTT = false;
  errsStepXNhanGTTT = false;
  errsStepNhanTTinKMat = false;
  errsStepNhapDonDKy = false;
  errsStepTaoDonDKy = false;
  currFinishStep = 0;

  params: Array<any> = [
    {
      kquaXThuc: '',
    }
  ];

  taskInstanceIds: Array<any> = [
    {
      NhanGTTT: '',
      XNhanGTTT: '',
      NhanKMat: '',
      QDinhTTuc: '',
      NhapDonDKy: '',
      TaoDonDKy: ''
    }
  ];

  customerUser = {
    loaiGToTThan: 4,
    soGTo: '',
    ngayCap: '',
    noiCap: '',
    hoTen: '',
    ngaySinh: '',
    gioiTinh: '',
    diaChi: '',
    quocTich: '',
    queQuan: '',
    noiTru: '',
    ngayHetHan: '',
    dacDiemNhanDang: ''
  }

  ttinMST = {
    maSoThue: ''
  }

  //Table
  datatGToTThan = ELEMENT_GTTT_DATA;
  pdfDonDKy = '';
  datdaGTTT = {
    loaiGToTThan: 4,
    soGTo: '',
    ngayCap: '',
    noiCap: '',
    hoTen: '',
    ngaySinh: '',
    gioiTinh: 0,
    diaChi: '',
    quocTich: '',
    queQuan: '',
    noiTru: '',
    ngayHetHan: '',
    dacDiemNhanDang: ''
  }

  constructor(private httpClient: HttpClient) {
  }

  swalAlert(title: any, text: any, type: any) {
    Swal.fire(
      title,
      text,
      type,
    );
  }

  swalAlertConfirm(title: any, text: any, text_confirm = '', text_deny = '', processInstanceId: any) {
    Swal.fire({
      title: title,
      text: text,
      showDenyButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Tiếp tục',
      denyButtonText: 'Từ chối',
      customClass: {
        actions: 'my-actions',
        denyButton: 'order-1',
        confirmButton: 'order-2',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(text_confirm, '', 'success');
        let data = {
          qdinhTTuc: true
        }
        this._completedQDinhTTuc(processInstanceId, data);
      } else if (result.isDenied) {
        if (!text_deny) {
          let data = {
            qdinhTTuc: false
          }
          this._completedQDinhTTuc(processInstanceId, data);
        }
      }
    });
  }

  swalAlertCIF(title: any, text: any) {
    Swal.fire({
      title: title,
      text: text,
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Quay về trang chủ',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
        window.location.reload();
      }
    });
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

  kquaXThuc(processInstanceId: any) {
    this._getVariables(processInstanceId).subscribe(
      res => {
        try {
          let maKQua = res['kquaXThuc']['maKQua'];

          if (res['kquaXThuc'].hasOwnProperty('fis.onboarding.common.model.ekyc.KQuaXThuc')) {
            maKQua = res['kquaXThuc']['fis.onboarding.common.model.ekyc.KQuaXThuc']['maKQua'];
          }

          if (maKQua == 200) {
            this.taskInstanceIds[0].NhanKMat = true;
            this.swalInfo('Thông báo', 'Xác Thực Khuôn Mặt Thành Công!', 6000);

            this.kTraPCRT(processInstanceId);

            setTimeout(() => {
              this.getCustomerUser(processInstanceId);
              this.getKquaTCuuMST(processInstanceId);
            }, 2000);

          } else {
            this.errsStepNhanTTinKMat = true;
            this.swalWarning('Kiểm tra khuôn mặt', 'Khuôn Mặt Không Khớp Với GTTT', 3000);
          }

        } catch (e) {
          this.errsStep = true;
        }
      },
      error => {
        this.errsStep = true;
      }
    );
  }

  kTraCIF(processInstanceId: any) {
    this._getVariables(processInstanceId).subscribe(
      res => {
        try {
          let ttaiCIF = res['kquaKTraCIF']['ttaiCIF'];

          if (res['kquaKTraCIF'].hasOwnProperty('fis.onboarding.process.banking.model.KQuaKTraCIF')) {
            ttaiCIF = res['kquaKTraCIF']['fis.onboarding.process.banking.model.KQuaKTraCIF']['ttaiCIF'];
          }

          if (!ttaiCIF) {
            //this.swalInfo('Thông báo', 'Chưa Có Số CIF', 20000);
            Swal.close();
          } else {
            this.swalAlertCIF('Kiểm Tra Số CIF', 'Khách Hàng Đã Có Số CIF');
          }

        } catch (e) {
          this.errsStep = true;
          Swal.close();
        }
      },
      error => {
        this.errsStep = true;
        Swal.close();
      }
    );
  }

  kTraPCRT(processInstanceId: any) {
    this._getVariables(processInstanceId).subscribe(
      res => {
        try {
          let pcrtHit = res['pcrtHit'];

          if (!pcrtHit) {
            //this.swalAlert('Thông báo', 'Kiểm Tra PCRT Không Có Vấn Đề', 'success');
          } else {
            this.swalAlertConfirm('Cảnh báo', 'Hệ thống SironKYC hiển thị cảnh báo. Đề nghị liên hệ với cán bộ PCRT để đưa ra quyết định để tiếp tục quy trình mở TKTT cho khách hàng.', 'Tiếp tục mở tài khoản cho khách hàng!', '', processInstanceId);
          }

        } catch (e) {
          this.errsStep = true;
        }
      },
      error => {
        this.errsStep = true;
      }
    );
  }

  getGtoTThan(processInstanceId: any) {
    this._getVariables(processInstanceId).subscribe(
      res => {
        try {
          if (res['kquaXThucGTTT']['kquaXThuc']['maKQua'] == 200) {
            let gtoTThan = res['kquaXThucGTTT']['gtoTThan'];

            if (res['kquaXThucGTTT'].hasOwnProperty('fis.onboarding.common.model.ekyc.xthucgttt.KQuaXThucGTTT')) {
              gtoTThan = res['kquaXThucGTTT']['fis.onboarding.common.model.ekyc.xthucgttt.KQuaXThucGTTT']['gtoTThan']['fis.onboarding.common.model.identity.GToTThan'];

            }

            this.datatGToTThan.push(gtoTThan);

            this.taskInstanceIds[0].NhanGTTT = true;
            Swal.close();
          } else {
            this.errsStepNhanGTTT = true;
            this.errsStep = true;
          }

        } catch (e) {
          this.errsStepNhanGTTT = true;
          this.errsStep = true;
        }
      },
      error => {
        this.errsStep = true;
      }
    );
  }

  getCustomerUser(processInstanceId: any) {
    this._getVariables(processInstanceId).subscribe(
      res => {
        try {
          let gtoTThan = res['gtoTThan'];

          if (res['gtoTThan'].hasOwnProperty('fis.onboarding.common.model.identity.GToTThan')) {
            gtoTThan = res['gtoTThan']['fis.onboarding.common.model.identity.GToTThan'];
          }

          this.customerUser = gtoTThan;
          this.datatGToTThan = gtoTThan;
        } catch (e) {
          this.errsStep = true;
        }
      },
      error => {
        this.errsStep = true;
      }
    );
  }

  getKquaTCuuMST(processInstanceId: any) {
    this._getVariables(processInstanceId).subscribe(
      res => {
        try {
          let ttinMST = res['kquaTCuuMST']['data'][0];

          if (res['kquaTCuuMST'].hasOwnProperty('fis.onboarding.common.model.ekyc.mst.KQuaTCuuMST')) {
            ttinMST = res['kquaTCuuMST']['fis.onboarding.common.model.ekyc.mst.KQuaTCuuMST']['data'][0]['fis.onboarding.common.model.ekyc.mst.TTinMST'];
          }

          if (ttinMST.hasOwnProperty('maSoThue')) {
            this.ttinMST = ttinMST;
          }
        } catch (e) {

        }
      },
      error => {

      }
    );
  }

  getPdfDonDKy(processInstanceId: any) {
    this._getVariables(processInstanceId).subscribe(
      res => {
        try {
          if (res['pdfDonDKy'].hasOwnProperty('org.jbpm.document.service.impl.DocumentImpl')) {
            this.pdfDonDKy = res['pdfDonDKy']['org.jbpm.document.service.impl.DocumentImpl']['content'];
          } else {
            this.pdfDonDKy = res['pdfDonDKy']['content'];
          }

          this.taskInstanceIds[0].TaoDonDKy = true;

        } catch (e) {
          this.errsStepTaoDonDKy = true;
        }
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

  _completedNhanGTTT(processInstanceId: any, data: any) {
    this.swalWarning('Xác Thực Giấy Tờ', 'Hệ thống đang xử lý ...', 60000);

    this._getTaskInstanceId(processInstanceId).subscribe(
      res => {
        let taskInstanceId = this._getTaskId(res, 'NhanGTTT');

        if (taskInstanceId && !this.taskInstanceIds[0].NhanGTTT) {
          this.completedTask(taskInstanceId, data).subscribe(
            res => {
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
    this.swalWarning('', 'Hệ thống đang xử lý ...', 60000);

    this._getTaskInstanceId(processInstanceId).subscribe(
      res => {
        let taskInstanceId = this._getTaskId(res, 'XNhanGTTT');

        if (taskInstanceId && !this.taskInstanceIds[0].XNhanGTTT) {
          this.completedTask(taskInstanceId, data).subscribe(
            res => {
              this.taskInstanceIds[0].XNhanGTTT = taskInstanceId;
              if (data.hasOwnProperty('xnhanGTTT')) {
                if (!data['xnhanGTTT']) {
                  Swal.close();
                  window.location.reload();
                } else {
                  this.kTraCIF(processInstanceId);
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
        let taskInstanceId = this._getTaskId(res, 'NhanKMat');

        if (taskInstanceId && !this.taskInstanceIds[0].NhanKMat) {
          this.completedTask(taskInstanceId, data).subscribe(
            res => {
              this.kquaXThuc(processInstanceId);
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

  _completedQDinhTTuc(processInstanceId: any, data: any) {
    this.swalWarning('Quyết Định Tiếp Tục', 'Hệ thống đang xử lý ...', 60000);

    this._getTaskInstanceId(processInstanceId).subscribe(
      res => {
        let taskInstanceId = this._getTaskId(res, 'QDinhTTuc');

        if (taskInstanceId && !this.taskInstanceIds[0].NhapDonDKy) {
          this.completedTask(taskInstanceId, data).subscribe(
            res => {
              this.taskInstanceIds[0].QDinhTTuc = taskInstanceId;

              if (data.hasOwnProperty('qdinhTTuc')) {
                if (data.qdinhTTuc == false) {
                  setTimeout(() => {
                    Swal.close();
                    window.location.reload();
                  }, 3000);
                } else {
                  Swal.close();
                }
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

  _completedNhapDonDKy(processInstanceId: any, data: any, htmlDonDKy: any) {
    this.swalWarning('Nhập Đơn Đăng Ký', 'Hệ thống đang xử lý ...', 60000);

    this._getTaskInstanceId(processInstanceId).subscribe(
      res => {
        let taskInstanceId = this._getTaskId(res, 'NhapDonDKy');

        if (taskInstanceId && !this.taskInstanceIds[0].NhapDonDKy) {
          this.completedTask(taskInstanceId, data).subscribe(
            res => {
              this.taskInstanceIds[0].NhapDonDKy = taskInstanceId;

              let params = {
                "ycTaoDonDKy": {
                  "fis.onboarding.process.model.jbpm.dto.PDFGenDTO": {
                    "html": htmlDonDKy,
                    "css": "",
                    "pdfName": "DonDKy"
                  }
                }
              }
              this._completedTaoDonDKy(processInstanceId, params);
            },
            error => {
              this.errsStep = true;
              this.errsStepNhapDonDKy = true;
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

  _completedTaoDonDKy(processInstanceId: any, data: any) {
    this.swalWarning('Nhập Đơn Đăng Ký', 'Hệ thống đang xử lý ...', 60000);

    this._getTaskInstanceId(processInstanceId).subscribe(
      res => {
        let taskInstanceId = this._getTaskId(res, 'TaoDonDKy');

        if (taskInstanceId && !this.taskInstanceIds[0].TaoDonDKy) {
          this.completedTask(taskInstanceId, data).subscribe(
            res => {
              this.getPdfDonDKy(processInstanceId);
            },
            error => {
              this.errsStep = true;
              this.errsStepTaoDonDKy = true;
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

  _completedXemDonDKy(processInstanceId: any, data: any) {
    this.swalWarning('Xem Đơn Đăng Ký', 'Hệ thống đang xử lý ...', 60000);

    this._getTaskInstanceId(processInstanceId).subscribe(
      res => {
        let taskInstanceId = this._getTaskId(res, 'XemDonDKy');

        if (taskInstanceId && !this.taskInstanceIds[0].XemDonDKy) {
          this.completedTask(taskInstanceId, data).subscribe(
            res => {
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
