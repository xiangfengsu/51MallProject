import React, { PureComponent,Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table,Alert } from 'antd';

import styles from './Index.less';

export default class TableList extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.array,
    columns: PropTypes.array,
    bordered: PropTypes.bool,
    size: PropTypes.oneOf(['default', 'small']),
    handleTableChange: PropTypes.func,
  };
  static defaultProps = {
    dataSource: [],
    columns: [],
    bordered: true,
    size: 'default',
    handleTableChange: () => {},
  };
  state = {
    selectedRowKeys: []
  }
  onSelectChange = (selectedRowKeys) => {
    const { updateSelectedRowKeysHandle } = this.props;
    updateSelectedRowKeysHandle&&updateSelectedRowKeysHandle(selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  cleanSelectedKeys = () => {
    this.onSelectChange([]);
  }
  render() {
    const {
      size,
      dataSource,
      columns,
      bordered,
      pagination,
      loading,
      handleTableChange,
    } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={styles.tableListWrap}>
        <div style={{marginBottom:'16px'}}>
            <Alert
              message={
                <Fragment>
                  已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                  
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    清空
                  </a>
                </Fragment>
              }
              type="info"
              showIcon
            />
        </div>
        <Table
          bordered={bordered}
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          rowKey={record => record.id}
          size={size}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          pagination={{ ...pagination }}
        />
      </div>
    );
  }
}
