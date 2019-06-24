import ajax from './ajax';
import { message } from 'antd';
import jsonp from 'jsonp'
// 登录请求
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST');

export const reqValidateUserInfo = (id) => ajax('/validate/user', {id}, 'POST');
// 天气请求
export const reqWeather = function () {
    return new Promise((resolve,reject) => {
        jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,{},function(err,data){
            if(!err) {
                const { dayPictureUrl, weather} = data.results[0].weather_data[0];
                resolve({
                    weatherImg:dayPictureUrl,
                    weather
                })
            } else {
                message.error('请求天气失败');
                resolve();
            }
        })
    })
}

// 请求品类管理-品类名称数据
export const reqCategories = (parentId) => ajax('/manage/category/list',{parentId},'GET');