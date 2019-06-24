import React, { Component } from "react";
import MyButton from "../my-button";
import { withRouter } from 'react-router-dom';
import { Modal } from 'antd';
import { getItem, removeItem } from '../../utils/storage-tools';
import { reqWeather } from '../../api/indxe'
import menuList from '../../config/menu-config'
import dayjs from "dayjs";
import "./index.less";

const { confirm } = Modal;
class HeaderMain extends Component {
  state = {
    sysTime:Date.now(),
    weather:'默认',
    weatherImg:'http://api.map.baidu.com/images/weather/day/qing.png'
  }
  componentWillMount () {
    this.username = getItem().username;
    this.title = this.getTitle(this.props);
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

  componentWillReceiveProps(nextProps) {
    this.title = this.getTitle(nextProps);
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
  // 获取 title
  getTitle = (nextProps) => {
    console.log('getTitle()');
    const { pathname } = nextProps.location;
    for (let i=0; i<menuList.length; i++) {
      const menu = menuList[i];
      if (menu.children) {
        for (let j=0; j<menu.children.length; j++) {
          const item = menu.children[j];
          if ( item.key === pathname) {
            return item.title;
          }
        }
      } else {
        if (menu.key === pathname) {
          return menu.title;
        }
      }
    }
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
          <span className="header-main-left">{this.title}</span>
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