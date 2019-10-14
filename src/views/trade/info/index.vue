<template>
  <div class="info-wrapper">
    <Header title="交易信息"></Header>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="info-container">
      <div class="info-header">
        <div class="header-left">
          <div class="title">
            <icon-svg class="icon" icon-class="clock" />请付款
          </div>
          <div class="time">
            请在
            <van-count-down format="mm 分 ss 秒" :time="lastTime"></van-count-down>&nbsp;内完成付款
          </div>
        </div>
        <div class="header-right">联系客服</div>
      </div>
      <div class="info-content">
        <div class="order">
          <p class="title">¥ {{order.cost}}</p>
          <div class="order-information">
            <p>
              <span>单价: ¥ {{order.price}}</span>
              <span>数量: {{order.size}} ETM</span>
            </p>
            <p class="order-num">订单号: {{order.orderSn}}</p>
          </div>
        </div>
        <div class="information">
          <div>{{payName}}</div>
          <p>
            <span>收款人</span>
            <span>
              {{info.username}}
              <copyField :target="info.username"></copyField>
            </span>
          </p>
          <p>
            <span>收款二维码</span>
            <span class="ewm" @click="show=true"></span>
          </p>
          <p>
            <span>{{payName}}账号</span>
            <span>
              {{info.account}}
              <copyField :target="info.account"></copyField>
            </span>
          </p>
        </div>
        <van-cell-group class="orders">
          <div class="label-num">
            <span>填写{{payName}}转账订单号</span>
          </div>
          <van-field
            v-model="model.paySn"
            type="text"
            :label-width="20"
            label
            :error-message="errorMessage.paySn"
            right-icon="info-o"
            placeholder="请输入转账订单号"
          />
        </van-cell-group>
      </div>

      <div class="note">
        <p>在转账过程中请勿备注 ETM、法币交易、sugram 等信息，防止汇款被拦截，账户被冻结等问题。</p>
      </div>
      <div class="btns">
        <van-button class="cancel" size="small" type="info" @click="cancelOrder">取消订单</van-button>
        <van-button class="submit" size="small" type="info" @click="submit">我已付款成功</van-button>
      </div>
      </div>
    </van-pull-refresh>

    <van-popup v-model="show">
      <img class="show-ewm" :src="paypic" />
    </van-popup>
  </div>
</template>

<script>
import { Field, Popup, CountDown, PullRefresh } from 'vant';
import CopyField from '@/components/copy';
import Header from '@/components/header/Header';
import { orderDetail, orderPay, orderCancel } from '@/api/trade';
import Schema from 'async-validator';
export default {
  data() {
    return {
      show: false,
      isLoading: false,
      orderId: '',
      payWay: '',
      model: {
        paySn: ''
      },
      errorMessage: {
        paySn: ''
      },
      rules: {
        paySn: [
          {
            required: true,
            message: '订单号不能为空'
          }
        ]
      },
      addTime: Date.now() / 1000,
      order: {
        orderSn: ''
      },
      info: {
        username: '',
        account: ''
      }
    };
  },
  created() {
    this.payWay = this.$route.params.payWay || '1';
    this.orderId = this.$route.params.orderId;
    this.getDetail(this.orderId);
  },
  computed: {
    payName() {
      return this.payWay === '1' ? '支付宝' : '微信';
    },
    paypic() {
      return this.payWay === '1' ? this.info.alipaypic : this.info.wepaypic;
    },
    lastTime() {
      return this.addTime * 1000 + 15 * 60 * 1000 - Date.now();
    }
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.payWay = this.$route.params.payWay || '1';
        this.orderId = this.$route.params.orderId;
        this.getDetail(this.orderId);
      }, 500);
    },
    async validator() {
      const schema = new Schema(this.rules);
      schema.validate({ paySn: this.model.paySn }, (errors, fields) => {
        if (errors) {
          this.errorMessage.paySn = errors[0].message;
        } else {
          this.errorMessage.paySn = '';
        }
      });
      return this.errorMessage.paySn;
    },
    showPopup() {
      this.show = true;
    },
    async cancelOrder() {
      try {
        const result = await orderCancel({ orderId: this.orderId });
        if (result && result.data.errno === 0) {
          this.$toast('取消成功');
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        } else if (result && result.data.errno !== 0) {
          this.$toast(result.data.errmsg);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getDetail(id) {
      try {
        const result = await orderDetail({ orderId: id });
        if (result && result.data.errno === 0) {
          this.isLoading = false;
          this.order = result.data.data.order;
          this.info = result.data.data.payee;
          this.addTime = result.data.data.timeSecond;
        } else if (result && result.data.errno !== 0) {
          this.$toast(result.data.errmsg);
          this.isLoading = false;
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async submit() {
      try {
        const res = await this.validator();
        if (!res) {
          const data = { orderId: this.orderId, paySn: this.model.paySn };
          const result = await orderPay(data);
          if (result && result.data.errno === 0) {
            this.$dialog
              .alert({
                title: '提示',
                message: '提交成功,请耐心等待审核'
              })
              .then(() => {
                setTimeout(() => {
                  this.$router.go(-1);
                }, 500);
              });
          } else if (result && result.data.errno !== 0) {
            this.$toast(result.data.errmsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [CountDown.name]: CountDown,
    [PullRefresh.name]: PullRefresh,
    CopyField,
    Header
  }
};
</script>

<style lang="scss" scoped>
.info-wrapper {
  background: #fafafa;
  .info-container{
  min-height: calc(100vh - 50px);
  }
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
      .time {
        font-size: 12px;
        .van-count-down {
          display: inline-block;
          font-size: 12px;
          color: rgba(42, 130, 228, 1);
        }
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
    line-height: 22px;
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