import React, { Component } from "react";
import MyButton from "../my-button";
import { withRouter } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { getItem, removeItem } from '../../utils/storage-tools';
import logo from "../../assets/img/logo.png";
import "./index.less";

const { confirm } = Modal;
class HeaderMain extends Component {
  componentWillMount () {
    this.username = getItem().username;
  }

  logout = () => {
    confirm({
      title: '你确定要退出登录吗?',
      okText: '确定',
    cancelText: '取消',
      onOk: () => {
        removeItem();
        this.props.history.replace('/login');
      }
    });
  }
  render() {
    return (
      <div>
        <div className="header-main-top">
          <span>欢迎, xxx</span>
          <MyButton onClick={this.logout}>退出</MyButton>
        </div>
        <div className="header-main-bottom">
          <span className="header-main-left">用户管理</span>
          <div className="header-main-right">
            <span>{Date.now()}</span>
            <img src={logo} alt="" />
            <span>晴</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(HeaderMain);