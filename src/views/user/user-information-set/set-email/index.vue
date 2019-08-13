<template>
  <div>
    <Header title="设置邮箱"></Header>

    <van-cell-group>
      <van-field
        label="邮箱"
        v-model="model.newEmail"
        :error-message="errorMessage.newEmail"
        type="text"
        placeholder="请输入绑定邮箱"
      />
      <van-field
        label="确认邮箱"
        v-model="model.confimEmail"
        :error-message="errorMessage.confimEmail"
        type="text"
        placeholder="请再次输入绑定邮箱"
      />
    </van-cell-group>

    <div class="bottom_btn">
      <van-button size="large" type="danger" @click="submit">保存</van-button>
    </div>
  </div>
</template>


<script>
import { authProfile } from '@/api/api';
import Header from '@/components/header/Header';
import { CountDown, Field } from 'vant';
import Schema from 'async-validator';
import { log } from 'util';

export default {
  data: () => ({
    error: '',
    model: { newEmail: '', confimEmail: '' },
    errorMessage: { newEmail: '', confimEmail: '' },
    rules: {
      newEmail: [{ type: 'email', required: true, message: '邮箱格式错误' }],
      confimEmail: [
        {
          type: 'email',
          required: true,
          message: '确认邮箱格式错误'
        }
      ]
    }
  }),

  methods: {
    async validator() {
      const schema = new Schema(this.rules);
      schema.validate(
        { newEmail: this.model.newEmail, confimEmail: this.model.confimEmail },
        (errors, fields) => {
          this.error = errors;
          if (errors) {
            if (errors.length === 2) {
              this.errorMessage.newEmail = errors[0].message;
              this.errorMessage.confimEmail = errors[1].message;
            } else {
              if (errors[0].field === 'newEmail') {
                this.errorMessage.newEmail = errors[0].message;
                this.errorMessage.confimEmail = '';
              } else {
                this.errorMessage.newEmail = '';
                this.errorMessage.confimEmail = errors[0].message;
              }
            }
          } else {
            if (this.model.newEmail !== this.model.confimEmail) {
              this.errorMessage.confimEmail = '两次邮箱不一致';
              this.errorMessage.newEmail = '';
              this.error = 'error';
            } else {
              this.errorMessage.confimEmail = '';
              this.errorMessage.newEmail = '';
            }
          }
        }
      );
      return this.error;
    },
    async submit() {
      const res = await this.validator();
      if (!res) {
        const result = await authProfile({ email: this.model.confimEmail });
        if (result && result.data.errno === 0) {
          this.$toast('设置成功');
          this.$router.go(-1);
        }
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
