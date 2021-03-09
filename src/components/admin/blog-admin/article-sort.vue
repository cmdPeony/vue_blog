<template>
  <div v-loading="loading" class="container">
    <el-form :inline="true" :model="ruleForm" label-width="80px">
      <el-form-item label="类别名称">
        <el-input v-model="ruleForm.name" placeholder="请输入类别名称" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="ruleForm.createTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="click-button" @click="getTableData(false)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <div class="btn-container">
      <!-- 10条的时候不能新增 -->
      <el-button type="primary" class="click-button" :disabled="total >= 10" @click="goAddSort">新增</el-button>
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
        label="类别id"
        show-overflow-tooltip
      />
      <el-table-column
        prop="name"
        label="类别名称"
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
          <span class="span-link" @click="updateSort(scope.row)">修改</span>
          <span class="span-link" style="color: #f56c6c;" @click="deleteSort(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- tableData拦截数据 -->
    <sort-dialog ref="dialog" :table-data="tableData" :sort-dialog-visible="sortDialogVisible" :update-flag="updateFlag" @closeDialog="closeDialog" @addSort="addSort" />
  </div>
</template>
<script>
// 文章类别最多新增20条
import SortDialog from './add-sort-dialog.vue'
export default {
  components: {
    SortDialog
  },
  data() {
    return {
      tableData: [], // 所有文章分类
      total: 0,
      loading: false,
      ruleForm: {
        name: '',
        createTime: ''
      },
      sortDialogVisible: false,
      updateFlag: false, // 更新分类
      updateSortItem: {} // 传递给子组件的
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 获取分类数据
    getTableData() {
      this.loading = true
      let startTime = ''
      let endTime = ''
      if (this.ruleForm.createTime) {
        startTime = this.$options.filters['filterTime'](this.ruleForm.createTime[0], 'yyyy-mm-dd')
        endTime = this.$options.filters['filterTime'](this.ruleForm.createTime[1], 'yyyy-mm-dd')
      }
      this.axios.get(`/articleSort?name=${this.ruleForm.name}&startTime=${startTime}&endTime=${endTime}`).then(res => {
        if (res && res.code === 200) {
          this.tableData = res.result.sorts
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
    // 更新文章分类
    updateSort(row) {
      this.updateFlag = true
      this.sortDialogVisible = true
      this.$refs.dialog.setSortName(row)
    },
    // 新增分类
    addSort(obj) {
      this.tableData = obj.sorts
      this.total = obj.total
      this.closeDialog()
    },
    // 点击新增
    goAddSort() {
      this.sortDialogVisible = true
      this.$refs.dialog.setSortName('')
    },
    onSubmit() {
      console.log('查询')
    },
    // 关闭弹窗
    closeDialog() {
      this.sortDialogVisible = false
      this.updateFlag = false
    },
    // 删除分类
    deleteSort(row) {
      this.$messagebox.confirm('确定删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`/articleSort/${row._id}`).then(res => {
          if (res && res.code === 200) {
            this.tableData = res.result.sorts
            this.total = res.result.total
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
  position: relative;
  background-color: #fff;
  .el-table {
    margin: 10px auto;
  }
  .el-form {
    // display: inline-block;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 15px;
  }
  .btn-container {
    width: 90%;
    margin: 0 auto;
    margin-bottom: 15px;
  }
  /deep/ .el-form-item {
    margin-bottom: 15px;
  }
  /deep/ .el-pagination {
    width: 90%;
    margin: 20px auto;
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
/deep/ .el-divider {
  margin: 0 auto;
  margin-bottom: 30px;
  width: 90%;
}
/deep/ .el-button {
  background-color: #00a65a;
}
/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #00a65a;
}
</style>
