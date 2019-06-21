import React,{Component} from 'react';
import { Form, Icon, Input, Button} from 'antd';
import logo from './logo.png';
import './index.less';
const Item = Form.Item;
class Login extends Component{
    // 登录点击事件
    login = (e) => {
        e.preventDefault();
    }
    //自定义校验规则
    validator = (rule, value, callback) => {
        const name = rule.fullField === 'username' ? '用户名' : '密码';
        if (!value) {
            callback(`必须输入${name}！`);
        }else if(value.length<4){
            callback(`${name}必须大于4位`);
        }else if (value.length > 15) {
            callback(`${name}必须小于15位`);
          } else if (!/^[a-zA-Z_0-9]+$/.test(value)) {
            callback(`${name}只能包含英文字母、数字和下划线`);
          } else {
            callback();
          }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
           <div className="login">
               <header className="login-header">
                   <img src={logo} alt="logo"/>
                   <h1>React项目: 后台管理系统</h1>
               </header>
               <section className="login-content">
                   <h2>用户登录</h2>
                   <Form className="login-form" onSubmit={this.logon}>
                       <Item>
                          {
                            getFieldDecorator(
                                'username',
                                {
                                    rules:[
                                        {
                                            validator:this.validator
                                        }
                                    ]
                                }
                            )(
                                <Input className="login-input" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名"/>
                            )   
                          } 
                       </Item>
                       <Item>
                       {
                            getFieldDecorator(
                                'password',
                                {
                                    rules:[
                                        {
                                            validator:this.validator
                                        }
                                    ]
                                }
                            )(
                                <Input className="login-input" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="密码"/>
                            )   
                          } 
                       </Item>
                       <Item>
                           <Button type="primary" htmlType="submit" className="login-btn">登录</Button>
                       </Item>
                   </Form>
               </section>
           </div>
        )
        
    }
}
export default Form.create()(Login);