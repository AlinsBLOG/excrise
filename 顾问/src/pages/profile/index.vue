<template>
  <div class="Home">
    <Head-Top head-title='我的'></Head-Top>
    <section class="profile-number">
      <router-link :to="userInfo&&userInfo.id? '/profile/info' : '/login'" class="profile-link">
          <img :src="userInfo.avatarImg" class="privateImage" v-if="userInfo&&userInfo.id">
          <span class="privateImage" v-else>
              <svg class="privateImage-svg">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#avatar-default"></use>
              </svg>
          </span>
          <div class="user-info">
              <p v-if='userInfo && userInfo.id'>
                <span class="icon-mobile-number">{{userInfo && userInfo.mobile}}</span>
              </p>
              <p v-else>
                <span class="icon-mobile-number">登录</span>
              </p>
          </div>
          <span class="arrow">
              <svg class="arrow-svg" fill="#fff">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
          </span>
      </router-link>
    </section>
    <section class="profile-1reTe">
      <!-- 申请成为顾问 -->
      <div class="myorder" @click='applyforAdviser'>
          <aside>
              <svg fill="#4aa5f0">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order"></use>
              </svg>
          </aside>
          <div class="myorder-div">
              <span>顾问申请</span>
              <span class="myorder-divsvg">
                  <svg fill="#bbb">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                  </svg>
              </span>
          </div>
      </div>
    </section>
    <section v-if="userInfo && userInfo.id">
      <mt-button size="large" class="login-btn" @click.native="loginout">退出</mt-button>
    </section>
    <Home-Footer></Home-Footer>
</div>
    
</template>

<script>
  import { mapState,mapMutations,mapGetters  } from 'vuex'
  import { MessageBox } from 'mint-ui';
  import { getStore, removeStore } from '../../../config/mUtils'
  import HeadTop from '@/components/header/head'
  import HomeFooter from '@/pages/footer'

  export default {
    name:"Profile",
    data(){
      return{

      }
    },
    components:{
      HomeFooter,
      HeadTop
    },
    mounted:function(){
      this.initData()
    },
    computed:{
      ...mapState([
          'userInfo',
      ])
    },
    methods:{
      ...mapMutations(['SET_USERINFO']),
      initData () {
        if (!this.userInfo) {
          let info = JSON.parse(getStore('userInfo'))
          if (info && info.id) {
            this.SET_USERINFO(info)
          }
        }
      },
      loginout () {
        MessageBox({
          title: '提示',
          message: '确定退出?'
        }).then( action => {
          if (action === 'confirm') {
            removeStore('userInfo')
            this.SET_USERINFO(null)
          }
        })
      },
      applyforAdviser () {
        if (!this.userInfo) {
          MessageBox({
            title: '提示',
            message: '申请顾问需要先进行登录操作'
          }).then( action => {
            if (action === 'confirm') {
              this.$router.push({ path:'/login' })
            }
          })
        } else {
          this.$router.push({ path:'/applyAdviser' })
        }
      }
    },
    watch: {
        userInfo: function (){
            this.initData()
        }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .profile-number{
        .profile-link{
            display:block;
            display:flex;
            text-align: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            background:$cglobal;
            padding: .366667rem .4rem;
            .privateImage{
                display:inline-block;
                @include wh(1.6rem,1.6rem);
                border-radius:50%;
                vertical-align:middle;
                .privateImage-svg{
                    background:$fc;
                    border-radius:50%;
                    @include wh(1.6rem,1.6rem);
                }
            }
            .user-info{
                margin-left:.38rem;
                -webkit-box-flex: 1;
                -ms-flex-positive: 1;
                flex-grow: 1;
                p{
                    @include sc(.45rem,$fc);
                    text-align: left;
                    .user-icon{
                        @include wh(0.5rem,0.75rem);
                        display:inline-block;
                        vertical-align:middle;
                        line-height:0.55rem;
                        .icon-mobile{
                            @include wh(100%,100%);
                        }
                    }
                    .icon-mobile-number{
                        display:inline-block;
                        @include sc(.47333rem,$fc);

                    }
                }

            }
            .arrow{
                @include wh(.3rem,.68rem);
                line-height: 0.68rem;
                display:inline-block;
                svg{
                   @include wh(100%,100%);
                }
            }
        }
   }
    .profile-1reTe{
        margin-top:.2rem;
        background:$fc;
        .myorder{
            padding-left:1.2rem;
            display:flex;
            align-items: center;
            aside{
                @include wh(.5rem,.5rem);
                margin-left:-.866667rem;
                margin-right:.266667rem;
                display:flex;
                align-items: center;
                svg{
                    @include wh(100%,100%);
                }
            }
            .myorder-div{
                width:100%;
                border-bottom:1px solid #f1f1f1;
                padding:.433333rem .266667rem .433333rem 0;
                @include sc(.42rem,#333);
                display:flex;
                justify-content:space-between;
                span{
                    display:block;
                }
                .myorder-divsvg{
                    @include wh(.26667rem,.266667rem);
                    svg{
                        @include wh(100%,100%);
                    }
                }
            }
        }
        .myorder:nth-of-type(3) .myorder-div{
            border:0;
        }
    }
    .login-btn {
      width: 95%;
      margin: .2rem auto 0;
    }
</style>

