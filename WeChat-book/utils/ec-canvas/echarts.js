var _echarts = require('./echarts.min');
var _echarts2 = _interopRequireDefault(_echarts);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Component({
  properties: {
    canvasId: {
      type: String,
      value: 'ec-canvas'
    },
    ec: {
      type: Object
    }
  },

  data: {},

  ready: function ready() {
    this.data.ec ? this.initChart() : console.warn('组件需绑定 ec 变量，例：\n<ec-canvas id="mychart-dom-bar" canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
  },

  methods: {
    initChart: function initChart() {
      var _this$data = this.data,
          canvasId = _this$data.canvasId,
          ec = _this$data.ec;


      var ctx = wx.createCanvasContext(canvasId, this);

      if (!ctx) {
        console.error('无法获取到 CanvasRenderingContext2D 对象');
        return;
      }
      var width = void 0;
      var height = void 0;
      wx.createSelectorQuery().in(this).select('.ec-canvas').boundingClientRect(function (res) {
        if (!res) {
          console.error('无法获取到 canvas 实例信息');
          return;
        }
        width = res.width;
        height = res.height;
        var chart = _echarts2['default'].init(ctx, null, {
          width: width,
          height: height
        });
        chart.setOption(ec);
        return chart;
      }).exec();
    }
  }
});