<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="標籤名稱" width="170">
      <template slot-scope="scope">
        {{ scope.row.key | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="搜尋次數" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.count+169 | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="熱門程度" width="100" align="center">
      <template slot-scope="scope">
        <el-tag :type="scope.row.count>2?'danger':'success'">
          {{ scope.row.count>2?"超熱門":"熱門" }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import { transactionList } from '@/api/remote-search'
import { get_tag_event_count } from '@/api/user'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null,
      hito: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      get_tag_event_count().then(response => {
        this.list = response.data
      })
      // transactionList().then(response => {
      //   this.list = response.data.items.slice(0, 8)
      // })
    }
  }
}
</script>
