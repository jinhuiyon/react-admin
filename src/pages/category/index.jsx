import React, { Component } from "react";
import { Card, Button, Icon, Table, Modal, message } from "antd";

import {
  reqCategories,
  reqAddCategory,
  reqUpdateCategoryName
} from "../../api";
import MyButton from "../../components/my-button";
import AddCategoryForm from "./add-category-form";
import UpdateCategoryNameForm from "./update-category-name";
import "./index.less";

export default class Category extends Component {
  state = {
    categories: [], // 一级分类列表
    subCategories: [], // 二级分类列表
    isShowSubCategories: false, // 是否显示二级分类列表
    isShowAddCategory: false, // 显示添加品类
    isShowUpdateCategoryName: false, // 显示修改分类名称
    loading: true // 是否显示loding
  };

  category = {};

  componentDidMount() {
    this.fetchCategories("0");
  }

  fetchCategories = async parentId => {
    this.setState({
      loading: true
    });

    const result = await reqCategories(parentId);

    if (result) {
      // 一级
      if (parentId === "0") {
        this.setState({ categories: result });
      } else {
        // 二级
        this.setState({
          subCategories: result,
          isShowSubCategories: true // 开
        });
      }
    }
    // 关闭loading
    this.setState({
      loading: false
    });
  };

  addCategory = () => {
    const { form } = this.addCategoryForm.props;

    form.validateFields(async (err, values) => {
      if (!err) {
        const { parentId, categoryName } = values;
        const result = await reqAddCategory(parentId, categoryName);

        if (result) {
          message.success("添加分类成功~", 2);
          form.resetFields(["parentId", "categoryName"]);

          const options = {
            isShowAddCategory: false
          };

          const { isShowSubCategories } = this.state;
          if (result.parentId === "0") {
            options.categories = [...this.state.categories, result];
          } else if (
            isShowSubCategories &&
            result.parentId === this.parentCategory._id
          ) {
            options.subCategories = [...this.state.subCategories, result];
          }

          this.setState(options);
        }
      }
    });
  };

  toggleDisplay = (stateName, stateValue) => {
    return () => {
      this.setState({
        [stateName]: stateValue
      });
    };
  };

  hideUpdateCategoryName = () => {
    // 清空表单项的值
    this.updateCategoryNameForm.props.form.resetFields(["categoryName"]);
    // 隐藏对话框
    this.setState({
      isShowUpdateCategoryName: false
    });
  };

  saveCategory = category => {
    return () => {
      // 保存要更新的分类数据
      this.category = category;

      this.setState({
        isShowUpdateCategoryName: true
      });
    };
  };

  showSubCategory = category => {
    return async () => {
      this.parentCategory = category;
      this.fetchCategories(category._id);
    };
  };

  goBack = () => {
    this.setState({
      isShowSubCategories: false
    });
  };

  updateCategoryName = () => {
    const { form } = this.updateCategoryNameForm.props;

    form.validateFields(async (err, values) => {
      if (!err) {
        const { categoryName } = values;
        const categoryId = this.category._id;
        // 发送请求
        const result = await reqUpdateCategoryName(categoryId, categoryName);

        if (result) {
          const { parentId } = this.category;
          let categoryData = this.state.categories;
          let stateName = "categories";

          if (parentId !== 0) {
            categoryData = this.state.subCategories;
            stateName = "subCategories";
          }
          const categories = categoryData.map(category => {
            let { _id, name, parentId } = category;

            if (_id === categoryId) {
              name = categoryName;
              return {
                _id,
                name,
                parentId
              };
            }
            return category;
          });

          // 清空表单值 隐藏对话框
          form.resetFields(["categoryName"]);

          message.success("更新分类名称成功~", 2);

          this.setState({
            isShowUpdateCategoryName: false,
            [stateName]: categories
          });
        }
      }
    });
  };

  render() {
    const {
      categories,
      subCategories,
      isShowSubCategories,
      isShowAddCategory,
      isShowUpdateCategoryName,
      loading
    } = this.state;

    // 表头内容
    const columns = [
      {
        title: "品类名称",
        dataIndex: "name"
      },
      {
        title: "操作",
        className: "category-operation",
        // 改变当列显示
        render: category => {
          // console.log(category);
          return (
            <div>
              <MyButton onClick={this.saveCategory(category)}>
                修改名称
              </MyButton>
              {this.state.isShowSubCategories ? null : (
                <MyButton onClick={this.showSubCategory(category)}>
                  查看其子品类
                </MyButton>
              )}
            </div>
          );
        }
      }
    ];

    return (
      <Card
        title={
          isShowSubCategories ? (
            <div>
              <MyButton onClick={this.goBack}>一级分类</MyButton>
              <Icon type="arrow-right" />
              &nbsp;{this.parentCategory.name}
            </div>
          ) : (
            "一级分类列表"
          )
        }
        extra={
          <Button
            type="primary"
            onClick={this.toggleDisplay("isShowAddCategory", true)}
          >
            <Icon type="plus" />
            添加品类
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={isShowSubCategories ? subCategories : categories}
          bordered
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["3", "6", "9", "12"],
            defaultPageSize: 3,
            showQuickJumper: true
          }}
          rowKey="_id"
          loading={loading}
        />

        <Modal
          title="添加分类"
          visible={isShowAddCategory}
          onOk={this.addCategory}
          onCancel={this.toggleDisplay("isShowAddCategory", false)}
          okText="确认"
          cancelText="取消"
        >
          <AddCategoryForm
            categories={categories}
            wrappedComponentRef={form => (this.addCategoryForm = form)}
          />
        </Modal>

        <Modal
          title="修改分类名称"
          visible={isShowUpdateCategoryName}
          onOk={this.updateCategoryName}
          onCancel={this.hideUpdateCategoryName}
          okText="确认"
          cancelText="取消"
          width={250}
        >
          <UpdateCategoryNameForm
            categoryName={this.category.name}
            wrappedComponentRef={form => (this.updateCategoryNameForm = form)}
          />
        </Modal>
      </Card>
    );
  }
}
