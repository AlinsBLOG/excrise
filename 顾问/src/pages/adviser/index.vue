<template>
  <div class="Home">
    <Head-Top head-title='顾问'></Head-Top>
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
    <Home-Footer></Home-Footer>
  </div>
</template>

<script>
  import { mapState,mapMutations,mapGetters  } from 'vuex'
  import HeadTop from '@/components/header/head'
  import HomeFooter from '@/pages/footer'
  import SearchList from '@/components/searchList'
  import { getBanner } from '@/service/getData'

  export default {
    name:"Adviser",
    data(){
      return{
        value: ''
      }
    },
    components:{
      HomeFooter,
      HeadTop,
      SearchList
    },
    mounted:function(){
    
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
  @import '../../styles/mixin.scss';
  .vux-search-box {
    font-size: 16px;
  }
  .search-div {
    top: 1.2rem;
    width: 100%;
    i {
      position: absolute;
      top: .4rem;
      left: .7rem;
      z-index:99;
    }
  }
  .adviser-box {
    height: 4rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>

