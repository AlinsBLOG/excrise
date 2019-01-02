<template>
  <div>
    <Head-Top head-title="我的项目" go-back='true'></Head-Top>
      <mt-navbar v-model="selected" class='projectTabNav'>
        <mt-tab-item v-for='(item, index) in tabContainer' :id="index+1+''" :key='index'>
          {{item.name}}
        </mt-tab-item>
      </mt-navbar>
      <ul 
        class="list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <li 
          v-for="(item, index) in list" 
          :key="index"
          @click="moreInfo(item.id)"
          class="list-item">
          <div class="left">
            <span class="title">《广州市天河区光大企业集团喜讯项目》</span>
            <div class="company line">
              <span class="company-name">广州光大资源优先公司</span><span>人力资源</span>
            </div>
            <div class="time">
              <span>起始时间：</span>2018.01.09 - 2018.02.20
            </div>
          </div>
          <i class='mint-cell-allow-right'></i>
        </li>
      </ul>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapGetters  } from 'vuex'
  import HeadTop from '@/components/header/head'
  import { projectList } from '@/service/getData'

  export default {
    name: "MyProject",
    data () {
      return{
        tabContainer: [{
          name: '我参与的项目',
        },{
          name: '我发起的项目',
        }],
        selected: '1',
        list: [1,1,1,1,1,],
        loading: false,
        loadingMore: true,
        params: {
          pageNo: 1,
          pageSize: 10,
        }
      }
    },
    components: {
      HeadTop
    },
    mounted: function () {

    },

    computed: {
      ...mapState(['defaultAvatarImg', 'userInfo'])
    },
    methods:{
      ...mapMutations(['SET_LOADING']),

      async loadMore () {
        const that = this
        if (this.loadingMore) {
          that.SET_LOADING(true)
          that.loading = true
          await projectList(this.params).then(res => {
            if (that.params.pageNo >= res.pageCount) {
              that.loading = true
            } else {
              that.loading = false
            }
            if (res.data && res.data.length) {
              that.list = that.list.concat(res.data)
            }
            that.params.pageNo = that.params.pageNo + 1
            that.SET_LOADING(false)
          })
        }
      },

       moreInfo (id) {
        this.$router.push({
          path: `/project/info/${id}`
        })
      },

    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../styles/mixin.stylus';
  .projectTabNav {
      >>> .mint-tab-item.is-selected {
        color: $cglobal;;
        border-bottom-color: $cglobal;
      }
      >>> .mint-tab-item-label {
        font-size: .37rem;
      }
  }
  .list {
      margin-top: .2rem;
      padding: 0 0 0 .4rem;
      background: #fff;
      .list-item {
        position: relative;
        font-size: .3rem;
        color: #868587;
        display:flex;
        justify-content:space-between;
        align-items:center;
        border-bottom: 1px solid #EEEEEF;
        padding: .1rem 0;
        line-height: 1;
        .left {
          .title {
            font-size: .4rem;
            color: #000;
            display: block;
            line-height: 1.6;
          }
          div {
            display: block;
            line-height: 1.65;
          }
          .line {
            span{
              position: relative;
              margin-right: .25rem;
              padding-right: .25rem;
              &:before {
                right: 0;
                top: .05rem;
                content: '';
                position: absolute;
                display: inline-block;
                border-right: 1px solid #eeeeef;
                height: 0.3rem;
              }
            }
          }
          .number {
            color: #ADADAF;
          }
          .time {
            span {
              color: #306EB3;
            }
          }
        }
        .span {
          color: #fff;
          min-width: 1.8rem;
          text-align: center;
          padding: 0.17rem 0;
          border-radius: 5px;
        }
        .state1 {
          color: red;
          border: 1px solid red;
        }
        .state2 {
          background: #3470b5;
        }
        .state3 {
          background: green;
        }
      }
    }
</style>

