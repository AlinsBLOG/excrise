 /* jshint esversion: 6 */
 import moment from 'moment';
/**
 * 手机验证
 */
export const validatePhone = phone => {
    return /^1[3|4|5|8][0-9]\d{8}$/.test(phone);
};

/**
 * 邮箱验证
 */
export const validateEmail = email => {
    return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email);
};

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
};

/**
 * 格式化时间
 */
export const formatData = time => {
	return moment(time).format('YYYY-MM-DD');
};


