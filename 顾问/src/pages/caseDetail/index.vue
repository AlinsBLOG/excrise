<template>
  <div class="box">
    <Head-Top head-title='案例详情' go-back='true'></Head-Top>
    <div class="info">
        <span class="title">项目名称</span>
        <span class="name">广州市天河区XXX高级企业咨询项目</span>
    </div>
    <div class="info">
        <span class="title">项目描述</span>
        <span class="name">123458广州市天河区XXX高级企业咨询项目</span>
    </div>
     <div class="info">
        <span class="title file-title">附件</span>
        <ul class="file-list">
            <li>
                <div class="left">
                    <i class="iconfont icon-head"></i>
                    <div class="content">
                        <span>人力资源文档.jpg</span>
                        <span>1.7M 2018.07.19 13.43 上传</span>
                    </div>
                </div>
                <i class="iconfont icon-more-line"></i>
            </li>
            <li>
                <div class="left">
                    <i class="iconfont icon-head"></i>
                    <div class="content">
                        <span>人力资源文档.jpg</span>
                        <span>1.7M 2018.07.19 13.43 上传</span>
                    </div>
                </div>
                <i class="iconfont icon-more-line"></i>
            </li>
            <li>
                <div class="left">
                    <i class="iconfont icon-head"></i>
                    <div class="content">
                        <span>人力资源文档.jpg</span>
                        <span>1.7M 2018.07.19 13.43 上传</span>
                    </div>
                </div>
                <i class="iconfont icon-more-line"></i>
            </li>
        </ul>
    </div>
</div>
    
</template>

<script>
  import { mapState,mapMutations,mapGetters  } from 'vuex'
  import HeadTop from '@/components/header/head'
  export default {
    name:"CaseDetail",
    data(){
      return{

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
            padding: .2rem .4rem;
            margin-top: .3rem;
            span{
                display: block;
                font-size: .4rem;
            }
            .title{
                color: #2C6DB4;
            }
            .file-title{
                line-height: 2.5;
            }
            .name{
                color: #818282;
            }
            .file-list {
                color: #818282;
                li{
                    display:flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #E4E4E6;
                    padding: .2rem 0;
                    .left{
                        display:flex;
                        align-items: center;
                        i{
                            margin-right: .4rem;
                        }
                    }
                }
            }
        }
    }
</style>

