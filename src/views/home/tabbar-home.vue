<template>
  <div class="tab_home">
    <div class="tal_class_searchBox">
      <van-search placeholder="点击前往搜索" @click="$router.push({ name: 'search' })" />
      <div class="tal_class_searchMask"></div>
    </div>
    <!-- 品牌商 -->
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(banner, index) in shopInfos.banner" :key="index">
        <img v-lazy="banner.url" style="height:230px" />
      </van-swipe-item>
    </van-swipe>

    <div class="goods-channel">
      <div
        class="item"
        @click="changeTabbar(channel)"
        v-for="(channel, index) in shopInfos.channel"
        :key="index"
      >
        <img v-lazy="channel.iconUrl" background-size="cover" />
        <span>{{channel.name}}</span>
      </div>
    </div>

    <van-panel title="优惠券" style=" padding-bottom: 10px;">
      <div
        class="van-coupon-item"
        v-for="(coupon,index) in shopInfos.couponList"
        :key="index"
        @click="getCoupon(coupon.id)"
      >
        <div class="van-coupon-item__content">
          <div class="van-coupon-item__head">
            <h2>
              <span>¥</span>
              {{coupon.discount}} 元
            </h2>
            <p></p>
          </div>
          <div class="van-coupon-item__body">
            <h2>{{coupon.name}}</h2>
            <p>有效期：{{coupon.days}} 天</p>
          </div>
        </div>
        <p class="coupon__description">{{coupon.desc }} - {{coupon.tag}}</p>
      </div>
    </van-panel>

    <van-panel>
      <van-card
        v-for="(grouponGood ,index) in shopInfos.grouponList"
        :key="index"
        :title="grouponGood.name"
        :desc="grouponGood.brief"
        :origin-price="grouponGood.retailPrice"
        :price="grouponGood.grouponPrice +'.00'"
        :thumb="grouponGood.picUrl"
        :lazy-load="true"
        @click="goDetail(grouponGood.id)"
      >
        <div slot="tags" class="card__tags">
          <van-tag plain type="primary" style="margin-right:5px">{{grouponGood.grouponMember}}人成团</van-tag>
          <van-tag plain type="danger">{{grouponGood.grouponDiscount}}元再减</van-tag>
        </div>
      </van-card>
      <div slot="header">
        <van-cell-group>
          <van-cell title="团购专区" isLink>
            <router-link to="/items/groupon" class="text-desc">更多团购商品</router-link>
          </van-cell>
        </van-cell-group>
      </div>
    </van-panel>
    <van-panel>
      <van-grid clickable :column-num="2">
        <van-grid-item
          v-for="(brand ,index) in shopInfos.brandList"
          :key="index"
          :text="brand.name"
          :url="goBrand(brand.id)"
        >
          <img :src="brand.picUrl" style="width: 80%;" />
          <div style="size:10px;">{{ brand.name }}</div>
        </van-grid-item>
      </van-grid>
      <div slot="header">
        <van-cell-group>
          <van-cell title="品牌商直供" isLink>
            <router-link to="/items/brand-list" class="text-desc">更多品牌商</router-link>
          </van-cell>
        </van-cell-group>
      </div>
    </van-panel>
    <van-panel>
      <van-row class="news">
        <van-col span="12" v-for="(newGood ,index) in shopInfos.newGoodsList" :key="index">
          <router-link :to="{ path: `/items/detail/${newGood.id}`}">
            <img v-lazy="newGood.picUrl" style="width:100%;" />
          </router-link>
          <p class="goods-text">{{newGood.name}}</p>
          <span class="goods-price">￥ {{newGood.retailPrice}}</span>
        </van-col>
      </van-row>

      <div slot="header">
        <van-cell-group>
          <van-cell title="新品首发" isLink>
            <router-link to="/items/new" class="text-desc">更多新品首发</router-link>
          </van-cell>
        </van-cell-group>
      </div>
    </van-panel>

    <van-panel>
      <van-card
        v-for="(groupGood ,index) in shopInfos.hotGoodsList"
        :key="index"
        :title="groupGood.name"
        :desc="groupGood.brief"
        :origin-price="groupGood.counterPrice"
        :price="groupGood.retailPrice +'.00'"
        :thumb="groupGood.picUrl"
        :lazy-load="true"
        @click="goDetail(groupGood.id)"
      >
        <!-- <div slot="footer">添加日期 {{item.addTime}}</div> -->
      </van-card>
      <div slot="header">
        <van-cell-group>
          <van-cell title="人气推荐" isLink>
            <router-link to="/items/hot" class="text-desc">更多人气推荐</router-link>
          </van-cell>
        </van-cell-group>
      </div>
    </van-panel>

    <van-panel>
      <van-grid clickable :column-num="2">
        <van-grid-item
          v-for="(topic ,index) in shopInfos.topicList"
          :key="index"
          :url="goTopic(topic.id)"
        >
          <img :src="topic.picUrl" style="width: 90%; max-height: 150px;" />
          <div style="font-size:14px;color:#ab956d;margin-top:10px;">{{ topic.title }}</div>
          <div
            style="font-size:10px;color:#ab956d;text-align:justify;margin-top:5px;"
          >{{ topic.subtitle }}</div>
        </van-grid-item>
      </van-grid>
      <div slot="header">
        <van-cell-group>
          <van-cell title="专题精选" isLink>
            <router-link to="/items/topic-list" class="text-desc">更多专题精选</router-link>
          </van-cell>
        </van-cell-group>
      </div>
    </van-panel>
  </div>
