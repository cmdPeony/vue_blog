<template>
  <div class="wrapper-page">
    <div class="ex-page-content text-center">
      <h1>404!</h1>
      <h2>Sorry, page not found</h2><br>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goHome() {
      this.$router.push({ path: '/home' })
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper-page {
  margin: 7.5% auto;
  width: 420px;
  text-align: center;
}
.ex-page-content h1 {
  color: #252932;
  font-size: 98px;
  font-weight: 700;
  line-height: 150px;
  text-shadow: rgb(61 61 61 / 30%) 1px 1px, rgb(61 61 61 / 20%) 2px 2px, rgb(61 61 61 / 30%) 3px 3px;
}
h2 {
  line-height: 35px;
}
</style>
