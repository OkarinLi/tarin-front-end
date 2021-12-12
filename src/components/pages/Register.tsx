
 import React from 'react';
 import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
//  import { PwaInstaller } from '../widget';
 import { connectAlita } from 'redux-alita';
 import { RouteComponentProps } from 'react-router';
 import { FormProps } from 'antd/lib/form';
 import {register} from '../../service/index'
//  import umbrella from 'umbrella-storage';
 
 const FormItem = Form.Item;
 type RegisterProps = {
     setAlitaState: (param: any) => void;
     auth: any;
 } & RouteComponentProps &
     FormProps;
 class Register extends React.Component<RegisterProps> {
     componentDidMount() {
        //  const { setAlitaState } = this.props;
        //  setAlitaState({ stateName: 'auth', data: null });
     }

     handleSubmit = (e: React.FormEvent) => {
         e.preventDefault();
         this.props.form!.validateFields((err, values) => {

             if (!err) {
                 console.log('Received values of form: ', values);
                 register(values).then((response)=>{
                    if(response.resultCode===200){
                        message.success('Register success');
                        this.props.history.push('/login');
                    }
                 }).catch((err)=>{
                     console.log(err)
                 })

             }
         });
     };

     render() {
         const { getFieldDecorator } = this.props.form!;
         return (
             <div className="register">
                 <div className="register-form">
                     <Form onSubmit={this.handleSubmit} style={{ maxWidth: '300px' }}>
                         <FormItem>
                             {getFieldDecorator('userName', {
                                 rules: [{ required: true, message: 'Username is required!' }],
                             })(
                                 <Input
                                     prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                     placeholder="Username"
                                 />
                             )}
                         </FormItem>
                         <FormItem>
                             {getFieldDecorator('password', {
                                 rules: [{ required: true, message: 'Password is required!' }],
                             })(
                                 <Input
                                     prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                     placeholder="password"
                                 />
                             )}
                         </FormItem>
                         <FormItem>
                             {getFieldDecorator('email', {})(
                                 <Input
                                     prefix={<Icon type="mail" style={{ fontSize: 13 }} />}
                                     placeholder="email"
                                 />
                             )}
                         </FormItem>
                         <FormItem>
                             {getFieldDecorator('telephone', {})(
                                 <Input
                                     prefix={<Icon type="phone" style={{ fontSize: 13 }} />}
                                     placeholder="telephone"
                                 />
                             )}
                         </FormItem>
                         <FormItem>
                             {getFieldDecorator('identity_card', {})(
                                 <Input
                                     prefix={<Icon type="idcard" style={{ fontSize: 13 }} />}
                                     placeholder="identity card"
                                 />
                             )}
                         </FormItem>
                         <FormItem>

                             <Button
                                 type="primary"
                                 htmlType="submit"
                                 className="login-form-button"
                                 style={{ width: '100%' }}
                             >
                                 Register
                             </Button>
                             {/* <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <span>或 现在就去注册!</span>
                                 <span onClick={this.gitHub}>
                                     <Icon type="github" />
                                     (第三方登录)
                                 </span>
                             </p> */}
                         </FormItem>
                     </Form>
                 </div>
             </div>
         );
     }
 }
 
 export default connectAlita(['auth'])(Form.create()(Register));
 