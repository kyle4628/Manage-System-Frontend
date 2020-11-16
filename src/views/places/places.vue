<template>
  <div class="app-container">
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
      <el-table-column :label="$t('place.phone')" width="120px" align="center">
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
          <el-button type="primary" @click="showDetail(row)">
            {{ $t('place.detail') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="queryInfo" />

    <el-dialog :visible.sync="dialogFormVisible" width="40%">
      <h3>{{ $t('place.detail') }}</h3>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane :label="$t('place.tagTitle')" name="first">
          <el-table
            :data="tagList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column :label="$t('place.tagName')" align="center">
              <template slot-scope="{row}">
                <span>{{ row.tagName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('place.creator')" align="center">
              <template slot-scope="{row}">
                <span>{{ row.tagCreatorName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('place.createdTime')" align="center">
              <template slot-scope="{row}">
                <span>{{ row.tagCreatedTime }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="$t('place.listTitle')" name="second">
          <el-table
            :data="placeList"
            border
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column :label="$t('place.listName')" align="center">
              <template slot-scope="{row}">
                <span>{{ row.placeListName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('place.creator')" align="center">
              <template slot-scope="{row}">
                <span>{{ row.listCreatorName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('place.createdTime')" align="center">
              <template slot-scope="{row}">
                <span>{{ row.listCreatedTime }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('place.close') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryPlaceInfoList } from '@/api/article'
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
        limit: 100,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      sortOptions: [{ label: this.$t('common.idAscending'), key: '+id' }, { label: this.$t('common.idDescending'), key: '-id' }],
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {
    this.queryInfo()
  },
  methods: {
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
    showDetail(row) {
      this.tagList = Object.assign([], row.tagInfo)
      this.placeList = Object.assign([], row.listInfo)
      this.activeName = 'first'
      this.dialogFormVisible = true
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
