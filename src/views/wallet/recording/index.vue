<template>
  <div class="record">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <ul class="record-item">
          <li>
            <span class="type">ETM</span>
            <span class="price">-8000</span>
          </li>
          <li class="address">0x6c74418275e4b6f301cceae778472327f2a31a03</li>
          <li>
            <span class="time">2019-07-17 22:22:22</span>
            <span class="status">提币成功</span>
          </li>
        </ul>
        <ul class="record-item">
          <li>
            <span class="type">ETM</span>
            <span class="price">-8000</span>
          </li>
          <li class="address">0x6c74418275e4b6f301cceae778472327f2a31a03</li>
          <li>
            <span class="time">2019-07-17 22:22:22</span>
            <span class="status">提币成功</span>
          </li>
        </ul>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { List, PullRefresh } from 'vant';
export default {
  data() {
    return {
      loading: false,
      finished: false
    };
  },
  methods: {
    onRefresh() {
      this.onLoad();
    },
    onLoad() {
      this.loading = false;
      this.finished = false;
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


