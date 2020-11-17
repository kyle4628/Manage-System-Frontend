<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { get_place_tag_count } from '@/api/user'

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
      placeTagCount: null,
      placeTagCountValue: [],
      placeTagCountName: []
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
      get_place_tag_count().then(response => {
        this.placeTagCount = response.data
        this.placeTagCountValue = []
        this.placeTagCountName = []
        // console.log(this.placeTagCount)
        this.placeTagCount.forEach(item => {
          const x = { value: item.count, name: item.key }
          this.placeTagCountValue.push(x)
        })

        console.log(this.placeTagCountValue)

        // this.placeTagCountValue=this.placeTagCount.map(item => Object.values(item)[0]);
        this.placeTagCountName = this.placeTagCount.map(item => Object.values(item)[1])
        // console.log(this.placeTagCountName)
        // console.log(Object.values(this.listUserGrowthKey))
        const datas = { res: this.placeTagCountValue, name: this.placeTagCountName }
        return datas
      }).then(result => {
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: result.name.splice(0, 5)
          },
          series: [
            {
              name: '熱門地點前五名',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: result.res.splice(0, 5),
              // [
              //   { value: 320, name: 'Industries' },
              //   { value: 240, name: 'Technology' },
              //   { value: 149, name: 'Forex' },
              //   { value: 100, name: 'Gold' },
              //   { value: 59, name: 'Forecasts' }
              // ],
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      })
    }
  }
}
</script>
