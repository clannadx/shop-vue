<template>
  <div class="item_search">
    <Header title="搜索"></Header>
    <form action="/search" @submit="disabledSubmit">
      <van-search
        placeholder="请输入搜索商品关键词"
        v-model="keyword"
        @search="enterSearch"
        show-action
        autofocus
      >
        <div slot="action" @click="enterSearch">搜索</div>
      </van-search>
    </form>
    <div class="item_search_content">
      <div class="item_search_text clearfix">
        <div class="float-l">历史搜索</div>
        <div class="float-r" @click="clearHistory">
          <van-icon
            class-prefix="van-icon1"
            name="lajitong"
            style="font-size: 12px;margin-right: 3px"
          />清空历史记录
        </div>
      </div>
      <div class="item_search_history">
        <van-tag plain v-for="(his, i) in wordHistory" :key="i" @click="clickSearch(his)">{{his}}</van-tag>
      </div>
    </div>

    <van-list
      v-model="loading"
      finished-text="没有更多了"
      :finished="finished"
      :immediate-check="false"
      @load="loadMore"
    >
      <van-card
        v-for="(item, i) in list"
        :key="i"
        currency
        :desc="item.brief"
        :title="item.name"
        :thumb="item.picUrl"
        :price="item.retailPrice+' ETM' "
        :origin-price="item.counterPrice+' ETM' "
        @click="itemClick(item.id)"
      />
    </van-list>

    <is-empty v-if="isEmpty">抱歉,没有找到符合条件商品</is-empty>
  </div>
</template>

<script>
import { Card, Search, Tag, List } from 'vant';
import { goodsList, searchIndex } from '@/api/api';
import IsEmpty from '@/components/is-empty/';
import Header from '@/components/header/Header';

export default {
  data() {
    return {
      keyword: '',
      focusStatus: true,
      wordHistory: [],
      list: [],
      page: 1,
      limit: 10,
      pages: 0,
      loading: false,
      finished: false,
      isEmpty: false
    };
  },
  methods: {
    enterSearch() {
      this.reset();
      this.searchGoods();
    },
    clickSearch(word) {
      this.keyword = word.trim();
      this.reset();
      this.searchGoods();
    },
    reset() {
      this.list = [];
      this.page = 1;
      this.limit = 10;
      this.total = 0;
      this.loading = false;
      this.finished = false;
      this.isEmpty = false;
    },
    pushHistoryTolocal(keyword) {
      const wordHistory = this.wordHistory;
      const historyKeyWord = this.getKeyWordHistory();
      if (!!keyword.trim() && historyKeyWord.indexOf(keyword) < 0) {
        wordHistory.push(keyword);
        window.localStorage.setItem('keyword', wordHistory.join('|'));
      }
    },
    getKeyWordHistory() {
      const listWord = window.localStorage.getItem('keyword');
      return listWord ? listWord.split('|') : [];
    },
    clearHistory() {
      this.$dialog
        .confirm({
          message: '是否清空历史记录'
        })
        .then(() => {
          window.localStorage.setItem('keyword', '');
          this.wordHistory = [];
        });
    },
    disabledSubmit() {
      return false;
    },
    searchGoods() {
      const keyword = decodeURIComponent(this.keyword);
      goodsList({
        keyword: keyword,
        page: this.page,
        limit: this.limit,
        categoryId: 0
      }).then(res => {
        var data = res.data.data;
        this.list.push(...data.list);
        this.page = data.page;
        this.limit = data.limit;
        this.pages = data.pages;
        this.pushHistoryTolocal(this.keyword);
      });
    },
    async loadMore() {
      this.loading = false;
      this.page += 1;
      await this.searchGoods();
      this.loading = false;
      if (this.pages <= this.page) {
        this.finished = true;
      }
    },
    itemClick(id) {
      this.$router.push(`/items/detail/${id}`);
    }
  },
  activated() {
    this.wordHistory = this.getKeyWordHistory();
  },
  components: {
    [Search.name]: Search,
    [Card.name]: Card,
    [Tag.name]: Tag,
    [List.name]: List,
    [IsEmpty.name]: IsEmpty,
    Header
  }
};
</script>


<style lang="scss" scoped>
.item_search {
  background-color: #fff;
}
.item_search_content {
  padding: 15px 10px 0;
}
.item_search_text {
  font-size: $font-size-normal;
  color: $font-color-gray;
  margin-bottom: 20px;
}

.item_search_history > span {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
