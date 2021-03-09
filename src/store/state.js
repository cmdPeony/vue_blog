let defaultToken = ''
let defaultBackgroundMenu = []
let defaultArticleList = []
let defaultTotal = 0
const defaultListCurPage = 1
const defaultListPageSize = 10
try {
  const token = localStorage.getItem('token')
  const menu = localStorage.getItem('backgroundMenu')
  const articleList = localStorage.getItem('articleList')
  const total = localStorage.getItem('total')
  defaultBackgroundMenu = menu ? JSON.parse(menu) : []
  defaultArticleList = articleList ? JSON.parse(articleList) : []
  defaultTotal = total || 0
  if (token) {
    defaultToken = token
  }
} catch (e) {
  console.log('state报错')
}

export default {
  token: defaultToken,
  backgroundMenu: defaultBackgroundMenu,
  articleList: defaultArticleList,
  total: defaultTotal,
  loading: false, // 异步加载数据的时候使用
  searchTitle: '', // 搜索的数据
  listCurPage: defaultListCurPage, // 博客列表的
  listPageSize: defaultListPageSize // 博客列表
}
