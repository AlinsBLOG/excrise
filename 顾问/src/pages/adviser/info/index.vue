<template>
  <div class="box">
    <Head-Top head-title='顾问详情' go-back='true'></Head-Top>
    <div class="collect" @click.stop.prevent="collection = !collection">
      <i class="iconfont icon-more-line"></i>
      <div class="collect-box" v-if="!collection">
        <i class="jiantou"></i>
        <div :class="{ 'content': true, 'content-collect': (info.state == 2)}">
          <span class="line" @click.stop.prevent="collectAction">
            <i :class="{ 'iconfont': true, 'icon-collection': (info.state == 2),'icon-no-collection': (info.state == 1)}"></i> 
            {{info.state == 2 ? '已收藏' : '收藏'}}
          </span>
          <span>服务评价</span>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="head">
        <div class="img">
          <img :src="info.avatarImg ? info.avatarImg : defaultAvatarImg">
        </div>
        <span class="name">辛育林</span>
        <span class="introduction">做一个有良心的顾问，为企业解决各种问题</span>
        <div class="comment">
          成交：<span class="number">1270</span>
          服务评价：
          <i class="iconfont icon-star"></i>
          <i class="iconfont icon-star"></i>
          <i class="iconfont icon-star"></i>
        </div>
      </div>
      <div class="consult">
        <span class="phone" @click="call">电话咨询</span>
        <span class="line">在线咨询</span>
      </div>
      <div class="dataInfo">
        <div class="commonInfo">基本信息</div>
        <mt-cell title="专业年限" value="12年顾问经验"></mt-cell>
        <mt-cell title="专业领域" value="人力资源"></mt-cell>
        <mt-cell title="个人资质" value="PMP"></mt-cell>
        <mt-cell title="所在地区" value="广东-广州"></mt-cell>
      </div>

      <div class="dataInfo">
        <div class="commonInfo">个人资质</div>
        <mt-cell title="所在12年顾所在PMP地区问经验地区"></mt-cell>
      </div>

      <div class="addCase dataInfo" @click="$router.push({path:'/caseList'});">
        +请添加案例
      </div>

      <div class="dataInfo caseList">
        <div class="commonInfo">经典案例 <span class="more" @click="moreCase">更多 ></span></div>
        <ul class="case">
          <li>
            <router-link to='/caseDetail'>如何管理企业员工如何管理企业员工</router-link>
          </li>
          <li>
            <router-link to='/caseDetail'>如何管理企业员工如何管理企业员工</router-link>
          </li>
          <li>
            <router-link to='/caseDetail'>如何管理企业员工如何管理企业员工</router-link>
          </li>
          <li>
            <router-link to='/caseDetail'>如何管理企业员工如何管理企业员工</router-link>
          </li>
        </ul>
      </div>

    </div>
</div>
    
</template>

<script>
  import { mapState,mapMutations,mapGetters  } from 'vuex'
  import HeadTop from '@/components/header/head'
  import { consultantInfo, consultantTel } from '@/service/getData'
  export default {
    name:"AdviserInfo",
    data(){
      return{
        id: '',
        collection: true,
        info: {
          avatarImg:'',
          state: 1
        }
      }
    },
    components:{
      HeadTop
    },
    computed: {
      ...mapState(['defaultAvatarImg'])
    },
    mounted:function(){
      let id =this.$route.query.id
      this.id = id
      this.getInfo(id)
    },
    methods:{
      async getInfo (id) {
        const that = this
        return
        await consultantInfo(id).then(res => {
          that.info = res.data
          console.log(res)
        })
      },
      async call () {
        window.location.href="tel://13527142146"
        return
        // 拨打电话
        await consultantTel().then(res => {
          console.log(res)
        })
      },
      collectAction () {
        this.info.state = 2
      },
      moreCase () {
        this.$router.push({
          path:'/caseList'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #head_top {
    background-color: #6774B7 !important;
  }
  .collect {
      display: inline-block;
      position: fixed;
      top: .13rem;
      right: .3rem;
      z-index: 999;
      font-size: .6rem;
    .icon-more-line {
      color: #fff;
      font-size: .6rem;
    }
    .collect-box {
      position: absolute;
      font-size: .3rem;
      background: #fff;
      right: -0.23rem;
      top: 1rem;
      width: 2rem;
      border-radius: 3px;
      .jiantou {
        position: absolute;
        width: 0;
        height: 0;
        border: .15rem solid transparent;
        top: -0.3rem;
        right: .4rem;
        border-bottom-color: #fff;
        z-index: 9999;
      }
      .content {
        color: #8D8E8E;
        text-align: center;
        padding: 0 .15rem;
        .line {
          border-bottom: 1px solid #8D8E8E;
        }
        span {
          display: block;
          line-height: 2;
          i {
            font-size: .2rem;
          }
        }
      }
      .content-collect {
        .line {
          color:lightgray;
          i {
            color: orange;
          }
        }
      }
    }
  }
  .info {
    font-size: .47rem;
    line-height: 1;
    .head {
      text-align: center;
      background: -webkit-linear-gradient(#6774B7,#A7C5FA);
      background: linear-gradient(#6774B7,#A7C5FA);
      color: #fff;
      padding-top: .2rem;
      .img {
        width: 2rem;
        height: 2rem;
        margin: 0 auto;
        border-radius:50%; 
        img{
          width: 100%;
          height: 100%;
        }
      }
      .name {
        display: inline-block;
        width: 100%;
        margin: .4rem auto .2rem;
      }
      .introduction {
        display: inline-block;
        width: 100%;
        font-size: .38rem;
        margin-bottom: .25rem;
      }
      .comment {
        font-size: .35rem;
        padding-bottom: .4rem;
        .number {
          color: red;
          display: inline-block;
          border-right: 1px solid #fff;
          padding-right: .3rem;
          margin-right: .3rem;
        }
        i {
          color: orange;
        }
      }
    }
    .consult {
        text-align: center;
        color: #fff;
        font-size: .3rem;
        margin-right: .2rem;
        span {
          width: 46%;
          border-radius: 4px;
          padding: 0 .25rem;
          margin: .2rem 0;
          line-height: .80rem;
          display: inline-block;
        }
        .phone {
          background: #3370B5;
        }
        .line {
          background: #52AA49;
        }
    }
    .dataInfo {
      margin-bottom: .2rem;
      .commonInfo {
        background: #fff;
        color: #246BB4;
        line-height: 1rem;
        padding: 0 10px;
        font-size: .45rem;
        .more {
          float: right;
          font-size: .3rem;
        }
      }
      /deep/ .mint-cell {
        min-height: 1.3rem;
      }
      /deep/ .mint-cell-text {
        font-size: .45rem;
      }
      /deep/ .mint-cell-value {
        font-size: .45rem;
      }
    }
    .addCase {
      color: #888;
      font-size: .4rem;
      text-align: center;
      background: #fff;
      padding: .4rem;
    }
    .caseList {
      .case {
        background: #fff;
        color: #246BB4;
        font-size: .43rem;
        padding: 0 33px 15px;
        margin-bottom: 1rem;
        margin-top: 1px;
        padding-top: 10px;
        li {
          line-height: 1.6;
          list-style-type: disc;
          a {
            color: #246BB4;
          }
        }
      }
    }
  }
</style>

