import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const TestChart = (props) => {
  const initChart = () => {
    let element = document.getElementById('chart3');
    let myChart = echarts.init(element);
    myChart.clear();
    let option;
    option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    };
    option && myChart.setOption(option);
  };

  useEffect(() => {
    initChart();
  }, []);

  return <div id="chart3" style={{ width: '100%', height: '100%' }}></div>;
};

export default TestChart;
