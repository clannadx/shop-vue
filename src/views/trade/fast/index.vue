<template>
  <div class="fast">
    <Header title="快捷交易"></Header>
    <div class="record">
      <router-link to="/trade/record" tag="span">充币记录</router-link>
    </div>
    <div class="fast-wrapper" v-if="amountWay">
      <van-cell-group>
        <div class="label-address">
          <span>购买金额</span>
          <span @click="changeWay">按数量购买</span>
        </div>
        <van-field
          v-model="model.amount"
          type="number"
          :label-width="20"
          label="¥"
          :error-message="errorMessage.amount"
          placeholder="100元起"
        />
      </van-cell-group>
      <div class="bottom">
        <p class="balance">
          <span>
            约
            <span class="color">{{etmSize}}</span>
            ETM
          </span>
          <span>
            单价
            <span class="color">{{etm}}</span>
            CYN/ETM
          </span>
        </p>
        <van-button class="button" size="small" type="info" @click="submit">购买</van-button>
        <p class="info">
          <van-icon name="info-o" />交易手续费:
          <span class="color">0</span>
        </p>
      </div>
    </div>
    <div class="fast-wrapper" v-else>
      <van-cell-group>
        <div class="label-address">
          <span>购买数量</span>
          <span @click="changeWay">按金额购买</span>
        </div>
        <van-field
          v-model="model.count"
          :label-width="90"
          type="number"
          :error-message="errorMessage.count"
          placeholder="请输入购买数量"
        >
          <span slot="button">ETM</span>
        </van-field>
      </van-cell-group>
      <div class="bottom">
        <p class="balance">
          <span>
            约
            <span class="color">{{etmCost}}</span>
            CYN
          </span>
          <span>
            单价
            <span class="color">{{etm}}</span>
            CYN/ETM
          </span>
        </p>
        <van-button class="button" size="small" type="info" @click="submit">购买</van-button>
        <p class="info">
          <van-icon name="info-o" />交易手续费:
          <span class="color">0</span>
        </p>
      </div>
    </div>
    <div class="note">
      <div class="note-title">注意事项</div>
      <p>快捷交易会以交易所市价，需要网络确认后才能到账。</p>
    </div>
    <van-action-sheet v-model="show">
      <div class="pay_way_group">
        <div class="pay_way_title">选择支付方式</div>
        <van-radio-group v-model="payWay">
          <van-cell-group>
            <van-cell>
              <template slot="title">
                <div class="alipay_way way">
                  <icon-svg class="icon" icon-class="alipay" />支付宝支付
                  <span class="recommend">推荐</span>
                </div>
              </template>
              <van-radio name="1" />
            </van-cell>
            <van-cell>
              <template slot="title">
                <div class="way">
                  <icon-svg class="icon" icon-class="wx" />微信支付
                </div>
              </template>
              <van-radio name="2" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <div class="way-btn">
          <van-button class="cancel" size="small" type="info" @click="cancel">取消</van-button>
          <van-button class="buy" size="small" type="info" @click="comfigWay">获取支付信息</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import { Field, Button, ActionSheet, Radio, RadioGroup } from 'vant';
