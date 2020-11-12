<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('tag.searchTitle')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.importance"
        :placeholder="$t('tag.searchItem')"
        clearable
        style="width: 120px;margin-left:10px;"
        class="filter-item"
      >
        <el-option
          v-for="item in placeSelection"
          :key="item.place_id"
          :label="item.name"
          :value="item.place_id"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        style="width: 140px;margin-left:10px;"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        style="margin-left:10px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("tag.search") }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("tag.add") }}
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
      <el-table-column
        :label="$t('tag.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="150"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('tag.placeName')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.place_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('tag.tagName')" class-name="status-col">
        <template slot-scope="{ row }">
          <el-tag :type="row.status">
            {{ row.tag_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('tag.userName')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('tag.actions')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" @click="handleUpdate(row)">
            {{ $t("tag.edit") }}
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ $t("tag.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="queryList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="25%"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 300px; margin-left:10px;">
        <el-form-item :label="$t('tag.placeName')" prop="placeName">
          <el-select v-model="temp.place_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item in placeSelection" :key="item.place_id" :label="item.name" :value="item.place_id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tag.tagName')" :class="'is-required'" prop="tagName" :required="isHave">
          <el-select v-model="temp.tag_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item in tagSelection" :key="item.tagId" :label="item.tagName" :value="item.tagId" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tag.userName')">
          <el-input v-model="temp.user_name" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
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
import {
  queryTagSelectoin,
  queryPlaceSelectoin,
  createArticle,
  updateArticle,
  queryTagList
} from '@/api/article'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      placeSelection: null,
      tagSelection: null,
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
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      temp: {
        id: undefined,
        place_id: undefined,
        tag_id: undefined,
        user_name: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      }
    }
  },
  computed: {
    isHave: function() {
      return !this.temp.tag_id
    },
    rules() {
      const tagRules = {
        // tagName: [
        //   {
        //     required: true,
        //     message: this.$t('tag.tagNameRule'),
        //     trigger: 'change'
        //   }
        // ],
        placeName: [
          {
            required: true,
            message: this.$t('tag.placeNameRule'),
            trigger: 'change'
          }
        ]
      }
      return tagRules
    }
  },
  created() {
    // this.getList()
    this.queryList()
    this.getPlaceSelection()
    this.getTagSelection()
  },
  methods: {
    queryList() {
      this.listLoading = true
      queryTagList().then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
        // console.log(this.list)
      })
    },
    getPlaceSelection() {
      queryPlaceSelectoin().then(response => {
        this.placeSelection = response.data
      })
    },
    getTagSelection() {
      queryTagSelectoin().then(response => {
        this.tagSelection = response.data
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
        place_id: undefined,
        tag_id: undefined,
        user_name: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.temp.user_name = 'Khito'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      // this.$refs['dataForm'].validate((valid) => {
      // if (valid) {
      const tempData = Object.assign({}, this.temp)
      updateArticle(tempData).then(() => {
        const index = this.list.findIndex(v => v.id === this.temp.id)
        this.list.splice(index, 1, this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
      // }
      // })
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
