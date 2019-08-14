<template>
  <div class="recharge">
    <div class="record">
      <router-link to="/wallet/recording" tag="span">充币记录</router-link>
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
          <span class="all" slot="button" size="small" type="primary">全部</span>
        </van-field>
      </van-cell-group>
      <div class="bottom">
        <p class="balance">
          当前可提
          <span>8888</span> ETM
        </p>
        <van-button class="button" size="small" type="info" @click="submit">提现</van-button>
      </div>
    </div>
    <div class="recharge-foot">
      <div class="title">注意事项</div>
      <p>需要网络确认后才能到账，任何非 ETM 资产充值到 ETM 地址后不可找回！充值最小额度为 0.01 ETM，小于 0.01 ETM 将无法到账。</p>
    </div>
  </div>
</template>
<script>
import { Field, Button } from 'vant';
import Schema from 'async-validator';

export default {
  data() {
    return {
      errorMessage: '',
      model: { count: '' },
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
  methods: {
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
        console.log('submit');
      }
    }
  },
  components: {
    [Field.name]: Field
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
      padding: 0 10px;
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


