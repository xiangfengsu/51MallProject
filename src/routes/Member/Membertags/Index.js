
  import React, { PureComponent } from 'react';
  import PropTypes from 'prop-types';
  import { connect } from 'dva';
  import { Link } from 'dva/router';
  import { Form, Card, Modal, Button, Popconfirm } from 'antd';
  import cloneDeep from 'lodash/cloneDeep';

  
  import PageHeaderLayout from 'layouts/PageHeaderLayout';
  import SearchForms from 'components/GeneralSearchForm/Index';
  import TableList from 'components/GeneralTableList/Index';
  import { formaterObjectValue, formItemAddInitValue } from 'utils/utils';
  
  import DetailFormInfo from './ModalDetailForm';
  import { PageConfig } from './pageConfig.js';
  import styles from './Index.less';
  
  
  @connect(({ user, membertags, loading }) => ({
    currentUser: user.currentUser,
    membertags,
    loading: loading.models.membertags,
  }))
  @Form.create()
  export default class Index extends PureComponent {
      static childContextTypes = {
        updateFormItems: PropTypes.func,
      }; 
      state = {
        showModalType: '',
        formValues: {},
        queryValues: {},
        currentItem:{},
        detailFormItems: PageConfig.detailFormItems,
      }
      getChildContext() {
        return {
          updateFormItems: this.updateFormItems,
        };
      }
      componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'membertags/fetch',
          payload: this.queryParamsFormater(),
        });
      }
      queryParamsFormater = (fields, type) => {
        // type 1:查询  2:update|delete  3:save  4:分页
        const { data: { pagination } } = this.props.membertags;
        delete pagination.total;
        const params = {
          form: {},
          query: {},
          pagination: {
            current: 1,
            pageSize: 10,
          },
        };
        switch (type) {
          case 1:
            Object.assign(params, {
              query: { ...fields },
            });
            break;
          case 2:
            Object.assign(params, {
              query: { ...this.state.queryValues },
              form: { ...fields },
              pagination,
            });
            break;
          case 3:
            Object.assign(params, {
              form: { ...fields },
            });
            break;
          case 4:
            Object.assign(params, {
              query: { ...this.state.queryValues },
              pagination: { current: fields.page, pageSize: fields.pageSize },
            });
            break;
          default:
            Object.assign(params, {});
        }
        return params;
      };
      updateFormItems = (selectValue=0,record = {}) => {
        const inputList = [{
          formType: 'inputUnit',
          disabled: false,
          isRequired: true,
          key: 'minTrades',
          label: '累计交易金额',
          hasFeedback:false,
          colSpan: 24,
        },{
          formType: 'inputUnit',
          disabled: false,
          isRequired: true,
          key: 'minAmount',
          label: '累计成功交易',
          unit:'笔',
          hasFeedback:false,
          colSpan: 24,
        },];
        let detailFormItems = [];
        if(selectValue!==0){
          detailFormItems = cloneDeep(PageConfig.detailFormItems);
        }else{
          detailFormItems = [...cloneDeep(PageConfig.detailFormItems),...inputList];
        }
        const { currentItem } = this.state;
        const newDetailFormItems = formItemAddInitValue(detailFormItems, currentItem);
        this.setState({ detailFormItems: newDetailFormItems });
      };
      changeModalVisibel = (flag) => {
        this.props.dispatch({
          type: 'membertags/modalVisible',
          payload: {
            modalVisible: flag,
          },
        });
      };
      showModalVisibel = (type, record) => {
        this.setState({
          showModalType: type,
          currentItem:Object.assign({},record)
        },()=>{
          if(type === 'update'){
            this.updateFormItems(record.type,record);
          }else{
            this.updateFormItems(0,record);
          }
          this.changeModalVisibel(true);
        });
       
        
      }
      hideModalVisibel = () => {
        this.changeModalVisibel(false);
      }
      deleteTableRowHandle = (id) => {
        this.props.dispatch({
          type: 'membertags/remove',
          payload: this.queryParamsFormater({ id }, 2),
        });
      }
      extraTableColumnRender = () => {
        const columns = [
          {
            title: '操作',
            render: (text, record) => (
              <div>
                <a onClick={() => { this.showModalVisibel('update', record); }}>编辑</a>
                &nbsp;
                <Popconfirm
                  title="确定删除吗？"
                  onConfirm={() => { this.deleteTableRowHandle(record.id); }}
                >
                  <a>删除</a>
                </Popconfirm>
              </div>
            ),
          },
        ];
        return columns;
      }
      modalOkHandle = () => {
        this.modalForm.validateFields((err, fieldsValue) => {
          if (err) return;
          const { showModalType } = this.state;
          const fields = formaterObjectValue(Object.assign({},{
            minAmount:'',
            minTrades:''
          },fieldsValue));

          if (showModalType === 'create') {
            this.props.dispatch({
              type: 'membertags/add',
              payload: this.queryParamsFormater(fields, 3),
            });
          } else if (showModalType === 'update') {
            this.props.dispatch({
              type: 'membertags/update',
              payload: this.queryParamsFormater(fields, 2),
            });
          }
        });
      }
      renderSearchForm = () => {
        const { form, dispatch } = this.props;
        const { searchForms } = PageConfig;
        const props = {
          form,
          formInfo: {
            layout: 'inline',
            formItems: searchForms,
          },
          handleSearchSubmit: (formValues) => {
            const payload = formaterObjectValue(formValues);
            this.setState({
              queryValues: payload,
            });
            dispatch({
              type: 'membertags/fetch',
              payload: this.queryParamsFormater(payload, 1),
            });
          },
          handleFormReset: () => {
            this.setState({
              queryValues: {},
            });
            dispatch({
              type: 'membertags/fetch',
              payload: this.queryParamsFormater(),
            });
          },
        };
        return (
          <SearchForms {...props} />
        );
      }
      renderTable = () => {
        const { membertags, loading } = this.props;
        const { tableColumns } = PageConfig;
        const { data: { list, pagination } } = membertags;
        const newTableColumns = [...tableColumns, ...this.extraTableColumnRender()];
        const tableProps = {
          loading,
          dataSource: list,
          columns: newTableColumns,
          pagination: Object.assign(pagination, { pageSize: 10 }),
          handleTableChange: ({ current }) => {
            const { dispatch } = this.props;
            const { formValues } = this.state;
            const payload = {
              page: current,
              pageSize: 10,
              ...formValues,
            };
            dispatch({
              type: 'membertags/fetch',
              payload: this.queryParamsFormater(payload, 4),
            });
          },
          bordered: false,
        };
        return (<TableList {...tableProps} />);
      }
      render() {
        const { detailFormItems } = this.state;
        const { membertags: { modalVisible, confirmLoading } } = this.props;
  
        return (
          <PageHeaderLayout>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  {this.renderSearchForm()}
                  <div className={styles.tableListOperator}>
                    <Button icon="plus" type="primary" onClick={() => this.showModalVisibel('create', {})}>
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
              onOk={() => { this.modalOkHandle(); }}
  
            >
              <DetailFormInfo
                ref={(ref) => { this.modalForm = ref; }}
                formItems={detailFormItems}
              />
            </Modal>
          </PageHeaderLayout>
        );
      }
  }
  
  