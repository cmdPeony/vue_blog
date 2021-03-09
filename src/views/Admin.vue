<template>
  <div class="container">
    <el-container style="height: 100%;">
      <el-header style="padding: 0">
        <el-container>
          <el-aside width="200px" style="background-color: #00a65a;">
            <img src="../assets/logo.png">
          </el-aside>
          <el-main style="background-color: #00a65a;padding-top: 0;">
            <admin-header />
          </el-main>
        </el-container>
      </el-header>
      <el-container>
        <el-aside width="200px" style="background-color: #fff;">
          <aside-nav :current-tab.sync="editableTabsValue" :menu-list="menuList" @addTab="addTab" />
        </el-aside>
        <el-container>
          <el-main>
            <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab" @tab-click="changeTab">
              <el-tab-pane
                v-for="item in editableTabs"
                :key="item.path"
                :label="item.name"
                :name="item.path"
                :closable="!item.editable"
              /></el-tabs>
            <!-- 路由不能放里面 否则刷新多次 -->
            <router-view />
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import AsideNav from '@/components/admin/aside-nav.vue'
import AdminHeader from '@/components/admin/admin-header.vue'
import { CHANGE_BACKGROUNDMENU } from '@/store/mutation-types'
import { mapMutations, mapState } from 'vuex'
export default {
  components: {
    AsideNav,
    AdminHeader
  },
  data() {
    return {
      editableTabsValue: '/admin', // 当前页
      // currentTab: '1', // 当前页
      editableTabs: [
        {
          name: '首页',
          path: '/admin',
          editable: true,
          _id: 1
        }
      ]
      // menuList: [] // 菜单列表
    }
  },
  computed: {
    ...mapState({
      menuList: 'backgroundMenu'
    })
  },
  created() {
    this.editableTabsValue = this.$route.path
    this.getBackgroundMenu()
  },
  methods: {
    ...mapMutations({
      'changeMenu': CHANGE_BACKGROUNDMENU // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    }),
    getBackgroundMenu() {
      this.axios.get('/menu?type=background').then(res => {
        console.log('查询参数结果', res)
        if (res && res.code === 200) {
          this.changeMenu(res.result)
          if (this.editableTabsValue !== '/admin') {
            let item = ''
            res.result.find(v => {
              item = v.subMenu.find(val => {
                return val.path === this.$route.path
              })
              return item
            })
            console.log('查询', item)
            this.addTab(item)
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    removeTab(targetPath) {
      const tabs = this.editableTabs
      let activePath = this.editableTabsValue
      let nextTab = ''
      console.log('删除文', targetPath, activePath)
      if (activePath === targetPath) {
        const tabIndex = tabs.findIndex(v => {
          return v.path === targetPath
        })
        if (tabIndex !== -1) {
          nextTab = tabs[tabIndex + 1] || tabs[tabIndex - 1]
          if (nextTab) {
            activePath = nextTab.path
          }
        }
      }
      // this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.path !== targetPath)
      if (this.editableTabs.length === 0) {
        this.editableTabsValue = '/admin'
      } else {
        this.editableTabsValue = nextTab.path
      }
      // 跳转路由
      if (this.editableTabsValue !== this.$route.path) {
        this.$router.push({ path: this.editableTabsValue })
      }
    },
    addTab(item) {
      this.editableTabsValue = item.path
      const flag = this.editableTabs.some(v => {
        return v.name === item.name
      })
      if (!flag) {
        this.editableTabs.push(item)
        console.log('点击路由', this.editableTabsValue)
      }
      this.$router.push({ path: item.path })
    },
    changeTab() {
      const item = this.editableTabs.find(v => v.path === this.editableTabsValue)
      console.log('当前页', item, this.editableTabsValue)
      if (item && item.path !== this.$route.path) {
        console.log('路径', item.path)
        this.$router.push({ path: item.path })
      }
      console.log('当前页改变', item.path, this.$route.path)
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  height: 100%;
  // border: 1px solid red;
  background-color: #00a65a;
  box-sizing: border-box;
  .el-container {
    // height: 100%;
    .el-header {
      width: 100%;
      border: 1px solid green;
      background-color: #00a65a;
    }
    .el-aside {
      border: 1px solid blue;
      overflow: inherit;
      // height: 100%;
    }
    .el-main {
      overflow: inherit;
      background-color: #fff;
      padding: 3px;
    }
    .el-footer {
      border: 1px solid pink;
    }
  }
  img {
    width: 200px;
    height: 60px;
    display: block;
  }
}
/deep/ .el-tabs__item.is-active {
    color: #00a65a;
}
/deep/ .el-tabs__item:hover {
  color: #00a65a;
}
.el-tabs__content {
  height: 100%;
}
</style>
