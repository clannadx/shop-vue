<template>
  <div class="item_list">
    <Header title="商品列表"></Header>
    <van-tabs v-model="navActive" @change="handleTabClick" swipeable>
      <van-tab
        v-for="(nav, index) in navList"
        :name="index"
        :title="nav.name"
        :key="index"
        ellipsis
        swipeable
      >
        <van-pull-refresh v-model="isloading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :immediate-check="false"
            finished-text="没有更多了"
            @load="getGoodsList"
          >
            <div class="h">
              <div class="name">{{currentCategory.name}}</div>
              <div class="desc">{{currentCategory.desc}}</div>
            </div>
            <ul class="good-list-box">
              <li
                class="good-list-item"
                v-for="(item,i) in goodsList"
                :key="i"
                @click="itemClick(item.id)"
              >
                <div class="good-product">
                  <div class="good-img">
                    <img v-lazy="item.picUrl" alt />
                  </div>
                  <p class="good-text">{{ item.name }}</p>
                  <p class="good-price">
                    <span class="price">{{ item.retailPrice*100 | yuan }}</span>
                  </p>
                </div>
              </li>
            </ul>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { goodsCategory, goodsList } from '@/api/api';
import { Card, List, Tab, Tabs, PullRefresh } from 'vant';
import Header from '@/components/header/Header';
import { setTimeout } from 'timers';

export default {
  name: 'Item-list',
  props: {
    itemClass: {
      type: [String, Number],
      default: ''
    }
  },

  data() {
    return {
      categoryId: this.itemClass,
      goodsList: [],
      page: 0,
      limit: 10,
      currentCategory: {},
      navList: [],
      navActive: 0,
      loading: false,
      isloading: false,
      finished: false,
      lazyloading: true
    };
  },

  created() {
    this.init();
  },

  methods: {
    handleTabClick(index, title) {
      this.categoryId = this.navList[index].id;
      this.$router.replace({
        name: 'category',
        query: { itemClass: this.categoryId }
      });
      this.init();
    },
    init() {
      goodsCategory({ id: this.categoryId }).then(res => {
        this.navList = res.data.data.brotherCategory;
        this.currentCategory = res.data.data.currentCategory;

        // 当id是L1分类id时，这里需要重新设置成L1分类的一个子分类的id
        if (res.data.data.parentCategory.id == this.categoryId) {
          this.categoryId = res.data.data.currentCategory.id;
        }

        for (let i = 0; i < this.navList.length; i++) {
          if (this.navList[i].id == this.categoryId) {
            this.navActive = i;
            break;
          }
        }
        this.page = 0;
        this.goodsList = [];
        this.getGoodsList();
        this.isloading = false;
      });
    },
    onRefresh() {
      setTimeout(() => {
        this.init();
      }, 500);
    },
    getGoodsList() {
      this.page++;
      goodsList({
        categoryId: this.categoryId,
        page: this.page,
        limit: this.limit
      }).then(res => {
        this.goodsList.push(...res.data.data.list);
        this.loading = false;
        this.finished = res.data.data.page >= res.data.data.pages;
      });
    },
    itemClick(id) {
      this.$router.push(`/items/detail/${id}`);
    }
  },

  components: {
    [List.name]: List,
    [Card.name]: Card,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [PullRefresh.name]: PullRefresh,
    Header
  }
};
</script>

<style lang="scss" scoped>
.item_list {
  background-color: #fff;
}

.h {
  height: 87px;
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.h .name {
  display: block;
  height: 30px;
  margin-bottom: 10px;
  font-size: 20px;
  color: #333;
}

.h .desc {
  display: block;
  height: 24px;
  font-size: 16px;
  color: #999;
}
.good-list-box {
  min-height: calc(100vh - 242px);
  overflow: hidden;
  background-color: #f5f5f5;
  padding-top: 8px;

  .good-list-item {
    float: left;
    width: 50%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-bottom: 8px;
    position: relative;

    &:nth-child(odd) {
      padding-right: 4px;
    }

    &:nth-child(2n) {
      padding-left: 4px;
    }

    a {
      display: block;
    }

    @at-root .good-product {
      background-color: #fff;
      padding-bottom: 6px;
      font-size: 0;

      .good-img {
        position: relative;
        width: 100%;

        img {
          width: 100%;
          height: 180px;
        }
      }

      .good-text {
        height: 30px;
        font-size: 14px;
        overflow: hidden;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-word;
        color: #232326;
        margin-top: 10px;
        line-height: 32px;
        margin-bottom: 6px;
        padding: 0 10px;
        margin: 0;
      }

      .good-price {
        margin: 0;
        height: 20px;
        font-size: 14px;
        overflow: hidden;
        color: #f23030;
        display: inline-block;
        padding: 0 10px 0 8px;
        margin-bottom: 8px;
        position: relative;
        top: 5px;
        line-height: 20px;
      }
    }
  }
}
</style>
