<template>
  <div class="wallet-home">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="wallet-balance">
        <p class="title">账户余额（ETM）</p>
        <div class="new-balance" v-if="newBalacne">
          新的充值已到账！
          <van-button
            class="btn"
            :loading="loading"
            @click="confim"
            loading-size="12px"
            loading-text="确认"
          >确认</van-button>
        </div>
        <div v-else>
          <h3>{{balance.origin}}</h3>
          <p class="trans">≈ {{balance.cny}} CNY/ {{balance.usdt}} USDT / {{balance.btc}} BTC</p>
        </div>

        <div class="address">
          {{userAddress}}
          <span
            title="复制"
            type="copy"
            v-clipboard:copy="userAddress"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            class="wallet-icon copyAddress"
          >
            <icon-svg icon-class="copy" />
          </span>
        </div>
        <ul class="operating">
          <router-link tag="li" to="/wallet/recharge">
            <icon-svg class="wallet-icon wallet" icon-class="pull" />充币
          </router-link>
          <router-link tag="li" to="/wallet/withdraw">
            <icon-svg class="wallet-icon wallet" icon-class="get" />提币
          </router-link>
        </ul>
      </div>

      <div class="notice">
        <div class="notice-contanter">
          <van-swipe
            class="notice-swipe"
            style="height:20px"
            :show-indicators="false"
            :touchable="false"
            :autoplay="2000"
            loop
            vertical
          >
            <van-swipe-item class="item" v-for="(item,i) in randomData" :key="i">
              {{item.name}} 刚刚购买了
              <span class="count">{{item.num}}</span> ETM
            </van-swipe-item>
          </van-swipe>
          <router-link tag="span" to="/trade/home" class="buy">去购买 ></router-link>
        </div>
      </div>

      <div class="banner">
        <van-swipe :loop="false" :width="210" :height="89" :show-indicators="false">
          <van-swipe-item>
            <img src="../../../assets/images/banner01.png" />
          </van-swipe-item>
          <van-swipe-item>
            <img src="../../../assets/images/banner02.png" />
          </van-swipe-item>
          <van-swipe-item>
            <img src="../../../assets/images/banner03.png" />
          </van-swipe-item>
          <van-swipe-item>
            <img src="../../../assets/images/banner01.png" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="application">
        <div class="title">应用</div>
        <ul class="app-content">
          <router-link tag="li" to="/">
            <icon-svg class="wallet-icon icon" icon-class="shoping" />匿名商城
          </router-link>
          <router-link tag="li" to="/trade/home">
            <icon-svg class="wallet-icon icon" icon-class="wallet" />法币交易
          </router-link>
          <li @click="noOpen">
            <icon-svg class="wallet-icon icon" icon-class="envelope" />发红包
          </li>
          <li @click="noOpen">
            <icon-svg class="wallet-icon icon" icon-class="account" />账单
          </li>
          <router-link tag="li" to="/user/information">
            <icon-svg class="wallet-icon icon" icon-class="safe" />安全设置
          </router-link>
        </ul>
      </div>
    </van-pull-refresh>
    <div class="share">
      <div class="share-item collection">
        <icon-svg class="wallet-icon icon" icon-class="collection" />收藏
      </div>
      <div class="share-item" @click="share">
        <icon-svg class="wallet-icon icon" icon-class="share" />分享
      </div>
    </div>
  </div>
</template>
<script>
import { Swipe, SwipeItem, PullRefresh } from 'vant';
import { data } from './data.js';
import { authInfo, balanceApi, dappBalance, dappRecharge } from '@/api/api';
import mixins from '@/mixin/mixins';
import Big from 'big.js';

