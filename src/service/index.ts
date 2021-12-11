/**
 * Created by hao.cheng on 2017/4/16.
 */
import axios from "axios";
import { get, post, put, deleteRequest } from "./tools";
import * as config from "./config";

export const getBbcNews = () => get({ url: config.NEWS_BBC });

export const npmDependencies = () =>
  axios
    .get("./npm.json")
    .then((res) => res.data)
    .catch((err) => console.log(err));

export const weibo = () =>
  axios
    .get("./weibo.json")
    .then((res) => res.data)
    .catch((err) => console.log(err));

export const gitOauthLogin = () =>
  get({
    url: `${config.GIT_OAUTH}/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin`,
  });
export const gitOauthToken = (code: string) =>
  post({
    url: `https://cors-anywhere.herokuapp.com/${config.GIT_OAUTH}/access_token`,
    data: {
      client_id: "792cdcd244e98dcd2dee",
      client_secret: "81c4ff9df390d482b7c8b214a55cf24bf1f53059",
      redirect_uri: "http://localhost:3000/",
      state: "reactAdmin",
      code,
    },
  });
// {headers: {Accept: 'application/json'}}
export const gitOauthInfo = (access_token: string) =>
  get({ url: `${config.GIT_USER}access_token=${access_token}` });

// easy-mock数据交互
// 管理员权限获取
export const admin = () => get({ url: config.MOCK_AUTH_ADMIN });
// 访问权限获取
export const guest = () => get({ url: config.MOCK_AUTH_VISITOR });
/** 获取服务端菜单 */
export const fetchMenu = () => get({ url: config.MOCK_MENU });

export const getPeopleList = () => get({ url: config.LOCAL_API + "/people" });

export const register = (user: any) =>
  post({
    url: config.LOCAL_API + "/user",
    data: {
      user_name: user.userName,
      password: user.password,
      email: user.email,
      identity_card: user.identity_card,
      telephone: user.telephone,
    },
  });

export const login = (user: any) =>
  post({
    url: config.LOCAL_API + "/login",
    data: {
      user_name: user.userName,
      password: user.password,
    },
  });

export const getUserInfo = (user_name: string) =>
  get({ url: config.LOCAL_API + "/user?user_id=" + user_name });

export const updateUserInfo = (user: any) => {
  return put({
    url: config.LOCAL_API + "/user",
    data: {
      id: user.key,
      email: user.email,
      identity_card: user.id,
      telephone: user.telephone,
    },
  });
};
export const deleteContact = (contactId: any) => {
  return deleteRequest({
    url: config.LOCAL_API + "/contact",
    data: {
      id: contactId,
    },
  });
};

export const addContact = (contact: any) => {
  return post({
    url: config.LOCAL_API + "/contact",
    data: contact,
  });
};

export const getStationList = () => get({ url: config.LOCAL_API + "/station" });

export const getTrainTicket = (
  departureStation: String,
  arrivalStation: String
) =>
  get({
    url:
      config.LOCAL_API +
      "/trainTicket?departureStation=" +
      departureStation +
      "&arrivalStation=" +
      arrivalStation,
  });
