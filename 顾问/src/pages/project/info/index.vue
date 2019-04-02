<template>
  <div class="Home">
    <Head-Top head-title='项目详情' go-back='true'></Head-Top>
    <div class="project-info">
      <div class="bottom20">
        <mt-cell title="项目名称">
          <span>{{data.title ? data.title : '未填写'}}</span>
        </mt-cell>
        <mt-cell title="发起人">
          <span>{{data.linkMan ? data.linkMan : '未填写'}}</span>
        </mt-cell>
        <mt-cell title="发起部门">
          <span>{{data.department ? data.department : '未填写'}}</span>
        </mt-cell>
      </div>
      <div class="bottom20">
        <mt-cell title="项目背景" :label="data.background?data.background:'未填写'"></mt-cell>
        <mt-cell title="项目需求" :label="data.demand?data.demand:'未填写'"></mt-cell>
      </div>
      <div class="bottom20">
        <mt-cell title="交付成果">
          <span>{{data.result ? data.result : '未填写'}}</span>
        </mt-cell>
        <mt-cell title="所属行业">
          <span>{{data.field ? data.field : '未填写'}}</span>
        </mt-cell>
        <mt-cell title="所属专业">
          <span>{{data.field ? data.field : '未填写'}}</span>
        </mt-cell>
        <mt-cell title="顾问要求" :label="data.demand?data.demand:'未填写'"></mt-cell>
      </div>
      <div class="bottom20">
         <mt-cell title="项目起始时间">
          <span>{{data.beginDate}} - {{data.endDate}}</span>
        </mt-cell>
      </div>
      
      <mt-button type="primary" size='large' class=edit @click.native='applyProjectFun(data)' v-if='apply'>申请项目</mt-button>
      <mt-button type="primary" size='large' class=edit @click.native='edit(data.id)' v-else>编辑</mt-button>
    </div>
  </div>
</template>

<script>
  import { mapState,mapMutations,mapGetters  } from 'vuex'
  import HeadTop from '@/components/header/head'
  import { MessageBox, Toast } from "mint-ui"
  import { projectgetInfo, applyProject } from '@/service/getData'
  import { formatData } from '../../../../config/mUtils'

  export default {
    name:"ProjectInfo",
    data(){
      return{
        apply: false,
        data: {}
      }
    },
    components:{
      HeadTop
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    mounted:function(){
      const apply = this.$route.query.apply
      if (apply) {
        this.apply = true
      }
      this.getInfo()
    },
    methods:{
      ...mapMutations(['SET_LOADING']),

      async getInfo () {
        this.SET_LOADING(true)
        await projectgetInfo(this.$route.params.id).then(res => {
          if (true) {
            if (res.data){
              this.data = {
                ...res.data,
                beginDate: (res.data.beginDate ? formatData(res.data.beginDate) : ''),
                endDate: (res.data.endDate ? formatData(res.data.endDate) : ''),
              }
            }
          }
          this.SET_LOADING(false)
        })
      },

      //编辑项目
      edit (id) {
        this.$router.push({
          path: '/project/sponsor',
          query: {
            id: 1
          }
        })
      },

      //申请项目
      applyProjectFun (res) {
        console.log(res);
        const that = this
        if (!that.userInfo) {
          MessageBox.confirm('请先登录再申请项目').then(action => {
            if (action == 'confirm') {
              that.$router.push({
                path:'/login'
              })
            }
          })
          return
        }
        MessageBox.confirm('确定申请项目?').then(action => {
          if (action == 'confirm') {
            that.applyPro(res)
          }
        })
      },

      async applyPro (res) {
        const that = this
        await applyProject({
          applyUser: that.userInfo.id,
          projectId: res.id,
        }).then(response => {
          if (response.success) {
            Toast('申请成功')
            that.$router.go(-1)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../styles/mixin.stylus'
  .project-info {
    padding-bottom: 50px;
    .mint-cell {
      min-height: 1.6rem;
    }
    .edit {
      margin-top: .5rem;
      position: fixed;
      bottom: 0;
    }
    >>> .mint-cell-text {
      color: $cglobal;
      font-size: .45rem;
    }
    >>> .mint-cell-label {
      font-size: .4rem;
      margin-top: .2rem;
    }
    >>> .mint-cell-value {
      font-size: .4rem;
    }
    .bottom20 {
      margin-top: .13rem;
    }
  }
</style>

