<template>
  <div class="Home">
    <Head-Top head-title='评价详情' go-back='true'></Head-Top>
    <div class="assess-box">
        <div class="label">
            <div class="row">
                雇主印象：
            </div>
            <div class="item">
                <span>12年顾经验</span>
                <span>沟通愉快</span>
                <span>服务态度好</span>
                <span>提案例</span>
                <span>培训很有方法</span>
                <span>业务熟练</span>
            </div>
        </div>
    </div>
    <mt-navbar v-model="selected" class='projectTabNav'>
      <mt-tab-item v-for='(item, index) in tabContainer' :id="index+1+''" :key='index'>
        {{item.name}}
      </mt-tab-item>
    </mt-navbar>
    <ul 
      class="list"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10">
      <li 
        v-for="(item, index) in list" 
        :key="index"
        class="list-item">
        <div class="left">
          <div class="title">
              <span>
                <img src="https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=4011437084,3327321107&fm=85&s=F9978B5457C356F69204E854030050EB" alt="">
              </span>
              <p class="name">Alice</p>
              <div class="assess">
                  <p>好评</p> 
                  <i class="iconfont icon-star"></i>
                  <i class="iconfont icon-star"></i>
                  <i class="iconfont icon-star"></i>
                  <i class="iconfont icon-star"></i>
              </div>
          </div>
          <div class="company">
            广州光大资源优先公司广州光大资源优先公司
          </div>
          <div class="number">
            2018.7.27
          </div>
        </div>
      </li>
    </ul>

    <span class="load-finsh" v-if='!loadingMore'>加载完成</span>
    <Home-Footer></Home-Footer>
  </div>
</template>
<script>
  import { mapState,mapMutations,mapGetters  } from 'vuex'
  import HeadTop from '@/components/header/head'
  import HomeFooter from '@/pages/footer'
  import { MessageBox, Toast } from "mint-ui"
  import { projectList } from '@/service/getData'

  export default {
    name:"AssessDetail",
    data(){
      return{
        tabContainer: [{
          name: '好评',
        },{
          name: '中评',
        },{
          name: '差评',
        }],
        loading: false,
        loadingMore: true,
        list: [],
        selected: '1',
        params: {
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    components:{
      HomeFooter,
      HeadTop,
    },
    mounted:function(){

    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    methods:{
      ...mapMutations(['SET_LOADING']),

      async loadMore () {
        const that = this
        if (this.loadingMore) {
          that.SET_LOADING(true)
          that.loading = true
          await projectList(this.params).then(res => {
            if (that.params.pageNo >= res.pageCount) {
              that.loadingMore = false
              that.loading = true
            } else {
              that.loading = false
            }
            if (res.data && res.data.length) {
              that.list = that.list.concat(res.data)
            }
            that.params.pageNo = that.params.pageNo + 1
            that.SET_LOADING(false)
          }).catch(err => {
            that.loadingMore = false
          })
        }
      },

      checkUserInfo () {
        if (!this.userInfo) {
          MessageBox.confirm('请先登录再申请项目').then(action => {
            if (action == 'confirm') {
              this.$router.push({
                path:'/login'
              })
            }
          })
          return false
        }
        return true
      }

    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../styles/mixin.stylus';
  .Home {
    .project-state {
      background-color: #fff;
      margin: 7px 0;
      vertical-align: middle;
      display: flex;
      padding: .3rem 0;
      justify-content: space-around;
      span {
        display: inline-block;
        padding: .2rem;
        font-size: .4rem;
      }
    }
    .projectTabNav {
      >>> .mint-tab-item {
        padding: 14px 0 10px;
      }
      >>> .mint-tab-item:not(:last-child) .mint-tab-item-label{
        border-right: 1px solid #EEECEE;
      }
      >>> .mint-tab-item-label {
          line-height 1.7;
      }
      >>> .mint-tab-item.is-selected {
        color: $cglobal;;
        border-bottom-color: $cglobal;
      }
      >>> .mint-tab-item-icon {
        margin: 0 auto;
      }
    }
    .list {
      margin-top: .2rem;
      padding: 0 .4rem;
      background: #fff;
      .list-item {
        font-size: .3rem;
        color: #868587;
        border-bottom: 1px solid #EEEEEF;
        padding: .1rem 0;
        line-height: 1;
        .left {
          .title {
            font-size: .4rem;
            color: #000;
            display: block;
            line-height: 1.6;
            vertical-align: middle;
            span {
                display: inline-block;
                vertical-align: middle;
                width: .8rem;
                height .8rem;
                border-radius: 50%;
                overflow: hidden;
                img {
                    width: 100%;
                    height 100%;
                }
            }
            .name {
                display: inline-block;
                line-height: 1;
                vertical-align: middle;
                margin-left: .1rem;
            }
            .assess {
                float: right;
                color: orange;
                line-height: 1;
                font-size: 0;
                vertical-align: middle;
                p {
                    display: inline-block;
                    font-size: .2rem;
                    margin-right: .1rem;
                }
                i {
                    font-size: .3rem;
                }
            }
          }
          div {
            display: block;
            line-height: 1.65;
          }
          .number {
            color: #ADADAF;
            text-align: right;
            line-height: 1;
          }
        }
        .span {
          color: #fff;
          min-width: 1.8rem;
          text-align: center;
          padding: 0.17rem 0;
          border-radius: 5px;
        }
      }
    }
  }
  .load-finsh {
    margin-bottom: 1.3rem;
    display: block;
    font-size: .4rem;
    color: gray;
    line-height: .6rem;
    text-align: center;
  }
  .assess-box {
        padding: 0 .3rem;
        background: #fff;
        font-size: .3rem;
        margin: .18rem 0;
        .label {
            border-bottom: 1px solid #EEECEE;
            padding: .2rem 0;
            .row {
                border-bottom: 1px solid #EEECEE;
            }
            .item {
                padding: .2rem 0 0;
                span {
                    display: inline-block;
                    border: 1px solid #3470b5;
                    line-height: 1;
                    padding: .05rem .15rem;
                    border-radius: .2rem;
                    color: #3470b5;
                    font-size: .1rem;
                    transform: scale(.9);
                    margin-bottom: .1rem;
                }
            }
        }
    }
</style>

