
import { SET_ARTICLE_List_TOTAL, SET_HOME_LOADING } from './mutation-types'
import axios from 'axios'
export default {
  // str位拼接好的查询条件
  getArticleList({ dispatch, state, commit }, str) {
    // 获取数据时候的加载事件
    commit(SET_HOME_LOADING, true)
    console.log('调用接口获取数据', str)
    axios.get(`/article?${str}`).then(res => {
      if (res && res.code === 200) {
        commit(SET_ARTICLE_List_TOTAL, res.result)
        console.log('设置文章数据', res.result)
      } else {
        this.$message.error(res.message)
      }
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      commit(SET_HOME_LOADING, false)
    })
  }
}
