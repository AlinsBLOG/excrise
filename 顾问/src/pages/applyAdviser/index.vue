<template>
  <div class="Home">
    <Head-Top :head-title="title" go-back='true'></Head-Top>
    <a class="mint-cell mint-field headImg">
      <div class="mint-cell-wrapper">
        <div class="mint-cell-title">
          <span class="mint-cell-text">头像</span>
        </div>
        <div style="position: relative;padding: .2rem;width: 100%;">
          <label
            :style="{backgroundImage:'url(' + (bean.avatarImg ? bean.avatarImg : defaultAvatarImg) + ')'}"
            for="file" 
            class="file"
            >
            <input type="file" name="file" id="file" hidden @change='uploadAvatar'>
          </label>
        </div>
      </div>
    </a>
    <div class="login">
      <mt-cell title="姓名" is-link @click.native.stop.prevent='changeInput("name","姓名")'>
        <span>{{bean.name ? bean.name : '未填写'}}</span>
      </mt-cell>
      <mt-cell title="性别" is-link @click.native.stop.prevent="popupChange('sex')">
        <span>{{bean.sex ? bean.sex : '未填写'}}</span>
      </mt-cell>
      <group>
        <x-address
          title="地区" 
          v-model="bean.area"
          @on-hide='addressPopupVisible = false'
          placeholder="未填写"
          @on-shadow-change='selectArea'
          :list='ChinaAddressV4Data' 
          :hide-district='true'
          :show='addressPopupVisible'></x-address>
      </group>
      <mt-cell title="行业" is-link @click.native.stop.prevent="popupChange('hy')">
        <span>{{bean.hy ? bean.hy : '未填写'}}</span>
      </mt-cell>
      <mt-cell title="联系方式" is-link @click.native.stop.prevent='changeInput("link","联系方式")'>
        <span>{{bean.link ? bean.link : '未填写'}}</span>
      </mt-cell>
    </div>
    <div class="bottom20">
      <mt-field label="个人标签" placeholder="请输入您的个人标签" v-model="bean.lables"></mt-field>
    </div>
    <div class="bottom20">
      <mt-button type="primary" size="large" class="login-btn" @click.native="submit">{{action}}</mt-button>
    </div>
    <div style="display:none;">
      <popup-picker
        :show='popupVisible'
        :data='data[popupName]'
        @on-change='res => bean[popupName] = res[0]'
        @on-show='popupVisible = true'
        @on-hide='popupVisible = false'
        ref='sexPopup'
        >
      </popup-picker>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapGetters  } from 'vuex'
  import { validatePhone  } from '../../../config/mUtils'
  import HeadTop from '@/components/header/head'
  import HomeFooter from '@/pages/footer'
  import { umeResumeSave, umeResumeUpdate, consultantSearch } from '@/service/getData'
  import { upload1, upload2 } from '../../../config/upload'
  import { MessageBox,Toast } from 'mint-ui';
  import { ChinaAddressV4Data } from 'vux'

  export default {
    name: "ApplyAdviser",
    data () {
      return{
        ChinaAddressV4Data,
        title: '申请成为顾问',
        action: '申请',
        data: {
          sex : [['男','女']],
          hy: [['制造','32432','32432','546','fdgfdg']],
        },
        popupName: '',
        id: 1,
        popupVisible: false,
        addressPopupVisible: false,
        bean: {
          avatarImg: null,
          area:[],
          name: '',
          sex: '',
          hy:'',
          link:'',
          lables: '',
          profession: '',
          remark: '',
          summary: '',
          userId: ''
        }
      }
    },
    components: {
      HomeFooter,
      HeadTop
    },
    mounted: function () {
      this.getInfo()
    },
    computed: {
      ...mapState(['defaultAvatarImg', 'userInfo'])
    },
    methods: {
      ...mapMutations(['SET_LOADING']),

      popupChange (value) {
        this.popupVisible = true
        this.popupName = value
      },

      selectArea (arr1, arr2) {
        console.log(arr1,arr2)
      },

      uploadAvatar () {
        const that = this
        that.SET_LOADING(true)
        let input = document.querySelector('#file')
        let file = input.files[0]
        upload1(file).then(res => {
          upload2(res, file).then(() => {
            that.bean.avatarImg = res.data.resourceUrl
            that.SET_LOADING(false)
          })
        })
      },

      changeInput (name,title) {
        this.changeInputMessageBox(name,'请输入'+title)
      },

      changeInputMessageBox (name,title) {
        const that = this
        MessageBox.prompt(title,'',{
          inputValue: that.bean[name],
          inputPlaceholder: title
        }).then(({ value, action }) => {
          if (action == 'confirm' && value) {
            that.bean[name] = value
          }
        })
      },

      async getInfo () {
        const that = this
        if (this.userInfo && this.userInfo.id) {
          that.SET_LOADING(true)
          that.title = '修改顾问信息'
          that.action = '确认修改'
          await consultantSearch({uid: this.userInfo.id}).then(res => {
            if (res && res.data.length) {
              that.bean = {
                ...that.bean,
                ...res.data[0]
              }
            }
            that.SET_LOADING(false)
          })
        }
      },

      async submit (e) {
        const that = this
        this.bean.userId = this.userInfo.id
        if (!this.bean.name || !this.bean.profession) {
          Toast('姓名或职业不能为空')
          return
        }
        that.SET_LOADING(true)
        if (this.userInfo && this.userInfo.id) {
           await umeResumeUpdate(that.bean).then(res => {
            if (res.success) {
              Toast('修改成功')
            }
          })
        } else {
           await umeResumeSave(that.bean).then(res => {
            if (res.success) {
              Toast('申请成功')
            }
          })
        }
        that.SET_LOADING(false)
      }
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
    .headImg {
      margin: .1rem 0;
    }
    .login {
      margin-top: .1rem;
      .login-btn {
        position: fixed;
        bottom: .2rem;
        width: 95%;
        left: 2.5%;
      }
    }
    .file {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      float: right;
    }
    /deep/ .weui-cells,.vux-no-group-title {
      margin-top: 0;
    }
    /deep/ .weui-cell__hd {
      font-size: 16px;
    }
    /deep/ .weui-cell {
      padding: 10px 19px 10px 10px;
    }
    /deep/ .weui-cell_access .weui-cell__ft:after {
      width: 5px;
      height: 5px;
    }
    .bottom20 {
      margin-top: .2rem;
    }
  }
</style>

