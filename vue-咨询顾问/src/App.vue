<template>
    <section>
        <transition :name="transitionName">
            <router-view class="child-view">
                <!-- <Home-Footer></Home-Footer> -->
            </router-view>
        </transition>
        <!-- <svg-icon></svg-icon> -->
        <mt-spinner :type="type[0]" color="#26a2ff" :size='35' class="loading-class" v-show='loading'></mt-spinner>
    </section>
</template>

<script>
    import rem from '../config/rem.js'
    // import svgIcon from '../config/svg'
    import { mapMutations, mapState } from 'vuex'
    import { getStore } from '../config/mUtils'
    import HomeFooter from '@/pages/footer'
    export default {
        name: 'app',
        data () {
            return {
                transitionName: 'slide-left',
                type: ['snake', 'double-bounce', 'triple-bounce', 'fading-circle']
            }
        },
        components:{
            HomeFooter,
        },
        watch: {
    　　　'$route' (to, from) {
            if (this.$router.isBack) {
                this.transitionName = 'slide-right';
            } else {
                this.transitionName = 'slide-left';
            }
            if (this.$router.isBack) {
                this.$router.isBack = false
            }
        }
    　　},
        // components: { svgIcon },
        computed: {
            ...mapState(['userInfo', 'loading'])
        },
        mounted:function(){
            this.initData()
        },
        methods: {
            ...mapMutations(['SET_USERINFO']),
            initData(){
                if (!this.userInfo) {
                    let info = JSON.parse(getStore('userInfo'))
                    if (info && info.id) {
                      this.SET_USERINFO(info)
                    }
                }
            },
        },
    }
</script>

<style lang="less">
    @import 'styles/common.css';
    @import 'styles/mixin.less';
    @import './fon/iconfont.css';
    @import '~vux/src/styles/reset.less';

    .mint-button--primary {
        background-color: @cglobal !important;
    }

    .loading-class{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .mint-cell.mint-field.required:before{
        content: '*';
        font-size: .2rem;
        color: red;
        top: 38%;
        left: .1rem;
        position: absolute;
    }

    .icon-address{
        vertical-align: middle;
        display: inline-block;
        background:url('../static/img/address.png') 100% no-repeat;
        width: .4rem;
        height: .5rem;
        background-size: cover;
    }
    
    .child-view {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        transition: all .5s cubic-bezier(.55,0,.1,1);
    }

    .slide-left-enter, .slide-right-leave-active{
        opacity: 0;
    }

    .slide-left-enter, .slide-right-leave-active {
        -webkit-transform: translate(100%, 0);
        transform: translate(100%, 0);
    }
    .slide-left-leave-active, .slide-right-enter {
        -webkit-transform: translate(-100%, 0);
        transform: translate(-100%, 0);
    }
</style>
