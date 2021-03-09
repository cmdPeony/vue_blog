<template>
  <div class="nav-container">
    <el-menu
      :default-active="currentTab"
      unique-opened
      @open="handleOpen"
      @close="handleClose"
    >
      <el-submenu v-for="item in menuList" :key="item._id" :index="item._id">
        <template slot="title">
          <i class="el-icon-menu" />
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item v-for="subItem in item.subMenu" :key="subItem._id" :index="subItem.path" @click="goDetail(subItem)">
          {{ subItem.name }}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  props: {
    currentTab: {
      type: String,
      default: ''
    },
    menuList: { // 菜单列表
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    handleOpen() {
      console.log('关闭2')
    },
    handleClose() {
      console.log('关闭1')
    },
    goDetail(item) {
      console.log('点击', item)
      this.$emit('addTab', item)
      this.$router.push({ path: item.path })
      console.log('路径出现', item.path)
    }
  }
}
</script>
<style lang="less" scoped>
.nav-container {
  .el-menu {
  height: 100%;
  .el-menu-item.is-active {
    // color: #409EFF;
    background-color: #00a65a;
    color: white;
    font-weight: bold;
  }
}
}
</style>
