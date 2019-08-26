<template>
  <div>
    <h1>授权中。。。</h1>
    {{code}}
    {{type}}
  </div>
</template>

<script>
import { authLoginByXianliao ,authLoginByWeibo} from '@/api/api';
// import location form "@/utils/location-params.js";
import { setLocalStorage } from '@/utils/local-storage';

export default {
  data() {
    return {
      code:'',
      type:''
    };
  },
  created(){
    console.log(window.location.href)
    let code = this.getUrl(window.location.href).code;
    let type = this.getUrl(window.location.href).type;
    this.code = code;
    console.log(code,type)
    if(type === '3'){
      authLoginByXianliao({code})
        .then(res => {
          console.log(res)
          // this.authPage = res.data.data;
          let userInfo = res.data.data.userInfo;
          setLocalStorage({
            Authorization: res.data.data.token,
            avatar: userInfo.avatarUrl,
            nickName: userInfo.nickName
          });

          window.location = '#/user/';
        })
        .catch(err => {
          console.log(err)
        });
    }
    else if(type === '1'){
      authLoginByWeibo({code})
        .then(res => {
          console.log(res)
          // this.authPage = res.data.data;
          let userInfo = res.data.data.userInfo;
          setLocalStorage({
            Authorization: res.data.data.token,
            avatar: userInfo.avatarUrl,
            nickName: userInfo.nickName
          });

          window.location = '#/user/';
        })
        .catch(err => {
          console.log(err)
        });
    }
    
  },
  methods: {
    getUrl(url){
      let str = url.split('?')[1], //  通过"?"得到一个数组,取?后面的参数
        items = str.split('&')  //  通过"&"分割成数组
      let arr, name, value
      let result = {}
      for (let i = 0; i < items.length; i++) {
        arr = items[i].split('=')  //  通过"="分割出每个参数的key和value
        name = arr[0]
        value = arr[1]
        result[name] = value
      }
      return result
    },
  },

};
</script>

<style lang="scss" scoped>

</style>
