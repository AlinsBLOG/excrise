 /* jshint esversion: 6 */ 
import Vue from 'vue';
import router from './router';
import Vuex from 'vuex';
import store from './store';
// import Navigation from 'vue-navigation' 
// Vue.use(Navigation, {router, store})

//引入UI组件
import {
	Cell,
	Field,		//input 输入框
	Button, 	//按钮
	Spinner,	//加载动画
	Swipe,		//轮播组件
	SwipeItem,	//轮播组件 item
	Badge,		//微章
	Navbar,
	TabItem,
	TabContainer,
	TabContainerItem,
	DatetimePicker,
	InfiniteScroll,
	Actionsheet,
	Picker
} from 'mint-ui';

import 'mint-ui/lib/style.css';


import {
	TransferDom,
	XInput,
	Group,
	Search,
	PopupPicker,
	XAddress,
} from 'vux';


Vue.component(Cell.name, Cell);
Vue.component(Field.name, Field);
Vue.component(Button.name, Button);
Vue.component(Spinner.name, Spinner);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Badge.name, Badge);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.use(InfiniteScroll);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Picker.name, Picker);

Vue.directive('transfer-dom', TransferDom);
Vue.component('x-input', XInput);
Vue.component('group', Group);
Vue.component('search', Search);
Vue.component('popup-picker', PopupPicker);
Vue.component('x-address', XAddress);



/* eslint-disable no-new */
new Vue({
  router,
  store,
}).$mount('#app');

const FastClick = require('fastclick');
FastClick.attach(document.body);