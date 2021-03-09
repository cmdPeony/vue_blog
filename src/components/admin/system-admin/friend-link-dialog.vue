<template>
  <el-dialog
    title="添加链接"
    :visible="true"
    center
    :show-close="false"
  >
    <el-row>
      <el-col :span="5" :offset="1"><span style="line-height: 35px;">链接名称</span></el-col>
      <el-col :span="15">
        <el-input v-model="name" style="width: 300px;" />
      </el-col>
    </el-row>
    <el-row style="margin: 15px 0;">
      <el-col :span="5" :offset="1"><span style="line-height: 35px;">URL</span></el-col>
      <el-col :span="15">
        <el-input v-model="url" style="width: 300px;" />
      </el-col>
    </el-row>
    <el-row class="bottom-row">
      <el-col :span="3" :offset="14">
        <el-button @click="saveLink">{{ btnName }}</el-button>
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
      id: '', // 修改的时候调用
      name: '', // 链接名称
      url: '' // 链接路径
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
    // 保存链接
    saveLink() {
      if (!this.name) {
        return this.$message.error('请输入链接名称')
      }
      if (!this.url) {
        return this.$message.error('请输入链接url')
      }
      if (this.id) {
        this.axios.patch(`/friendLink/${this.id}`, { name: this.name, url: this.url }).then(res => {
          if (res && res.code === 200) {
            this.$emit('updateTable', res.result.links)
            this.$message.success('修改友情链接成功')
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.axios.post('/friendLink', { name: this.name, url: this.url }).then(res => {
          if (res && res.code === 200) {
            this.$emit('updateTable', res.result.links)
            this.$message.success('新增友情链接成功')
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    // 设置当前链接的数据
    setLinkData(obj) {
      this.name = obj.name
      this.url = obj.url
      this.id = obj.id
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
