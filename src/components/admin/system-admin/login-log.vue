<template>
  <div v-loading="loading" class="container">
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
      >
        <template slot-scope="scope">
          {{ getTableIndex(scope.$index) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="_id"
        label="id"
        show-overflow-tooltip
      />
      <el-table-column
        prop="loginIP"
        label="登录IP"
        show-overflow-tooltip
      />
      <el-table-column
        prop="loginUser.account"
        label="登录账号"
        show-overflow-tooltip
      />
      <el-table-column
        prop="created"
        label="登录时间"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.created | filterTime('yyyy-mm-dd hh:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <span class="span-Link" style="color: #f56c6c; cursor: pointer;" @click="deleteLog(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100],
      total: 0,
      loading: false
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 序号转化
    getTableIndex(index) {
      return index * 1 + (this.currentPage - 1) * this.pageSize
    },
    getTableData(flag) {
      this.loading = true
      this.axios.get(`/loginLog?currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then(res => {
        if (res && res.code === 200) {
          this.tableData = res.result.logs
          this.total = res.result.total
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },
    deleteLog(row) {
      this.$messagebox.confirm('确定删除该日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`/loginLog/${row._id}`).then(res => {
          if (res && res.code === 200) {
            this.tableData = res.result.logs
            this.total = res.result.total
            this.$message.success('删除系统日志成功')
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getTableData(false)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableData(false)
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
  .span-link {
    cursor: pointer;
    color: #409eff;
    padding-left: 15px;
  }
}
/deep/ .el-pagination {
  width: 90%;
  margin: 20px auto;
}
/deep/ .el-table th {
  padding: 9px 0;
  font-weight: bold;
}
/deep/ .el-table td, .el-table tr {
  height: 40px;
  padding: 0;
}
/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #00a65a;
}
</style>
