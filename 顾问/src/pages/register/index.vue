<template>
  <div class="Home">
    <Head-Top head-title='注册' go-back='true'></Head-Top>
    <div class="login">
      <mt-field label="手机号码" placeholder="手机号码" type="text" v-model="mobile"></mt-field>
      <mt-field label="密码" placeholder="密码" type="password" v-model="password"></mt-field>
      <mt-field label="确认密码" placeholder="确认密码" type="password" v-model="confirmPassword"></mt-field>
      <mt-field label="验证码" placeholder="请输入" v-model="checknum" disableClear>
        <mt-button size="small" type="primary" :disabled="ButtonDisabled" @click.native="handleClick">{{captchaText}}</mt-button>
      </mt-field>
      <mt-button type="primary" size="large" class="login-btn" @click.native="submit">注册</mt-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters  } from 'vuex'
// import { validatePhone, validateEmail  } from '../../../config/mUtils'
import  { Toast } from "mint-ui"
import HeadTop from '@/components/header/head'
import HomeFooter from '@/pages/footer'
import { isAccountExists, registerGetcheckNum, registerWithMNC } from '@/service/getData'

export default {
  name: "Register",
  data () {
    return{
      mobile: '',
      password: '',
      confirmPassword: '',
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
  methods:{
    async handleClick (e) {
      const that = this

      // if (!validatePhone(this.mobile)) {
      //   Toast('请输入正确的手机号码')
      //   return
      // }

      that.ButtonDisabled = true
      let res = await isAccountExists(this.mobile)
      if (res.success) {
        await registerGetcheckNum(this.mobile)
      } else {
        Toast(res.message)
        that.ButtonDisabled = false
      }

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
        that.captchaText = number + ' s'
      },1000)
    },

    async submit (e) {
      // if (!validatePhone(this.mobile)) {
      //   Toast('请输入正确的手机号码')
      //   return
      // }
      if (!this.checknum) {
        Toast('请输入收到的验证码')
        return
      }
      if (this.confirmPassword !== this.password) {
        Toast('两次密码输入不一致')
        return
      }

      let regRes = await registerWithMNC({
        mobile: this.mobile,
        password: this.password,
        checknum: this.checknum,
      }).then( response => {
        if (response.success) {
          Toast('注册成功')
          this.$router.go(-1)
        } else {
          Toast(response.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    margin-top: .1rem;
    .login-btn {
      width: 95%;
      margin: .5rem auto 0;
    }
  }
</style>

