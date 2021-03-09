import Vue from 'vue'
import { Container, Header, Main, Aside, Footer, Form, FormItem, Button, Pagination,
  Input, Menu, MenuItem, MenuItemGroup, Submenu, Tabs, TabPane, Checkbox, CheckboxGroup,
  Message, Tree, Table, TableColumn, DatePicker, Divider, Dialog, Select, Option, Row,
  Col, MessageBox, Card, Loading, Step, Steps } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Input)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Tree)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Divider)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Option)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Step)
Vue.use(Steps)
// 引入loading
Vue.use(Loading.directive)
Vue.prototype.$message = Message
Vue.prototype.$messagebox = MessageBox