import Schema from 'async-validator';
import Header from '@/components/header/Header';
import { etmTicker, etmRate, orderSubmit } from '@/api/trade';
import Big from 'big.js';
export default {
  data() {
    return {
      amountWay: true,
      etm: 0,
      show: false,
      payWay: '1',
      error: '',
      model: { amount: '', count: '' },
      errorMessage: { amount: '', count: '' },
      amountRules: {
        amount: [
          {
            required: true,
            message: '最低购买100元',
            validator: (rule, value) => {
              return value >= 100;
            }
          }
        ]
      },
      countRules: {
        count: [
          {
            required: true,
            message: '最低购买0.1',
            validator: (rule, value) => value >= 0.1
          }
        ]
      }
    };
  },
  created() {
    console.log(new Big(3.1415924).round(4, 0).toString());
    this.getEtmPrice();
  },
  computed: {
    etmSize() {
      if (this.amountWay) {
        return this.etm === 0
          ? 0
          : new Big(+this.model.amount).div(new Big(+this.etm)).round(4, 0);
      } else {
        return this.model.count;
      }
    },
    etmCost() {
      if (this.amountWay) {
        return this.model.amount;
      } else {
        return new Big(+this.model.count).times(new Big(this.etm));
      }
    }
  },
  methods: {
    async getEtmPrice() {
      const ticker = await etmTicker();
      const rate = await etmRate();
      if (ticker && rate && ticker.data.success && rate.data.success) {
        this.etm = new Big(ticker.data.data.last)
          .times(new Big(rate.data.data.rate))
          .round(4, 0)
          .toString();
      }
    },
    async validator() {
      let way = this.amountWay ? 'amount' : 'count';
      let obj = this.amountWay
        ? { amount: this.model.amount }
        : { count: this.model.count };
      const schema = new Schema(this[`${way}Rules`]);
      schema.validate(obj, (errors, fields) => {
        if (errors) {
          this.errorMessage[way] = errors[0].message;
        } else {
          this.errorMessage[way] = '';
        }
      });
      return this.errorMessage[way];
    },
    async submit() {
      const res = await this.validator();
      if (!res) {
        this.show = true;
      }
    },
    changeWay() {
      this.amountWay = !this.amountWay;
    },
    async comfigWay() {
      let data = {
        type: this.payWay,
        size: this.etmSize,
        price: this.etm,
        cost: this.etmCost
      };
      const result = await orderSubmit(data);
      if (result && result.data.errno === 0) {
        this.$router.push({
          name: 'info',
          params: { payWay: this.payWay, orderId: result.data.data.orderId }
        });
      } else if (result && result.data.errno !== 0) {
        this.$toast(result.data.errmsg);
      }
    },
    cancel() {
      this.show = false;
    }
  },
  components: {
    Header,
    [Field.name]: Field,
    [ActionSheet.name]: ActionSheet,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup
  }
};
</script>
<style lang="scss" scoped>
.fast {
  .record {
    height: 44px;
    line-height: 44px;
    text-align: right;
    padding-right: 10px;
    color: rgba(42, 130, 228, 1);
    font-size: 14px;
  }
  .fast-wrapper {
    background-color: #fff;
    padding: 25px 5px;

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
      left: 16px;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .label-address {
      padding: 0 15px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      span:first-child {
        color: rgba(56, 56, 56, 1);
      }
      span {
        color: rgba(42, 130, 228, 1);
        font-size: 12px;
      }
    }
    .bottom {
      padding: 10px 10px 0 10px;
      .balance {
        color: rgba(128, 128, 128, 1);
        font-size: 12px;
        display: flex;
        justify-content: space-between;
      }
      .button {
        width: 100%;
        border-radius: 5px;
        margin-top: 20px;
      }
      .info {
        display: flex;
        align-items: center;

        height: 30px;
        color: rgba(128, 128, 128, 1);
        font-size: 12px;
        .van-icon-info-o {
          margin-right: 5px;
          font-size: 14px;
        }
        span {
          margin-left: 5px;
        }
      }
    }
  }
  .note {
    padding: 26px 15px;
    .note-title {
      color: rgba(128, 128, 128, 1);
      font-size: 14px;
      margin-bottom: 10px;
    }
    p {
      color: rgba(255, 141, 26, 1);
    }
  }
  .pay_way_title {
    padding: 15px;
    background-color: #fff;
  }
  .pay_way_group {
    .van-cell__value .van-radio {
      margin-top: 3px;
    }
    .van-icon-success {
      line-height: 1em;
    }
    .way {
      display: flex;
      align-self: center;
      .icon {
        font-size: 28px;
        color: rgba(24, 140, 236, 1);
        margin-right: 10px;
      }
      .wx {
        color: rgba(120, 196, 124, 1);
      }
    }
    .alipay_way {
      .recommend {
        width: 30px;
        height: 18px;
        margin-left: 5px;
        text-align: center;
        line-height: 18px;
        color: rgba(255, 255, 255, 1);
        background-color: rgba(255, 129, 2, 1);
        border-radius: 2px;
        font-size: 10px;
      }
    }
    .way-btn {
      height: 80px;
      display: flex;
      align-items: center;
      padding: 0 15px;
      justify-content: space-between;
      .buy,
      .cancel {
        width: 158px;
        height: 36px;
        font-size: 16px;
      }
      .cancel {
        color: rgba(42, 130, 228, 1);
        background-color: rgba(229, 229, 229, 1);
        border: 0 none;
      }
    }
  }
  .color {
    color: rgba(255, 141, 26, 1);
  }
}
</style>


