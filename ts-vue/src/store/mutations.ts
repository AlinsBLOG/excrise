import {
	SET_USERINFO,
	SET_LOADING
} from './mutation-types'

export default {
	[SET_LOADING](state: object, booleon: boolean) {
		state.loading = booleon
	},

}
