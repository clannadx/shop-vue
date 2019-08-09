<template>
  <div class="payment">
    <van-nav-bar title="支付" left-arrow @click-left="onClickLeft" />
    <div class="time_down payment_group">
      请在
      <span class="red">半小时内</span>
      完成付款，否则系统自动取消订单
    </div>

    <van-cell-group class="payment_group">
      <van-cell title="订单编号" :value="order.orderInfo.orderSn" />
      <van-cell title="实付金额">
        <span class="red">{{order.orderInfo.actualPrice *100 | yuan}}</span>
      </van-cell>
    </van-cell-group>

    <div class="pay_way_group">
      <div class="pay_way_title">选择支付方式</div>
      <van-radio-group v-model="payWay">
        <van-cell-group>
          <van-cell>
            <template slot="title">
              <img class="pay-icon" src="../../../assets/images/etm_pay.png" alt="etm" />
            </template>
            <van-radio name="etm" />
          </van-cell>
          <!-- <van-cell>
            <template slot="title">
              <img src="../../../assets/images/wx_pay.png" alt="微信支付" width="113" height="23" />
            </template>
            <van-radio name="wx" />
          </van-cell>-->
        </van-cell-group>
      </van-radio-group>
    </div>

    <van-button class="pay_submit" @click="pay" type="primary" bottomAction>去支付</van-button>
  </div>
</template>

<script>
import { Radio, RadioGroup, Dialog, NavBar } from 'vant';
import Header from '@/components/header/Header';
import { orderDetail, orderPrepay, payOrder } from '@/api/api';
import _ from 'lodash';

export default {
  name: 'payment',

  data() {
    return {
      payWay: 'etm',
      order: {
        orderInfo: {},
        orderGoods: []
      },
      orderId: 0
    };
  },
  created() {
    if (_.has(this.$route.params, 'orderId')) {
      this.orderId = this.$route.params.orderId;
      this.getOrder(this.orderId);
    }
  },
  methods: {
    changeAmount(str) {
      if (str.includes('.')) {
        const num = 8;
        const pointPos = str.lastIndexOf('.');
        let last = str.length - str.lastIndexOf('.') - 1;
        if (last > 8) {
          str = str.substr(0, pointPos + 9);
          last = str.length - str.lastIndexOf('.') - 1;
        }
        const zero = ''.padEnd(num - last, '0');
        return parseInt(str.replace('.', '') + zero);
      } else {
        const zero = ''.padEnd(8, '0');
        return parseInt(str + zero);
      }
    },
    onClickLeft() {
      this.$router.push('/user/order/list/1');
    },
    getOrder(orderId) {
      orderDetail({ orderId: orderId }).then(res => {
        this.order = res.data.data;
      });
    },
    async pay() {
      try {
        let params = {
          amount: this.changeAmount('' + this.order.orderInfo.actualPrice),
          orderSn: this.order.orderInfo.orderSn
        };
        const result = await Dialog.confirm({
          message: '确认支付?'
        });
        if (result) {
          const res = await payOrder(params);
          if (res && res.data.errno === 0) {
            this.$router.push({
              name: 'paymentStatus',
              params: {
                status: 'success'
              }
            });
          } else {
            this.$toast(res.data.errmsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  },

  components: {
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Dialog.name]: Dialog,
    [NavBar.name]: NavBar
  }
};
</script>

<style lang="scss" scoped>
.payment_group {
  margin-bottom: 10px;
}

.time_down {
  background-color: #fffeec;
  padding: 10px 15px;
}

.pay_submit {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.pay_way_group img {
  vertical-align: middle;
}

.pay_way_title {
  padding: 15px;
  background-color: #fff;
}
.pay_way_group {
  .pay-icon {
    height: 28px;
  }
  .van-cell__value .van-radio {
    margin-top: 3px;
  }
  .van-icon-success {
    line-height: 1em;
  }
}
</style>
