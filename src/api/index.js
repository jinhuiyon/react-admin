import ajax from './ajax';
import { message } from 'antd';
import jsonp from 'jsonp'
// 登录请求
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST');
//验证用户id
export const reqValidateUserInfo = (id) => ajax('/validate/user', {id}, 'POST');
// 天气请求
export const reqWeather = function () {
    let cancel = null;
    const promise = new Promise((resolve,reject) => {
        cancel = jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,{},function(err,data){
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
    return {
        promise,
        cancel
      }
}

// 请求品类管理-品类名称数据
export const reqCategories = (parentId) => ajax('/manage/category/list',{parentId},'GET');

export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {parentId, categoryName}, 'POST');

export const reqUpdateCategoryName = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST');

export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize});
// 添加
export const reqAddProduct = ({name, desc, price, categoryId, pCategoryId, detail}) => ajax('/manage/product/add', {name, desc, price, categoryId, pCategoryId, detail},'POST');
// 修改
export const reqUpdateProduct = ({name, desc, price, categoryId, pCategoryId, detail, _id}) => ajax('/manage/product/update', {name, desc, price, categoryId, pCategoryId, detail, _id}, 'POST');
// 图片
export const reqDeleteProductImg = (name, id) => ajax('/manage/img/delete', {name, id}, 'POST');

// 搜索
export const reqSearchProduct = ({searchType, searchContent, pageSize, pageNum}) => ajax('/manage/product/search', {[searchType]: searchContent, pageSize, pageNum});