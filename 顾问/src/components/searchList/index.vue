<template>
  <div class="module-adviser-list ceiling">
    <ul 
      class="adviser-area"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
      >
      <li class="adviser-item clearfix" v-for='(item,index) in list' :key='index'>
        <router-link :to="{path:'/adviser/info', query:{id:item.resumeId}}" class="register">
          <div class="head">
            <img :src="item.avatarImg">
          </div>
          <div class="info">
            <div class="name-area clearfix">
              <span class="name fl">{{item.name}}</span>
              <div class="area fl">
                <span>12年顾问经验</span>
                <span>人力资源</span>
              </div>
            </div>
            <div class="job">{{item.summary}}</div>
            <div class="label-area">
              <div class="sale">成交: <span>1270</span></div>
              <div class="comment">
                <span>服务评价: </span>
                <i class="iconfont icon-star"></i>
                <i class="iconfont icon-star"></i>
                <i class="iconfont icon-star"></i>
                <i class="iconfont icon-star"></i>
                <i class="iconfont icon-star"></i>
              </div>
            </div>
          </div>
          <div class="consult">
            <span class="phone" @click.stop.prevent="call"><i class="iconfont icon-phone"></i> 电话咨询</span>
            <span class="line"><i class="iconfont icon-message"></i> 在线咨询</span>
          </div>
        </router-link>
      </li>
    </ul>
    <span class="loadMore-class" v-if='!pageLoading'>加载完毕</span>
  </div>
</template>

<script>
  import { mapState,mapMutations,mapGetters  } from 'vuex'
  import { consultantSearch } from '@/service/getData'

  export default {
    name:"SearchList",
    data () {
      return {
        loading: false,
        list: [],
        pageNo: 1,
        pageSize: 10,
        pageLoading: true,
      }
    },
    props: ['value'],
    components: {
      
    },
    mounted (){

    },
    methods:{
      ...mapMutations(['SET_LOADING']),

      async loadMore() {
        if (this.pageLoading) {
          const that = this
          that.loading = true
          that.SET_LOADING(true)
          await consultantSearch({
            name: this.value,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
          }).then(res => {
            if (that.pageNo >= res.pageCount) {
              that.pageLoading = false
            }
            if (res.data && res.data.length) {
              that.list = this.list.concat(res.data)
            } else {
              that.pageLoading = false
            }
            this.pageNo = this.pageNo + 1
            this.loading = false
            that.SET_LOADING(false)
          })
        }
      },

      change () {
        this.pageNo = 1
        this.pageLoading = true
        this.list = []
        this.loadMore()
      },

      call () {
        window.location.href="tel://13527142146"
      }
    }
  }
</script>

<style lang="scss" scoped>
  .module-adviser-list.ceiling {
    width: 100%;
    height: calc(100% - 2rem);
    z-index:-1;
    .adviser-item {
      background: #fff;
      padding: .3rem 0;
      margin: .2rem 0;
      .head {
        float: left;
        width: 1.5rem;
        height: 1.5rem;
        margin: .15rem .2rem 0;
        border-radius: 100%;
        overflow: hidden;
        border: 1px solid #f1f1f1;
        img {
          width: 100%;
          height: 100%;
          vertical-align: baseline;
        }
      }
      .info {
        float: left;
        font-size: .43rem;
        width: 6rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        .name-area {
          .name {
            font-weight: 600;
            color: #333;
          }
          .area {
            font-size: .38rem;
            color: #b0b0b0;
            margin-left: .3rem;
            overflow: hidden;
            white-space: nowrap;
            line-height: 1.8;
            width: 4.3rem;
            span {
              font-size: .05rem;
              color: #fff;
              background-color: #6E9DEB;
              border-radius: 10px;
              padding: .03rem .15rem;
            }
          }
        }
        .job {
          color: #666;
          font-size: .3rem;
          margin: .05rem 0;
        }
        .label-area {
          color: #666;
          font-size: .3rem;
          margin-top: .1rem;
              line-height: 1;
          div {
            display: inline-block;
            line-height: 1;
          }
          .sale {
            padding-right: .3rem;
            margin-right: .3rem;
            border-right: 1px solid #b0b0b0;
            span {
              color: red;
            }
          }
          .comment {
            font-size: 0;
            span {
              font-size: .3rem
            }
            i {
              font-size: .37rem;
              color: orange;
            }
          }
        }
      }
      .consult {
        color: #fff;
        font-size: .25rem;
        float: right;
        width: 2.4rem;
        margin-right: .2rem;
        span {
          border-radius: 4px;
          padding: 0 .25rem;
          margin-top: .2rem;
          line-height: .67rem;
          display: inline-block;
          i {
            font-size: .2rem;
          }
        }
        .phone {
          background: #3370B5;
        }
        .line {
          background: #52AA49;
        }
      }
    }
  }
  .loadMore-class{
    display: block;
    font-size: .4rem;
    color: gray;
    line-height: 1rem;
    text-align: center;
  }
</style>

