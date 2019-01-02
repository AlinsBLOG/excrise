<template>
  <div class="Home">
    <Head-Top head-title='项目'></Head-Top>
    <div class="search-div">
      <!-- <mt-field placeholder="搜索项目" class="input" @change='change' v-model='params.titleLike'></mt-field> -->
      <search 
        placeholder='请输入搜素项目'
        :auto-fixed='false'
        @on-submit='change'
        @on-cancel='cancel'
        @on-clear='cancel'
        v-model='params.titleLike'></search>
    </div>
    <router-link to="/project/sponsor" class='applyProject'>发起项目</router-link>
    <mt-navbar v-model="selected" class='projectTabNav'>
      <mt-tab-item v-for='(item, index) in tabContainer' :id="index+1+''" :key='index'>
        {{item.name}}
        <i :class="item.icon" slot='icon'></i>
      </mt-tab-item>
    </mt-navbar>
    <!-- 项目状态 -->
    <!-- <div class="project-state">
      <span>项目状态</span>
      <div class="btn">
        <div @click="toApply('message')">申请项目审核信息</div>
        <div @click="toApply('user')">用户申请项目审核</div>
      </div>
    </div> -->
    <ul 
      class="list"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10">
      <li 
        v-for="(item, index) in list" 
        :key="index"
        @click="moreInfo(item.id)"
        class="list-item">
        <div class="left">
          <span class="title">《广州市天河区光大企业集团喜讯项目》</span>
          <div class="company line">
            <span class="company-name">广州光大资源优先公司</span><span>人力资源</span>
          </div>
          <div class="time">
            <span>起始时间：</span>2018.01.09 - 2018.02.20
          </div>
          <div class="number line">
            <span>已有16人参与</span>还剩2个月
          </div>
        </div>
        <span
          @click.stop.prevent="stateClick(item)"
          :class="['span',stateAction.className[item.state]]">{{stateAction.value[item.state]}}</span>
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
    name:"ProjectInfo",
    data(){
      return{
        tabContainer: [{
          name: '全部',
          icon: 'iconfont icon-all'
        },{
          name: '申请',
          icon: 'iconfont icon-hand'
        },{
          name: '进行中',
          icon: 'iconfont icon-circle-up'
        },{
          name: '已完成',
          icon: 'iconfont icon-circle-check'
        }],
        stateAction: {
          className: {
            1: 'state1',
            2: 'state2',
            3: 'state3',
          },
          value: {
            1: '申请',
            2: '反馈状态',
            3: '确认完成',
          }
        },
        loading: false,
        loadingMore: true,
        list: [],
        selected: '1',
        isLink: true,
        isApply: false,
        isCertain: false,
        params: {
          pageNo: 1,
          pageSize: 10,
          titleLike: ''
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

      stateClick (item) {
        console.log(item,item.state)
        Toast(this.stateAction.value[item.state])
      },

      moreInfo (id) {
        this.$router.push({
          path: `/project/info/${id}`
        })
      },

      apply (id) {
        this.$router.push({
          path: `/project/info/${id}`,
          query: {
            apply: true
          }
        })
      },

      change () {
        this.list = []
        this.loading = false
        this.loadingMore = true
        this.params.pageNo = 1
        this.loadMore()
      },

      cancel () {
        this.params.titleLike = ''
        this.change()
      },

      toApply (value) {
        if (this.checkUserInfo) {
          let path = '/project/applyMessage'
          if(value === 'user'){
            path = '/project/userApply'
          }
          this.$router.push({
            path:path
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

    },
    watch: {
      selected (value) {
        (value == 1 || value == 4 || value == 5) ? this.isLink = true : this.isLink = false
        value == 2 ? this.isApply = true : this.isApply = false
        value == 3 ? this.isCertain = true : this.isCertain = false
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../styles/mixin.stylus';
  .vux-search-box {
    font-size: 16px;
  }
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
      .btn {
        font-size: .5rem;
        div {
          background-color: $cglobal;
          display: inline-block;
          font-size: .4rem;
          color: #fff;
          padding: .15rem .3rem;
          border-radius: .1rem;
        }
      }
    }
    .projectTabNav {
      i {
        font-size: .6rem;
      }
      >>> .mint-tab-item-icon {
        width: auto;
        height: auto;
      }
      >>> .mint-tab-item {
        padding: 0 0 5px;
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
        display:flex;
        justify-content:space-between;
        align-items:center;
        border-bottom: 1px solid #EEEEEF;
        padding: .1rem 0;
        line-height: 1;
        .left {
          .title {
            font-size: .4rem;
            color: #000;
            display: block;
            line-height: 1.6;
          }
          div {
            display: block;
            line-height: 1.65;
          }
          .line {
            span{
              position: relative;
              margin-right: .25rem;
              padding-right: .25rem;
              &:before {
                right: 0;
                top: .05rem;
                content: '';
                position: absolute;
                display: inline-block;
                border-right: 1px solid #eeeeef;
                height: 0.3rem;
              }
            }
          }
          .number {
            color: #ADADAF;
          }
          .time {
            span {
              color: #306EB3;
            }
          }
        }
        .span {
          color: #fff;
          min-width: 1.8rem;
          text-align: center;
          padding: 0.17rem 0;
          border-radius: 5px;
        }
        .state1 {
          color: red;
          border: 1px solid red;
        }
        .state2 {
          background: #3470b5;
        }
        .state3 {
          background: green;
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
  .applyProject {
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    padding: .3rem;
    border-radius: 50%;
    text-align: center;
    background-color: #3470b5;
    font-size: 0.45rem;
    color: #fff;
    line-height: 1.3;
    position fixed;
    bottom: 2rem;
    right: .5rem;
    z-index:99;
  }
</style>

