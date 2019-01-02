<template>
  <div>
    <Head-Top head-title='用户申请项目审核' go-back='true'></Head-Top>
    <ul
      class='userApply'
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10">
      <li v-for="(item,index) in list" :key='index'>
        <div class="top">
          <span class="name">XXX项目</span>
        </div>
        <div class="bottom clearfix">
          <div class="img">
            <img src="https://elm.cangdu.org/img/16018a5c08533.jpeg">
          </div>
          <div class="introduction">
            <p>通过理由：厉害了</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapGetters  } from 'vuex'
  import  { Toast } from "mint-ui"
  import HeadTop from '@/components/header/head'
  // import {  } from '@/service/getData'

  export default {
    name: "ApplyMessage",
    data () {
      return{
        loading: false,
        list: [1,1,1,1,1]
      }
    },
    components: {
      HeadTop
    },
    mounted: function () {

    },
    methods:{
      loadMore() {
        this.loading = true;
        setTimeout(() => {
          let last = this.list[this.list.length - 1];
          for (let i = 1; i <= 10; i++) {
            this.list.push(last + i);
          }
          this.loading = false;
        }, 200);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .userApply {
    font-size: .4rem;
    color: #333;
    li{
      background: #fff;
      margin-bottom: 2px;
      padding: .2rem .3rem;
    }
    .top {
      .name {
        font-weight: 600;
        font-size: .5rem;
        line-height: .8rem;
        vertical-align: middle;
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
        width: 2.5rem;
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
        font-size: .45rem;
      }
    }
  }
</style>
