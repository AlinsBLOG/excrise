<template>
  <div>
    <Head-Top head-title='搜索顾问' go-back='true'></Head-Top>
    <div class="search-div">
      <search 
        placeholder='请输入搜素顾问'
        :auto-fixed='false'
        @on-submit='change'
        @on-cancel='cancel'
        @on-clear='cancel'
        v-model='value'
      >
      </search>
    </div>
    <Search-List :value='value' ref='seaLi'></Search-List>
  </div>  
</template>

<script>
  import { mapState,mapMutations,mapGetters  } from 'vuex'
  import HeadTop from '@/components/header/head'
  import SearchList from '@/components/searchList'
  import { consultantSearch } from '@/service/getData'

  export default {
    name:"SearchAdviser",
    data () {
      return {
        value: ''
      }
    },
    components: {
      HeadTop,
      SearchList
    },
    mounted (){

    },
    methods:{
      change () {
        this.$refs.seaLi.change()
      },

      cancel () {
        this.value = ''
        this.change()
      },

    }
  }
</script>

<style lang="scss" scoped>
  .vux-search-box {
    font-size: 16px;
  }
  .search-div {
    position: fixed;
    top: 1.2rem;
    width: 100%;
    i {
      position: absolute;
      top: .4rem;
      left: .7rem;
      z-index:99;
    }
  }
  .module-adviser-list.ceiling {
    margin-top: 1.6rem;
    width: 100%;
    height: calc(100% - 2rem);
    z-index:-1;
    .adviser-item {
      height: 2.8rem;
      background: #fff;
      padding: .4rem 0;
      margin: .2rem;
      border-radius: .2rem;
      .head {
        float: left;
        width: 2rem;
        height: 2rem;
        margin: 0 .4rem;
        border-radius: 100%;
        overflow: hidden;
        border: 1px solid #f1f1f1;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        float: left;
        font-size: .43rem;
        .name-area {
          .name {
            font-weight: 600;
            color: #333;
          }
          .area {
            font-size: .38rem;
            color: #b0b0b0;
            margin-left: .3rem;
          }
        }
        .job {
          color: #666;
          font-size: .4rem;
          margin: .05rem 0;
        }
        .label-area {
          padding: .1rem 0;
          overflow: hidden;
          .label {
            color: #0076ff;
            background: #f2f8ff;
            border: 1px solid #0076ff;
            padding: .03rem .15rem;
            border-radius: .1rem;
            font-size: .15rem;
            display: inline-block;
            margin-bottom: .4rem;
            margin-right: .2rem;
          }
        }
      }
    }
  }
</style>

