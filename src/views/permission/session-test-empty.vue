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
    <el-button @click="handleLogin">Log In</el-button>
    <!-- <el-button @click="handleLogout">Log Out</el-button>
    <el-button @click="handleTest">Test</el-button> -->
  </div>
</template>

<script>
// import { userLogout, userLogin } from '@/api/user'
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

export default {
  data() {
    return {
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
    handleLogin() {
      console.log(this.temp)
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
