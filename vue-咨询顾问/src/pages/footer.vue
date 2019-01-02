<template>
  <div id="bottom" style="position:fixed;bottom:0;">
    <ul class="bottom-ul"> 
      <router-link  to="/index" tag="li">
        <i class="iconfont icon-head"></i>
        <span>首页</span>
      </router-link>

      <router-link to="/adviser" tag="li">
        <i class="iconfont icon-customer"></i>
        <span>顾问</span>
      </router-link>

      <router-link to="/project" tag="li">
        <i class="iconfont icon-project"></i>
        <span>项目</span>
      </router-link>

       <router-link to="/profile" tag="li">
        <i class="iconfont icon-head" ></i>
        <span>我的</span>
      </router-link>
    </ul>
  </div>
</template>

<script>
  export default {
    data(){
      return {

      }
    },
    mounted(){
      // this.active = this.$route.path.slice(1);
    }
  }
</script>

<style lang="stylus" scoped>
 @import '../styles/mixin.stylus';
  #bottom
    width: 100%;
    position: fixed;
    bottom: 0;
    color: #666
    background: white
    .bottom-ul
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 -0.02667rem 0.05333rem rgba(0,0,0,.1)
      li
        width 33.33%
        display: flex;
        justify-content: center;
        flex-direction: column;
        text-align center
        span
          font-size .3rem
          line-height: 1.5
        i 
          font-size .55rem
          line-height: 1.3
      .router-link:hover,.router-link-active
        color: $cglobal;
</style>
