<template>
  <div v-loading="loading" class="container">
    <div class="btn-container">
      <el-button type="primary" class="click-button" @click="addNotice">新增</el-button>
    </div>
    <el-table :data="tableData" border style="width: 90%" stripe highlight-current-row>
      <el-table-column
        type="index"
        width="50"
        label="序号"
      >
        <template slot-scope="scope">
          {{ getTableIndex(scope.$index) }}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="公告内容" show-overflow-tooltip />
      <el-table-column prop="author.account" label="作者" show-overflow-tooltip />
      <el-table-column prop="status" label="是否生效" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
      </el-table-column>
      <el-table-column prop="created" label="创建时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.created | filterTime('yyyy-mm-dd hh:mm:ss') }}</template>
      </el-table-column>
      <el-table-column prop="updated" label="更新时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.updated | filterTime('yyyy-mm-dd hh:mm:ss') }}</template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" :width="180">
        <template slot-scope="scope">
          <el-button type="text" class="span-link" @click="modifyNotice(scope.row)">修改</el-button>
          <el-button
            type="text"
            :disabled="disabledBtn(scope.row, 1)"
            :style="btnColor(scope.row, 1)"
            class="span-link"
            @click="changeNoticeStatus(scope.row, 1)"
          >生效</el-button>
          <el-button
            type="text"
            :disabled="disabledBtn(scope.row, 0)"
            :style="btnColor(scope.row, 0)"
            class="span-link"
            style="color: #f56c6c;"
            @click="changeNoticeStatus(scope.row, 0)"
          >失效</el-button>
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
    <notice-dialog
      v-if="showDialog"
      ref="dialog"
      @closeDialog="closeDialog"
      @updateNotice="updateNotice"
    />
  </div>
</template>
<script>
import NoticeDialog from './system-notice-dialog'
export default {
  components: {
    NoticeDialog
  },
  filters: {
    filterStatus(val) {
      return val === 1 ? '生效' : '失效'
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100],
      total: 0,
      tableData: [],
      showDialog: false,
      loading: false
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 序号转化
    getTableIndex(index) {
      // console.log('数据', index, this.currentPage, this.pageSize)
      return index * 1 + (this.currentPage - 1) * this.pageSize
    },
    // 改变公告状态
    changeNoticeStatus(row, status) {
      if (status === 1) {
        const flag = this.tableData.some(v => {
          return v.status === 1
        })
        if (flag) {
          return this.$message.error('仅允许一条生效的公告存在')
        }
      }
      this.$messagebox.confirm('确定修改该公告的状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.patch(`/systemNotice/${row._id}/status`, { status }).then(res => {
          if (res && res.code === 200) {
            this.tableData = res.result.notices
            this.total = res.result.total
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(err => {
        console.log(err)
      })
    },
    disabledBtn(row, type) {
      if (type === 1) {
        return row.status === 1
      } else {
        return row.status === 0
      }
    },
    btnColor(row, type) {
      if (
        (type === 1 && row.status === 1) ||
        (type === 0 && row.status === 0)
      ) {
        return 'color: #e5e5e5;'
      }
      return ''
    },
    getTableData() {
      this.loading = true
      this.axios.get(`/systemNotice?currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then(res => {
        if (res && res.code === 200) {
          this.tableData = res.result.notices
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
    addNotice() {
      this.showDialog = true
    },
    // 关闭公告
    closeDialog() {
      this.showDialog = false
    },
    // 更新公告
    updateNotice(obj) {
      this.tableData = obj.notices
      this.total = obj.total
      this.showDialog = false
    },
    // 修改公告
    modifyNotice(row) {
      this.showDialog = true
      this.$nextTick(() => {
        this.$refs.dialog.setNotice(row)
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
@import url('./system-notice.less');
</style>
