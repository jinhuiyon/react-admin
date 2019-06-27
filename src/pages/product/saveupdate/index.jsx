import React, { Component } from "react";
import { Card, Icon, Form, Input, Cascader, InputNumber, Button } from "antd";
import { reqCategories, reqAddProduct } from "../../../api";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
import "./index.less";
import RichTextEditor from "./rich-text-editor";
const { Item } = Form;

class Saveupdade extends Component {
  state = {
    options: []
  };
  // 获取组件
  richTextEditorRef = React.createRef();
  async componentDidMount() {
    const result = await reqCategories("0");

    if (result) {
      this.setState({
        options: result.map(item => {
          return {
            value: item._id,
            label: item.name,
            isLeaf: false
          };
        })
      });
    }
  }
  goBack = () => {
    this.props.history.goBack();
  };
  // 加载二级分类
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // 显示loading
    targetOption.loading = true;
    // 请求二级分类
    const result = await reqCategories(targetOption.value);

    if (result) {
      targetOption.loading = false;

      targetOption.children = result.map(item => {
        return {
          label: item.name,
          value: item._id
        };
      });
      this.setState({
        options: [...this.state.options]
      });
    }
  };

  addProduct = e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { editorState } = this.richTextEditorRef.current.state;
        const detail = draftToHtml(
          convertToRaw(editorState.getCurrentContent())
        );
        const { name, desc, price, categoriesId } = values;

        let pCategoryId = "0";
        let categoryId = "";

        if (categoriesId.length === 1) {
          categoryId = categoriesId[0];
        } else {
          pCategoryId = categoriesId[0];
          categoryId = categoriesId[1];
        }
        // 发送请求
        const result = await reqAddProduct({
          name,
          desc,
          price,
          categoryId,
          pCategoryId,
          detail
        });

        if (result) {
          // 请求成功返回到index页面
          this.props.history.push("/product/index");
        }
      }
    });
  };
  render() {
    const { options } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      }
    };
    return (
      <Card
        title={
          <div className="title">
            <Icon
              onClick={this.goBack}
              className="arrow-icon"
              type="arrow-left"
            />
            添加商品
          </div>
        }
      >
        <Form {...formItemLayout} onSubmit={this.addProduct}>
          <Item label="商品名称">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入商品名称" }]
            })(<Input placeholder="请输入商品名称" />)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator("desc", {
              rules: [{ required: true, message: "请输入商品描述" }]
            })(<Input placeholder="请输入商品描述" />)}
          </Item>
          <Item label="商品分类" wrapperCol={{ span: 5 }}>
            {getFieldDecorator("categoriesId", {
              rules: [{ required: true, message: "请选择分类" }]
            })(
              <Cascader
                placeholder="请选择分类"
                options={options}
                loadData={this.loadData}
                changeOnSelect
              />
            )}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator("price", {
              rules: [{ required: true, message: "请输入商品价格" }]
            })(
              <InputNumber
                formatter={value =>
                  `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={value => value.replace(/￥\s?|(,*)/g, "")}
                className="input-number"
              />
            )}
          </Item>
          <Item label="商品详情" wrapperCol={{ span: 20 }}>
            <RichTextEditor ref={this.richTextEditorRef} />
          </Item>
          <Item>
            <Button
              type="primary"
              className="add-product-btn"
              htmlType="submit"
            >
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(Saveupdade);
