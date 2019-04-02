<template>
  <div class="Home">
    <Head-Top head-title="我的" go-back='true'></Head-Top>
    <a class="mint-cell mint-field headImg bottom20" @click="$router.push({path:'/applyAdviser'})">
      <div class="mint-cell-wrapper">
        <div style="padding: .2rem;">
            <label
                :style="{backgroundImage:'url(' + (userInfo.avatarImg ? userInfo.avatarImg : defaultAvatarImg) + ')'}"
                class="file"
                >
            </label>
        </div>
        <span class="mint-cell-text">
            我的基本资料
        </span>
        <i class="mint-cell-allow-right"></i>
      </div>
    </a>
    <div class="bottom20">
      <mt-cell title="我的关注" is-link to='/profile/collection'></mt-cell>
    </div>
    <div class="bottom20">
      <mt-cell title="我的项目" is-link to='/profile/my-project'></mt-cell>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapGetters  } from 'vuex'
  import HeadTop from '@/components/header/head'
  import { umeResumeSave, umeResumeUpdate, consultantSearch } from '@/service/getData'

  export default {
    name: "Info",
    data () {
      return{

      }
    },
    components: {
      HeadTop
    },
    mounted: function () {
      this.getInfo()
    },
    computed: {
      ...mapState(['defaultAvatarImg', 'userInfo'])
    },
    methods:{
      ...mapMutations(['SET_LOADING']),

    }
  }
</script>

<style lang="scss" scoped>
  .Home {
    .tips {
      display: inline-block;
      width: 100%;
      color: #A3A3A5;
      font-size: .2rem;
      line-height: 1;
    }
    .file {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      display: inline-block;
    }
    .bottom20 {
      margin-top: .1rem;
    }
  }
</style>

