package com.fis.model;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class UserObject {
  String apiUserName ;
  String apiPassWord;
  String containerId;
  String processId;

  String userName ;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getApiUserName() {
        return apiUserName;
    }

    public void setApiUserName(String apiUserName) {
        this.apiUserName = apiUserName;
    }

    public String getApiPassWord() {
        return apiPassWord;
    }

    public void setApiPassWord(String apiPassWord) {
        this.apiPassWord = apiPassWord;
    }

    public String getContainerId() {
        return containerId;
    }

    public void setContainerId(String containerId) {
        this.containerId = containerId;
    }

    public String getProcessId() {
        return processId;
    }

    public void setProcessId(String processId) {
        this.processId = processId;
    }

    @Override
    public String toString() {
        return new GsonBuilder().create().toJson(this);
    }
}
