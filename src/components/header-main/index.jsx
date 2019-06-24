import React, { Component } from "react";
import MyButton from "../my-button";
import { withRouter } from 'react-router-dom';
import { Modal } from 'antd';
import { getItem, removeItem } from '../../utils/storage-tools';
import { reqWeather } from '../../api/indxe'
import "./index.less";
import dayjs from "dayjs";

const { confirm } = Modal;
class HeaderMain extends Component {
  state = {
    sysTime:Date.now(),
    weather:'默认',
    weatherImg:'http://api.map.baidu.com/images/weather/day/qing.png'
  }
  componentWillMount () {
    this.username = getItem().username;
  }

  async componentDidMount () {
    setInterval ( () => {
      this.setState ({
        sysTime:Date.now()
      })
    },1000);
    const result = await reqWeather();
    
    if (result) {
      this.setState(result);
    }
  }
  // 点击登出
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
    const { sysTime, weather, weatherImg } = this.state;
    return (
      <div>
        <div className="header-main-top">
          <span>欢迎, {this.username}</span>
          <MyButton onClick={this.logout}>退出</MyButton>
        </div>
        <div className="header-main-bottom">
          <span className="header-main-left">用户管理</span>
          <div className="header-main-right">
            <span>{dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            <img src={weatherImg} alt="" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(HeaderMain);