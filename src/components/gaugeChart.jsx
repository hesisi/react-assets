import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import Icon, { FundProjectionScreenOutlined } from '@ant-design/icons';
const GaugeChart = (props) => {
  const initChart = () => {
    let element = document.getElementById(props.id);
    let myChart = echarts.init(element);
    myChart.clear();
    let option;
    option = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
      },
      grid: {
        top: 30,
      },
      series: [
        {
          name: 'Pressure',
          type: 'gauge',
          detail: {
            formatter: '{value}',
          },
          data: [
            {
              value: 50,
              name: 'SCORE',
            },
          ],
        },
      ],
    };
    option && myChart.setOption(option);
  };

  useEffect(() => {
    initChart();
  }, []);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
      className="guideChart"
    >
      <p>
        <FundProjectionScreenOutlined
          style={{ marginRight: '10px', color: 'rgb(84,112,198)' }}
        />
        GaugeChart
      </p>
      <div
        id={props.id}
        style={{ width: '100%', height: '100%' }}
        className={props.className}
      ></div>
    </div>
  );
};

export default GaugeChart;
