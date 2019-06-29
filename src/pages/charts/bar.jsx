import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";


export default class Bar extends Component {
  getOption = () => {
    return {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar"
        }
      ]
    };
  };
  render() {
    return (
      <div>
        <ReactEcharts option={this.getOption()} />
      </div>
    );
  }
}
