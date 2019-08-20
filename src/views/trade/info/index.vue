<template>
  <div class="info-wrapper">
    <div class="info-header">
      <div class="header-left">
        <div class="title">
          <icon-svg class="icon" icon-class="clock" />请付款
        </div>
        <p>请在15：00内完成付款</p>
      </div>
      <div class="header-right">联系客服</div>
    </div>
    <div class="info-content">
      <div class="order">
        <p class="title">3000</p>
        <div class="order-information">
          <p>
            <span>单价: 3.00</span>
            <span>数量: 1000ETM</span>
          </p>
          <p class="order-num">订单号: 1231231254534</p>
        </div>
      </div>
      <div class="information">
        <div>支付宝</div>
        <p>
          <span>收款人</span>
          <span>
            {{info.name}}
            <copyField :target="info.name"></copyField>
          </span>
        </p>
        <p>
          <span>收款二维码</span>
          <span class="ewm" @click="show=true"></span>
        </p>
        <p>
          <span>支付宝账号</span>
          <span>
            {{info.account}}
            <copyField :target="info.account"></copyField>
          </span>
        </p>
      </div>
      <van-cell-group class="orders">
        <div class="label-num">
          <span>填写支付宝转账订单号</span>
        </div>
        <van-field
          v-model="model.amount"
          :label-width="20"
          label="¥"
          :error-message="errorMessage.amount"
          right-icon="info-o"
          placeholder="请输入支付宝转账订单号"
        />
      </van-cell-group>
    </div>

    <div class="note">
      <p>在转账过程中请勿备注 ETM、法币交易、sugram 等信息，防止汇款被拦截，账户被冻结等问题。</p>
    </div>
    <div class="btns">
      <van-button class="cancel" size="small" type="info" @click="cancelOrder">取消订单</van-button>
      <van-button class="submit" size="small" type="info">我已付款成功</van-button>
    </div>

    <van-popup v-model="show">
      <img class="show-ewm" src="../../../assets/images/ewm.png" alt />
    </van-popup>
  </div>
</template>

<script>
import { Field, Popup } from 'vant';
import CopyField from '@/components/copy';
export default {
  data() {
    return {
      show: false,
      model: {
        amount: ''
      },
      errorMessage: {
        amount: ''
      },
      info: {
        name: '王大锤',
        account: '234243645221'
      }
    };
  },
  methods: {
    showPopup() {
      this.show = true;
    },
    cancelOrder() {
      this.$router.push('/trade/fast');
    }
  },
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    CopyField
  }
};
</script>

<style lang="scss" scoped>
.info-wrapper {
  background: #fafafa;
  .info-header {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    height: 70px;
    .header-left,
    .header-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: rgba(42, 130, 228, 1);
    }
    .header-left {
      .title {
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 5px;
        .icon {
          margin-right: 5px;
        }
      }
      p {
        font-size: 12px;
      }
    }
  }
  .info-content {
    .order {
      background: #fff;
      padding: 10px;
      line-height: 22px;
      font-size: 12px;
      color: rgba(128, 128, 128, 1);
      .title {
        color: rgba(42, 130, 228, 1);
        font-size: 26px;
        font-weight: bold;
        line-height: 40px;
      }
      .order-information {
        p {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    .information {
      padding: 10px;
      background: #fff;
      margin-top: 10px;
      p {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        border-bottom: 1px solid #ebedf0;
        height: 53px;
        line-height: 53px;
        .ewm {
          width: 30px;
          height: 30px;
          background: url('../../../assets/images/pay_ewm.png') no-repeat;
          background-size: 30px 30px;
        }
        span:first-child {
          color: rgba(128, 128, 128, 1);
        }
        span:last-child {
          color: rgba(56, 56, 56, 1);
        }
      }
      p:last-child {
        border: 0 none;
      }
    }
    .orders {
      .label-num {
        padding-left: 10px;
        padding-top: 10px;
        margin-top: 10px;
        color: rgba(166, 166, 166, 1);
      }
    }
  }
  .note {
    background-color: rgba(255, 141, 26, 0.2);
    font-size: 14px;
    color: rgba(255, 141, 26, 1);
    font-size: 12px;
    padding: 8px 18px;
    margin-top: 44px;
  }
  .btns {
    background: #fff;
    margin-top: 40px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    .cancel {
      margin-right: 18px;
      width: 122px;
      color: rgba(42, 130, 228, 1);
      background-color: rgba(229, 229, 229, 1);
      border-radius: 5px;
      border: 1px solid rgba(229, 229, 229, 1);
    }
    .submit {
      border-radius: 5px;
      width: 202px;
    }
  }
  .show-ewm {
    width: 200px;
  }
}
</style>