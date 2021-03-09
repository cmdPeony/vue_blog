
export default {
  getArticleTotal(state) {
    return state.total * 1
  },
  getArticleList(state) {
    return state.articleList
  },
  getHomeLoading(state) {
    return state.loading
  },
  getBlogListCurPage(state) {
    return state.listCurPage
  },
  getBlogListPageSize(state) {
    return state.listPageSize
  },
  getToken(state) {
    return state.token
  }
}
