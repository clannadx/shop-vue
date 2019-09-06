import axios from 'axios'
import { Dialog, Toast } from 'vant';
import { removeLocalStorage } from '@/utils/local-storage';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (!config.headers['X-Litemall-Token']) {
      config.headers['X-Litemall-Token'] = `${window.localStorage.getItem(
        'Authorization'
      ) || ''}`;
    }
    return config;
  },
  err => Promise.reject(err)
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.errno === 501) {
      Toast.fail('已过期\n正在重新登录');
      setTimeout(() => {
        // window.location.href = '#/login'
        window.location.href = 'https://open.xianliao.updrips.com/connect/oauth2/authorize?appid=qBSdYLZEuaTMssbI&redirect_uri=http://47.111.165.42:8080/wx/auth/auth_by_xianliao&response_type=code';
        return false;
      }, 500);
      return Promise.reject('error')
    } else if (res.errno === 502) {
      Toast.fail('正在维护，请稍后再试');
      removeLocalStorage('Authorization');
      removeLocalStorage('avatar');
      removeLocalStorage('nickName');
      return Promise.reject('error')
    } else if (res.errno === 401) {
      Toast.fail('参数不对');
      return Promise.reject('error')
    } else if (res.errno === 402) {
      Toast.fail('参数值不对');
      return Promise.reject('error')
    } else if (res.errno !== 0) {
      // 非5xx的错误属于业务错误，留给具体页面处理
      return Promise.resolve(response)
    } else {
      return response
    }
  }, error => {
    console.log('err' + error)// for debug
    Dialog.alert({
      title: '警告',
      message: '登录连接超时'
    });
    return Promise.reject(error)
  })

export default service
