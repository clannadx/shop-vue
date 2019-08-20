<template>
  <div class="recharge">
    <div class="record">
      <router-link to="/wallet/recording" tag="span">充币记录</router-link>
    </div>
    <div class="recharge-content">
      <div class="ewm">
        <qrcode :value="userAddress" :options="{ size: 119 }"></qrcode>
      </div>

      <div class="title-address">充币地址</div>
      <p class="address">{{userAddress}}</p>
      <van-button
        class="copyAddress copy-button"
        title="复制"
        type="info"
        v-clipboard:copy="userAddress"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        size="small"
      >复制地址</van-button>
    </div>
    <div class="recharge-foot">
      <div class="title">注意事项</div>
      <p>需要网络确认后才能到账，任何非 ETM 资产充值到 ETM 地址后不可找回！充值最小额度为 0.01 ETM，小于 0.01 ETM 将无法到账。</p>
    </div>
  </div>
</template>
<script>
import { Button } from 'vant';
import Clipboard from 'clipboard';
import mixins from '@/mixin/mixins';
export default {
  mixins: [mixins],
  data() {
    return {};
  },
  created() {
    this.getAddress();
  },
  methods: {
    onCopy: function(e) {
      this.$toast('复制成功');
    },
    onError: function(e) {
      this.$toast('复制失败，请重试');
    }
  }
};
</script>
<style lang="scss" scoped>
.recharge {
  .record {
    height: 44px;
    line-height: 44px;
    text-align: right;
    padding-right: 10px;
    color: rgba(42, 130, 228, 1);
    font-size: 14px;
  }
  .recharge-content {
    padding: 15px;
    margin: 10px;
    background-color: #fff;
    .ewm {
      height: 210px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .title-address {
      color: rgba(128, 128, 128, 1);
      font-size: 14px;
    }
    .address {
      color: rgba(80, 80, 80, 1);
      font-size: 12px;
      margin-top: 10px;
    }
    .copy-button {
      width: 100%;
      border-radius: 5px;
      margin-top: 10px;
    }
  }
  .recharge-foot {
    padding: 0 23px;
    .title {
      color: rgba(128, 128, 128, 1);
      font-size: 14px;
      text-align: left;
    }
    p {
      color: rgba(255, 141, 26, 1);
      font-size: 12px;
      line-height: 20px;
      margin-top: 10px;
    }
  }
}
</style>


