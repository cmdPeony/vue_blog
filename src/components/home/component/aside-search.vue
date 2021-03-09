<template>
  <form class="navbar-form">
    <div class="input-group">
      <el-input v-model="searchContent" placeholder="搜索" style="width: 70%;padding-right: 10px;" />
      <el-button type="primary" @click="clickSearch">搜索</el-button>
    </div>
  </form>
</template>
<script>
export default {
  data() {
    return {
      searchContent: ''
    }
  },
  created() {
    if (this.$route.params.type === 'search') {
      this.searchContent = this.$route.params.id
    }
  },
  methods: {
    clickSearch() {
      this.$emit('clickSearch', this.searchContent)
    }
  }
}
</script>
<style lang="less" scoped>
.navbar-form {
  background-color: #fff;
  height: 50px;
  line-height: 50px;
  display: inline-block;
  margin-top: 15px;
  width: 100%;
  padding-left: 15px;
  box-sizing: border-box;
}
</style>
