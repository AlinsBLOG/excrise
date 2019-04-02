<template>
  <div class="box">
    <div class="banner">
      <img class="banner-img" src="http://www.jinmalvyou.com/Public/uploads/app_admin/article/1_16c222aa19898e5058938167c8ab6c57.png" />
    </div>
   <!--  <div class="border-bottom">
      border-bottom
    </div> -->
    <div>
      border
    </div>
    <!-- <div class="border-bottom">
      border-bottom
    </div> -->
    <div class="padding-10">
      <div class="border-rightbottom">
        border
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:"Test",
    data(){
      return{
        
      }
    },
  }
</script>
<style lang="stylus" scoped>
  @import '~styles/border.css'
  .box
    background: #fff
    .banner
      overflow: hidden
      height: 0
      padding-bottom: 60%
      .banner-img 
        width: 100%
    .padding-10
      padding: 20px
</style>
