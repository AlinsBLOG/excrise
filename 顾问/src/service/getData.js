 /* jshint esversion: 6 */ 
import fetch from '../../config/fetch';
import { getStore } from '../../config/mUtils';

/**
 * 用户名登录
 */
export const accountLogin = (username, password) => fetch('/mall-portal/authorize/loginByUNP', {username, password}, 'POST');

/**
 * 手机+验证码登录
 */
export const mobileLogin = (mobile, checknum) => fetch('/mall-portal/authorize/loginByMNC', {mobile, checknum}, 'POST');

/**
 * 登录获取验证码
 */
export const getcheckNum = (mobile) => fetch('/mall-portal/sys/checknum/applyWithCheck/'+mobile, {}, 'POST');

/**
 * 注册获取验证码
 */
export const registerGetcheckNum = (mobile) => fetch('/mall-portal/sys/checknum/applyWithoutCheck/'+mobile, {}, 'POST');

/**
 * 查看手机是否注册
 */
export const isAccountExists = (mobile) => fetch('/mall-portal/account/isAccountExists', {mobile});

/**
 * 成功注册
 */
export const registerWithMNC = (data) => fetch('/mall-portal/account/registerWithMNC', data, 'POST');

/**
 * 申请顾问／保存简历
 */
export const umeResumeSave = (data) => fetch('/umeResume/save', data, 'POST');

/**
 * 修改顾问／修改简历
 */
export const umeResumeUpdate = (data) => fetch('/umeResume/update', data, 'POST');
/**
 * 搜索顾问
 */
export const consultantSearch = (data) => fetch('/api/consultant/search', data, 'GET');

/**
 * 获取顾问详情
 */
export const consultantInfo = (resumeId) => fetch('/api/consultant/info', { resumeId: resumeId }, 'GET');

/**
 * 电话咨询
 */
export const consultantTel = (resumeId) => fetch('/api/consultant/telConsult', { }, 'GET');

/**
 * 顾问首页 banner
 */
export const getBanner = (adTypes) => fetch('/cfg/api/advertisement/query', { adTypes: adTypes}, 'GET');

/**
 * 发起项目
 */
export const projectCreate = (data) => fetch('/api/project/create', data , 'POST');

/**
 * 编辑项目
 */
export const projectModify = (data) => fetch('/api/project/modify', data , 'POST');

/**
 * 项目列表
 */
export const projectList = (data) => fetch('/api/project/search', data , 'GET');

/**
 * 查看项目
 */
export const projectgetInfo = (id) => fetch('/api/project/info', {id: id} , 'GET');

/**
 * 申请项目
  "applyTime": "2018-07-20T04:11:09.899Z",
  "applyUser": 0,
  "handleUser": 0,
  "id": 0,
  "projectId": 0,
  "reason": "string",
  "remark": "string",
  "state": 0
 */
export const applyProject = (data) => fetch('/api/apply/apply', data , 'POST');

/*
 * 查看项目申请
 * 动态组合条件tenantId,projectId，applyUser，applyUserName，state，pageNo，pageSize
 */
export const applyList = (data) => fetch('/api/apply/list', data , 'GET');

/*
 * 处理申请
 * "handler": 0,
   "id": 0,
   "reason": "string",
   "state": 0
 */
export const applyHandleApply = (data) => fetch('/api/apply/handleApply', data , 'POST');
















