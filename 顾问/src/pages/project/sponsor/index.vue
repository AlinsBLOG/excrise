<template>
  <div class="Home">
    <Head-Top :head-title="title + '项目'" go-back='true'></Head-Top>
    <div class="sponsor">
      <div class="bottom20">
        <mt-cell title="项目名称" is-link @click.native.stop.prevent='changeInput("title","项目名称")'>
          <span>{{bean.title ? bean.title : '未填写'}}</span>
        </mt-cell>
        <mt-cell title="发起人" is-link @click.native.stop.prevent='changeInput("linkMan","发起人")'>
          <span>{{bean.linkMan ? bean.linkMan : '未填写'}}</span>
        </mt-cell>
        <mt-cell title="发起部门" is-link @click.native.stop.prevent="popupChange('department')">
          <span>{{bean.department ? bean.department : '未填写'}}</span>
        </mt-cell>
      </div>
      <div class="bottom20">
        <mt-cell title="项目金额" is-link @click.native.stop.prevent='changeInput("price","项目金额,单位:元")'>
          <span>{{bean.price ? bean.price+' 元' : '未填写'}}</span>
        </mt-cell>
        <mt-cell title="项目有效期" is-link @click.native.stop.prevent='changeInput("expiryDate","项目有效期,单位:月")'>
          <span>{{bean.expiryDate ? bean.expiryDate+' 个月' : '未填写'}}</span>
        </mt-cell>
        <mt-cell title="项目起始时间" is-link @click.native="chooesTime('beginDate')">
          {{bean.beginDate ? bean.beginDate : '请选择'}}
        </mt-cell>
        <mt-cell title="项目结束时间" is-link @click.native="chooesTime('endDate')">
          {{bean.endDate ? bean.endDate : '请选择'}}
        </mt-cell>
      </div>
      <div class="bottom20">
        <mt-field label="项目背景" placeholder="项目背景" type="textarea" rows="4" v-model='bean.background'></mt-field>
        <mt-field label="项目需求" placeholder="项目需求" type="textarea" rows="4" v-model='bean.description'></mt-field>
        <mt-field label="交付成果" placeholder="交付成果" type="textarea" rows="4" v-model='bean.result'></mt-field>
      </div>
      <mt-button type="primary" size="large" class="login-btn" @click.native="submit">确认{{title}}</mt-button>
    </div>

    <mt-datetime-picker
      ref="beginDate"
      type="date"
      @confirm="handleConfirm">
    </mt-datetime-picker>
     <mt-datetime-picker
      ref="endDate"
      type="date"
      @confirm="handleConfirm">
    </mt-datetime-picker>

    <div>
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
import  { MessageBox, Toast } from "mint-ui"
import HeadTop from '@/components/header/head'
import { projectCreate, projectModify, projectgetInfo } from '@/service/getData'
import { formatData } from '../../../../config/mUtils'

export default {
  name: "Sponsor",
  data () {
    return{
      title: '发起',
      id: null,
      data: {
        department : [['department1','department2']],
        hy: [['制造','32432','32432','546','fdgfdg']],
      },
      popupName: '',
      popupVisible: false,
      bean: {
        title: '',
        linkMan: '',
        department: '',
        price: '',
        expiryDate: '',
        beginDate: '',
        endDate: '',
        background: '',
        description: '',
        result: '',
        tenantId: 0,
        classId: 1,
        openType: 1,
      }
    }
  },
  components: {
    HeadTop
  },
  mounted: function () {
    const id = this.$route.query.id
    if (id) {
      this.id = id
      this.title = '编辑'
      this.getInfo(id)
    }
  },
  computed: {
    ...mapState([
        'userInfo'
    ]),
  },
  methods:{
    ...mapMutations(['SET_USERINFO','SET_LOADING']),

    popupChange (value) {
      this.popupVisible = true
      this.popupName = value
    },

    // 成功发布需求
    async submit () {
      const that = this
      if (!that.bean.linkMan || !that.bean.title) {
        Toast('项目名称或项目发起人不能为空')
        return
      }
      that.SET_LOADING(true)
      if (that.id) {
        await projectModify({
          ...this.bean,
        }).then( res => {
          if (res.success) {
            that.SET_LOADING(false)
            Toast('编辑项目成功')
          }
        })
      } else {
        await projectCreate({
          ...this.bean,
          createUser: that.userInfo.id
        }).then( res => {
          if (res.success) {
            that.SET_LOADING(false)
            that.$router.push({
              path:'/project/sponsorSuccess'
            })
          }
        })
      }
    },

    changeInput (name,title) {
      this.changeInputMessageBox(name,'请输入'+title)
    },

    changeInputMessageBox (name,title) {
      const that = this
      MessageBox.prompt(title,'',{
        // inputValue: (that.bean[name]?that.bean[name]:''),
        inputPlaceholder: title
      }).then(({ value, action }) => {
        if (action == 'confirm' && value) {
          that.bean[name] = value
        }
      })
    },

    async getInfo (id) {
      this.SET_LOADING(true)
      await projectgetInfo(id).then(res => {
        if (true) {
          this.bean = {
            ...res.data,
            beginDate: (res.data.beginDate ? formatData(res.data.beginDate) : ''),
            endDate: (res.data.endDate ? formatData(res.data.endDate) : ''),
          }
        }
        this.SET_LOADING(false)
      })
    },

    chooesTime (name) {
      this.$refs[name].open();
      this.chooseTimeRef = name;
    },

    handleConfirm (value) {
      this.bean[this.chooseTimeRef] = formatData(value);
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../../styles/mixin.stylus'
  .sponsor {
    .login-btn {
      margin: .5rem auto 0;
    }
    .mint-cell {
      min-height: 1.6rem;
    }
  }
  .bottom20 {
    margin-top: .13rem;
  }
  .vux-cell-box {
    display: none;
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
</style>

