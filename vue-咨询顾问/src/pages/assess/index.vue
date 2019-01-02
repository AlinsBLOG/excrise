<template>
  <div class="Home">
    <Head-Top head-title='发表评价' go-back='true'></Head-Top>
    <div class="assess-box">
        <span class="title">对顾问评分：</span>
        <div class="star">
            <div class="row">
                顾问印象：
            </div>
            <div class="row">
                服务态度：
            </div>
        </div>
        <div class="label">
            <div class="row">
                顾问标签：
            </div>
            <div class="item">
                <span>12年顾问经验</span>
                <span>沟通愉快</span>
                <span>服务态度好</span>
                <span>提案例</span>
                <span>培训很有方法</span>
                <span>业务熟练</span>
            </div>
        </div>
    </div>
    <div class="input-box">
      dd
    </div>
    <div class="btn-box">
        <mt-button size="large" class="assess-btn" type='primary'>提交评价</mt-button>
    </div>
  </div>
</template>

<script>
  import { mapState,mapMutations,mapGetters  } from 'vuex'
  import HeadTop from '@/components/header/head'

  export default {
    name:"Assess",
    data(){
      return{

}
    },
    components:{
      HeadTop
    },
    mounted:function(){
    
    },
    methods:{
      
    }
  }
</script>

<style lang="scss" scoped>
    .assess-box {
        padding: 0 .3rem;
        background: #fff;
        font-size: .4rem;
        margin: .18rem 0;
        .title {
            display: block;
            line-height: 2;
            border-bottom: 1px solid #EEECEE;
        }
        .star {
            border-bottom: 1px solid #EEECEE;
            .row {
                line-height: 2.2;
                color: #3470b5;
            }
        }
        .label {
            border-bottom: 1px solid #EEECEE;
            padding: .2rem 0 .4rem;
            .row {
                color: #3470b5;
                // margin-bottom: .1rem;
            }
            .item {
                span {
                    display: inline-block;
                    border: 1px solid #3470b5;
                    line-height: 1;
                    padding: .05rem .15rem;
                    border-radius: .2rem;
                    color: #3470b5;
                    font-size: .1rem;
                    // margin-bottom: .1rem;
                    transform: scale(.9);
                }
            }
        }
    }
    .input-box {
        padding: 0 .3rem;
        background: #fff;
        font-size: .4rem;
    }
    .btn-box {
        width: 95%;
        margin: .8rem auto 0;
    }
</style>

