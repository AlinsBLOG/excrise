<template>
    <header id='head_top'>
        <slot name='logo'></slot>
        <i class="iconfont icon-back" v-if="goBack" @click="$router.goBack()"></i>
       <!--  <section class="head_goback" v-if="goBack" @click="$router.go(-1)">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2"/>
            </svg>
        </section> -->
        <router-link :to="userInfo? '/profile':'/login'" v-if='signinUp' class="head_login">
            <svg class="user_avatar" v-if="userInfo">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>
            </svg>
            <span class="login_span" v-else>登录|注册</span>
        </router-link>
        <section class="title_head ellipsis" v-if="headTitle">
            <span class="title_text">{{headTitle}}</span>
        </section>
        <slot name="changecity"></slot>
    </header>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    export default {
        name: 'HeadTop',
    	data(){
            return{

            }
        },
        mounted(){
            //获取用户信息
        },
        props: ['signinUp', 'headTitle', 'goBack'],
        computed: {
            // ...mapState([
            //     'userInfo'
            // ]),
        },
        methods: {
            // ...mapActions([
            //     'getUserInfo'
            // ]),
        },

    }

</script>

<style lang="scss" scoped>
    @import '../../styles/mixin';

    #head_top{
        background-color: $cglobal;
        position: relative;
        z-index: 100;
        left: 0;
        top: 0;
        @include wh(100%, 1.2rem);
        line-height: 1.2rem;
    }
    .head_goback{
        display: inline-block;
        @include wh(0.6rem, 0.7rem);
        line-height: 0.7rem;
        margin-left: .4rem;
    }
    .icon-back{
        vertical-align: text-top;
        color: #fff;
        margin-left: .3rem;
        font-size: .5rem;
    }
    .head_login{
        right: 0.55rem;
        @include sc(0.65rem, #fff);
        @include ct;
        .login_span{
            color: #fff;
        }
        .user_avatar{
            fill: #fff;
            @include wh(.8rem, .8rem);
        }
    }
    .title_head{
        position: absolute;
        top: 42%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        text-align: center;
        .title_text{
            @include sc(0.45rem, #fff);
            text-align: center;
        }
    }
</style>