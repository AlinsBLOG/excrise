<template>
  <div>
    <div class="HomeLogo">
      <Head-Top head-title='填写资料' go-back='true'></Head-Top>
      <div class="chooseContainer">
          <div class="box boxqy">
              <span class="title">我是企业</span>
              <span class="value" @click="breakout('qy')">发起项目咨询</span>
          </div>
          <div class="box boxgw">
              <span class="title">我是顾问</span>
              <span class="value" @click="breakout('gw')">填写顾问资料</span>
          </div>
      </div>
      <span class="break" @click="breakout('breakout')">直接跳过 ></span>
    </div>
  </div>
</template>

<script>
    import { mapState, mapMutations, mapGetters  } from 'vuex'
    import HeadTop from '@/components/header/head'
    
    export default {
        name: "LoginSuccess",
        data () {
            return{

            }
        },
        components: {
            HeadTop
        },
        mounted: function () {

        },
        computed: {

        },
        methods:{
            breakout (name) {
                let path = '/';
                switch (name) {
                    case 'breakout':
                        break;
                    case 'qy':
                        break;
                    case 'gw':
                        path = '/applyAdviser';
                        break;
                    default:
                        break;
                }
                this.$router.push({path:path});
            }
        }
    }
</script>

<style lang="scss" scoped>
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
    .chooseContainer {
        width: 90%;
        margin: 5.7rem auto 0;
        .box {
            padding: .4rem;
            border-radius: 6px;
            color: #fff;
            span {
                display: block;
                text-align: center;
                font-size: .4rem;
                line-height: 1;
            }
            .value {
                font-size: .45rem;
                margin-top: .2rem;
            }
        }
        .boxqy {
            background: #3370B5;
        }
        .boxgw {
            border: 1px solid #fff;
            margin-top: .5rem;
        }
    }
    .break {
        position: absolute;
        bottom: 1rem;
        color: #3370B5;
        left: 50%;
        transform: translateX(-50%);
        font-size: .4rem;
    }
  }
</style>

