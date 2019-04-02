<template>
  <div class="home">
    <p @click="submit">click</p>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { accountLogin } from '@/service/getData.js';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  click(){
    window.console.log(1)
  }

  async submit() {
    await accountLogin().then(res => {
        window.console.log('accountLogin')
    })
  }
}
</script>
