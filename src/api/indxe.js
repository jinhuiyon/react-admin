import ajax from './ajax';

export default reqLogin = (username,password) => ajax('/login',{username,password},'post');