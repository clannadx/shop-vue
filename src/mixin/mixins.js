const mixinMethods = {
  methods:{
    goDetail(id) {
      this.$router.push(`/items/detail/${id}`);
    },
  }
}


export default mixinMethods