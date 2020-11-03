<template>
  <div class="app-container">
    <el-form :model="role" label-width="80px" label-position="left">
      <el-form-item label="Name">
        <el-input v-model="temp.account" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="temp.password" />
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="danger">
        {{ $t('permission.cancel') }}
      </el-button>
      <el-button type="primary" @click="confirmRole">
        {{ $t('permission.confirm') }}
      </el-button>
    </div>
    <el-button @click="handleLogin">Log In</el-button>
    <el-button @click="handleLogout">Log Out</el-button>
    <el-button @click="handleTest">Test</el-button>
  </div>
</template>

<script>
// import path from 'path'
// import { deepClone } from '@/utils'
// import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
// import i18n from '@/lang'
import { userLogout, userLogin } from '@/api/user'
import axios from 'axios'

const service = axios.create({
  baseURL: 'http://localhost:57680'
})
service.interceptors.request.use(
  config => {
    return config
  }
)
service.interceptors.response.use(
  response => {
    const res = response.headers
    return res
  }
)

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      temp: {
        account: 'test',
        password: 'test'
      }
    }
  },
  computed: {
  },
  created() {
    // Mock: get all routes and roles list from server
    // this.getRoutes()
    // this.getRoles()
  },
  methods: {
    confirmRole() {
      const tempData = Object.assign({}, this.temp)
      console.log(tempData)
      // axios({
      //   method: 'post',
      //   baseURL: 'http://localhost:57680',
      //   url: '/auth/login',
      //   'Content-Type': 'application/json',
      //   tempData
      // })
      //   .then((result) => { console.log(result.headers) })
      userLogin(tempData).then((result) => {
        console.log(result.headers)
        this.$notify({
          title: '成功',
          message: '登入成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleLogin() {
      const tempData = Object.assign({}, this.temp)
      console.log(this.temp)
      axios.post('http://localhost:57680/token/login',
        tempData)
        .then((response) => {
          console.log('response', response)
          if (response.data.Result === true) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user_id', response.data.user_id)
            this.$notify({
              title: '成功',
              message: '登入成功',
              type: 'success',
              duration: 2000
            })
          } else {
            alert('Wrong Account and Password')
          }
        })
    },
    handleLogout() {
      userLogout().then(() => {
        console.log('log out')
        this.$notify({
          title: '成功',
          message: '登出成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleTest() {
      axios({
        method: 'post',
        url: '/auth/test',
        'Content-Type': 'application/json'
      })
        .then((result) => { console.log(result.headers) })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
