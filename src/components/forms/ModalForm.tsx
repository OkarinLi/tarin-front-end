/**
 * Created by hao.cheng on 2017/4/15.
 */
import React, { Component } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import { FormProps } from 'antd/lib/form';
import { addContact } from '../../service/index'
import umbrella from 'umbrella-storage';
const FormItem = Form.Item;

type CollectionCreateFormProps = {
    visible: boolean;
    onCancel: () => void;
    onCreate: () => void;
    ref: any;
} & FormProps;

const CollectionCreateForm: any = Form.create()((props: CollectionCreateFormProps) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form!;
    return (
        <Modal
            visible={visible}
            title="New Contact"
            okText="confirm"
            onCancel={onCancel}
            onOk={onCreate}
        >
            <Form layout="vertical">
                <FormItem label="Name">
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please input name!' }],
                    })(<Input />)}
                </FormItem>
                <FormItem label="Telephone">
                    {getFieldDecorator('telephone', {
                        rules: [{ required: true, message: 'Please input telephone!' }],
                    })(<Input />)}
                </FormItem>
                <FormItem label="Identity card">
                    {getFieldDecorator('identity_card', {
                        rules: [{ required: true, message: 'Please input identity card!' }],
                    })(<Input />)}
                </FormItem>
            </Form>
        </Modal>
    );
});

interface ModalFormProps{
    getUser?:any
}
class ModalForm extends Component<ModalFormProps> {
    
    state = {
        visible: false,
    };
    
    form: any;
    showModal = () => {
        this.setState({ visible: true });
    };
    handleCancel = () => {
        this.setState({ visible: false });
    };
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err: any, values: any) => {
            if (err) {
                return;
            }
        let user = umbrella.getLocalStorage('user')
        values.user_id=user.id
            addContact(values).then(()=>{
                this.props.getUser()
            })
            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ visible: false });
        });
    };
    saveFormRef = (form: any) => {
        this.form = form;
    };
    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    New Contact
                </Button>
                <CollectionCreateForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        );
    }
}

export default ModalForm;
