<template>
  <div class="container">
    <div class="left-container">
      <div class="title">
        <p>菜单目录</p>
      </div>
      <div class="search">
        <el-input
          v-model="filterMenu"
          placeholder="输入关键字进行过滤"
        />
      </div>
      <div id="menu-tree" class="menu">
        <el-tree ref="tree" :data="menuList" :props="defaultProps" :filter-node-method="filterNode" @node-click="nodeClick" />
      </div>
    </div>
    <div class="right-container">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item>
          <!-- 挂到他名下的 -->
          <el-button type="primary" style="background-color: #00a65a;" @click="addSubMenu()">新增</el-button>
          <el-button @click="delForm()">删除</el-button>
        </el-form-item>
        <el-form-item label="父菜单" prop="parentName">
          <el-input v-model="ruleForm.parentName" disabled />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="ruleForm.path" type="text" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="background-color: #00a65a;" @click="submitForm()">保存</el-button>
          <el-button @click="resetForm()">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { CHANGE_BACKGROUNDMENU } from '@/store/mutation-types'
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      ruleForm: {
        parentid: '',
        parentName: '', // 父菜单名称
        path: '', // 路径
        name: '', // 菜单名称
        id: '',
        level: '', // 菜单等级
        type: 'background',
        loading: false
      },
      rules: {
        path: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      openMenu: '',
      isSubMenu: false, // 是否新增子菜单
      defaultProps: {
        children: 'subMenu',
        label: 'name'
      },
      filterMenu: '' // 菜单过滤
    }
  },
  computed: {
    ...mapState({
      menuList: 'backgroundMenu'
    })
  },
  watch: {
    filterMenu(val) {
      console.log('搜索菜单', val)
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    ...mapMutations({
      'changeMenu': CHANGE_BACKGROUNDMENU // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    }),
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let url = '/menu'
          if (this.ruleForm.id || this.isSubMenu) {
            console.log('啊哈哈哈')
            url = this.ruleForm.parentName ? `/menu/subMenu/${this.ruleForm.id}` : `/menu/${this.ruleForm.id}`
            if (this.isSubMenu) {
              this.ruleForm.level = '2'
              this.axios.post(url, this.ruleForm).then(res => {
                if (res && res.code === 200) {
                  this.$message.success('新增子菜单成功')
                  this.changeMenu(res.result)
                  this.resetForm()
                } else {
                  console.log('报错结果', res)
                  this.$message.error(res.message)
                }
              })
            } else {
              this.axios.patch(url, this.ruleForm).then(res => {
                if (res && res.code === 200) {
                  this.$message.success('修改菜单成功')
                  this.changeMenu(res.result)
                  this.resetForm()
                } else {
                  console.log('报错结果', res)
                  this.$message.error(res.message)
                }
              })
            }
          } else {
            this.ruleForm.level = this.ruleForm.parentName ? '2' : '1'
            this.axios.post(url, this.ruleForm).then(res => {
              if (res && res.code === 200) {
                this.$message.success('新增菜单成功')
                this.resetForm()
                this.changeMenu(res.result)
              } else {
                console.log('报错结果', res)
                this.$message.error(res.message)
              }
            })
          }
          console.log('路径', url)
        }
      })
    },
    // 节点点击
    nodeClick(obj, node, self) {
      console.log('点击节点', obj, node, self)
      this.$refs.ruleForm.clearValidate()
      this.ruleForm = {
        id: obj._id,
        level: obj.level,
        name: obj.name,
        path: obj.path,
        type: 'background'
      }
      console.log('数据', node.parent)
      if (obj.level !== '1') {
        this.ruleForm.parentName = node.parent.data.name
        this.ruleForm.parentid = node.parent.data._id
        this.rules.path[0].required = true
      }
    },
    // 过滤节点
    filterNode(value, data) {
      if (!value) return true
      console.log('树形节点', data)
      return data.name.indexOf(value) !== -1
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    // 删除菜单
    delForm() {
      // 删除子菜单
      if (this.ruleForm.parentName) {
        console.log('删除子菜单', this.ruleForm.parentid)
        this.$messagebox.confirm('确定删除该子菜单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/menu/subMenu/${this.ruleForm.parentid}`, { data: { id: this.ruleForm.id }}).then(res => {
            if (res && res.code === 200) {
              this.$message.success('删除子菜单成功')
              this.changeMenu(res.result)
            } else {
              this.$message.error(res.message)
            }
          })
        })
      } else {
        this.$messagebox.confirm('确定删除该父菜单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除父菜单
          this.axios.delete(`/menu/${this.ruleForm.id}`).then(res => {
            if (res && res.code === 200) {
              this.$message.success('删除父菜单成功')
              this.changeMenu(res.result)
            }
          })
        })
      }
      this.resetForm()
    },
    // 新增子菜单
    addSubMenu() {
      this.ruleForm.parentName = this.ruleForm.name
      this.ruleForm.name = ''
      this.ruleForm.path = ''
      // 当没有菜单数据时
      if (this.ruleForm.parentName) {
        this.isSubMenu = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./menu');
</style>

