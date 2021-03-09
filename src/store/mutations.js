
import { CHANGE_BACKGROUNDMENU, CHANGE_KOKEN, SET_ARTICLE_List_TOTAL, SET_HOME_LOADING, SET_BLOG_LIST_CURPAGE, SET_BLOG_LIST_PAGESIZE } from './mutation-types'
export default {
  [CHANGE_KOKEN](state, token) {
    state.token = token
    try {
      localStorage.setItem('token', token)
    } catch (e) {
      console.log('mutation报错')
    }
  },
  [CHANGE_BACKGROUNDMENU](state, menu) {
    state.backgroundMenu = menu
    try {
      localStorage.setItem('backgroundMenu', JSON.stringify(menu))
    } catch (e) {
      console.log('mutation报错')
    }
  },
  [SET_ARTICLE_List_TOTAL](state, obj) {
    state.articleList = obj.articles
    state.total = obj.total
    console.log('设置数据', obj.articles)
    try {
      localStorage.setItem('articleList', JSON.stringify(obj.articles))
      localStorage.setItem('total', JSON.stringify(obj.total))
    } catch (e) {
      console.log('mutation报错')
    }
  },
  [SET_HOME_LOADING](state, flag) {
    state.loading = flag
  },
  [SET_BLOG_LIST_CURPAGE](state, val) {
    state.listCurPage = val
  },
  [SET_BLOG_LIST_PAGESIZE](state, val) {
    state.listPageSize = val
  }
}
