<template>
  <div v-loading="homeLoading" class="list-container">
    <main-content-card v-for="item in articles" :key="item._id" :article="item" />
    <div v-if="!total" class="wrapper-page">
      <div class="ex-page-content text-center">
        <h2>亲， 没找到相关内容</h2><br>
      </div>
    </div>
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
import { mapGetters, mapActions } from 'vuex'
import MainContentCard from './main-content-card.vue'
// import { SET_BLOG_LIST_CURPAGE, SET_BLOG_LIST_PAGESIZE } from '@/store/mutation-types'
export default {
  components: {
    MainContentCard
  },
  data() {
    return {
      pageSizes: [10, 20, 30, 50],
      sortId: '', // 点击分类的
      tagId: '', // 点击标签的
      title: '', // 查询
      timeStr: '', // 时间查询 文章归档
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    ...mapGetters({
      articles: 'getArticleList',
      total: 'getArticleTotal',
      homeLoading: 'getHomeLoading'
    })
  },
  created() {
    console.log('路由', this.$route)
    this.getIdByType()
    this.getArticles()
  },
  methods: {
    ...mapActions(['getArticleList']),
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getArticles()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getArticles()
    },
    // 获取文章数据
    getArticles() {
      this.getArticleList(`currentPage=${this.currentPage}&pageSize=${this.pageSize}&title=${this.title}&sortId=${this.sortId}&tagId=${this.tagId}&time=${this.timeStr}`)
    },
    // 根据type判断当前类型
    getIdByType() {
      switch (this.$route.params.type) {
        case 'search':
          this.title = this.$route.params.id || ''
          break
        case 'sort':
          this.sortId = this.$route.params.id || ''
          break
        case 'tag':
          this.tagId = this.$route.params.id || ''
          break
        case 'count':
          this.timeStr = this.$route.params.id || ''
          break
        default:
          this.sortId = ''
          this.tagId = ''
          this.title = ''
          this.timeStr = ''
          // 类型拦截
          if (this.$route.params.type) {
            this.$router.push('/home')
          }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.wrapper-page {
  margin: 7.5% auto;
  width: 420px;
  text-align: center;
}
h2 {
  line-height: 35px;
  font-weight: bold;
  color: #555;
}
</style>
