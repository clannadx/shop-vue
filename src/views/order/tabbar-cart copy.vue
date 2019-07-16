<template>
  <div class="tab-cart">
    <Header title="我的购物车"></Header>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="editor_head" v-show="goods.length">
        <van-icon :name="isEditor ? 'success' : 'editor'" />&nbsp;
        <span @click="isEditor = !isEditor">{{isEditor ? '完成' : '编辑'}}</span>
      </div>
      <van-checkbox-group @change="toggle" class="card-goods" v-model="checkedGoods">
        <div v-for="(item, i) in goods" :key="i" class="card-goods__item">
          <van-checkbox
            class="cart-checkbox"
            icon-size="16px"
            :key="item.id"
            :name="item.id"
            v-model="item.checked"
          ></van-checkbox>

          <van-card
            :title="item.goodsName"
            desc="描述信息"
            :price="item.price"
            :num="item.number"
            :thumb="item.picUrl"
            @click-thumb="goDetail(item.goodsId)"
          >
            <div slot="tags">
              <div class="van-card__desc">
                <van-tag
                  plain
                  style="margin-right:6px;"
                  type="danger"
                  v-for="(spec, index) in item.specifications"
                  :key="index"
                >{{spec}}</van-tag>
              </div>
            </div>
            <div slot="footer" v-if="isEditor">
              <van-stepper
                v-model="item.number"
                @change="stepperEvent(item,arguments)"
                disableInput
              />
            </div>
            <div slot="footer" v-else>添加日期 {{item.addTime}}</div>
          </van-card>

          <div class="cart_delete" v-if="isEditor" @click="deleteCart(i)">删除</div>
        </div>
      </van-checkbox-group>

      <is-empty v-if="!goods.length">您的购物车空空如也~</is-empty>
    </van-pull-refresh>

    <van-submit-bar
      style="bottom: 50px"
      :price="totalPrice"
      :disabled="!checkedGoods.length"
      :buttonText="submitBarText"
      :loading="isSubmit"
      label="总计"
      @submit="cartSubmit"
    >
      <van-checkbox v-model="allCheckedStatus" @change="setCheckAll" style="padding: 0 10px;">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup, Card, SubmitBar, Stepper, Tag } from 'vant';
import { cartList, cartUpdate, cartChecked, cartDelete } from '@/api/api';
import { setLocalStorage } from '@/utils/local-storage';
import Header from '@/components/header/Header';
import mixin from '@/mixin/mixins';
import { Toast, PullRefresh } from 'vant';

import isEmpty from '@/components/is-empty/';
import _ from 'lodash';
import request from '@/utils/request';

