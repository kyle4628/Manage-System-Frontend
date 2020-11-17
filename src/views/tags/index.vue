<template>
  <div class="app-container">
    <div class="filter-container">
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
      :title="this.$t('tag.add')"
      :visible.sync="dialogCreateFormVisible"
      width="25%"
    >
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="110px" style="width: 300px; margin-left:10px;">
        <el-form-item :label="$t('tag.placeName')" :class="'is-required'" prop="placeName" :required="!isPlaceSelected">
          <el-select v-model="temp.place_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item in placeSelection" :key="item.place_id" :label="item.name" :value="item.place_id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tag.tagName')" :class="'is-required'" prop="tagName">
          <el-select v-model="temp.add" multiple class="filter-item" placeholder="Please select">
            <el-option v-for="item in tagSelection" :key="item.tagId" :label="item.tagName" :value="item.tagId" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tag.userName')">
          <el-input v-model="temp.user_name" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogCreateFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="createData">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="this.$t('tag.edit')"
      :visible.sync="dialogUpdateFormVisible"
      width="25%"
    >
      <el-form ref="dataForm" :model="updateModel" label-position="left" label-width="110px" style="width: 300px; margin-left:10px;">
        <el-form-item :label="$t('tag.placeName')" :class="'is-required'" prop="placeName" :required="!isPlaceSelected">
          <el-select v-model="updateModel.place_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item in placeSelection" :key="item.place_id" :label="item.name" :value="item.place_id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tag.tagName')" :class="'is-required'" prop="tagName">
          <el-select v-model="updateModel.add" class="filter-item" placeholder="Please select">
            <el-option v-for="item in tagSelection" :key="item.tagId" :label="item.tagName" :value="item.tagId" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tag.userName')">
          <el-input v-model="updateModel.user_name" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogUpdateFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="updateData">
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
  updateArticle,
  queryTagList,
  createTagRelation
} from '@/api/article'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Tags',
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
        place_id: undefined,
        add: [],
        remove: [],
        newTags: []
      },
      updateModel: {
        place_id: undefined,
        tag_id: undefined,
        user_name: ''
      },
      dialogCreateFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      }
    }
  },
  computed: {
    isTagSelected: function() {
      return !!this.temp.tag_id
    },
    isPlaceSelected: function() {
      return !!this.temp.place_id
    }
  },
  created() {
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
        place_id: undefined,
        add: [],
        remove: [],
        newTags: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogCreateFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      // this.$refs['dataForm'].validate(valid => {
      //   if (valid) {
      createTagRelation(this.temp).then((response) => {
        // this.list.unshift(this.temp)
        if (response.status === 1) {
          this.dialogCreateFormVisible = false
          this.queryList()
          this.$notify({
            title: '成功',
            message: '新增成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.dialogCreateFormVisible = false
          this.$notify({
            title: '失敗',
            message: '新增失敗',
            type: 'fail',
            duration: 2000
          })
        }
        //   })
        // }
      })
    },
    handleUpdate(row) {
      this.updateModel = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogUpdateFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.updateModel)
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogUpdateFormVisible = false
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
