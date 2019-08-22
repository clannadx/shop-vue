<template>
  <div class="record">
    <van-pull-refresh v-model="isloading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text="没有更多了"
        @load="getList"
      >
        <ul class="record-item" v-for="(item,index) in listData" :key="index">
          <li>
            <span class="type">ETM</span>
            <span class="price">{{item.amount/Math.pow(10,8)}}</span>
          </li>
          <li class="address">{{item.senderId}}</li>
          <li>
            <span
              class="time"
            >{{timestampToTime(item.timestamp*1000 + Date.UTC(2018, 9, 12, 12, 0, 0, 0))}}</span>
            <span class="status">提币成功</span>
          </li>
        </ul>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { List, PullRefresh } from 'vant';
import { rechargeList } from '@/api/api';
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
    // rechargeList();
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
    timestampToTime(timestamp) {
      let addZero = function(num) {
        if (num <= 9) {
          return '0' + num;
        }
        return num;
      };
      let date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-';
      let D = addZero(date.getDate()) + ' ';
      let h = addZero(date.getHours()) + ':';
      let m = addZero(date.getMinutes()) + ':';
      let s = addZero(date.getSeconds());
      return Y + M + D + h + m + s;
    },
    async getList() {
      // this.page++;
      // const params = { page: this.page, limit: this.limit };
      const result = await rechargeList();
      if (result && result.data.errno === 0) {
        this.listData.push(...result.data.data.transactions);
        this.loading = false;
        this.finished = true;
        // if (result.data.data.page === result.data.data.pages) {
        //   this.finished = true;
        // }
      }
    }
  },
  components: {
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


