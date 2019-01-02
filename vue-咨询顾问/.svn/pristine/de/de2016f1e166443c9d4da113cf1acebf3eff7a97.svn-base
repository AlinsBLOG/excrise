<template>
  <div class="Home">
    <Head-Top head-title='发起项目成功' go-back='true'></Head-Top>
    <div class="sponsorSuccess">
      <span class="tips">发起项目成功</span>
      <p class="number">项目编号：<span>8234832295849358</span></p>
      <span class="gotoSponsor" @click='$router.go(-1)'>进入项目发起</span>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapGetters  } from 'vuex'
  import  { Toast } from "mint-ui"
  import HeadTop from '@/components/header/head'

  export default {
    name: "SponsorSuccess",
    data () {
      return{

      }
    },
    components: {
      HeadTop
    },
    mounted: function () {

    },
    methods:{

    }
  }
</script>

<style lang="scss" scoped>
  .sponsorSuccess {
    position: absolute;
    top: 0;
    text-align:center;
    font-size: .4rem;
    width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .tips {
      font-size:.7rem;
      font-weight: 600;
    }
    .number {
      font-size: .45rem;
      line-height: 1.2rem;
    }
    .gotoSponsor {
      display: block;
      width: 70%;
      margin: 0 auto;
      color: #fff;
      background: orange;
      padding: .2rem .4rem;
      border-radius: .8rem;
    }
  }
</style>

