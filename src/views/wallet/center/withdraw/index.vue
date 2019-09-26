<template>
  <div class="withdraw">
    <Header title="提现"></Header>
    <div class="record">
      <router-link to="/wallet/recording" tag="span">充币记录</router-link>
    </div>
    <div class="withdraw-wrapper">
      <van-cell-group>
        <van-field
          v-model="model.count"
          :label-width="90"
          type="number"
          label="提币数量"
          placeholder="最低提币 0.01 个"
          right-icon="提取全部"
          :error-message="errorMessage"
        >
          <span class="all" slot="button" size="small" @click="all" type="primary">全部</span>
        </van-field>
      </van-cell-group>
      <div class="bottom">
        <p class="balance">
          当前可提
          <span>{{allBalance}}</span> ETM
        </p>
        <van-button
          class="button"
          :loading="loading"
          loading-text="加载中..."
          size="small"
          type="info"
          @click="submit"
        >提现</van-button>
      </div>
    </div>
    <div class="note">
      <div class="note-title">提币须知</div>
      <p>支持金额：xxxxxxxxxx</p>
      <p>提现限额：xxxxxxx</p>
      <p>提现手续费：xxxxxxxxxx</p>
    </div>
  </div>
</template>
<script>
import { Field, Button } from 'vant';
import Header from '@/components/header/Header';
import Schema from 'async-validator';
import { dappBalance, dappDraw } from '@/api/api';
import getToken from '@/utils/location-param';
import { setLocalStorage } from '@/utils/local-storage';
import mixins from '@/mixin/mixins';
import Big from 'big.js';
export default {
  mixins: [mixins],
  data() {
    return {
      loading: false,
      isLoading: false,
      errorMessage: '',
      model: { count: '' },
      allBalance: '',
      rules: {
        count: [
          {
            required: true,
            message: '最低提币0.01个',
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
      this.$router.replace({ path: '/withdraw' });
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
        const result = await dappBalance();
        this.getAddress();
        if (result && result.data.errno === 0) {
          if (result.data.data < 0.1 * Math.pow(10, 8)) {
            this.allBalance = this.floorNum(new Big(result.data.data)
              .div(Math.pow(10, 8)).toString());
          } else {
            const num = new Big(0.1);
            this.allBalance = this.floorNum(new Big(result.data.data)
              .div(Math.pow(10, 8))
              .minus(num).toString());
            console.log(new Big(result.data.data)
              .div(Math.pow(10, 8))
              .minus(num).toPrecision(2));
              
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    all() {
      this.model.count = this.allBalance;
    },
    async draw() {
      try {
        const data = {
          address: this.userAddress,
          amount: new Big(this.model.count).plus(0.1).times(Math.pow(10, 8))
        };
        this.loading = true;
        const result = await dappDraw(data, { timeout: 20000 });
        if (result && result.data.errno === 0) {
          this.loading = false;
          this.$toast('提现成功');
          setTimeout(() => {
            this.init();
          }, 4000);
        } else {
          this.$toast(result.data.errmsg);
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
        this.$dialog
          .confirm({
            title: '提示',
            message: '确认提现'
          })
          .then(() => {
            this.draw();
          })
          .catch(() => {
            // on cancel
          });
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
.withdraw {
  .record {
    height: 44px;
    line-height: 44px;
    text-align: right;
    padding-right: 10px;
    color: rgba(42, 130, 228, 1);
    font-size: 14px;
  }
  .withdraw-wrapper {
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
        margin-top: 50px;
      }
    }
  }
  .note {
    padding: 26px 15px;
    .note-title {
      color: rgba(128, 128, 128, 1);
      font-size: 14px;
    }
    p {
      color: rgba(166, 166, 166, 1);
    }
  }
}
</style>


