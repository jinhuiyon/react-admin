import React, { Component } from "react";
import { Card, Icon, Form, Input, Cascader, InputNumber, Button } from "antd";
import { reqCategories, reqAddProduct, reqUpdateProduct } from "../../../api";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
import "./index.less";
import RichTextEditor from "./rich-text-editor";
import PictureWall from "./picture-wall";
const { Item } = Form;

class Saveupdade extends Component {
  state = {
    options: []
  };
  // 获取组件
  richTextEditorRef = React.createRef();

  getCategories = async parentId => {
    const result = await reqCategories(parentId);

    if (result) {
      // 判断如果为2级分类
      if (parentId === "0") {
        this.setState({
          options: result.map(item => {
            return {
              value: item._id,
              label: item.name,
              isLeaf: false
            };
          })
        });
      } else {
        this.setState({
          options: this.state.options.map(item => {
            if (item.value === parentId) {
              item.children = result.map(item => {
                return {
                  value: item._id,
                  label: item.name
                };
              });
            }
            return item;
          })
        });
      }
    }
  };
  async componentDidMount() {
    this.getCategories('0');

    const product = this.props.location.state;

    let categoriesId = [];
    // 判断是否有传参
    if (product) {
      if(product.pCategoryId !=='0') {
        categoriesId.push(product.pCategoryId);
      }
      categoriesId.push(product.categoryId);
    }

    this.categoriesId = categoriesId;
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

        let promise = null;
        const product = this.props.location.state;
        const options = { name, desc, price, categoryId, pCategoryId, detail };
        // 发送请求
        if (product) {
          options._id = product._id;
          promise = reqUpdateProduct(options);
        } else {
          promise = reqAddProduct(options);
        }

        const result = await promise;

        if (result) {
          // 请求成功 返回index页面
          this.props.history.push('/product/index');
        }
      }
    });
  };
  render() {
    const { options } = this.state;
    const { getFieldDecorator } = this.props.form;
    // 添加页面值位undefined，修改产品页面，值为对象
    const product = this.props.location.state;
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
              rules: [{ required: true, message: "请输入商品名称" }],
              initialValue: product ? product.name : ''
            })(<Input placeholder="请输入商品名称" />)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator("desc", {
              rules: [{ required: true, message: "请输入商品描述" }],
              initialValue: product ? product.desc : ''
            })(<Input placeholder="请输入商品描述" />)}
          </Item>
          <Item label="商品分类" wrapperCol={{ span: 5 }}>
            {getFieldDecorator("categoriesId", {
              rules: [{ required: true, message: "请选择分类" }],
              initialValue: this.categoriesId
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
              rules: [{ required: true, message: "请输入商品价格" }],
              initialValue: product ? product.price : ''
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
          <Item label="商品图片" >
            <PictureWall imgs={product ? product.imgs : []} id={product ? product._id : ''}/>
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
