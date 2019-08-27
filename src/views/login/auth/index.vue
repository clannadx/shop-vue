<template>
  <div class="start">
    <h1>授权中 ...</h1>
  </div>
</template>

<script>
import { authLoginByXianliao, authLoginByWeibo } from '@/api/api';
// import location form "@/utils/location-params.js";
import { setLocalStorage, getLocalStorage } from '@/utils/local-storage';
import { Loading } from 'vant';
export default {
  data() {
    return {
      code: '',
      type: ''
    };
  },
  created() {
    let code = this.getUrl(window.location.href).code;
    let type = this.getUrl(window.location.href).type;
    this.code = code;
    if (code.length == 0) {
      window.location.href =
        'https://open.xianliao.updrips.com/connect/oauth2/authorize?appid=qBSdYLZEuaTMssbI&redirect_uri=http://47.111.165.42:8080/wx/auth/auth_by_xianliao&response_type=code';
      return;
    }
    if (code.length > 0 && type === '3') {
      authLoginByXianliao({ code })
        .then(res => {
          let userInfo = res.data.data.userInfo;
          setLocalStorage({
            Authorization: res.data.data.token,
            avatar: userInfo.avatarUrl,
            nickName: userInfo.nickName
          });
          setTimeout(() => {
            window.location = '#/wallet/home';
          }, 2000);
        })
        .catch(err => {
          this.$toast('授权失败，请稍后再试');
          console.log(err);
        });
    } else if (code.length > 0 && type === '1') {
      authLoginByWeibo({ code })
        .then(res => {
          console.log(res);
          // this.authPage = res.data.data;
          let userInfo = res.data.data.userInfo;
          setLocalStorage({
            Authorization: res.data.data.token,
            avatar: userInfo.avatarUrl,
            nickName: userInfo.nickName
          });
          setTimeout(() => {
            window.location = '#/wallet/home';
          }, 2000);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  methods: {
    getUrl(url) {
      if (url.indexOf('?') == -1) return {};
      let str = url.split('?')[1], //  通过"?"得到一个数组,取?后面的参数
        items = str.split('&'); //  通过"&"分割成数组
      let arr, name, value;
      let result = {};
      for (let i = 0; i < items.length; i++) {
        arr = items[i].split('='); //  通过"="分割出每个参数的key和value
        name = arr[0];
        value = arr[1];
        result[name] = value;
      }
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.start {
  background: url(../../../assets/images/start.png);
  position: relative;
  h1 {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translate(-50%, 0);
    font-weight: 500;
  }
}
</style>
