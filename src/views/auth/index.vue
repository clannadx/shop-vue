<template>
  <div>授权中。。。</div>
</template>

<script>
export default {
  data() {
    return {
      oauthUrl:
        'https://open.xianliao.updrips.com/connect/oauth2/authorize?appid=qBSdYLZEuaTMssbI&redirect_uri=http://47.111.165.42:8080/wx/auth/login_by_xianliao/&response_type=code'
    };
  },
  mounted() {
    // Redirect to wechat oauth
    if (this.$route.query.redirect) {
      window.location.href =
        this.oauthUrl +
        '?redirect_path=' +
        encodeURIComponent(this.$route.query.redirect);
    } else {
      // 页面重定向至微信官网授权页面
      window.location.href = this.oauthUrl;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>