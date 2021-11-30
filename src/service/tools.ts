/**
 * Created by 叶子 on 2017/7/30.
 * http通用工具函数
 */
import axios from 'axios';
import { message } from 'antd';

interface IFRequestParam {
    url: string;
    msg?: string;
    config?: any;
    data?: any;
}
/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const get = ({ url, msg = 'Server Error', config }: IFRequestParam) =>
    axios
        .get(url, config)
        .then((res) => res.data)
        .catch((err) => {
            console.log(err);
            message.warn(msg);
        });

/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const post = ({ url, data, msg = 'Server Error', config }: IFRequestParam) =>
    axios
        .post(url, data, config)
        .then((res) => res.data)
        .catch((err) => {
            console.log(err);
            message.warn(msg);
        });

export const put = ({ url, data, msg = 'Server Error', config }: IFRequestParam) =>
    axios
        .put(url, data, config)
        .then((res) => res.data)
        .catch((err) => {
            console.log(err);
            message.warn(msg);
        });

export const deleteRequest = ({ url, data, msg = 'Server Error' }: IFRequestParam) =>
axios
    .delete(url, {data:data})
    .then((res) => res.data)
    .catch((err) => {
        console.log(err);
        message.warn(msg);
    });