<template>
  <md-field-group class="register_submit">
    <md-field v-model="code" icon="mobile" placeholder="请输入验证码">
      <div slot="rightIcon" @click="getCode" class="getCode red">
        <van-count-down v-if="counting" :time="60*1000" format="ss 秒" @finish="countdownend" />
        <span v-else>获取验证码</span>
      </div>
    </md-field>
    <md-field v-model="password" icon="lock" placeholder="请输入密码" />
    <md-field v-model="repeatPassword" icon="lock" placeholder="请再次确认密码" />

    <div class="register_submit_btn">
      <van-button type="danger" size="large" @click="registerSubmit">确定</van-button>
    </div>
  </md-field-group>
</template>

<script>
import field from '@/components/field/';
import fieldGroup from '@/components/field-group/';
import { CountDown } from 'vant';

export default {
  data() {
    return {
      counting: false,
      code: '',
      password: '',
      repeatPassword: ''
    };
  },

  methods: {
    registerSubmit() {
      this.$router.push({
        name: 'registerStatus',
        params: { status: 'success' }
      });
    },

    getCode() {
      this.counting = true;
    },
    countdownend() {
      this.counting = false;
    }
  },

  components: {
    [field.name]: field,
    [fieldGroup.name]: fieldGroup,
    [CountDown.name]: CountDown
  }
};
</script>


<style lang="scss" scoped>
@import '../../../assets/scss/mixin';

.register_submit {
  padding-top: 40px;
  background-color: #fff;
}

.register_submit_btn {
  padding-top: 30px;
}

.getCode {
  @include one-border(left);
  text-align: center;
}

.time_down {
  color: $red;
}
</style>
