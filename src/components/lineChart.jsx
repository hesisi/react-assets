import React, { useEffect, useState, useMemo } from 'react';
import * as echarts from 'echarts';
import Icon, { LineChartOutlined } from '@ant-design/icons';
import './public.less';

const LineChart = (props) => {
  const [propsData, setPropsData] = useState(props.echartsProps);
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
  const data = useMemo(() => {
    console.log('数据', propsData);
  }, [propsData]);
  useEffect(() => {
    initChart();
  }, [props]);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
      className="linechart"
    >
      <p>
        <LineChartOutlined
          style={{ marginRight: '10px', color: 'rgb(84 ,112,198)' }}
        />
        echart
      </p>
      <div
        id={props.id}
        style={{ width: '100%', height: '100%' }}
        className={props.className}
      ></div>
    </div>
  );
};

export default LineChart;
