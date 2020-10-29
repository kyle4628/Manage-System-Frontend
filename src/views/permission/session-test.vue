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
    <el-button @click="handleLogout">Log Out</el-button>
    <el-button @click="handleTest">Test</el-button>
  </div>
</template>

<script>
// import path from 'path'
// import { deepClone } from '@/utils'
// import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
// import i18n from '@/lang'
import { userLogin, userLogout, userTest } from '@/api/user'

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
        account: '',
        password: ''
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
      console.log(this.temp)
      const tempData = Object.assign({}, this.temp)
      userLogin(tempData).then(() => {
        this.$notify({
          title: '成功',
          message: '登入成功',
          type: 'success',
          duration: 2000
        })
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
      userTest().then(() => {
        console.log('Test')
        this.$notify({
          title: 'Test',
          message: 'Test',
          type: 'success',
          duration: 2000
        })
      })
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