</template>

<script>
import { getHome, goodsCategory, couponReceive } from '@/api/api';
import scrollFixed from '@/mixin/scroll-fixed';
import mixin from '@/mixin/mixins';
import _ from 'lodash';

import {
  List,
  Swipe,
  SwipeItem,
  Tabbar,
  TabbarItem,
  Search,
  Panel,
  CouponCell,
  CouponList,
  Grid,
  GridItem,
  Toast,
  Card,
  Row,
  Col,
  Tag
} from 'vant';

export default {
  mixins: [scrollFixed, mixin],

  data() {
    return {
      shopInfos: [],
      isLoading: false
    };
  },

  created() {
    this.initViews();
  },

  methods: {
    goBrand(id) {
      return `#/items/brand/${id}`;
    },
    goTopic(id) {
      return `#/items/topic/${id}`;
    },
    getCoupon(id) {
      couponReceive({ couponId: id }).then(res => {
        Toast.success('领取成功');
      });
    },
    changeTabbar(o) {
      goodsCategory({ id: o.id }).then(res => {
        let categoryId = res.data.data.currentCategory.id;
        this.$router.replace({
          name: 'category',
          query: { itemClass: categoryId }
        });
      });
    },
    initViews() {
      getHome().then(res => {
        this.shopInfos = res.data.data;
      });
    }
  },

  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Card.name]: Card,
    [Toast.name]: Toast,
    [CouponCell.name]: CouponCell,
    [CouponList.name]: CouponList,
    [Search.name]: Search,
    [Panel.name]: Panel,
    [List.name]: List,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Tag.name]: Tag,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  }
};
</script>


<style lang="scss" scoped>
.interval_bot {
  margin-bottom: 10px;
}

.goods-channel {
  background: #fff;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 0px;
  padding-top: 20px;
}

.goods-channel .item {
  width: 50px;
  height: 50px;
  margin-left: 16px;
  margin-bottom: 10px;
}

.goods-channel img {
  display: block;
  width: 30px;
  height: 30px;
  margin: 0 auto;
}

.goods-channel span {
  display: block;
  font-size: 15px;
  text-align: center;
  margin: 0 auto;
  line-height: 1;
  color: #333;
}
.van-coupon-cell--selected {
  color: #323233;
}
.van-panel {
  margin-top: 20px;
}
.van-coupon-list {
  height: 100%;
  position: relative;
  background-color: #f8f8f8;
}
.van-coupon-list__field {
  padding: 7px 15px;
}
.van-coupon-list__exchange {
  height: 32px;
  line-height: 30px;
}
.van-coupon-list__list {
  overflow-y: auto;
  padding: 15px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}
.van-coupon-list__close {
  left: 0;
  bottom: 0;
  position: absolute;
  font-weight: 500;
}
.van-coupon-list__empty {
  padding-top: 100px;
  text-align: center;
}
.van-coupon-list__empty p {
  color: #969799;
  margin: 15px 0;
  font-size: 14px;
  line-height: 20px;
}
.van-coupon-list__empty img {
  width: 80px;
  height: 84px;
}
.van-coupon-item {
  overflow: hidden;
  border-radius: 4px;
  margin: 0 15px 15px;
  background-color: #fff;
  -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}
.coupon__description {
  padding: 7px 15px;
  background-color: #fafafa;
  border-top: 1px dashed #ebedf0;
}
.van-coupon-item:active {
  background-color: #e8e8e8;
}
.van-coupon-item__content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 100px;
  padding: 24px 0 0 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.van-coupon-item h2,
.van-coupon-item p {
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.van-coupon-item h2 {
  height: 34px;
  font-weight: 500;
  line-height: 34px;
}
.van-coupon-item p {
  font-size: 12px;
  line-height: 16px;
  color: #969799;
}
.van-coupon-item__head {
  min-width: 90px;
}
.van-coupon-item__head h2 {
  color: #f44;
  font-size: 24px;
}
.van-coupon-item__head h2 span {
  font-size: 50%;
}
.van-coupon-item__body {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  position: relative;
  border-radius: 0 4px 4px 0;
}
.van-coupon-item__body h2 {
  font-size: 16px;
}
.van-coupon-item__corner {
  top: 16px;
  right: 15px;
  position: absolute;
}
.van-coupon-item__corner .van-icon {
  border-color: #f44;
  background-color: #f44;
}
.van-coupon-item__reason {
  padding: 7px 15px;
  border-top: 1px dashed #ebedf0;
  background-color: #fafafa;
}
.van-coupon-item--disabled:active {
  background-color: #fff;
}
.van-coupon-item--disabled .van-coupon-item__content {
  height: 90px;
}
.van-coupon-item--disabled h2,
.van-coupon-item--disabled p,
.van-coupon-item--disabled span {
  color: #969799;
}
.news {
  padding-bottom: 20px;
  .goods-text {
    margin: 0 !important;
    padding: 0 10px;
    font-size: 14px;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
    margin-top: 10px;
    line-height: 32px;
    margin-bottom: 6px;
    color: #232326;
  }
  .goods-price {
    margin: 0;
    height: 20px;
    font-size: 14px;
    overflow: hidden;
    color: #ab956d;
    display: inline-block;
    padding: 0 10px 0 8px;
    position: relative;
    top: 5px;
    line-height: 20px;
  }
}
</style>
