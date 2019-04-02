 /* jshint esversion: 6 */ 
import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';
import getters from './getters';

Vue.use(Vuex);

const state = {
	loading: false,
	userInfo: null, //用户信息
	state: null,
	defaultAvatarImg: 'https://img.zcool.cn/community/01786557e4a6fa0000018c1bf080ca.png@1280w_1l_2o_100sh.webp',
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
});