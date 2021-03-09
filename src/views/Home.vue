<template>
  <div v-loading="loading" class="home">
    <el-container>
      <el-header>
        <div class="header-container">
          <div class="header-title">Peony的个人博客</div>
          <ul class="header-menu">
            <li :class="{'active': $route.path === '/home' || $route.path === '/home/'}" @click="goHome">首页</li>
            <li v-for="item in sorts" :key="item._id" :class="{'active': judgeActive(item)}" @click="goLink(item)">{{ item.name }}</li>
          </ul>
          <div id="box">
            <div v-if="account && token" class="login" @click="changeCardStatus">{{ account }}</div>
            <div v-else class="login" @click="goLogin">登录</div>
            <el-card v-if="showCard" class="box-card">
              <span @click="goAdmin">后台管理</span>
              <span @click="logout">注销</span>
            </el-card>
          </div>
        </div>
      </el-header>
      <blog-home :sorts="sorts" :tags="tags" :articles="articles" :notice-content="noticeContent" :links="links" :article-count="articleCount" />
      <el-footer>底部</el-footer>
    </el-container>
  </div>
</template>

<script>
import BlogHome from '../components/home/blog-home.vue'
import {
  SET_ARTICLE_List_TOTAL
} from '../store/mutation-types'
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'Home',
  components: {
    BlogHome
  },
  data() {
    return {
      loading: false,
      noticeContent: '', // 关于本站
      articles: [], // 最近的10篇文章
      sorts: [], // 文章分类
      tags: [], // 文章标签
      links: [], // 友情链接
      articleCount: [], // 文章归档数据
      account: '',
      showCard: false
    }
  },
  computed: {
    ...mapGetters({
      token: 'getToken'
    })
  },
  created() {
    this.account = sessionStorage.getItem('account')
    this.getHomeData()
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    ...mapMutations({
      setArticleListTotal: SET_ARTICLE_List_TOTAL
    }),
    // 处理外部点击 关闭
    handleClickOutside(e) {
      const box = document.getElementById('box')
      if (box && !box.contains(e.target)) {
        this.showCard = false
      }
    },
    // 退出展示
    logout() {
      sessionStorage.clear()
      localStorage.clear()
      this.$router.go(0)
    },
    // 切换卡片展示
    changeCardStatus() {
      this.showCard = !this.showCard
    },
    // 跳转登录页面
    goLogin() {
      this.$router.push('/login')
    },
    // 跳转首页
    goHome() {
      if (this.$route.path !== '/home') {
        this.$router.push({ path: '/home' })
      }
    },
    goAdmin() {
      this.$router.push('/admin')
    },
    // 判断是否处于激活状态
    judgeActive(item) {
      if (this.$route.path.indexOf(`/home/sort/${item._id}`) !== -1) {
        return true
      } else {
        return false
      }
    },
    // 调准
    goLink(item) {
      if (this.$route.path !== item.path) {
        if (item.type) {
          this.$router.push({ path: '/home' })
        } else {
          this.$router.push({ path: `/home/sort/${item._id}` })
        }
      }
    },
    // 获取文章归档数据
    getArticleCount() {
      return this.axios.get('/article/count')
    },
    // 获取当前生效的网站公告
    getNotice() {
      return this.axios.get('/systemNotice/home')
    },
    // 文章
    getRecentArticles() {
      return this.axios.get('/article/recent')
    },
    // 文章
    getAllArticles() {
      return this.axios.get('/article')
    },
    getLink() {
      return this.axios.get('/friendLink')
    },
    getTags() {
      return this.axios.get('/articleTag')
    },
    getSorts() {
      return this.axios.get('/articleSort')
    },
    // 获取首页加载的数据
    getHomeData() {
      this.loading = true
      const arr = [
        this.getNotice(),
        this.getRecentArticles(),
        this.getLink(),
        this.getTags(),
        this.getSorts(),
        this.getArticleCount()
      ]
      // 说明是在首页
      if (!this.$route.params.id) {
        arr.push(this.getAllArticles())
      }
      Promise.all(arr)
        .then(res => {
          console.log('请求数据', res)
          const notice = res[0]
          const recent = res[1]
          const links = res[2]
          const tags = res[3]
          const sorts = res[4]
          const counts = res[5]

          if (notice && notice.code === 200) {
            this.noticeContent = notice.result.notices && notice.result.notices.content ? notice.result.notices.content : ''
            console.log('通知数据', this.notice)
          }
          if (recent && recent.code === 200) {
            this.articles = recent.result.articles
          }
          if (links && links.code === 200) {
            this.links = links.result.links
            console.log('友情链接', links)
          }
          if (tags && tags.code === 200) {
            this.tags = tags.result
            console.log('标签', this.tags)
          }
          if (sorts && sorts.code === 200) {
            this.sorts = sorts.result.sorts
            console.log('文章分类', this.sorts)
          }
          // 避免吃饭请求数据
          if (res.length === 6) {
            const articles = res[6]
            if (articles && articles.code === 200) {
              console.log('文章数据', articles.result)
              this.setArticleListTotal(articles.result)
              console.log('设置文章数据', articles.result.articles)
            }
          }

          if (counts && counts.code === 200) {
            this.articleCount = counts.result.map(v => {
              return {
                year: v._id.year,
                month: v._id.month,
                count: v.count
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error(err.message)
        })
        .finally(() => {
          console.log('六拉尼数据', this.loading)
          this.loading = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.el-container {
  border: 1px solid red;
  width: 100%;
  .el-header {
    padding: 0;
    width: 100%;
    background-color: #fff;
    position: fixed;
    box-sizing: border-box;
    box-shadow: 0 8px 6px -6px #999;
    z-index: 999;
    .header-container {
      width: 1200px;
      margin: 0 auto;
      position: relative;
    }
    .header-title {
      font-size: 22px;
      line-height: 60px;
      color: #555;
      display: inline;
      position: absolute;
      left: 0;
    }
    .header-menu {
      font-size: 16px;
      color: #555;
      line-height: 60px;
      position: absolute;
      left: 200px;
    }
    li {
      padding-left: 40px;
      cursor: pointer;
      float: left;
      &:hover {
        color: #409eff;
      }
    }
    .login {
      position: absolute;
      right: 10px;
      line-height: 60px;
      cursor: pointer;
      color: #555;
      &:hover {
        color: #409eff;
      }
    }
    .active {
      color: #409eff;
    }
  }
}
.box-card {
  width: 100px;
  position: absolute;
  right: 0;
  top: 60px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  span {
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
    display: block;
    &:hover {
      background-color: #eee;
    }
  }
}
/deep/ .el-card__body {
  padding: 10px;
  text-align: center;
}
.el-footer {
  border: 1px solid red;
  width: 1200px;
  margin: 0 auto;
}
</style>