export default {
  mixins: [mixins],
  data() {
    return {
      name: data,
      isLoading: false,
      mainBalance: '',
      balance: {
        origin: '0000',
        cny: '',
        usdt: '',
        btc: ''
      },
      newBalacne: false,
      loading: false
    };
  },
  sockets: {
    okex_ticker: function(msg) {
      this.balance.usdt = (this.balance.origin * msg.last).toFixed(2);
    },
    okex_rate: function(msg) {
      this.balance.cny = (this.balance.usdt * msg.rate).toFixed(2);
    },
    okex_btc_rate: function(msg) {
      this.balance.btc = (this.balance.usdt * msg.rate).toFixed(2);
    }
  },
  created() {
    this.init();
  },
  computed: {
    randomData() {
      let arr = [];
      this.shuffle(this.name).forEach((element, i) => {
        arr[i] = {
          name: element + '**',
          num: (Math.random() * 500 + 10).toFixed() + '0'
        };
      });
      return arr;
    }
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.init();
      }, 500);
    },
    changeCount(count) {
      return (count / Math.pow(10, 8)).toFixed(2);
    },
    async init() {
      try {
        // this.$toast.loading({
        //   duration: 6000,
        //   mask: true,
        //   message: '加载中...'
        // });
        const res = await balanceApi();
        if (res && res.data.errno === 0) {
          this.isLoading = false;
          if (res.data.data >= Math.pow(10, 8) * 0.1) {
            this.mainBalance = res.data.data;
            this.newBalacne = true;
          } else {
            this.newBalacne = false;
          }
          this.getAddress();
          this.getBalance();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getBalance() {
      try {
        const result = await dappBalance();
        if (result && result.data.errno === 0) {
          this.balance.origin = this.changeCount(result.data.data);
          // this.$toast.clear();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async recharge(amount) {
      try {
        const params = { amount: amount };
        const result = await dappRecharge(params);
        if (result && result.data.errno === 0) {
          setTimeout(() => {
            this.getBalance();
            this.newBalacne = false;
            this.loading = false;
          }, 4000);
        } else if (result && result.data.errno != 0) {
          setTimeout(() => {
            this.loading = false;
            this.$toast('请稍后再试');
          }, 4000);
        }
      } catch (error) {
        console.log(error);
      }
    },
    shuffle(arr) {
      for (var i = arr.length - 1; i >= 0; i--) {
        var randomIdx = Math.floor(Math.random() * (i + 1));
        var itemAtIdx = arr[randomIdx];
        arr[randomIdx] = arr[i];
        arr[i] = itemAtIdx;
      }
      return arr;
    },
    onCopy: function(e) {
      this.$toast('复制成功');
    },
    onError: function(e) {
      this.$toast('复制失败，请重试');
    },
    confim() {
      this.loading = true;
      this.mainBalance = new Big(this.mainBalance).minus(Math.pow(10, 7));
      this.recharge(this.mainBalance);
    },
    noOpen() {
      this.$toast('暂未开放');
    },
    share() {
      // window.location.href =
      //   'https://open.xianliao.updrips.com/connect/oauth2/authorize?appid=qBSdYLZEuaTMssbI&redirect_uri=http://47.111.165.42:8080/wx/auth/auth_by_xianliao&response_type=code#xianliao_redirect';
    }
  },
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [PullRefresh.name]: PullRefresh
  }
};
</script>
<style lang="scss" scoped>
.van-pull-refresh {
  height: calc(100vh - 10px);
}
.wallet-home {
  padding: 10px;
  position: relative;
  .wallet-balance {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    text-align: center;
    width: 100%;
    padding: 0 10px;
    margin: 0 auto;
    margin-bottom: 10px;
    background-color: rgba(255, 87, 80, 0.9934640522875817);
    border-radius: 5px;
    color: #fff;
    .new-balance {
      margin: 15px 0;
      color: rgba(255, 255, 255, 1);
      font-size: 15px;
      .btn {
        width: 66px;
        height: 28px;
        color: rgba(255, 255, 255, 1);
        background-color: rgba(255, 195, 0, 1);
        border-radius: 5px;
        font-size: 15px;
        border: 0 none;
        margin-left: 10px;
        padding: 0;
        line-height: 28px;
        .van-button__text {
          font-size: 14px;
        }
        .van-loading__circular {
          color: rgb(152, 109, 109);
        }
      }
    }
    .title {
      font-size: 14px;
      letter-spacing: 1px;
      line-height: 24px;
      margin-top: 10px;
    }
    h3 {
      font-size: 46px;
      font-weight: normal;
    }
    .address {
      @include one-border(bottom, #d0d0d0);
      line-height: 26px;
      color: rgba(229, 229, 229, 1);
      font-size: 12px;
      padding-bottom: 5px;
      .copy {
        padding: 3px;
        margin-left: 3px;
      }
    }
    .trans {
      font-size: 12px;
      color: rgba(229, 229, 229, 1);
    }
    .operating {
      display: flex;
      justify-content: space-between;
      height: 30px;
      li {
        text-align: center;
        width: 50%;
        font-size: 12px;
        align-self: center;
        .wallet {
          font-size: 12px;
          margin-right: 3px;
        }
      }
      li:first-child {
        @include one-border(right, #d0d0d0);
        &:after {
          top: 2px;
          height: 150%;
        }
      }
    }
  }
  .notice {
    padding: 5px 10px;
    border-radius: 5px;
    background: url(../../../assets/images/notive.svg) no-repeat 5px center #fff;
    background-size: 20px 20px;
    .icon {
      width: 20px;
      margin-right: 10px;
    }
    .notice-contanter {
      padding-left: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: rgba(80, 80, 80, 1);
      .notice-swipe {
        width: 250px;
        line-height: 20px;
        overflow: hidden;
      }
      .buy {
        color: rgba(212, 48, 48, 1);
      }
      .count {
        color: rgba(255, 87, 51, 1);
      }
    }
  }
  .banner {
    margin: 10px 0;
    img {
      width: 180px;
    }
  }
  .application {
    background-color: #fff;
    border-radius: 5px;
    width: 100%;
    padding: 10px 10px 0 10px;
    margin: 0 auto;
    .title {
      position: relative;
      font-size: 14px;
      padding-left: 10px;
      margin-bottom: 10px;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 200%;
        transform: scale(0.5);
        transform-origin: 0 0;
        pointer-events: none;
        box-sizing: border-box;
        border-left: 5px solid rgba(42, 130, 228, 1);
      }
    }
    .app-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      li {
        width: 33.3%;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-bottom: 10px;
        color: rgba(80, 80, 80, 1);
        font-size: 12px;
        line-height: 36px;
        .icon {
          font-size: 36px;
        }
      }
    }
  }
  .share {
    position: fixed;
    background: #fff;
    width: 112px;
    height: 66px;
    bottom: 0;
    right: 10px;
    display: flex;
    justify-content: space-around;
    border-radius: 5px;
    color: rgba(80, 80, 80, 1);
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.5);
    .share-item {
      display: flex;
      padding: 4px;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      font-size: 12px;
      .icon {
        font-size: 30px;
        margin-bottom: 6px;
      }
    }
  }
}
</style>


