<template>
  <div class="tabbar-user">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <div class="tabbar-user-content">
        <user-header :isLogin="isLogin" />
        <order-group />
        <coupon-group />
        <user-module />
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import userHeader from './tabbar-user-header';
import orderGroup from './tabbar-user-order';
import couponGroup from './tabbar-user-coupon';
import userModule from './tabbar-user-module';
import { PullRefresh } from 'vant';
export default {
  data() {
    return {
      isLogin: false,
      loading: false
    };
  },

  activated() {
    this.getLoginStatus();
  },

  methods: {
    onRefresh() {
      this.getLoginStatus();
      this.loading = false;
    },
    getLoginStatus() {
      this.isLogin = !!localStorage.getItem('Authorization');
    }
  },

  components: {
    [userHeader.name]: userHeader,
    [orderGroup.name]: orderGroup,
    [couponGroup.name]: couponGroup,
    [userModule.name]: userModule,
    [PullRefresh.name]: PullRefresh
  }
};
</script>


<style scoped lang="scss">
.tabbar-user {
  > div {
    margin-bottom: 10px;
  }
  &__quit {
    border: 0;
    border-radius: 0;
  }
  .tabbar-user-content {
    min-height: calc(100vh - 50px);
  }
}
</style>
