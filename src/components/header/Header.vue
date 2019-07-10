<template>
  <div>
    <van-nav-bar :title="title" left-arrow @click-left="onClickLeft" />
  </div>
</template>


<script>
import { NavBar } from 'vant';
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  components: {
    [NavBar.name]: NavBar
  },
  data() {
    return {};
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="sass" scoped>

</style>


