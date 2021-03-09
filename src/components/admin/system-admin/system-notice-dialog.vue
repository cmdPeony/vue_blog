<template>
  <el-dialog
    title="添加公告"
    :visible="true"
    center
    :show-close="false"
  >
    <el-row>
      <el-col :span="24">
        <el-input v-model="content" type="textarea" maxlength="200" @input="inputContent" />
        <span v-if="showTips" style="float: left;margin-top: 10px; color: red;">{{ tips }} </span>
        <span style="float:right;color:#999; margin-top: 10px;">{{ restCount }}/{{ maxLength }}</span>
      </el-col>
    </el-row>
    <el-row class="bottom-row">
      <el-col :span="3" :offset="14">
        <el-button @click="saveNotice">{{ btnName }}</el-button>
      </el-col>
      <el-col :span="3" :offset="2">
        <el-button style="backgroundColor: #fff;color: #606266;" @click="closeDialog">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      content: '',
      restCount: 200,
      maxLength: 200,
      tips: '',
      showTips: false,
      id: '' // 修改的时候用
    }
  },
  computed: {
    btnName() {
      return this.id ? '修改' : '保存'
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
    inputContent(val) {
      if (this.content.length > this.maxLength) {
        this.content = this.content.substr(0, this.maxLength)
        this.tips = `公告字数限制${this.maxLength}以内`
        this.showTips = true
        return
      }
      this.showTips = false
      this.restCount = this.maxLength - this.content.length
    },
    // 修改公告初始化值
    setNotice(obj) {
      this.content = obj.content
      this.id = obj._id
      this.restCount = this.maxLength - this.content
    },
    // 保存链接
    saveNotice() {
      // 更新系统公告
      if (this.id) {
        this.axios.patch(`/systemNotice/${this.id}`, { content: this.content }).then(res => {
          if (res && res.code === 200) {
            this.$emit('updateNotice', res.result)
            this.$message.success('修改系统公告成功')
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        // 新增系统公告
        this.axios.post(`/systemNotice`, { content: this.content }).then(res => {
          if (res && res.code === 200) {
            this.$emit('updateNotice', res.result)
            this.$message.success('新增系统公告成功')
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
  width: 500px;
}
</style>
