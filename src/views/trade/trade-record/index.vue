<template>
  <div class="record">
    <Header title="快捷交易记录"></Header>

    <van-pull-refresh v-model="isloading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text="没有更多了"
        @load="getList"
      >
        <ul class="record-item" v-for="(item,index) in listData" :key="index">
          <li class="address">订单号：{{item.orderSn}}</li>
          <li>
            <span class="type"></span>
            <span class="price">{{item.cost}} RMB</span>
          </li>
          <li class="address">单价：{{item.price}} 数量：{{item.size}}</li>
          <li>
            <span class="time">{{item.addTime}}</span>
            <span class="status">{{item.orderStatus | orderStatusFilter}}</span>
          </li>
        </ul>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { List, PullRefresh } from 'vant';
import { orderList } from '@/api/trade';
import Header from '@/components/header/Header';
import Big from 'big.js';
const statusMap = {
  101: '未付款',
  102: '取消订单',
  103: '系统取消',
  201: '待审核',
  301: '已审核',
  302: '审核未通过',
  401: '已完成'
};
export default {
  data() {
    return {
      loading: false,
      isloading: false,
      finished: false,
      listData: [],
      page: 0,
      limit: 10
    };
  },
  created() {
    this.init();
  },
  filters: {
    orderStatusFilter(status) {
      return statusMap[status];
    }
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.init();
      }, 500);
    },
    init() {
      this.page = 0;
      this.listData = [];
      this.getList();
      this.isloading = false;
    },
    async getList() {
      try {
        this.page++;
        const params = { page: this.page, limit: this.limit };
        const result = await orderList(params);
        if (result && result.data.errno === 0) {
          this.listData.push(...result.data.data.list);
          this.loading = false;
          if (result.data.data.page === result.data.data.pages) {
            this.finished = true;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  components: {
    Header,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh
  }
};
</script>
<style lang="scss" scoped>
.record {
  .van-list {
    min-height: 100vh;
  }
  .record-item {
    display: flex;
    flex-direction: column;
    padding: 15px 20px;
    background-color: #fff;
    border-bottom: 1px solid rgba(229, 229, 229, 1);
    li {
      display: flex;
      justify-content: space-between;
      line-height: 26px;
      .type {
        color: rgba(80, 80, 80, 1);
        font-size: 18px;
      }
      .price {
        color: rgba(212, 48, 48, 1);
        font-size: 18px;
        font-weight: bold;
      }
      span {
        color: rgba(166, 166, 166, 1);
        font-size: 10px;
      }
    }
    .address {
      color: rgba(128, 128, 128, 1);
      font-size: 10px;
      line-height: 22px;
    }
  }
}
</style>


