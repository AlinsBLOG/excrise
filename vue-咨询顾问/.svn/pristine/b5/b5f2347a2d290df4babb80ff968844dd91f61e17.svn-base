<template>
  <div>
    <div class="HomeLogo">
      <Head-Top head-title='顾问登录' go-back='true'></Head-Top>
      <div class="logo">
        <i class="iconfont icon-logo"></i>
        <span class="tips">咨询在线平台</span>
      </div>
      <div class="inputContainer">
        <mt-field placeholder="手机号码" type="text" v-model="mobile"></mt-field>
        <!-- <mt-field label="密码" placeholder="密码" type="password" v-model="password"></mt-field> -->
        <mt-field placeholder="请输入验证码" v-model="checknum" disableClear>
          <mt-button size="small" type="primary" :disabled="ButtonDisabled" @click.native="handleClick">{{captchaText}}</mt-button>
        </mt-field>
        <router-link to="/register" class="register">立即注册</router-link>
        <mt-button type="primary" size="large" class="login-btn" @click.native="submit">下一步</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters  } from 'vuex'
import { validatePhone, setStore } from '../../../../config/mUtils'
import  { Toast } from "mint-ui"
import HeadTop from '@/components/header/head'
import HomeFooter from '@/pages/footer'
import { accountLogin, getcheckNum, mobileLogin } from '@/service/getData'
 
export default {
  name: "LoginByPhone",
  data () {
    return{
      mobile: '',
      password: '',
      checknum: '',
      captchaText: '获取验证码',
      ButtonDisabled: false,
      number: 5
    }
  },
  components: {
    HomeFooter,
    HeadTop
  },
  mounted: function () {

  },
  computed: {
    ...mapState([
        'userInfo','loading'
    ]),
  },
  methods:{
    ...mapMutations(['SET_USERINFO','SET_LOADING']),

    async handleClick (e) {
      const that = this
      if (!validatePhone(this.mobile)) {
        Toast('请输入正确的手机号码')
        return
      }
      that.ButtonDisabled = true
      that.SET_LOADING(true)
      await getcheckNum(this.mobile).then(res => {
        var sintv = setInterval(function(){
          let number = that.number
          if (number < 1) {
            that.ButtonDisabled = false
            that.number = 5
            that.captchaText = "获取验证码"
            clearInterval(sintv)
            return
          }
          that.number = number-1
          that.captchaText = '请稍后(' +number + ')s'
        },1000)
        that.SET_LOADING(false)
      })
    },

    async submit (e) {
      // Toast({
      //   message: '操作成功',
      //   position: 'middle',
      // });
      const that = this
      // if (!validatePhone(this.mobile)) {
      //   Toast('请输入正确的手机号码')
      //   return
      // }
      if (!this.checknum) {
        Toast('请输入收到的验证码')
        return
      }

      that.SET_LOADING(true)
      let res = await mobileLogin(this.mobile, this.checknum)
      if (res.success) {
        this.SET_USERINFO(res.data)
        setStore('userInfo', res.data)
        this.$router.push({
          path:'/loginSuccess'
        })
      } else {
        Toast(res.message)
      }
      that.SET_LOADING(false)
    },

    register () {
      
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin.scss';
  #head_top {
    background:none !important;
  }
  .HomeLogo {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: -webkit-linear-gradient(#5C66A8, #9DBEF9); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#5C66A8, #9DBEF9); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#5C66A8, #9DBEF9); /* Firefox 3.6 - 15 */
    background: linear-gradient(#5C66A8, #9DBEF9); /* 标准的语法 */
    .logo {
      margin-top: 3rem;
      text-align: center;
      line-height: 1;
      .icon-logo {
        font-size: 4rem;
        color: #fff;
      }
      .tips {
        display: block;
        color: #fff;
        font-size: .8rem;
        line-height: 2;
        font-weight: 600;
      }
    }
    .inputContainer {
      width: 90%;
      margin: .7rem auto 0;
      a {
        margin-bottom: .3rem;
        border-radius: 5px;
      }
      .login-btn {
        margin-top: .3rem;
      }
    }
  }
  .register {
    color: #fff;
    display: block;
    line-height: 1;
    font-size: .3rem;
    text-align: right;
  }
</style>

