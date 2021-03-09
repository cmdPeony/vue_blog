<template>
  <div class="card-container">
    <div class="title" @click="goDetail">
      <h1>{{ article.title }}</h1>
    </div>
    <div class="content">
      <p>{{ article.content | filterHtml }}</p>
      <div class="content-footer">
        <span>
          <i class="el-icon-collection-tag" />{{ article.tags[0].name }}
        </span>
        <span>
          <i class="el-icon-star-off" />{{ article.loves }}颗星
        </span>
        <span>
          <i class="el-icon-view" />{{ article.visits || 0 }}次阅读
        </span>
        <span><i class="el-icon-time" /> {{ article.created | filterTime }} 发布</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  filters: {
    filterHtml(val) {
      return val.replace(/<\/?.+?>/g, '')
    }
  },
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  methods: {
    goDetail() {
      sessionStorage.setItem('articleDetail', JSON.stringify(this.article))
      this.$router.push({ name: 'detail', params: { id: this.article._id }})
    }
  }
}
</script>
<style lang="less" scoped>
.card-container {
  background-color: #fff;
  padding-right: 0;
  padding: 15px;
  margin-bottom: 15px;
  width: 849px;
  box-sizing: border-box;
  padding-right: 0;
  width: 100%;
  .title {
    line-height: 35px;
    border-bottom: 1px solid #e5e5e5;
    font-size: 16px;
    cursor: pointer;
    padding-left: 20px;
    font-weight: bold;
    h1 {
      font-size: 22px;
      color: #333;
      &:hover {
        color: #409EFF;
      }
    }
  }
  .content {
    font-size: 12px;
    line-height: 25px;
    color: #555555;
    padding: 10px;
    padding-bottom: 0;
    p {
      padding-left: 15px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      font-size: 16px;
    }
    .content-footer {
      line-height: 40px;
      padding-left: 15px;
      span {
        margin-right: 30px;
        i {
          padding-right: 5px;
        }
      }
    }
  }
}
</style>
