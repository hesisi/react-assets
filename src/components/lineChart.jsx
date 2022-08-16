import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const LineChart = (props) => {
  const initChart = () => {
    let element = document.getElementById(props.id);
    let myChart = echarts.init(element);
    myChart.clear();
    let option;
    option = {
      grid: {
        left: 50,
        right: 30,
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
          },
        },
      ],
    };
    option && myChart.setOption(option);
  };

  useEffect(() => {
    initChart();
  }, []);

  return <div id={props.id} style={{ width: '100%', height: '100%' }}></div>;
};

export default LineChart;
