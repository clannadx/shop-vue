<template>
  <div class="order_list">
    <van-nav-bar title="我的订单" left-arrow @click-left="onClickLeft" />
    <van-tabs v-model="activeIndex" :swipe-threshold="5" @change="handleTabClick" swipeable>
      <van-tab v-for="(tabTitle, index) in tabTitles" :name="index" :title="tabTitle" :key="index">
        <van-pull-refresh v-model="isloading" @refresh="onRefresh">
          <van-list
            :finished="finished"
            v-model="loading"
            :immediate-check="false"
            finished-text="没有更多了"
            @load="getOrderList"
          >
            <van-panel
              v-for="(el, i) in orderList"
              class="order_list--panel"
              :key="i"
              :title="'订单编号: ' + el.orderSn"
              :status="el.orderStatusText"
            >
              <div>
                <van-card
                  v-for="(goods, goodsI) in el.goodsList"
                  class="order_list--van-card"
                  currency
                  :key="goodsI"
                  desc="描述信息"
                  :title="goods.goodsName"
                  :num="goods.number"
                  :thumb="goods.picUrl"
                  @click="toOrderDetail(el.id)"
                >
                  <div slot="tags">
                    <div class="van-card__desc">
                      <van-tag
                        plain
                        style="margin-right:6px;"
                        type="danger"
                        v-for="(spec, index) in goods.specifications"
                        :key="index"
                      >{{spec}}</van-tag>
                    </div>
                  </div>
                </van-card>
                <div class="total">合计: {{el.actualPrice * 100 | yuan}}（含运费{{el.post_fee | yuan}}）</div>
              </div>

              <div slot="footer" class="footer_btn">
                <van-button
                  size="small"
                  v-if="el.handleOption.cancel"
                  @click="cancelOrder(el.id)"
                >取消订单</van-button>
                <van-button
                  size="small"
                  v-if="el.handleOption.pay"
                  type="danger"
                  @click="toPay(el.id)"
                >去支付</van-button>
                <van-button
                  size="small"
                  v-if="el.handleOption.refund"
                  type="danger"
                  @click="refundOrder(el.id)"
                >退款</van-button>
                <van-button
                  size="small"
                  v-if="el.handleOption.confirm"
                  type="danger"
                  @click="confirmOrder(el.id)"
                >确认收货</van-button>
                <van-button size="small" v-if="el.handleOption.delete" @click="delOrder(el.id)">删除订单</van-button>
                <!-- <van-button
                  size="small"
                  v-if="el.handleOption.comment"
                  @click="commentOrder(el.id)"
                >去评价</van-button>-->
              </div>
            </van-panel>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import {
  orderList,
  orderDelete,
  orderConfirm,
  orderCancel,
  orderRefund
} from '@/api/api';
import _ from 'lodash';
import Header from '@/components/header/Header';
import { Tab, Tabs, Panel, Card, List, Tag, NavBar, PullRefresh } from 'vant';

export default {
  name: 'order-list',

  props: {
    active: {
      type: [String, Number],
      default: 0
    }
  },
  created() {
    this.init();
  },
  data() {
    return {
      activeIndex: Number(this.active),
      tabTitles: ['全部', '待付款', '待发货', '待收货', '待评价'],
      orderList: [],
      page: 0,
      limit: 10,
      loading: false,
      isloading: false,
      finished: false
    };
  },

  methods: {
    onRefresh() {
      setTimeout(() => {
        this.init();
      }, 500);
    },
    onClickLeft() {
      this.$router.push('/user');
    },
    init() {
      this.page = 0;
      this.orderList = [];
      this.getOrderList();
      this.isloading = false;
    },
    getOrderList() {
      this.page++;
      orderList({
        showType: this.activeIndex,
        page: this.page,
        limit: this.limit
      }).then(res => {
        this.orderList.push(...res.data.data.list);
        this.loading = false;
        if (res.data.data.page === res.data.data.pages) {
          this.finished = true;
        }
      });
    },
    async delOrder(id) {
      try {
        const result = await this.$dialog.confirm({
          message: '确定要删除该订单吗?'
        });
        if (result) {
          const res = await orderDelete({ orderId: id });
          if (res && res.data.errno === 0) {
            this.init();
            this.$toast('已删除订单');
          } else {
            this.$toast(res.data.errmsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async cancelOrder(id) {
      try {
        await this.$dialog.confirm({ message: '确定要取消该订单吗?' });
        const res = await orderDelete({ orderId: id });
        if (res && res.data.errno === 0) {
          this.init();
          this.$toast('已取消该订单');
        } else {
          this.$toast(res.data.errmsg);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async confirmOrder(id) {
      try {
        await this.$dialog.confirm({
          message: '请确认收到货物, 确认收货后无法撤销!'
        });
        const res = await orderConfirm({ orderId: id });
        if (res && res.data.errno === 0) {
          this.init();
          this.$toast('已确认收货');
        } else {
          this.$toast(res.data.errmsg);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async refundOrder(id) {
      try {
        await this.$dialog.confirm({ message: '确定要申请退款吗?' });
        const res = await orderRefund({ orderId: id });
        if (res && res.data.errno === 0) {
          this.init();
          this.$toast('已申请订单退款');
        } else {
          this.$toast(res.data.errmsg);
        }
      } catch (error) {
        console.log(error);
      }
    },
    commentOrder(id) {},
    toPay(id) {
      this.$router.push({ name: 'payment', params: { orderId: id } });
    },
    handleTabClick(index) {
      this.activeIndex = index;
      this.page = 0;
      this.orderList = [];
      this.$router.push(`/user/order/list/${index}`);
      this.getOrderList();
    },
    toOrderDetail(id) {
      this.$router.push({
        path: '/order/order-detail',
        query: { orderId: id }
      });
    }
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Panel.name]: Panel,
    [Card.name]: Card,
    [List.name]: List,
    [Tag.name]: Tag,
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh
  }
};
</script>

<style lang="scss" scoped>
.order_list {
  .van-panel {
    margin-top: 20px;
  }
  .van-list {
    min-height: calc(100vh - 90px);
  }
  .van-card {
    background-color: #fff;
  }
  .total {
    text-align: right;
    padding: 10px;
  }
  .footer_btn {
    text-align: right;
    .van-button {
      margin-left: 10px;
    }
  }
}
</style>
