import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Modal, Button, Popconfirm } from 'antd';

import cloneDeep from 'lodash/cloneDeep';
import TreeTable from 'components/TreeTable/Index';
import { formaterObjectValue, formItemAddInitValue } from 'utils/utils';
import PageHeaderLayout from 'layouts/PageHeaderLayout';

import { PageConfig } from './pageConfig.js';
import DetailFormInfo from './ModalDetailForm';
import styles from './Index.less';

@connect(({ user, loading, menumanage, dictionary }) => ({
  currentUser: user.currentUser,
  loading: loading.models.menumanage,
  menumanage,
  dictionary,
}))
export default class Index extends PureComponent {
  static childContextTypes = {
    updateFormItems: PropTypes.func,
  };
  state = {
    showModalType: '',
    detailFormItems: [],
  };
  getChildContext() {
    return {
      updateFormItems: this.updateFormItems,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menumanage/fetch',
    });
  }

  updateFormItems = (id = 1, type = 'create', record = {}) => {
    const detailForm = cloneDeep(PageConfig.detailFormItems);
    const detailFormItems = [
      ...detailForm.selectFormItem,
      ...detailForm[id],
      ...detailForm.textArea,
    ];
    const newDetailFormItems = formItemAddInitValue(detailFormItems, record);
    if (type === 'update') {
      newDetailFormItems[0].colSpan = 0;
    }
    this.setState({ detailFormItems: newDetailFormItems });
  };
  showModalVisibel = (type, record) => {
    const typeId = record.menutype;
    this.updateFormItems(typeId, type, record);
    this.changeModalVisibel(true);
    this.setState({
      showModalType: type,
    });
  };
  hideModalVisibel = () => {
    this.changeModalVisibel(false);
    this.setState({
      detailFormItems: [],
    });
  };
  changeModalVisibel = (flag) => {
    this.props.dispatch({
      type: 'menumanage/modalVisible',
      payload: {
        modalVisible: flag,
      },
    });
  };
  extraTableColumnRender = () => {
    const columns = [
      {
        title: '操作',
        render: (text, record) => {
          if (record.parentid !== 0) {
            if (record.menutype !== 3) {
              return (
                <div>
                  <a
                    onClick={() => {
                      this.showModalVisibel('update', record);
                    }}
                  >
                    编辑
                  </a>
                  &nbsp;
                  <Popconfirm
                    title="确定删除吗？"
                    onConfirm={() => {
                      this.deleteTableRowHandle(record.id);
                    }}
                  >
                    <a>删除</a>
                  </Popconfirm>
                </div>
              );
            }
          }
        },
      },
    ];
    return columns;
  };
  modalOkHandle = () => {
    this.modalForm.validateFields((err, fieldsValue) => {
      if (err) return;
      // logs('fieldsValue', fieldsValue);
      const { showModalType } = this.state;
      const fields = formaterObjectValue(fieldsValue);
      if (showModalType === 'create') {
        this.props.dispatch({
          type: 'menumanage/add',
          payload: fields,
        });
      } else if (showModalType === 'update') {
        this.props.dispatch({
          type: 'menumanage/update',
          payload: fields,
        });
      }
    });
  };
  deleteTableRowHandle = (id) => {
    this.props.dispatch({
      type: 'menumanage/remove',
      payload: { id },
    });
  };
  renderTable = () => {
    const { menumanage, loading } = this.props;
    const { tableColumns } = PageConfig;
    const newTableColumns = [...tableColumns, ...this.extraTableColumnRender()];
    const { data: { list = [] } } = menumanage;
    const tableProps = {
      loading,
      dataSource: list,
      columns: newTableColumns,
    };
    return <TreeTable {...tableProps} />;
  };
  render() {
    const { detailFormItems } = this.state;
    const { menumanage: { modalVisible, confirmLoading } } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.showModalVisibel('create', {})}
                >
                  新建
                </Button>
              </div>
              {this.renderTable()}
            </div>
          </div>
        </Card>
        <Modal
          destroyOnClose
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onCancel={() => this.hideModalVisibel()}
          onOk={() => {
            this.modalOkHandle();
          }}
        >
          <DetailFormInfo
            ref={(ref) => {
              this.modalForm = ref;
            }}
            formItems={detailFormItems}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
