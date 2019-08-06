<template>
  <div class="fast">
    <div class="record">
      <router-link to="/wallet/recording" tag="span">充币记录</router-link>
    </div>
    <div class="fast-wrapper" v-if="amountWay">
      <van-cell-group>
        <div class="label-address">
          <span>购买金额</span>
          <span @click="changeWay">按数量购买</span>
        </div>
        <van-field
          v-model="model.amount"
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
            <span class="color">888</span>
            ETM
          </span>
          <span>
            单价
            <span class="color">3</span>
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
            <span class="color">888</span>
            CYN
          </span>
          <span>
            单价
            <span class="color">3</span>
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
  </div>
</template>
<script>
import { Field, Button, Icon } from 'vant';
import Schema from 'async-validator';

export default {
  data() {
    return {
      amountWay: true,
      error: '',
      model: { amount: '', count: '' },
      errorMessage: { amount: '', count: '' },
      amountRules: {
        amount: [
          {
            required: true,
            message: '最低购买1001元',
            validator: (rule, value) => value >= 100
          }
        ]
      },
      countRules: {
        count: [
          {
            required: true,
            message: '最低购买100元',
            validator: (rule, value) => value >= 100
          }
        ]
      }
    };
  },
  methods: {
    async validator() {
      let way = this.amountWay ? 'amount' : 'count';
      const schema = new Schema(this[`${way}Rules`]);
      schema.validate({ way: this.model.way }, (errors, fields) => {
        this.error = errors;
        if (errors) {
          this.errorMessage[way] = errors[0].message;
        } else {
          this.errorMessage[way] = '';
        }
      });
      return this.error;
    },
    async submit() {
      const res = await this.validator();
      if (!res) {
        console.log('submit');
      }
    },
    changeWay() {
      this.amountWay = !this.amountWay;
    }
  },
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon
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
          margin-top: 4px;
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
  .color {
    color: rgba(255, 141, 26, 1);
  }
}
</style>


