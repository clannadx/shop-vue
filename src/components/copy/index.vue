<template>
  <span
    title="复制"
    type="copy"
    v-clipboard:copy="target"
    v-clipboard:success="onCopy"
    v-clipboard:error="onError"
    class="copy"
  >
    <icon-svg icon-class="copy1" />
  </span>
</template>

<script>
export default {
  props: {
    target: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    onCopy: function(e) {
      this.$toast('复制成功');
    },
    onError: function(e) {
      this.$toast('复制失败，请重试');
    }
  }
};
</script>

<style lang="scss" scoped>
.copy {
  color: rgba(42, 130, 228, 1);
}
</style>