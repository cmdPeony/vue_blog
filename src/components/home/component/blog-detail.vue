<template>
  <div v-loading="loading" class="detail-cotainer">
    <div class="header">
      <p>{{ article.title }}</p>
      <div class="describe">
        <span>发布时间：{{ article.created | filterTime }}</span>
        <span>
          <i class="el-icon-star-off" />{{ article.loves }}颗星
        </span>
        <span>
          <i class="el-icon-reading" />{{ article.visits | filterNum }}次阅读
        </span>
      </div>
    </div>
    <div class="content">
      <div class="ql-container ql-snow">
        <div class="ql-editor" v-html="article.content" />
        <!-- <p>{{ article.content }} </p> -->
      </div>
      <div class="footer">
        <div class="footer-button">
          <el-button type="primary" :disabled="disabledAddLove" @click="addLove">给颗星</el-button>
        </div>
        <el-divider />
        <p>该文章属于{{ articleSort }}分类, 被贴了{{ articleTag }}标签</p>
        <div class="recomend">
          上一篇: <span :class="getRecomendClass(previous)" @click="changeArticle(previous._id)">{{ previous && previous.title }}</span>
          下一篇: <span :class="getRecomendClass(next)" @click="changeArticle(next._id)">{{ next && next.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import 'quill/dist/quill.snow.css'
export default {
  filters: {
    filterNum(val) {
      return val || 0
    }
  },
  data() {
    return {
      article: '',
      previous: '',
      next: '',
      loading: false,
      hasAddLoves: [], // 已经点赞过的
      hasRead: []
    }
  },
  computed: {
    articleSort() {
      return this.article ? this.article.sorts.map(v => v.name).join('、') : ''
    },
    articleTag() {
      return this.article ? this.article.tags.map(v => v.name).join('、') : ''
    },
    disabledAddLove() {
      return this.hasAddLoves.includes(this.article._id)
    }
  },
  watch: {
    $route(val) {
      console.log('啊哈哈哈', val)
    }
  },
  created() {
    const loves = localStorage.getItem('hasAddLoves')
    if (loves) {
      this.hasAddLoves = JSON.parse(loves)
    }
    const read = localStorage.getItem('hasRead')
    if (read) {
      this.hasRead = JSON.parse(read)
    }
    this.getArticle(this.$route.params.id, 0)
  },
  methods: {
    getRecomendClass(obj) {
      return obj && obj._id ? 'link-class' : ''
    },
    getArticle(id, type) {
      if (type === 1) {
        this.$router.push({ name: 'detail', params: { id }})
      }
      this.loading = true
      this.axios.get(`/article/${id}`).then(res => {
        if (res && res.code === 200) {
          this.article = res.result.article ? res.result.article : {}
          this.previous = res.result.previous[0] || { title: '没有了' }
          this.next = res.result.next[0] || { title: '没有了' }
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err.message)
      }).finally(() => {
        this.loading = false
        console.log('当Ian', typeof this.hasRead)
        if (this.article && !this.hasRead.includes(this.article._id)) {
          this.addVisits()
        }
      })
    },
    changeArticle(id) {
      if (id) {
        this.getArticle(id, 1)
      }
    },
    addLove() {
      this.article.loves++
      this.axios.patch(`/article/${this.article._id}`, { loves: this.article.loves }).then(res => {
        if (!res || res.code !== 200) {
          this.article.loves--
          this.$message.error(res.message)
        } else {
          this.hasAddLoves.push(this.article._id)
          localStorage.setItem('hasAddLoves', JSON.stringify(this.hasAddLoves))
          // this.$message.errr('')
        }
      }).catch(() => {
        this.article.loves--
      })
    },
    // 新增浏览人数
    addVisits() {
      // 这个值不存在 给个默认值
      if (!this.article.visits) {
        this.article.visits = 1
      } else {
        this.article.visits += 1
      }
      this.axios.patch(`/article/${this.article._id}`, { visits: this.article.visits }).then(res => {
        if (!res || res.code !== 200) {
          this.article.visits--
          this.$message.error(res.message)
        } else {
          this.hasRead.push(this.article._id)
          localStorage.setItem('hasRead', JSON.stringify(this.hasRead))
        }
      }).catch(() => {
        this.article.visits--
      })
    }
  }
}
</script>
<style lang="less" scoped>
.detail-cotainer {
  background-color: #fff;
  padding: 0 20px;
  padding-bottom: 170px;
  .header {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    p {
      font-size: 18px;
      text-align: center;
      line-height: 50px;
    }
    .describe {
      line-height: 30px;
      font-size: 12px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      border-bottom: 1px solid #eae6e6;
      span {
        padding-left: 20px;
        i {
          margin-right: 3px;
        }
      }
    }
  }
  .footer {
    margin-top: 10px;
    position: relative;
    box-sizing: border-box;
    /deep/ .el-divider {
      position: absolute;
      top: 75px;
    }
    .recomend {
      font-size: 16px;
      line-height: 30px;
      color: #555;
      position: absolute;
      top: 105px;
    }
    p {
      position: absolute;
      top: 65px;
      left: 15px;
      color: #757575;
      font-size: 12px;
    }
    span {
      width: 750px;
      display: inline-block;
      padding-left: 20px;
    }
    .link-class {
      color: #409EFF;
      cursor: pointer;
      text-decoration: underline;
    }
    .footer-button {
      position: absolute;
      left: 50%;
      top: 10px;
      transform: translateX(-50%);
    }
  }
  .ql-container.ql-snow {
    border: none;
  }
}
</style>
