<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" :placeholder="$t('place.searchTitle')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" :placeholder="$t('place.searchItem')" clearable style="width: 120px;margin-left:10px;" class="filter-item">
        <!-- <el-option v-for="item in searchItem" :key="item" :label="item" :value="item" /> -->
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px;margin-left:10px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left:10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('place.search') }}
      </el-button>
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
      <el-table-column :label="$t('place.id')" prop="id" sortable="custom" align="center" width="100" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('place.name')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('place.type')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('place.phone')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('place.address')" min-width="200px">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('place.longitude')" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.longitude }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('place.latitude')" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.latitude }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="210" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" @click="handleUpdate(row)">
            Detail
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="queryInfo" />

    <el-dialog title="Detail" :visible.sync="dialogFormVisible" width="40%">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="標籤" name="first">
          <el-table
            :data="tagList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="標籤名稱" align="center">
              <template slot-scope="{row}">
                <span>{{ row.tagName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="標籤作者" align="center">
              <template slot-scope="{row}">
                <span>{{ row.tagCreatorName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="建立時間" align="center">
              <template slot-scope="{row}">
                <span>{{ row.tagCreatedTime }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="地點清單" name="second">
          <el-table
            :data="placeList"
            border
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="清單名稱" align="center">
              <template slot-scope="{row}">
                <span>{{ row.placeListName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="清單作者" align="center">
              <template slot-scope="{row}">
                <span>{{ row.listCreatorName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="建立時間" align="center">
              <template slot-scope="{row}">
                <span>{{ row.listCreatedTime }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, queryPlaceInfoList } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Places',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      tagList: [],
      placeList: [],
      total: 0,
      listLoading: true,
      activeName: 'first',
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      sortOptions: [{ label: this.$t('common.idAscending'), key: '+id' }, { label: this.$t('common.idDescending'), key: '-id' }],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {
    // this.getList()
    this.queryInfo()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        // console.log(response.data.items)
        // this.list = response.data.items
        // this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    queryInfo() {
      this.listLoading = true
      queryPlaceInfoList().then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
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
    // handleCreate() {
    //   this.resetTemp()
    //   this.dialogStatus = 'create'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
    //       this.temp.author = 'vue-element-admin'
    //       createArticle(this.temp).then(() => {
    //         this.list.unshift(this.temp)
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: '成功',
    //           message: '创建成功',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },
    handleUpdate(row) {
      this.tagList = Object.assign([], row.tagInfo)
      this.placeList = Object.assign([], row.listInfo)
      console.log(typeof (this.tagList))
      console.log(this.placeList)
      // this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
