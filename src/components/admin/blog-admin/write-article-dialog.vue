<template>
  <el-dialog title="写文章" :show-close="false" :visible="true" :close-on-click-modal="false" top="105px" @close="closeDialog">
    <div class="left-container">
      <el-form label-width="80px">
        <el-form-item label="文章标题">
          <el-input v-model="ruleForm.title" />
        </el-form-item>
      </el-form>
      <quill-editor
        ref="myTextEditor"
        v-model="ruleForm.content"
        :options="editorOption"
      />
    </div>
    <div class="right-container">
      <div class="box">
        <div class="box-header">
          <h3 class="box-title">文章分类</h3>
        </div>
        <div class="box-body">
          <span>文章类别</span>
          <el-select
            v-model="ruleForm.sorts"
            multiple
            style="margin-left: 20px;"
            placeholder="请选择文章分类"
            :multiple-limit="3"
          >
            <el-option
              v-for="item in articleSortData"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </div>
      </div>
      <div class="box">
        <div class="box-header">
          <h3 class="box-title">文章标签</h3>
        </div>
        <div class="box-body">
          <span>文章标签</span>
          <el-select
            v-model="ruleForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            style="margin-left: 20px;"
            placeholder="请选择文章标签"
            :multiple-limit="5"
          >
            <el-option
              v-for="item in articleTagData"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </div>
      </div>
      <div class="box">
        <div class="box-header">
          <h3 class="box-title">文章设置</h3>
        </div>
        <div class="box-body">
          <span>文章设置</span>
          <el-select
            v-model="ruleForm.flag"
            style="margin-left: 20px;"
            placeholder="请选择文章标签"
          >
            <el-option
              v-for="item in articleShow"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </div>
    <el-divider />
    <div class="footer-btn">
      <el-button type="primary" @click="saveArticle">保存</el-button>
      <el-button style="backgroundColor: #fff;" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  components: {
    quillEditor
  },
  props: {
    updateFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ruleForm: {
        id: '', // 编辑用的
        title: '', // 标题
        content: '', // 博客内容
        sorts: [], // 文章类别
        tags: [], // 文章标签
        flag: 1, // 文章性质 0 自己见
        addTag: [] // 自己增加的文章标标签
      },
      articleShow: [
        { label: '仅自己可见', value: 0 },
        { label: '所有人可见', value: 1 }
      ],
      articleSortData: [], // 文章分类
      articleTagData: [], // 文章标签
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
          ]
        }
      }
    }
  },
  created() {
    console.log('调用渲染')
    this.getArticleSortData()
    this.getArticleTagData()
  },
  methods: {
    setUpdateArticle(val) {
      console.log('更新数据')
      this.ruleForm.title = val.title
      this.ruleForm.content = val.content
      this.ruleForm.id = val._id
      this.ruleForm.tags = val.tags.map(v => v._id)
      this.ruleForm.sorts = val.sorts.map(v => v._id)
      this.ruleForm.flag = val.flag
    },
    // 获取所有文章分类
    getArticleSortData() {
      // 查找所有文章分类
      this.axios.get(`/articleSort?currentPage=${this.currentPage}&pageSize=30`).then(res => {
        if (res && res.code === 200) {
          this.articleSortData = res.result.sorts
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getArticleTagData() {
      // 查找所有文章分类
      this.axios.get(`/articleTag`).then(res => {
        if (res && res.code === 200) {
          this.articleTagData = res.result
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 保存文章
    saveArticle() {
      if (!this.ruleForm.title) {
        return this.$message.error('请输入文章标题')
      }
      if (!this.ruleForm.content) {
        return this.$message.error('请输入文章内容')
      }
      if (!this.ruleForm.sorts.length) {
        return this.$message.error('请选择文章类别')
      }
      if (!this.ruleForm.tags.length) {
        return this.$message.error('请选择文章标签')
      }
      const tagIds = this.articleTagData.map(item => item._id)
      this.ruleForm.addTag = this.ruleForm.tags.filter(v => {
        return !tagIds.includes(v)
      })
      this.ruleForm.tags = this.ruleForm.tags.filter(v => {
        return tagIds.includes(v)
      })
      if (this.ruleForm.id) {
        this.axios.patch(`/article/${this.ruleForm.id}`, this.ruleForm).then(res => {
          if (res && res.code === 200) {
            this.$message.success('修改文章成功')
            this.$emit('addArticle', res.result)
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.axios.post(`/article`, this.ruleForm).then(res => {
          if (res && res.code === 200) {
            this.$message.success('添加文章成功')
            this.$emit('addArticle', res.result)
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-dialog {
  width: 85%;
  margin-left: 200px;
  margin-right: 50px;
}
/deep/ .el-dialog__body {
  width: 96%;
  padding-right: 20px;
  display: flex;
  padding-top: 15px;
  .left-container {
    flex: 2;
    padding-right: 30px;
    padding-bottom: 60px;
  }
  .right-container {
    flex: 1;
    padding-bottom: 60px;
  }
  /deep/ .el-divider {
    position: absolute;
    bottom: 35px;
    width: 96%;
  }
  .footer-btn {
    position: absolute;
    bottom: 10px;
    right: 30px;
  }
}
/deep/ .ql-container {
  min-height: 300px;
}
.box-header {
  color: #555;
  display: block;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-bottom: 1px solid #00a65a;
  border-top: 3px solid #00a65a;
  box-shadow: 0 1px 1px rgb(0 0 0 / 20%);
}
.box {
  position: relative;
  border-radius: 3px;
  background: #ffffff;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 30px;
  .box-body {
    padding-top: 55px;
    text-align: center;
  }
}
</style>