export default {
  mixins: [mixin],
  data() {
    return {
      isLoading: false,
      isEditor: false,
      checkedAll: false,
      isSubmit: false,
      checkedGoods: [],
      AllGoods: [],
      allCheckedStatus: false,
      goods: [],
      count: 0
    };
  },

  activated() {
    this.checkedAll = false;
    this.isEditor = false;
    this.isSubmit = false;
  },
  created() {
    this.init();
  },
  computed: {
    submitBarText() {
      const count = this.count;
      const text = count ? `结算(${count})` : '结算(0)';
      return this.isEditor ? '删除' : text;
    },
    totalPrice() {
      return this.goods.reduce(
        (total, item) =>
          total +
          (this.checkedGoods.indexOf(item.id) !== -1
            ? item.price * item.number * 100
            : 0),
        0
      );
    }
  },

  methods: {
    onRefresh() {
      this.init();
    },
    async stepperEvent(item, arg) {
      let number = arg[0];
      let data = {
        number: number,
        goodsId: item.goodsId,
        id: item.id,
        productId: item.productId
      };
      const res = await cartUpdate(data);
      if (res && res.data.errno === 710) {
        Toast.fail('库存不足');
        item.number = item.number - 1;
      } else if (res && res.data.errno === 0) {
        item.number = number;
      }
    },
    async init() {
      const res = await cartList();
      if (res && res.data.errno === 0) {
        this.goods = res.data.data.cartList;
        this.AllGoods = this.getAllList();
        this.checkedGoods = this.getCheckedList(this.goods);
        this.count = this.checkedGoods.length;
        this.isLoading = false;
      }
    },
    getAllList() {
      let result = [];
      _.each(this.goods, v => {
        result.push(v.id);
      });
      return result;
    },
    getCheckedList(goods) {
      let result = [];
      _.each(goods, v => {
        if (v.checked) {
          result.push(v.id);
        }
      });
      return result;
    },
    cartSubmit(data) {
      let productIds = [];
      let checkedGoods = this.checkedGoods;
      _.each(checkedGoods, id => {
        productIds.push(
          _.find(this.goods, vv => {
            return id === vv.id;
          }).productId
        );
      });
      if (this.isEditor) {
        this.$dialog
          .confirm({
            message: '确定删除所选商品吗?',
            cancelButtonText: '再想想'
          })
          .then(() => {
            this.deleteNext(productIds);
          });
      } else {
        this.isSubmit = true;
        setLocalStorage({ AddressId: 0, CartId: 0, CouponId: 0 });
        this.$router.push('/order/checkout');
      }
    },
    setCheckAll(val) {
      if (
        this.checkedGoods.length === this.AllGoods.length &&
        !this.allCheckedStatus
      ) {
        this.checkedGoods = [];
      } else {
        this.checkedGoods = this.AllGoods;
      }
    },
    deleteCart(o) {
      let productId = this.goods[o].productId;
      this.$dialog
        .confirm({ message: '确定删除所选商品吗', cancelButtonText: '再想想' })
        .then(() => {
          this.$nextTick(() => {
            this.deleteNext(productId);
          });
        });
    },
    async toggle(index) {
      let addProductIds = [];
      _.each(index, v => {
        let productId = _.find(this.goods, result => {
          return result.id === v;
        }).productId;
        addProductIds.push(productId);
      });

      let delProductIds = [];
      _.each(_.difference(this.AllGoods, index), v => {
        let productId = _.find(this.goods, result => {
          return result.id === v;
        }).productId;
        delProductIds.push(productId);
      });
      //没选中的不掉接口
      if (delProductIds.length > 0) {
        this.cartChange({ productIds: delProductIds, isChecked: 0 });
      }
      if (addProductIds.length > 0) {
        this.cartChange({ productIds: addProductIds, isChecked: 1 });
      }
    },
    async cartChange(params = {}) {
      const res = await cartChecked(params);
      if (res && res.data.errno === 0) {
        this.count = this.checkedGoods.length;
      }
    },
    deleteNext(o) {
      let productIds = [];
      if (o instanceof Array) {
        productIds = o;
      } else {
        productIds.push(o);
      }

      cartDelete({ productIds: productIds }).then(res => {
        this.goods = res.data.data.cartList;
        this.AllGoods = this.getAllList();
        this.checkedGoods = this.getCheckedList(this.goods);
        this.count = this.checkedGoods.length;
      });
    }
  },

  components: {
    [Card.name]: Card,
    [Tag.name]: Tag,
    [Stepper.name]: Stepper,
    [isEmpty.name]: isEmpty,
    [Checkbox.name]: Checkbox,
    [SubmitBar.name]: SubmitBar,
    [CheckboxGroup.name]: CheckboxGroup,
    [PullRefresh.name]: PullRefresh,
    Header
  }
};
</script>


<style lang="scss" scoped>
@import '../../assets/scss/mixin';

.tab-cart {
  padding-bottom: 50px;
  box-sizing: border-box;
}

.editor_head {
  @include one-border;
  text-align: right;
  padding: 10px;
  font-size: $font-size-normal;
  background-color: #fff;
}

.card-goods {
  min-height: calc(100vh - 189px);
  background-color: $bg-color;
  padding-bottom: 50px;
  .card-goods__item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    background-color: #fff;
    justify-content: space-between;
    .cart-checkbox {
      width: 33px;
      justify-content: flex-end;
    }
    .van-card {
      padding-left: 0;
    }
    .van-card__bottom {
      margin-top: 5px;
    }
  }
  .cart_delete {
    line-height: 100px;
    padding: 0 10px;
    color: #fff;
    background-color: $red;
    align-items: center;
  }
  .card-goods__footer {
    font-size: $font-size-normal;
    color: $font-color-gray;
  }
}

.clear_invalid {
  width: 120px;
  color: $font-color-gray;
  border: 1px solid $font-color-gray;
  margin: 0 auto;
  text-align: center;
  padding: 5px 3px;
  margin-top: 20px;
  border-radius: 3px;
}
</style>
