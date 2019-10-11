<template>
  <div>
    <Header title="提现"></Header>

    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="withdraw">
        <div class="record">
          <router-link to="/wallet/recording" tag="span">提币记录</router-link>
        </div>
        <div class="withdraw-wrapper">
          <van-cell-group>
            <div class="label-address">提币地址</div>
            <van-field
              v-model="model.address"
              :label-width="90"
              right-icon="ewm"
              :error-message="errorMessage.address"
              placeholder="区块地址"
            />
            <van-field
              v-model="model.count"
              :label-width="90"
              type="number"
              label="提币数量"
              placeholder="最低0.1 个"
              right-icon="提取全部"
              :error-message="errorMessage.count"
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
          <p>提现手续费：0.1ETM</p>
          <p>注意：产生的手续费从账户余额中扣</p>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import { Field, Button, PullRefresh } from 'vant';
import { dappBalance, dappDraw } from '@/api/api';
import Header from '@/components/header/Header';
import Schema from 'async-validator';
import Big from 'big.js';
export default {
  data() {
    return {
      error: '',
      loading: false,
      isLoading: false,
      allBalance: '',
      model: { address: '', count: '' },
      errorMessage: { address: '', count: '' },
      rules: {
        address: [
          {
            required: true,
            message: '地址格式错误',
            validator: (rule, value) => value.length >= 32 && value.length <= 34
          }
        ],
        count: [
          {
            required: true,
            message: '最低提币不小于0.1个',
            validator: (rule, value) => value >= 0.1
          }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    floorNum(value) {
      return this.decimalAdjust('floor', value, -2);
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
      value = Math[type](
        +(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp))
      );
      // Shift back
      value = value.toString().split('e');
      let result = +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
      if (Number.isInteger(result)) {
        result = '' + result + '.00';
      }
      return result;
    },
    onRefresh() {
      setTimeout(() => {
        this.init();
      }, 500);
    },
    async init() {
      try {
        this.isLoading = false;
        const result = await dappBalance();
        if (result && result.data.errno === 0) {
          if (result.data.data < 0.1 * Math.pow(10, 8)) {
            this.allBalance = this.floorNum(
              new Big(result.data.data).div(Math.pow(10, 8)).toString()
            );
          } else {
            const num = new Big(0.1);
            this.allBalance = this.floorNum(
              new Big(result.data.data)
                .div(Math.pow(10, 8))
                .minus(num)
                .toString()
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async validator() {
      const schema = new Schema(this.rules);
      schema.validate(
        { address: this.model.address, count: this.model.count },
        (errors, fields) => {
          this.error = errors;
          if (errors) {
            if (errors.length === 2) {
              this.errorMessage.address = errors[0].message;
              this.errorMessage.count = errors[1].message;
            } else {
              if (errors[0].field === 'address') {
                this.errorMessage.address = errors[0].message;
                this.errorMessage.count = '';
              } else {
                this.errorMessage.address = '';
                this.errorMessage.count = errors[0].message;
              }
            }
          } else {
            this.errorMessage.count = '';
            this.errorMessage.address = '';
          }
        }
      );
      return this.error;
    },
    all() {
      this.model.count = this.allBalance;
    },
    async draw() {
      try {
        const data = {
          address: this.model.address,
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
    async submit() {
      try {
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
      } catch (error) {
        console.log(error);
      }
    }
  },
  components: {
    Header,
    [Field.name]: Field,
    [PullRefresh.name]: PullRefresh
  }
};
</script>
<style lang="scss" scoped>
.withdraw {
  min-height: calc(100vh - 50px);
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


