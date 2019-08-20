import { authInfo } from '@/api/api'
const mixinMethods = {
  data() {
    return {
      userAddress: ''
    }
  },
  methods: {
    goDetail(id) {
      this.$router.push(`/items/detail/${id}`);
    },
    async getAddress() {
      const result = await authInfo();
      if (result && result.data.errno === 0) {
        this.userAddress = result.data.data.address;
      }
    },
  }
}


export default mixinMethods