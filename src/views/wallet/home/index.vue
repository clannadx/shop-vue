<template>
  <div class="wallet-home">
    <div class="wallet-balance">
      <p class="title">账户余额（ETM）</p>
      <h3>8888</h3>
      <p class="trans">≈ 25555 CNY/ 4000 USDT / 0.5 BTC</p>
      <div class="address">
        0x6c74418275e4b6f301cceae778472327f2a31a03
        <span
          @click="copyAddress"
          title="复制"
          type="copy"
          data-clipboard-target=".address"
          aria-hidden="true"
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
          style="height:20px;width:250px;"
          :show-indicators="false"
          :touchable="false"
          :autoplay="2000"
          loop
          vertical
        >
          <van-swipe-item v-for="(item,i) in randomData" :key="i">
            {{item.name}} 刚刚购买了
            <span class="count">{{item.num}}</span> ETM
          </van-swipe-item>
          <!-- <van-swipe-item>
            CoCoxx 刚刚购买了
            <span class="count">50000</span> ETM
          </van-swipe-item>
          <van-swipe-item>
            王大锤 刚刚购买了
            <span class="count">50000</span> ETM
          </van-swipe-item>-->
        </van-swipe>
        <span class="buy">去购买 ></span>
      </div>
    </div>

    <div class="banner">
      <van-swipe :loop="false" :width="210" :height="83" :show-indicators="false">
        <van-swipe-item>
          <img src="../../../assets/images/banner03.png" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="../../../assets/images/banner02.png" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="../../../assets/images/banner01.png" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="../../../assets/images/banner03.png" />
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
        <li>
          <icon-svg class="wallet-icon icon" icon-class="envelope" />发红包
        </li>
        <li>
          <icon-svg class="wallet-icon icon" icon-class="account" />账单
        </li>
        <router-link tag="li" to="/user/information">
          <icon-svg class="wallet-icon icon" icon-class="safe" />安全设置
        </router-link>
      </ul>
    </div>
    <div class="share">
      <div class="share-item collection">
        <icon-svg class="wallet-icon icon" icon-class="collection" />收藏
      </div>
      <div class="share-item">
        <icon-svg class="wallet-icon icon" icon-class="share" />分享
      </div>
    </div>
  </div>
</template>
<script>
import { Swipe, SwipeItem } from 'vant';
import Clipboard from 'clipboard';
import { data } from './data.js';
export default {
  data() {
    return {
      name: data
    };
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
    shuffle(arr) {
      for (var i = arr.length - 1; i >= 0; i--) {
        var randomIdx = Math.floor(Math.random() * (i + 1));
        var itemAtIdx = arr[randomIdx];
        arr[randomIdx] = arr[i];
        arr[i] = itemAtIdx;
      }
      return arr;
    },
    copyAddress() {
      const clipboard = new Clipboard('.copyAddress');
      clipboard.on('success', e => {
        this.$toast('复制成功');
        e.clearSelection();
        clipboard.destroy();
      });
      clipboard.on('error', e => {
        this.$toast('复制失败，请重试');
        clipboard.destroy();
      });
    }
  },
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem
  }
};
</script>
<style lang="scss" scoped>
.wallet-home {
  padding: 10px;
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
    .title {
      font-size: 14px;
      letter-spacing: 1px;
      line-height: 40px;
    }
    h3 {
      font-size: 52px;
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
      height: 33px;
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
  }
  .application {
    background-color: #fff;
    border-radius: 5px;
    width: 100%;
    padding: 10px 10px;
    margin: 0 auto;
    .title {
      position: relative;
      font-size: 14px;
      padding-left: 10px;
      margin-bottom: 20px;
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
        margin-bottom: 25px;
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
    display: flex;
    justify-content: center;
    margin-top: 20px;
    .share-item {
      display: flex;
      flex-direction: column;
      text-align: center;
      line-height: 30px;
      color: rgba(80, 80, 80, 1);
      .icon {
        font-size: 30px;
      }
    }
    .collection {
      margin-right: 70px;
    }
  }
}
</style>


