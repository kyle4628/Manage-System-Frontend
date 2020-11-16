<template>
  <div class="app-container">
    <!-- $t is vue-i18n global function to translate lang -->
    <el-input v-model="filename" :placeholder="$t('excel.placeholder')" style="width:350px;" prefix-icon="el-icon-document" />
    <el-button :loading="downloadLoading" style="margin-bottom:20px" type="primary" icon="el-icon-document" @click="handleDownload">
      {{ $t('excel.selectedExport') }}
    </el-button>
    <!-- <a href="https://panjiachen.github.io/vue-element-admin-site/feature/component/excel.html" target="_blank" style="margin-left:15px;">
      <el-tag type="info">Documentation</el-tag>
    </a> -->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="傳輸中"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column align="center" label="編號" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="名稱">
        <template slot-scope="scope">
          {{ scope.row.listName }}
        </template>
      </el-table-column>
      <el-table-column label="權限" width="160" align="center">
        <template slot-scope="scope">
          <el-tag>{{ listPrivacyMap[scope.row.privacy].name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="敘述" width="400" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="建立時間" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createdTime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { fetchList } from '@/api/article'
import { testPlaceList } from '@/api/article'

export default {
  name: 'SelectExcel',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      filename: ''
    }
  },
  computed: {
    listPrivacyMap() {
      const listPrivacy = {
        1: { name: this.$t('placeList.public') },
        2: { name: this.$t('placeList.private') },
        3: { name: this.$t('placeList.hito') }
      }
      return listPrivacy
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      testPlaceList().then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
    },
    mapPrivacy(privacy) {
      const placeListPrivacy = {
        1: '公開',
        2: '非公開',
        3: '熱門'
      }
      return placeListPrivacy[privacy]
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['清單編號', '名稱', '權限', '敘述', '建立時間']
          const filterVal = ['id', 'listName', 'privacy', 'updatedTime', 'createdTime']
          const list = this.multipleSelection
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename
          })
          this.$refs.multipleTable.clearSelection()
          this.downloadLoading = false
        })
      } else {
        this.$message({
          message: 'Please select at least one item',
          type: 'warning'
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
