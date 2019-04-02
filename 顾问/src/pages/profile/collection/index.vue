<template>
  <div>
    <Head-Top head-title="我的关注" go-back='true'></Head-Top>
    <ul  class="adviser-area">
      <li class="adviser-item clearfix" v-for='(item,index) in list' :key='index'>
        <router-link :to="{path:'/adviser/info', query:{id:item.resumeId}}" class="register">
          <div class="head">
            <img :src="item.avatarImg">
          </div>
          <div class="info">
            <div class="name-area clearfix">
              <span class="name fl">{{item.name}}</span>
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
            <span class="phone">已收藏</span>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapGetters  } from 'vuex'
  import HeadTop from '@/components/header/head'
  // import {  } from '@/service/getData'

  export default {
    name: "Collection",
    data () {
      return{
        list:[{
          name: '爸爸',
          resumeId: 1,
          summary: '家是世界上最好的避风港'
        },{
          name: 'Khunttt',
          resumeId: 1,
          summary: '如果天空是黑暗的，那就摸黑生存'
        }]
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
      ...mapMutations(['SET_LOADING']),

    }
  }
</script>

<style lang="scss" scoped>
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
            transform: scale(0.5);
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
      margin-right: .2rem;
      margin-top: .5rem;
      span {
        border-radius: 4px;
        padding: 0 .25rem;
        line-height: .67rem;
        display: inline-block;
        i {
          font-size: .2rem;
        }
      }
      .phone {
        background: #949496;
      }
    }
  }
</style>

