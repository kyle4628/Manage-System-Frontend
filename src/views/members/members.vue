<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" :placeholder="$t('member.searchTitle')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" :placeholder="$t('member.searchItem')" clearable style="width: 120px;margin-left:10px;" class="filter-item">
        <el-option v-for="item in searchItem" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" :placeholder="$t('member.memberStatus')" clearable class="filter-item" style="width: 130px;margin-left:10px;">
        <el-option v-for="item in setOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px;margin-left:10px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left:10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('member.add') }}
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        {{ $t('member.reviewer') }}
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('member.id')" prop="id" sortable="custom" align="center" width="110" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.name')" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.email')" min-width="200px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" :label="$t('member.password')" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.created')" align="center" width="250px">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.updated')" align="center" width="250px">
        <template slot-scope="{row}">
          <span>{{ row.updatedTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.authority')" class-name="status-col" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.authority | statusFilter">
            <span>{{ authorityText[row.authority].name }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.actions')" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            {{ $t('member.edit') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row,$index)">
            {{ $t('member.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUserList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 280px; margin-left:20px;">
        <el-form-item :label="$t('member.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" :label="$t('member.email')" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item :label="$t('member.password')" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='update'" :label="$t('member.authority')" prop="authority">
          <el-select v-model="temp.authority" class="filter-item" placeholder="Please select">
            <el-option v-for="item in setOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus==='update'" :label="$t('member.created')">
          <el-input v-model="temp.createdTime" disabled />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='update'" :label="$t('member.updated')">
          <el-input v-model="temp.updatedTime" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createMember, updateMember } from '@/api/article'
import { queryUser } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'primary',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      searchItem: [this.$t('member.name'), this.$t('member.email')],
      sortOptions: [{ label: this.$t('common.idAscending'), key: '+id' }, { label: this.$t('common.idDescending'), key: '-id' }],
      showReviewer: false,
      temp: {
        id: undefined,
        name: '',
        email: '',
        password: '',
        authority: '',
        createdTime: '',
        updatedTime: ''
      },
      createModel: {
        name: '',
        email: '',
        password: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('member.edit'),
        create: this.$t('member.add')
      }
    }
  },
  computed: {
    authorityText() {
      const memberAuthority = {
        0: { name: this.$t('member.administrator') },
        1: { name: this.$t('member.normal') },
        2: { name: this.$t('member.blackList') }
      }
      return memberAuthority
    },
    rules() {
      const memberRules = {
        name: [{ required: true, message: this.$t('member.nameRule'), trigger: 'blur' }],
        email: [{ required: true, message: this.$t('member.passwordRule'), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('member.passwordRule'), trigger: 'blur' }],
        authority: [{ required: true, message: this.$t('member.authorityRule'), trigger: 'change' }]
      }
      return memberRules
    },
    setOptions() {
      const memberAuthority = [
        {
          value: 0,
          label: this.$t('member.administrator')
        },
        {
          value: 1,
          label: this.$t('member.normal')
        },
        {
          value: 2,
          label: this.$t('member.blackList')
        }
      ]
      return memberAuthority
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      queryUser().then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
        setTimeout(() => {
          this.listLoading = false
        }, 2 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      // console.log(data) //{column: {…}, prop: "id", order: "ascending"}
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        email: '',
        password: '',
        authority: '',
        createdTime: '',
        updatedTime: ''
      }
    },
    resetCreateModel() {
      this.createModel = {
        name: '',
        email: '',
        password: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.resetCreateModel()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.createModel.name = this.temp.name
          this.createModel.email = this.temp.email
          this.createModel.password = this.temp.password
          this.temp.id = this.total + 1
          var today = new Date()
          var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
          var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
          this.temp.createdTime = date + ' ' + time
          this.temp.authority = 1
          createMember(this.createModel).then(() => {
            this.list.push(this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateMember(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getUserList()
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
