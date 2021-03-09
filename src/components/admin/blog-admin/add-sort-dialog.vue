<template>
  <el-dialog
    title="添加类别"
    :visible.sync="sortDialogVisible"
    center
    :show-close="false"
  >
    <el-row>
      <el-col :span="5" :offset="1"><span style="line-height: 35px;">文章类别</span></el-col>
      <el-col :span="15">
        <el-input v-model="sortTag" style="width: 300px;" />
      </el-col>
    </el-row>
    <el-row class="bottom-row">
      <el-col :span="3" :offset="14">
        <el-button @click="addArticleSort">{{ btnName }}</el-button>
      </el-col>
      <el-col :span="3" :offset="2">
        <el-button style="backgroundColor: #fff;color: #606266;" @click="closeDialog">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  props: {
    sortDialogVisible: {
      type: Boolean,
      default: false
    },
    updateFlag: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      id: '', // 修改类别使用
      sortTag: '' // 文章类别
    }
  },
  computed: {
    btnName() {
      return this.updateFlag ? '修改' : '添加'
    }
  },
  methods: {
    setSortName(item) {
      if (!item) {
        this.sortTag = ''
        this.id = ''
      } else {
        this.sortTag = item.name
        this.id = item._id
      }
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    // 增加文章分类
    addArticleSort() {
      if (!this.sortTag) {
        return this.$message.error('请输入文章分类名称')
      }
      const flag = this.tableData.some(v => {
        return v.name === this.sortTag
      })
      if (flag) {
        return this.$message.error('文章分类已经存在')
      }
      if (this.updateFlag) {
        this.axios.patch(`/articleSort/${this.id}`, { name: this.sortTag }).then(res => {
          if (res && res.code === 200) {
            this.$message.success('修改文章分类成功')
            this.$emit('addSort', res.result)
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.axios.post('/articleSort', { name: this.sortTag }).then(res => {
          if (res && res.code === 200) {
            this.$message.success('添加文章分类成功')
            this.$emit('addSort', res.result)
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.bottom-row {
  padding-top: 30px;
  /deep/ .el-button {
    color: white;
  }
}
/deep/ .el-dialog {
  width: 470px;
}
</style>
