<template>
  <div v-loading="loading" class="container">
    <el-form :inline="true" :model="ruleForm" label-width="80px">
      <el-form-item label="博客标题">
        <el-input v-model="ruleForm.title" placeholder="请输入博客标题" />
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
        <el-button type="primary" class="click-button" @click="getArticleList(false)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <div class="btn-container">
      <el-button type="primary" class="click-button" @click="goWrite">写文章</el-button>
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
      >
        <template slot-scope="scope">
          {{ getTableIndex(scope.$index) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="_id"
        label="博客id"
        show-overflow-tooltip
      />
      <el-table-column
        prop="title"
        label="博客标题"
        show-overflow-tooltip
      />
      <el-table-column
        prop="author.account"
        label="作者"
        show-overflow-tooltip
      />
      <el-table-column
        prop="content"
        label="内容"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.content | filterHtml }}
        </template>
      </el-table-column>
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
          <span class="span-link" @click="clickUpdateArticle(scope.row)">修改</span>
          <span class="span-link" style="color: #f56c6c;" @click="delArticle(scope.row)">删除</span>
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
    <write-article v-if="showWriteArticle" ref="write" :update-flag="updateFlag" @closeDialog="closeDialog" @addArticle="addArticle" />
  </div>
</template>
<script>
import WriteArticle from './write-article-dialog.vue'
export default {
  components: {
    WriteArticle
  },
  filters: {
    filterHtml(val) {
      return val.replace(/<\/?.+?>/g, '')
    }
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      total: 0,
      loading: false,
      ruleForm: {
        title: '',
        createTime: ''
      },
      showWriteArticle: false,
      updateFlag: false // 是否修改文章
    }
  },
  created() {
    console.log('文章管理')
    this.getArticleList()
  },
  methods: {
    // 序号转化
    getTableIndex(index) {
      return index + (this.currentPage - 1) * this.pageSize
    },
    // 获取文章列表
    getArticleList() {
      let startTime = ''
      let endTime = ''
      this.loading = true
      if (this.ruleForm.createTime) {
        startTime = this.$options.filters['filterTime'](this.ruleForm.createTime[0], 'yyyy-mm-dd')
        endTime = this.$options.filters['filterTime'](this.ruleForm.createTime[1], 'yyyy-mm-dd')
      }
      this.axios.get(`/article?currentPage=${this.currentPage}&pageSize=${this.pageSize}&title=${this.ruleForm.title}&startTime=${startTime}&endTime=${endTime}`).then(res => {
        if (res && res.code === 200) {
          this.tableData = res.result.articles
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
    // 删除文章
    delArticle(row) {
      this.$messagebox.confirm('确定删除该文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`/article/${row._id}`).then(res => {
          if (res && res.code === 200) {
            this.tableData = res.result.articles
            this.total = res.result.total
            // sessionStorage.setItem('articles', JSON.stringify(res.result))
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    // 修改文章
    clickUpdateArticle(row) {
      this.updateFlag = true
      console.log('数据', this.updateArticle)
      this.showWriteArticle = true
      this.$nextTick(() => {
        this.$refs.write.setUpdateArticle(row)
      })
    },
    // 新增文章
    addArticle(obj) {
      this.tableData = obj.articles
      this.total = obj.total
      this.currentPage = 1
      this.pageSize = 10
      this.closeDialog()
    },
    goWrite() {
      this.showWriteArticle = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getArticleList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getArticleList()
    },
    closeDialog() {
      this.showWriteArticle = false
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
  .click-button {
    width: 85px;
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
