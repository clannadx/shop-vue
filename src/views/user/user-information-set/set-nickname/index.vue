<template>
  <div class="set_nickname">
    <Header title="修改昵称"></Header>
    <van-cell-group>
      <van-field v-model="nickName" label="昵称" />
    </van-cell-group>

    <div class="bottom_btn">
      <van-button size="large" type="danger" @click="saveNick">保存</van-button>
    </div>
  </div>
</template>


<script>
import { authProfile } from '@/api/api';
import Header from '@/components/header/Header';
import { Field } from 'vant';
import { setTimeout } from 'timers';

export default {
  data() {
    return {
      nickName: ''
    };
  },

  created() {
    this.getNick();
  },

  methods: {
    getNick() {
      this.nickName = localStorage.getItem('nickName') || '';
    },
    async saveNick() {
      const result = await authProfile({ nickName: this.nickName });
      if (result && result.data.errno === 0) {
        localStorage.setItem('nickName', this.nickName);
        this.$dialog.alert({ message: '保存成功' });
        setTimeout(() => {
          this.$router.go(-1);
        }, 1000);
      }
    }
  },

  components: {
    [Field.name]: Field,
    Header
  }
};
</script>


<style scoped>
.bottom_btn {
  padding: 30px 15px 0 15px;
}
</style>
