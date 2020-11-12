<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { get_tag_count } from '@/api/user'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      tagCountTop10: null,
      tagCountTop10Count: [],
      tagCountTop10Key: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      get_tag_count().then(response => {
        this.tagCountTop10 = response.data
        this.tagCountTop10Count = []
        this.tagCountTop10Key = []
        this.tagCountTop10Count = this.tagCountTop10.map(item => Object.values(item)[0])
        this.tagCountTop10Key = this.tagCountTop10.map(item => Object.values(item)[1])
        // console.log(Object.values(this.listUserGrowthKey))
        const datas = { key: this.tagCountTop10Key, count: this.tagCountTop10Count }
        return datas
      }).then(result => {
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: result.key,
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: [{
            name: '本月份',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: result.count,
            animationDuration
          }, {
            name: '前月份',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [8, 8, 9, 6, 3, 4, 2, 5, 1, 2],
            animationDuration
          }, {
            name: '預估成長',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [6, 8, 5, 9, 7, 5, 2, 5, 1, 2],
            animationDuration
          }]
        })
      })
    }
  }
}
</script>
