<template>
  <div>
    <Head-Top head-title='项目申请列表' go-back='true'></Head-Top>
    <ul
      class='applyMessage'
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10">
      <li v-for="(item,index) in list" :key='index' class="applyMessageLi">
        <div class="applyMessageLiLeft">
          <div class="top">
            <span class="name">{{item.projectName}}</span>
          </div>
          <div class="bottom clearfix">
            <div class="img">
              <img :src="item.userImg ? item.userImg : defaultAvatarImg">
            </div>
            <div class="introduction">
              <p><span>姓名：</span>{{item.userName}}</p>
              <p><span>专业年限：</span>12年顾问经验</p>
              <p>{{item.applyTime ? item.applyTime.substring(0,10) : ''}}</p>
            </div>
          </div>
        </div>
        <div class="applyMessageLiRight">
          <span class="agree" @click="deal(item,1)">同意</span>
          <span class="reject" @click="deal(item,2)">拒绝</span>
        </div>
      </li>
    </ul>
    <span class="load-finsh" v-if='!loadingMore'>加载完成</span>
  </div>
</template>

<script>
  import { mapState, mapMutations  } from 'vuex'
  import  { MessageBox, Toast } from "mint-ui"
  import HeadTop from '@/components/header/head'
  import { applyList, applyHandleApply } from '@/service/getData'

  export default {
    name: "ApplyMessage",
    data () {
      return{
        loading: false,
        loadingMore: true,
        list: [{
          applyId:1,
          applyTime:"2018-07-20T05:34:11.000+0000",
          applyUser:2,
          projectId:1,
          projectName:"1",
          reason:null,
          state:0,
          userImg:null,
          userName:null
        }],
        params: {
          pageNo: 1,
          pageSize: 10,
        }
      }
    },
    components: {
      HeadTop
    },
    mounted: function () {

    },
    computed: {
      ...mapState([
        'userInfo','defaultAvatarImg'
      ])
    },
    methods:{
      ...mapMutations(['SET_LOADING']),

      async loadMore () {
        const that = this
        if (that.loadingMore) {
          that.SET_LOADING(true)
          that.loading = true
          await applyList({
            ...this.params,
            applyUser: that.userInfo.id
          }).then(res => {
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

      deal (item,state) {
        let title = '';
        const that = this;
        id == 1 ? (title = '同意') : (title = '拒绝');
        MessageBox.confirm(title+'该项目申请').then(action => {
          if(action === 'confirm'){
            that.handle(item,state)
          }
        });
      },

      async handle (item,state) {
        const that = this;
        await applyHandleApply({
          id: that.userInfo.id,
          handler: 1,
          state: state
        }).then(res => {
          console.log(res)
        })
      },
    },

    watch: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin.scss';
  .applyMessage {
    .applyMessageLi {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .applyMessageLiLeft {
        flex: 3;
      }
      .applyMessageLiRight {
        flex: 1;
        height: 100%;
        span {
          display: block;
          width: 92%;
          text-align: center;
          margin: 5px auto;
          border-radius: 4px;
        }
        .agree {
          border:1px solid $cglobal;
          color: $cglobal;
        }
        .reject {
          border:1px solid red;
          color: red;
        }
        .disabled {
          border:1px solid gray;
          color: gray;
        }
        .agree-active {
          background: $cglobal;
          color: #fff;
        }
        .reject-active {
          background: red;
          color: #fff;
        }
      }
    }
    font-size: .4rem;
    color: #333;
    li{
      background: #fff;
      margin-bottom: 2px;
      padding: .1rem .4rem;
      margin: 6px 0;
    }
    .top {
      .name {
        font-size: .43rem;
        line-height: .8rem;
        vertical-align: middle;
        color: gray;
      }
      .already-action{
        float: right;
        font-size: .2rem;
        padding: .05rem .25rem;
      }
      .action {
        float: right;
        background: #3190e8;
        color: #fff;
        border-radius: 3px;
        padding: .05rem .25rem;
        font-size: .2rem;
      }
    }
    .bottom {
      vertical-align: middle;
      .img {
        display: inline-block;
        width: 1.8rem;
        vertical-align: middle;
        img {
          width: 100%;
          vertical-align: middle;
        }
      }
      .introduction {
        vertical-align: middle;
        display: inline-block;
        margin-left: .5rem;
        font-size: .36rem;
        color: gray;
        span {
          display: inline-block;
          width: 1.8rem;
          color: $cglobal;
        }
      }
    }
  }
  .load-finsh {
    display: block;
    font-size: .4rem;
    color: gray;
    line-height: 1rem;
    text-align: center;
  }
</style>
