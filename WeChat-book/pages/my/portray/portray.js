// import * as echarts from '../../../components/ec-canvas/echarts';
// const app = getApp()

// Page({
//   onReady: function () {
//     // 获取组件
//     this.ecComponentA = this.selectComponent('#mychart-dom-multi-bar');
//     this.ecComponentB = this.selectComponent('#mychart-dom-multi-scatter');
//     this.ecComponentC = this.selectComponent('#mychart-dom-multi-bara');
//     this.getPreferencePercent();
//     this.getBehaviorPercent();
//     this.getTimePercent();
//   },
//   data: {
//     ecPreference: {
//       lazyLoad: true
//     },
//     ecBehavior: {
//       lazyLoad: true
//     },
//     ecTime: {
//       lazyLoad: true
//     },
//     preferencePercent: [], // 偏好
//     behaviorPercent: [],  // 行为
//     timePercent: [],  // 时间
//     isNormal: false
//   },
//   onShow: function() {
//     this.setData({
//       isNormal: wx.getStorageSync('isNormal')
//     })
//   },
//   // 开始初始化
//   initChartA: function () {
//     this.ecComponentA.init((canvas, width, height, dpr) => {
//       const charta = echarts.init(canvas, null, {
//         width: width,
//         height: height,
//         devicePixelRatio: dpr
//       });
//       this.getChartAOption(charta);
//       this.charta = charta;
//       return charta;
//     });
//   },
//   initChartB: function () {
//     this.ecComponentB.init((canvas, width, height, dpr) => {
//       const chartb = echarts.init(canvas, null, {
//         width: width,
//         height: height,
//         devicePixelRatio: dpr
//       });
//       this.getChartBOption(chartb);
//       this.chartb = chartb;
//       return chartb;
//     });
//   },
//   initChartC: function () {
//     this.ecComponentC.init((canvas, width, height, dpr) => {
//       const chartc = echarts.init(canvas, null, {
//         width: width,
//         height: height,
//         devicePixelRatio: dpr
//       });
//       this.getSChartCOption(chartc);
//       this.chartc = chartc;
//       return chartc;
//     });
//   },
//   getChartAOption(chart) {
//     const optiona = {
//       backgroundColor: "#f2f2f2",
//       color: ["#0081ff", "#f37b1d", "#39b54a", "#1cbbb4"],
//       series: [{
//         label: {
//           normal: {
//             fontSize: 14
//           }
//         },
//         type: 'pie',
//         center: ['50%', '50%'],
//         radius: ['40%', '60%'],
//         data: [{
//           value: this.data.preferencePercent.tb,
//           name: '趣闻'
//         }, {
//           value: this.data.preferencePercent.tc,
//           name: '分享'
//         }]
//       }]
//     };
//     chart.setOption(optiona)
//   },
//   getChartBOption(chart) {
//     const optionb = {
//       backgroundColor: "#f2f2f2",
//       color: ["#0081ff", "#f37b1d", "#39b54a", "#1cbbb4"],
//       series: [{
//         label: {
//           normal: {
//             fontSize: 14
//           }
//         },
//         type: 'pie',
//         center: ['50%', '50%'],
//         radius: ['40%', '60%'],
//         data: [{
//           value: this.data.behaviorPercent.typea,
//           name: '评论'
//         }, {
//           value: this.data.behaviorPercent.typeb,
//           name: '引用'
//         }]
//       }]
//     };
//     chart.setOption(optionb)
//   },
//   getSChartCOption(chart) {
//     const optionc = {
//       backgroundColor: "#f2f2f2",
//       color: ["#0081ff", "#f37b1d", "#39b54a", "#1cbbb4"],
//       series: [{
//         label: {
//           normal: {
//             fontSize: 14
//           }
//         },
//         type: 'pie',
//         center: ['50%', '50%'],
//         radius: ['40%', '60%'],
//         data: [{
//           value: this.data.timePercent.timea,
//           name: '凌晨'
//         }, {
//           value: this.data.timePercent.timeb,
//           name: '上午'
//         }, {
//           value: this.data.timePercent.timec,
//           name: '下午'
//         }, {
//           value: this.data.timePercent.timed,
//           name: '晚上'
//         }]
//       }]
//     };
//     chart.setOption(optionc);
//   },
//   getPreferencePercent() {
//     wx.request({
//       url: app.globalData.baseUrl + "/user/analysis",
//       header: {
//         'cookie': 'JSESSIONID=' + app.globalData.SESSIONID
//       },
//       success: (res)=> {
//         this.setData({
//           preferencePercent: res.data.data
//         })
//         this.initChartA()
//       },
//       error() {
//         console.log("请求失败")
//       }
//     })
//   },
//   getBehaviorPercent() {
//     wx.request({
//       // url: 'http://localhost:8080/getBehaviorPercent',
//       url: app.globalData.baseUrl + "getBehaviorPercent",
//       header: {
//         'cookie': 'JSESSIONID=' + app.globalData.SESSIONID
//       },
//       success: (res)=> {
//         this.setData({
//           behaviorPercent: res.data.data
//         })
//         this.initChartB()
//       },
//       error() {
//         console.log("请求失败")
//       }
//     })
//   },
//   getTimePercent() {
//     this.setData({
//       timePercent: {
//         timea: 14,
//         timeb: 24,
//         timec: 9,
//         timed: 17
//       }
//     })
//     this.initChartC();
//   }
// });

// 引入 wx-charts 库
const app = getApp()
import * as echarts from "/utils/wx-charts.min.js";

Page({
  data: {
    chartsData: {}
  },

  onLoad: function () {
    const wxCharts = require('../../../utils/wx-charts.min.js');
    //使用 echarts 绘制图表等其他操作  
    console.log(echarts)
    // 在小程序页面中发起请求
    wx.request({
      url: app.globalData.baseUrl + "user/analysis",
      method: "GET",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success: res => {
        // 解析数据并进行准备
        const rawData = res.data.data;
        const chartsData = {
          chart1: [],
          chart2: [],
          chart3: []
        }
        rawData.forEach(item => {
          chartsData.chart1.push({
            name: item.name,
            data: item.value
          });
          chartsData.chart2.push({
            name: item.name,
            data: 100 - item.value
          });
          chartsData.chart3.push({
            name: item.name,
            data: item.value % 3
          });
        });

        // 将准备好的数据保存到页面数据中供显示页面使用
        this.setData({
          chartsData: chartsData
        });

        // 在页面中展示三个饼图
        new echarts({
          canvasId: 'canvas1',
          type: 'pie',
          series: chartsData.chart1,
          width: 300,
          height: 200,
          dataLabel: true
        });

        new echarts({
          canvasId: 'canvas2',
          type: 'pie',
          series: chartsData.chart2,
          width: 300,
          height: 200,
          dataLabel: true
        });

        new echarts({
          canvasId: 'canvas3',
          type: 'pie',
          series: chartsData.chart3,
          width: 300,
          height: 200,
          dataLabel: true
        });
      }
    })
  }
});
