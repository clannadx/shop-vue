<template>
  <div>
    <Header title="设置支付密码"></Header>

    <van-cell-group>
      <van-field
        label="新密码"
        v-model="newPassword"
        :error-message="errorMessage.newPassword"
        type="password"
        placeholder="请输入6位数字支付密码"
      />
      <van-field
        label="确认密码"
        v-model="confimPassword"
        :error-message="errorMessage.confimPassword"
        type="password"
        placeholder="请再次输入6位数字支付密码"
      />
      <!-- <van-field v-model="code" center clearable label="短信验证码" placeholder="请输入短信验证码">
        <van-count-down v-if="counting" :time="60*1000" format="ss 秒" @finish="countdownend" />
        <van-button v-else slot="button" size="small" @click="getCode" type="primary">获取验证码</van-button>
      </van-field>-->
    </van-cell-group>

    <div class="bottom_btn">
      <van-button size="large" type="danger" @click="setpassword">保存</van-button>
    </div>
  </div>
</template>


<script>
import { authProfile } from '@/api/api';
import Header from '@/components/header/Header';
import { CountDown, Field } from 'vant';

export default {
  data: () => ({
    newPassword: '',
    confimPassword: '',
    errorMessage: {
      newPassword: '',
      confimPassword: ''
    }
  }),

  methods: {
    setpassword() {
      let reg = /^[0-9]{6}$/;
      if (!reg.test(this.newPassword) || this.newPassword.length !== 6) {
        this.errorMessage.newPassword = '请输入6位数字支付密码';
        this.errorMessage.confimPassword = '';
      } else if (
        !reg.test(this.confimPassword) ||
        this.confimPassword.length !== 6
      ) {
        this.errorMessage.newPassword = '';
        this.errorMessage.confimPassword = '请输入6位数字支付密码';
      } else if (this.newPassword !== this.confimPassword) {
        this.errorMessage.newPassword = '';
        this.errorMessage.confimPassword = '两次输入的密码不一致';
      } else {
        this.errorMessage.newPassword = '';
        this.errorMessage.confimPassword = '';
        this.payPassword();
      }
    },
    async payPassword() {
      const result = await authProfile({ payPassword: this.newPassword });
      if (result && result.data.errno === 0) {
        this.$toast('设置成功');
        this.$router.go(-1);
      }
    }
  },

  components: {
    [Field.name]: Field,
    [CountDown.name]: CountDown,
    Header
  }
};
</script>


<style lang="scss" scoped>
@import '../../../../assets/scss/var';
@import '../../../../assets/scss/mixin';
.bottom_btn {
  padding: 30px 15px 0 15px;
}

.verifi_code {
  @include one-border;
  padding-left: 10px;
  &::after {
    border-bottom: 0;
    border-left: 1px solid $border-color;
  }

  &_counting {
    color: $font-color-gray;
  }
}
.getCode {
  @include one-border(left);
  text-align: center;
}
</style>
