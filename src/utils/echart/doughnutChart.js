const Util = ({ id, series, legend, color }) => {
  import('echarts').then((echarts) => {
    const element = document.getElementById(id);
    if (element) {
      echarts.init(element).setOption({
        legend,
        tooltip: {
          trigger: 'item',
        },
        series,
        color
      });
    }
  });
};
export default Util;
