<template>
  <div class="Home">
    <Head-Top head-title='首页'></Head-Top>
    <ul class="banner-box clearfix">
      <router-link to="/adviser/search" class='li' v-for='(item, index) in typeList' :key='index'>
        <img :src="item.imgUrl">
        <span>{{item.name}}</span>
      </router-link>
    </ul>
    <Search-List></Search-List>
    <Home-Footer></Home-Footer>
  </div>  
</template>

<script>
  import { mapState,mapMutations,mapGetters  } from 'vuex'
  import HeadTop from '@/components/header/head'
  import SearchList from '@/components/searchList'
  import HomeFooter from '@/pages/footer'

  export default {
    name:"Index",
    data(){
      return{
       list: [],
       typeList: [
        {
          imgUrl: 'https://tianpeng.zbjimg.com/tianpeng/task/app.png/origine/0a1aed3f-e3e2-4ac2-acd8-f9e23d5cdebc',
          name: 'APP'
        },
        {
          imgUrl: 'https://tianpeng.zbjimg.com/tianpeng/task/%E7%BD%91%E7%AB%99.png/origine/3a34a406-fcaf-44ba-8508-b0abbe057c15',
          name: '网站'
        },
        {
          imgUrl: 'https://tianpeng.zbjimg.com/tianpeng/task/%E5%BE%AE%E4%BF%A1.png/origine/1146b47e-8a42-4be5-a534-14552e488be0',
          name: '微信'
        },
        {
          imgUrl: 'https://tianpeng.zbjimg.com/tianpeng/task/LOGO.png/origine/37d7ec9f-a247-4d00-9a4e-b90113537acf',
          name: 'LOGO'
        },
        {
          imgUrl: 'https://tianpeng.zbjimg.com/tianpeng/task/VI.png/origine/171bdf53-46ab-4979-bb10-e33d4f56b6fd',
          name: 'VI设计'
        },
        {
          imgUrl: 'https://tianpeng.zbjimg.com/tianpeng/task/%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91.png/origine/44fab789-a08a-45bd-b5fb-20c971bf4e48',
          name: '游戏'
        },
        {
          imgUrl: 'https://tianpeng.zbjimg.com/tianpeng/task/%E5%8A%A8%E7%94%BB.png/origine/298ffa59-e905-420a-9bd8-da51fa8cc9d4',
          name: '动画'
        },
        {
          imgUrl: 'https://tianpeng.zbjimg.com/tianpeng/task/%E7%94%B5%E5%95%86.png/origine/fdc0a3ae-3fc6-4ae7-9d97-1c17a5bec7e0',
          name: '电商'
        },
        {
          imgUrl: 'https://tianpeng.zbjimg.com/tianpeng/task/%E8%A3%85%E4%BF%AE.png/origine/54754797-2c57-4888-b5f3-df198ff89e53',
          name: '装修'
        },
        {
          imgUrl: 'https://tianpeng.zbjimg.com/tianpeng/task/%E4%BA%92%E8%81%94%E7%BD%91.png/origine/899311ef-49e1-421a-9d4c-9dd739b09447',
          name: '工业设计'
        },
       ]
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

    }
  }
</script>

<style lang="scss" scoped>
  .banner-box {
    background-color: #fff;
    padding: 0 0 .3rem;
    .li {
      margin: .2rem 0 0;
      float: left;
      width: 20%;
      text-align: center;
      img {
        width: 1.22rem;
        height: 1.22rem;
      }
      span {
        display: block;
        color: #333;
        font-size: .3rem;
        margin-top: .1rem;
      }
    }
  }
  .module-adviser-list.ceiling {
    margin-top: .1rem !important;
    height: auto;
    margin-bottom: 1.4rem;
  }
</style>

