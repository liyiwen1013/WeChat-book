// import * as echarts from '../../../components/ec-canvas/echarts';
import * as echarts from '../../../utils/ec-canvas/echarts';
const app = getApp()
Page({
  onReady: function () {
    // 获取组件
    this.ecComponentA = this.selectComponent('#mychart-dom-multi-bar');
    this.ecComponentB = this.selectComponent('#mychart-dom-multi-scatter');
    this.ecComponentC = this.selectComponent('#mychart-dom-multi-bara');
    this.getAllPercent();
    // this.getBehaviorPercent();
    // this.getTimePercent();
  },
  data: {
    ec: {
      onInit: initChart
    },
  // }
  // data: {
  //   ecPreference: {
  //     lazyLoad: true
  //   },
  //   ecBehavior: {
  //     lazyLoad: true
  //   },
  //   ecTime: {
  //     lazyLoad: true
  //   },
    preferencePercent: [],
    behaviorPercent: [],
    timePercent: [],
    isNormal: false
  },
  onShow: function() {
    this.setData({
      isNormal: wx.getStorageSync('isNormal')
    })
  },
  // 开始初始化
  initChartA: function () {
    this.ecComponentA.init((canvas, width, height, dpr) => {
      const charta = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      this.getChartAOption(charta);
      this.charta = charta;
      return charta;
    });
  },
  initChartB: function () {
    this.ecComponentB.init((canvas, width, height, dpr) => {
      const chartb = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      this.getChartBOption(chartb);
      this.chartb = chartb;
      return chartb;
    });
  },
  initChartC: function () {
    this.ecComponentC.init((canvas, width, height, dpr) => {
      const chartc = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      this.getSChartCOption(chartc);
      this.chartc = chartc;
      return chartc;
    });
  },
  getChartAOption(chart) {
    console.log("chart",chart)
    console.log("...",this.data)
    const optiona = {
      backgroundColor: "#f2f2f2",
      color: ["#0081ff", "#f37b1d", "#39b54a", "#1cbbb4"],
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['40%', '60%'],
        data: [{
          value: this.data.preferencePercent.dynamicCount,
          name: '趣闻'
        }, {
          value: this.data.preferencePercent.sharingCount,
          name: '分享'
        }]
      }]
    };
    chart.setOption(optiona)
  },
  getChartBOption(chart) {
    const optionb = {
      backgroundColor: "#f2f2f2",
      color: ["#0081ff", "#f37b1d", "#39b54a", "#1cbbb4"],
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['40%', '60%'],
        data: [{
          value: this.data.behaviorPercent.commentCount,
          name: '评论'
        }, {
          value: this.data.behaviorPercent.referenceCount,
          name: '引用'
        }]
      }]
    };
    chart.setOption(optionb)
  },
  getSChartCOption(chart) {
    console.log("..0",this.data)
    const optionc = {
      backgroundColor: "#f2f2f2",
      color: ["#0081ff", "#f37b1d", "#39b54a", "#1cbbb4"],
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['40%', '60%'],
        data: [{
          value: this.data.timePercent.dawnCount,
          name: '凌晨'
        }, {
          value: this.data.timePercent.morningCount,
          name: '上午'
        }, {
          value: this.data.timePercent.afternoonCount,
          name: '下午'
        }, {
          value: this.data.timePercent.nightCount,
          name: '晚上'
        }]
      }]
    };
    chart.setOption(optionc);
  },
  // 偏好
  getAllPercent() {
    wx.request({
      url: app.globalData.baseUrl + "user/analysis",
      method: "GET",
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success: (res)=> {
        console.log(res.data)
        if (res.data.code == "0000"){
          this.setData({
            preferencePercent: res.data.data.preference,
            behaviorPercent: res.data.data.behavior,
            timePercent: res.data.data.online,
          })
          this.initChartA()
          this.initChartB()
          this.initChartC()
        }
      },
      error() {
        console.log("请求失败")
      }
    })
  },
  // 行为
  // getBehaviorPercent() {
  //   wx.request({
  //     url: app.globalData.baseUrl + "user/analysis",
  //     method: "GET",
  //     header: {
  //       'content-type': 'application/json',
  //       'Authorization': 'Bearer ' + app.globalData.token
  //     },
  //     success: (res)=> {
  //       this.setData({
  //         behaviorPercent: res.data.data.behavior
  //       })
  //       this.initChartB()
  //     },
  //     error() {
  //       console.log("请求失败")
  //     }
  //   })
  // },
  // // 时间
  // getTimePercent() {
  //   this.setData({
  //     timePercent: {
  //       timea: 14,
  //       timeb: 24,
  //       timec: 9,
  //       timed: 17
  //     }
  //   })
  //   this.initChartC();
  // }
});
function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  const option = {
    title: {
      text: '饼状图',
      subtext: '示例',
      left: 'center'
    },
    series: [{
      name: '访问来源',
      type: 'pie',
      radius: '50%',
      data: [
        {value: 335, name: '直接访问'},
        {value: 310, name: '邮件营销'},
        {value: 234, name: '联盟广告'},
        {value: 135, name: '视频广告'},
        {value: 1548, name: '搜索引擎'}
      ]
    }]
  };

  chart.setOption(option);
  return chart;
}