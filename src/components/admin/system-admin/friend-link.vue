<template>
  <div v-loading="loading" class="container">
    <div class="btn-container">
      <el-button type="primary" class="click-button" @click="addLink">新增</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 90%"
      stripe
      highlight-current-row
    >
      <el-table-column
        type="index"
        width="50"
        label="序号"
      />
      <el-table-column
        prop="_id"
        label="链接id"
        show-overflow-tooltip
      />
      <el-table-column
        prop="name"
        label="链接名称"
        show-overflow-tooltip
      />
      <el-table-column
        prop="url"
        label="链接路径"
        show-overflow-tooltip
      />
      <el-table-column
        prop="author.account"
        label="作者"
        show-overflow-tooltip
      />
      <el-table-column
        prop="created"
        label="创建时间"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.created | filterTime('yyyy-mm-dd hh:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updated"
        label="更新时间"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.updated | filterTime('yyyy-mm-dd hh:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作"
      >
        <template slot-scope="scope">
          <span class="span-link" @click="updateLink(scope.row)">修改</span>
          <span class="span-link" style="color: #f56c6c;" @click="deleteLink(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <friend-dialog v-if="showDialog" ref="dialog" @closeDialog="closeDialog" @updateTable="updateTable" />
  </div>
</template>
<script>
import FriendDialog from './friend-link-dialog.vue'
export default {
  components: {
    FriendDialog
  },
  data() {
    return {
      tableData: [],
      showDialog: false,
      loading: false
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 新增链接
    updateTable(arr) {
      this.tableData = arr
      this.closeDialog()
    },
    addLink() {
      this.showDialog = true
    },
    // 关闭链接
    closeDialog() {
      this.showDialog = false
    },
    // 获取数据
    getTableData() {
      this.loading = true
      const links = sessionStorage.getItem('links')
      console.log('获取链接数据', typeof links)
      if (links) {
        const obj = JSON.parse(links)
        this.tableData = obj
        this.loading = false
      } else {
        this.axios.get('/friendLink').then(res => {
          if (res && res.code === 200) {
            this.tableData = res.result.links
            sessionStorage.setItem('links', JSON.stringify(res.result.links))
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          console.error(err)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    // 更新链接
    updateLink(row) {
      this.showDialog = true
      this.$nextTick(() => {
        this.$refs.dialog.setLinkData({ name: row.name, url: row.url, id: row._id })
      })
    },
    // 删除链接
    deleteLink(row) {
      this.$messagebox.confirm('确定删除该链接?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`/friendLink/${row._id}`).then(res => {
          if (res && res.code === 200) {
            this.tableData = res.result.links
            sessionStorage.setItem('links', JSON.stringify(res.result))
          } else {
            this.$message.error(res.message)
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  background-color: #fff;
  height: 85%;
  box-sizing: border-box;
  /deep/ .el-table {
    margin: 15px auto;
  }
  .btn-container {
    width: 90%;
    margin: 20px auto;
    margin-bottom: 15px;
  }
  .span-link {
    cursor: pointer;
    color: #409eff;
    padding-left: 15px;
  }
}
/deep/ .el-table th {
  padding: 9px 0;
  font-weight: bold;
}
/deep/ .el-table td, .el-table tr {
  height: 40px;
  padding: 0;
}
/deep/ .el-button {
  background-color: #00a65a;
}
</style>
