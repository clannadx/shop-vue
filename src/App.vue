<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view class="view-router" v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view class="view-router" v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <router-view name="tabbar"></router-view>
  </div>
</template>

