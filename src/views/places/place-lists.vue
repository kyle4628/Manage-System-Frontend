<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('placeList.add') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('placeList.id')" prop="id" sortable="custom" align="center" width="100" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('placeList.userName')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('placeList.privacy')" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in +row.privacy+1" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('placeList.name')" width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleDetail(row)">{{ row.listName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('placeList.description')" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('placeList.createdTime')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('placeList.updatedTime')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updatedTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="testList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 400px; margin-left:20px;">
        <!-- <el-form-item :label="$t('placeList.userId')" prop="timestamp">
          <el-input v-model="temp.user_id" disabled />
        </el-form-item> -->
        <el-form-item v-if="dialogStatus==='update'" :label="$t('placeList.userName')">
          <el-input v-model="temp.user_name" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item :label="$t('placeList.name')" prop="listName">
          <el-input v-model="temp.listName" />
        </el-form-item>
        <el-form-item :label="$t('placeList.privacy')" prop="privacy">
          <el-select v-model="temp.privacy" class="filter-item" placeholder="Please select">
            <el-option v-for="item in privacyOption" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('placeList.description')">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" :label="$t('placeList.addPlace')">
          <el-select v-model="temp.place" class="filter-item" placeholder="Please select" multiple collapse-tags>
            <el-option v-for="item in placeSelection" :key="item.place_id" :label="item.name" :value="item.place_id" />
          </el-select>
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

    <el-dialog :title="this.$t('placeList.jounery')" :visible.sync="dialogTimelineVisible" width="40%" center>
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :timestamp="activity.createdTime"
          >
            {{ activity.placeName }}
          </el-timeline-item>
        </el-timeline>
      </div>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogTimelineVisible = false">
          {{ $t('placeList.close') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createList, testPlaceList, queryPlaceSelectoin, updatePlaceList } from '@/api/article'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'PlacesListTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      placeSelection: null,
      activities: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        user_id: undefined,
        privacy: undefined,
        listName: undefined,
        description: undefined,
        sort: '+id'
      },
      privacyOption: [
        { key: 0, label: this.$t('placeList.public') },
        { key: 1, label: this.$t('placeList.private') },
        { key: 2, label: this.$t('placeList.hito') }
      ],
      sortOptions: [{ label: this.$t('common.idAscending'), key: '+id' }, { label: this.$t('common.idDescending'), key: '-id' }],
      showReviewer: false,
      temp: {
        id: undefined,
        user_id: '',
        user_name: '',
        privacy: '',
        listName: '',
        description: '',
        coverImageURL: '',
        place: null
      },
      createModel: {
        name: '',
        description: '',
        privacy: undefined,
        places: null,
        editors_email: []
      },
      dialogFormVisible: false,
      dialogTimelineVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('placeList.edit'),
        create: this.$t('placeList.add')
      }
    }
  },
  computed: {
    rules() {
      const placeListRules = {
        listName: [{ required: true, message: this.$t('member.nameRule'), trigger: 'blur' }],
        privacy: [{ required: true, message: this.$t('member.passwordRule'), trigger: 'blur' }]
      }
      return placeListRules
    }
  },
  created() {
    this.testList()
    this.getPlaceSelection()
  },
  methods: {
    testList() {
      // this.listLoading = true
      testPlaceList().then(response => {
        this.list = response.data
        this.total = response.total
        // console.log(this.list)
      })
    },
    getPlaceSelection() {
      queryPlaceSelectoin().then(response => {
        this.placeSelection = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.list.reverse()
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
    resetTemp() {
      this.temp = {
        id: undefined,
        user_id: '',
        privacy: '',
        listName: '',
        description: ''
      }
    },
    resetCreateModel() {
      this.createModel = {
        name: '',
        description: '',
        privacy: undefined,
        places: null
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.createModel.name = this.temp.listName
          this.createModel.description = this.temp.description
          this.createModel.privacy = this.temp.privacy
          this.createModel.places = this.temp.place
          this.temp.id = this.total + 1
          var today = new Date()
          var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
          var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
          this.temp.createdTime = date + ' ' + time
          this.temp.user_id = 1
          this.temp.user_name = 'Khito'
          this.$confirm(this.$t('member.createCheck'), '提示', {
            confirmButtonText: this.$t('member.confirm'),
            cancelButtonText: this.$t('member.cancel'),
            type: 'warning'
          }).then(() => {
            createList(this.createModel).then(() => {
              this.list.push(this.temp)
              this.dialogFormVisible = false
              this.testList()
              this.$notify({
                title: '成功',
                message: '建立成功',
                type: 'success',
                duration: 2000
              })
            })
          }).catch(() => {
            this.dialogFormVisible = false
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
          updatePlaceList(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.testList()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
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
    handleDetail(row) {
      this.activities = Object.assign([], row.timelineItmes)
      this.dialogTimelineVisible = true
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
