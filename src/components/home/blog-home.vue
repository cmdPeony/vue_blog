<template>
  <el-container v-loading="loading" class="main-container">
    <el-aside width="300px">
      <aside-content>
        <template #title>关于本站</template>
        <template #content>
          <p style="text-decoration: none;cursor: text;color: #555;">{{ noticeContent }}</p>
        </template>
      </aside-content>
      <!-- 搜索模块 -->
      <aside-search ref="search" @clickSearch="clickSearch" />
      <aside-content>
        <template #title>最近更新</template>
        <template #content>
          <p
            v-for="(item, index) in articles"
            :key="item._id"
            :class="{'active': item._id === $route.params.id}"
            @click="goDetail(item)"
          >【{{ index + 1 }}】{{ item.title }}</p>
        </template>
      </aside-content>
      <!-- 文章分类模块 -->
      <aside-content>
        <template #title>文章分类</template>
        <template #content>
          <p
            v-for="(item, index) in sorts"
            :key="item._id"
            class="recommend"
            :class="{'active': item._id === $route.params.id }"
            @click="getSortArticles(item)"
          >
            【{{ index + 1 }}】{{ item.name }}
            <span>({{ item.articles.length }})</span>
          </p>
        </template>
      </aside-content>
      <!-- 文章归档 -->
      <aside-content>
        <template #title>文章归档</template>
        <template #content>
          <p v-for="item in articleCount" :key="item.month" class="recommend" @click="goArticleCount(item)">{{ item.year }}年{{ item.month }}月({{ item.count }})</p>
        </template>
      </aside-content>
      <!-- 文章标签 -->
      <aside-content>
        <template #title>标签云</template>
        <template #content>
          <ul>
            <li
              v-for="item in tags"
              :key="item._id"
              :class="{'active': item._id === $route.params.id }"
              @click="getArticleTag(item)"
            >{{ item.name }}</li>
          </ul>
        </template>
      </aside-content>
      <aside-content>
        <template #title>友情链接</template>
        <template #content>
          <a
            v-for="(item, index) in links"
            :key="item._id"
            :href="item.url"
            target="_blank"
          >【{{ index + 1 }}】{{ item.name }}</a>
        </template>
      </aside-content>
    </el-aside>
    <el-main>
      <router-view :key="key" />
    </el-main>
  </el-container>
</template>
<script>
import AsideContent from '@/components/home/component/aside-content.vue'
import AsideSearch from '@/components/home/component/aside-search.vue'
import { mapActions } from 'vuex'
export default {
  components: {
    AsideContent,
    AsideSearch
  },
  props: {
    noticeContent: {
      type: String,
      default: ''
    }, // 关于本站
    articles: {
      type: Array,
      default: () => []
    }, // 最近的10篇文章
    sorts: {
      type: Array,
      default: () => []
    }, // 文章分类
    tags: {
      type: Array,
      default: () => []
    }, // 文章标签
    links: {
      type: Array,
      default: () => []
    }, // 友情链接
    articleCount: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    key() {
      return this.$route.name
        ? this.$route.name + new Date()
        : this.$route + new Date()
    }
  },
  methods: {
    ...mapActions(['getArticleList']),
    goDetail(item) {
      this.$router.push({ name: 'detail', params: { id: item._id }})
    },
    clickSearch(title) {
      if (title) {
        this.$router.push({ path: `/home/search/${title}` })
      } else {
        this.$router.push('/home')
      }
    },
    // 跳转文章归档的数据列表
    goArticleCount(item) {
      if (this.$route.path !== `/home/count/${item.year}-${item.month}`) {
        this.$router.push({ path: `/home/count/${item.year}-${item.month}` })
      }
    },
    getSortArticles(item) {
      if (this.$route.path !== `/home/sort/${item._id}`) {
        this.$router.push({ path: `/home/sort/${item._id}` })
      }
    },
    getArticleTag(item) {
      if (this.$route.path !== `/home/tag/${item._id}`) {
        this.$router.push({ path: `/home/tag/${item._id}` })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.main-container {
  padding-top: 60px;
  width: 1200px !important;
  margin: 0 auto;
}
.el-aside {
  border: 1px solid green;
  height: 100%;
  overflow: inherit;
}
.el-main {
  padding-right: 0;
  position: relative;
  overflow: inherit;
  margin-bottom: 30px;
}
.el-pagination {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
