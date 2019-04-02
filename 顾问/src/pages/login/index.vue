<template>
  <div class="Home">
    <div class="logo">
      <i class="iconfont icon-logo"></i>
      <span class="tips">咨询在线平台</span>
    </div>
    <div class="login">
      <div class="wechat" @click="login('wechat')">
        <i class="iconfont icon-wechat"></i>
        微信用户快速登录　
      </div>
      <div class="phone" @click="login('phone')">
        输入手机号码登录/注册
      </div>
    </div>
    <div class="wechat-modal" v-if='wechatLogin'>
      <span class="sq">微信手机号授权</span>
      <div class="modal-logo">
        <i class="iconfont icon-logo"></i>
        <span class="tips">咨询在线平台</span>
      </div>
      <div class="applytips">
        <span>申请获取你微信绑定的手机号码:</span>
        <span class="phone">159****4948</span>
      </div>
      <div class="btn">
        <span class="certain">确认授权</span>
        <span class="cancel" @click="wechatLogin = false">取消</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters  } from 'vuex'
import  { Toast } from "mint-ui"
import HeadTop from '@/components/header/head'
// import { accountLogin, getcheckNum, mobileLogin } from '@/service/getData'
 
export default {
  name: "Adviser",
  data () {
    return{
      wechatLogin: false
    }
  },
  components: {
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
    login (value) {
      if(value == 'wechat') {
        this.wechatLogin = true
      } else {
        this.$router.push({
          path: '/loginByPhone'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';
  .Home {
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
    .login {
      width: 90%;
      color: #fff;
      margin: 2.5rem auto 0;
      font-size: .45rem;
      text-align: center;
      .wechat {
        background: #5BB252;
        border-radius: 5px;
        margin-bottom: .35rem;
        line-height: 1.3rem;
        height: 1.3rem;
        i {
          vertical-align: middle;
          font-size: .8rem;
        }
      }
      .phone {
        border-radius: 5px;
        border:1px solid #BBE0FE;
        line-height: 1.3rem;
        height: 1.3rem;
      }
    }
    .wechat-modal {
      position: fixed;
      width: 80%;
      left: 10%;
      top: 15%;
      background: #FEFEFF;
      border-radius: 5px;
      z-index: 99;
      .sq {
        display: block;
        text-align: center;
        font-size: .6rem;
        font-weight: 600; 
        margin: .5rem auto 0;
      }
      .modal-logo {
        color: #4992E1;
        text-align: center;
        width: 90%;
        margin: 0 auto .7rem;
        padding-bottom: 1rem;
        border-bottom:1px solid #E5E5E7;
        i {
          color: #4992E1;
          font-size: 2rem;
        }
        .tips {
          display: block;
          line-height: 1;
          font-size: .6rem;
          font-weight: 600; 
        }
      }
      .applytips {
        font-size: .4rem;
        text-align: center;
        color: #949395;
        span {
          display: block;
        }
        .phone {
          color: #000;
          font-size: .5rem;
        }
      }
      .btn {
        span {
          display: block;
          width: 80%;
          margin: .3rem auto 0;
          font-size: .5rem;
          text-align: center;
          line-height: 2.3;
        }
        .certain {
          color: #fff;
          background: #5BB252;
          border-radius: 4px;
        }
        .cancel {
          color: #1D83E0;
          border: 1px solid #1D83E0;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
      }
    }
  }
</style>

