<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { get_user_growth } from '@/api/user'
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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      listUserGrowth: [],
      listUserGrowthKey: [],
      listUserGrowthCount: []
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
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
      this.setOptions(this.chartData)
    },
    setOptions({ expectedData, actualData } = {}) {
      get_user_growth().then(response => {
        this.listUserGrowth = response.data
        this.listUserGrowthCount = []
        this.listUserGrowthKey = []
        this.listUserGrowthCount = this.listUserGrowth.map(item => Object.values(item)[0])
        this.listUserGrowthKey = this.listUserGrowth.map(item => Object.values(item)[1])
        // console.log(Object.values(this.listUserGrowthKey))
        const datas = { key: this.listUserGrowthKey, count: this.listUserGrowthCount }
        return datas
      }).then(result => {
        this.chart.setOption({
          xAxis: {
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          // data:Object.values(this.listUserGrowthKey),
          // data:["2020-10-27", "2020-11-06", "2020-11-09", "noDateInfo"],
            data: result.key,
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          legend: {
            data: ['期望值', '實際值']
          },
          series: [{
            name: '期望值', itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: result.count,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: '實際值',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: result.count,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }]
        })
      })
    }
  }
}
</script>
