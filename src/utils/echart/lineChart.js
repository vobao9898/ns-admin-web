const Util = ({ id, series, color, legend, grid = {}, xAxis = {}, yAxis = {} }) => {
  import('echarts').then((echarts) => {
    const element = document.getElementById(id);
    if (element) {
      echarts.init(element).setOption({
        color,
        legend,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
          ...grid,
        },
        title: {
          text: 'Tickets Solved & create'
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            ...xAxis,
          },
        ],
        yAxis: [
          {
            type: 'value',
            ...yAxis
          },
        ],
        series,
      });
    }
  });
};
export default Util;
