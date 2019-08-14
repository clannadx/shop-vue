<template>
  <div class="trade-home">
    <div class="fast-trade trade">
      <img src="../../../assets/images/trade01.png" alt />
      <router-link to="/trade/fast" tag="button">快捷交易</router-link>
    </div>
    <div class="self-trade trade">
      <img src="../../../assets/images/trade02.png" alt />
      <button class="disabled">自选交易</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.trade-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 0;
  .trade {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 150px;
    }
    button {
      width: 100px;
      height: 38px;
      line-height: 38px;
      margin-top: 20px;
      color: rgba(255, 255, 255, 1);
      background-color: rgba(24, 144, 255, 1);
      border-radius: 5px;
      font-size: 16px;
      line-height: 150%;
      text-align: center;
      outline: none;
      border: none;
    }
    .disabled {
      color: rgba(0, 0, 0, 0.25);
      background-color: rgba(0, 0, 0, 0.05);
      box-shadow: rgba(217, 217, 217, 1) solid 1px;
    }
  }
  .self-trade {
    margin-top: 50px;
  }
}
</style>




