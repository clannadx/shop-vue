<template>
  <div>
    <Header title="修改手机号"></Header>
    <van-cell-group>
      <van-field label="登录密码" v-model="password" type="password" placeholder="请输入登录密码" />

      <van-field label="新手机号" v-model="mobile" placeholder="请输入新手机号" />

      <van-field v-model="code" center clearable label="短信验证码" placeholder="请输入短信验证码">
        <van-count-down v-if="counting" :time="60*1000" format="ss 秒" @finish="countdownend" />
        <van-button v-else slot="button" size="small" @click="getCode" type="primary">获取验证码</van-button>
      </van-field>
    </van-cell-group>

    <div class="bottom_btn">
      <van-button size="large" type="danger" @click="saveMobile">保存</van-button>
    </div>
  </div>
</template>


<script>
import { authCaptcha } from '@/api/api';
import Header from '@/components/header/Header';

import { Field, CountDown } from 'vant';

export default {
  data: () => ({
    password: '',
    mobile: '',
    code: '',
    counting: false
  }),

  methods: {
    getCode() {
      if (!this.counting && this.vuelidate()) {
        authCaptcha({
          mobile: this.mobile,
          type: 'bind-mobile'
        })
          .then(res => {
            console.log(res);
            this.$toast.success('发送成功');
            this.counting = true;
          })
          .catch(error => {
            this.$toast.fail(error.data.errmsg);
            this.counting = false;
          });
      }
    },
    countdownend() {
      this.counting = false;
    },
    vuelidate() {
      if (this.mobile === '') {
        this.$toast.fail('请输入号码');
        return false;
      }
      return true;
    },
    saveMobile() {
      console.log('保存手机号');
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
</style>
