<template>
  <div class="box">
    <Head-Top head-title='案例' go-back='true'></Head-Top>
     <div class="info">
        <!-- <span class="title">案例列表</span> -->
        <search 
            placeholder='请输入搜素案例'
            :auto-fixed='false'
            @on-submit='change'
            @on-cancel='cancel'
            @on-clear='cancel'
            v-model='value'
        ></search>
    </div>
    <span class="upload-case">上传案例</span>
    <ul class="list">
        <li v-for="(item,index) in list" :key='index'><router-link to="/caseDetail">《广州市天河区光大集团企业咨询项目》</router-link></li>
    </ul>
</div>
    
</template>

<script>
  import { mapState,mapMutations,mapGetters  } from 'vuex'
  import HeadTop from '@/components/header/head'
  export default {
    name:"CaseDetail",
    data(){
      return {
          list:[1,1,1,1,1,1,1]
      }
    },
    components:{
      HeadTop
    },
    computed: {

    },
    mounted:function(){

    },
    methods:{

    }
  }
</script>

<style lang="scss" scoped>
    .box{
        .info{
            background: #fff;
            font-size: .4rem;
            .title{
                display: block;
                color: #2C6DB4;
                margin: 0 .4rem;
                line-height: 1rem;
            }
            /deep/ .weui-search-bar{
                background: #3470b5;
                // padding: 0 10px 8px;
            }
            /deep/ .weui-search-bar:before{
                border-top: none;
            }
            // /deep/ .weui-search-bar__label{
            //     // background: #EDEDEF;
            // }
            // /deep/ .weui-search-bar__box{
            //     // background: #EDEDEF;
            // }
        }
        .upload-case{
            background: #3470b5;
            display: block;
            width: 92%;
            margin: .2rem auto;
            border-radius: 3px;
            line-height: 2.1;
            font-size: .55rem;
            color: #fff;
            text-align: center;
        }
        .list{
            font-size: .4rem;
            padding: 0 .2rem;
            background: #fff;
            li{
              line-height: 3.5;
            }
            li:not(:first-child){
                border-top: 1px solid #EBEAEC;
            }
        }
    }
</style>

