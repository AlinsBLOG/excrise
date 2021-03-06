 /* jshint esversion: 6 */ 
import {
	SET_USERINFO,
	SET_LOADING
} from './mutation-types.js';
import { 
	setStore, 
	getStore 
} from '../../config/mUtils';

export default {
	//获取用户信息
	[SET_USERINFO](state, userinfo) {
		state.userInfo = userinfo;
	},

	//是否加载
	[SET_LOADING](state, booleon) {
		state.loading = booleon;
	},

}
