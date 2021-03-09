<template>
  <div class="login-container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
      <el-form-item label="账号" prop="account">
        <el-input v-model="ruleForm.account" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="text" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">登录</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { CHANGE_KOKEN } from '../store/mutation-types'
export default {
  data() {
    return {
      ruleForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.$route.path !== '/login') {
      this.$router.replace('/login')
    }
  },
  // 拦截
  beforeRouteEnter(to, from, next) {
    const account = sessionStorage.getItem('account')
    if (account) {
      next('/home')
    } else {
      next()
    }
  },
  methods: {
    ...mapMutations({
      'changeToken': CHANGE_KOKEN // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    }),
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.axios.post('/user/login', this.ruleForm).then(res => {
            if (res && res.code === 200) {
              this.changeToken('Bearer ' + res.result.token)
              sessionStorage.setItem('account', this.ruleForm.account)
              this.$router.push('/admin')
              console.log('人跳转啊哈哈')
            } else {
              console.log('报错结果', res)
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.login-container {
  width: 500px;
  position: absolute;
  background-color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .el-form {
    padding-top: 20px;
    padding-right: 20px;
    padding-bottom: 10px;
  }
}
</style>
