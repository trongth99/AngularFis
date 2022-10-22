import { Injectable } from '@angular/core';
import { CommonService } from '../_services/common.service';

export interface DataList {
  status: string;
  createdDate: string;
  signedDate: string;
  contractName: string;
  contractCode: string;
}

const ELEMENT_DATA_LIST: DataList[] = [];

@Injectable({
  providedIn: 'root'
})

export class ContractsService {

  //Table
  dataList = ELEMENT_DATA_LIST;
  data$ = {
    status: '',
    createdDate: '',
    signedDate: '',
    contractName: '',
    contractCode: '',
    contentContract: '',
    contractNumber: '',
    phoneNumber: ''
  };

  dataRegSign = {
    agreementUUID: '',
    billCode: '',
    otp: '' //for test
  }

  constructor(private common: CommonService) { }

  getData(data: any, author: any) {
    let mod = `public/all/list-contract`;
    return this.common.curlData(mod, data, author, 'post');
  }

  readData(data: any, author: any) {
    let mod = `public/all/detail-contract`;
    return this.common.curlData(mod, data, author, 'post');
  }

  dangKyChuKySo(data: any, author: any) {
    let mod = `public/all/register-sign`;
    return this.common.curlData(mod, data, author, 'post');
  }

  kySo(data: any, author: any) {
    let mod = `public/all/siged`;
    return this.common.curlData(mod, data, author, 'post');
  }
}
