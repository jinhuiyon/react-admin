import React, { Component } from "react";
import { Card, Icon, List } from "antd";

export default class Detail extends Component {
  
  render() {
    const data = [
      '商品名称:',
      '商品描述:',
      '商品价格:',
      '商品分类',
      '商品图片',
      '商品详情',
    ];
    return (
      <Card
        title={
          <div style={{ display: "flex", alignItems: "centenr" }}>
            <Icon style={{ fontSize: 25, marginRight: 10 }} type="arrow-left" />
            <span>商品详情</span>
          </div>
        }
      >
        <List>
          size="large"
          {/* header={<div>Header</div>} */}
          {/* footer={<div>Footer</div>} */}
          bordered
          dataSource={data}
          renderItem={this.renderItem}
        </List>
      </Card>
    );
  }
}
