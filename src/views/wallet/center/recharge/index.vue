<template>
  <div class="recharge">
    <Header title="充币"></Header>
    <div class="record">
      <router-link to="/wallet/rechargeRecord" tag="span">充币记录</router-link>
    </div>
    <div class="recharge-wrapper">
      <van-cell-group>
        <van-field
          v-model="model.count"
          :label-width="90"
          type="number"
          label="充币数量"
          placeholder="最低充币 0.01 个"
          right-icon="提取全部"
          :error-message="errorMessage"
        >
          <span class="all" slot="button" size="small" @click="all" type="primary">全部</span>
        </van-field>
        <van-field
          v-model="password"
          :label-width="90"
          type="password"
          label="二级密码"
          placeholder="请输入二级密码"
        ></van-field>
      </van-cell-group>
      <div class="bottom">
        <p class="balance">
          当前可充
          <span>{{allBalance}}</span> ETM
        </p>
        <van-button
          class="button"
          :loading="loading"
          loading-text="加载中..."
          size="small"
          type="info"
          @click="submit"
        >充币</van-button>
      </div>
    </div>
    <div class="recharge-foot">
      <div class="title">注意事项</div>
      <p>1.若有二级密码则需要输入</p>
      <p>2.需要网络确认后才能到账，任何非 ETM 资产充值到 ETM 地址后不可找回！充值最小额度为 0.01 ETM，小于 0.01 ETM 将无法到账。</p>
    </div>
  </div>
</template>
<script>
import { Field, Button } from 'vant';
import Header from '@/components/header/Header';
import Schema from 'async-validator';
import getToken from '@/utils/location-param';
import { setLocalStorage } from '@/utils/local-storage';
import mixins from '@/mixin/mixins';
import { balanceApi, dappBalance, dappRecharge } from '@/api/api';
import Big from 'big.js';
export default {
  data() {
    return {
      errorMessage: '',
      model: { count: '' },
      allBalance: '',
      password: '',
      isLoading: false,
      loading: false,
      rules: {
        count: [
          {
            required: true,
            message: '最低充币0.01个',
            validator: (rule, value) => value >= 0.01
          }
        ]
      }
    };
  },
  created() {
    let token = getToken('token');
    if (token) {
      setLocalStorage({
        Authorization: token,
        avatar: '',
        nickName: ''
      });
      this.$router.replace({ path: '/recharge' });
    }
    this.init();
  },
  methods: {
    floorNum(value){
      return  this.decimalAdjust('floor', value, -2);
    },
    decimalAdjust(type, value, exp) {
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
      }
      value = +value;
      exp = +exp;
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
      }
      // Shift
      value = value.toString().split('e');
      value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
      // Shift back
      value = value.toString().split('e');
      let result =  +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
      if(Number.isInteger(result)){
        result = (''+result+'.00')
      }
      return result
    },
    async init() {
      try {
        this.isLoading = false;
        const result = await balanceApi();
        if (result && result.data.errno === 0) {
          if (result.data.data < 0.1 * Math.pow(10, 8)) {
            this.allBalance = this.floorNum(new Big(result.data.data)
              .div(Math.pow(10, 8))
              .toString());
          } else {
            const num = new Big(0.1);
            this.allBalance = this.floorNum(new Big(result.data.data)
              .div(Math.pow(10, 8))
              .minus(num)
              .toString());
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    all() {
      this.model.count = this.allBalance;
    },
    async recharge(amount) {
      try {
        this.loading = true;
        const params = { amount: amount, secondSecret: this.password };
        const result = await dappRecharge(params);
        if (result && result.data.errno === 0) {
          this.loading = false;
          this.$toast('充值成功');
          setTimeout(() => {
            this.init();
          }, 4000);
        } else {
          this.$toast('充值失败,请稍后再试');
          this.loading = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async validator() {
      const schema = new Schema(this.rules);
      schema.validate({ count: this.model.count }, (errors, fields) => {
        if (errors) {
          this.errorMessage = errors[0].message;
        } else {
          this.errorMessage = '';
        }
      });
      return this.errorMessage;
    },
    async submit() {
      const res = await this.validator();
      if (!res) {
        let amount = new Big(this.model.count).times(Math.pow(10, 8));
        this.recharge(amount);
      }
    }
  },
  components: {
    [Field.name]: Field,
    Header
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
  .recharge-wrapper {
    background-color: #fff;
    padding: 25px 5px;

    .all {
      color: rgba(42, 130, 228, 1);
      font-size: 14px;
    }
    .van-cell:not(:last-child)::after {
      right: 16px;
    }
    .van-cell:last-child::after {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 16px;
      bottom: 0;
      left: 90px;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .label-address {
      padding-left: 15px;
      color: rgba(56, 56, 56, 1);
      font-size: 14px;
    }
    .bottom {
      padding: 10px 10px 0 10px;
      .balance {
        color: rgba(128, 128, 128, 1);
        font-size: 14px;
        span {
          color: rgba(255, 141, 26, 1);
        }
      }
      .button {
        width: 100%;
        border-radius: 5px;
        margin-top: 30px;
      }
    }
  }
  .recharge-foot {
    padding: 20px 23px;
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


