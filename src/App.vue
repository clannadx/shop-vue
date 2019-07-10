<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view class="view-router" v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <router-view class="view-router" v-if="!$route.meta.keepAlive"></router-view>
    <router-view name="tabbar"></router-view>
  </div>
</template>

<style lang="scss" src="./assets/scss/global.scss" />
