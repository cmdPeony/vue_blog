<template>
  <div class="header-container">
    <div id="box-admin" class="img-container">
      <img src="../../assets/logo.png" @click="changeCardStatus">
      <el-card v-if="showCard" class="box-card">
        <span @click="goHome">首页</span>
        <span @click="logout">注销</span>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showCard: false
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    // 处理外部点击 关闭
    handleClickOutside(e) {
      const box = document.getElementById('box-admin')
      if (box && !box.contains(e.target)) {
        this.showCard = false
      }
    },
    // 展示影藏卡片
    changeCardStatus() {
      this.showCard = !this.showCard
    },
    goHome() {
      this.$router.push({ path: '/home' })
    },
    logout() {
      sessionStorage.clear()
      localStorage.clear()
      this.$router.push({ path: '/home' })
    }
  }
}
</script>
<style lang="less" scoped>
.header-container {
  position: relative;
  height: 60px;
  width: 100%;
  z-index: 9999;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    position: absolute;
    right: 50px;
    top: 50%;
    transform: translateY(-50%);
  }
  .img-container {
    height: 60px;
  }
  .box-card {
    width: 100px;
    position: absolute;
    right: 30px;
    top: 60px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    span {
      padding: 10px;
      font-size: 14px;
      cursor: pointer;
      display: block;
      &:hover {
        background-color: #eee;
      }
    }
  }
  /deep/ .el-card__body {
    padding: 10px;
    text-align: center;
  }
}
</style>
