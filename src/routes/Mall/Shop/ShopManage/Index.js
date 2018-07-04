
  import React, { PureComponent,Fragment } from 'react';
  import { connect } from 'dva';
  import { Link } from 'dva/router';
  import { Form, Card, Modal, Button, Popconfirm } from 'antd';
  import cloneDeep from 'lodash/cloneDeep';
  
  import PageHeaderLayout from 'layouts/PageHeaderLayout';
  import SearchForms from 'components/GeneralSearchForm/Index';
  import TableList from './TableList/Index';
  import { formaterObjectValue, formItemAddInitValue } from 'utils/utils';
  
  import DetailFormInfo from './ModalDetailForm';
  import { PageConfig } from './pageConfig.js';
  import styles from './Index.less';
  
  
  @connect(({ user, shopmanage, loading }) => ({
    currentUser: user.currentUser,
    shopmanage,
    loading: loading.models.shopmanage,
  }))
    @Form.create()
  export default class Index extends PureComponent {
      state = {
        showModalType: '',
        formValues: {},
        queryValues: {},
        selectedRowKeys:[],
        detailFormItems: PageConfig.detailFormItems,
      }
      componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'shopmanage/fetch',
          payload: this.queryParamsFormater(),
        });
      }
      queryParamsFormater = (fields, type) => {
        // type 1:查询  2:update|delete  3:save  4:分页
        const { data: { pagination } } = this.props.shopmanage;
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
      updateFormItems = (record = {}) => {
        const detailFormItems = cloneDeep(PageConfig.detailFormItems);
        const newDetailFormItems = formItemAddInitValue(detailFormItems, record);
        this.setState({ detailFormItems: newDetailFormItems });
      };
      changeModalVisibel = (flag) => {
        this.props.dispatch({
          type: 'shopmanage/modalVisible',
          payload: {
            modalVisible: flag,
          },
        });
      };
      showModalVisibel = (type, record) => {
        this.updateFormItems(record);
        this.changeModalVisibel(true);
        this.setState({
          showModalType: type,
        });
      }
      hideModalVisibel = () => {
        this.changeModalVisibel(false);
      }
      extraTableColumnRender = () => {
        const columns = [
          {
            title: '操作',
            width:'10%',
            render: (text, record) => (
              <div>
                <a onClick={() => { this.showModalVisibel('update', record); }}>编辑商品</a>
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
          const picUrl = fieldsValue.picUrl.map(item=>{
            return item.response&&item.response.url || item.url;
          })
          const params = Object.assign({},fieldsValue,{
            picUrl:picUrl.join(',')
          });
          const fields = formaterObjectValue(params);
          if (showModalType === 'create') {
            this.props.dispatch({
              type: 'shopmanage/add',
              payload: this.queryParamsFormater(fields, 3),
            });
          } else if (showModalType === 'update') {
            this.props.dispatch({
              type: 'shopmanage/update',
              payload: this.queryParamsFormater(fields, 2),
            });
          }
        });
      }
      updateSelectedRowKeysHandle = (selectedRowKeys)=>{
        this.setState({selectedRowKeys});
      }
      btnActions = ({actionType})=>{
        const { selectedRowKeys } = this.state;
        if(actionType === 'del'){
          const content = <Fragment>
                          确定删除已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项商品？
                          </Fragment>
          Modal.confirm({
            title: '删除商品',
            content: content,
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:()=> {
              this.btnActionsDispatch(selectedRowKeys,actionType);
            }
          });
        }else{
          this.btnActionsDispatch(selectedRowKeys,actionType);
        }
      }
      btnActionsDispatch = (selectedRowKeys,actionType)=> {
        this.props.dispatch({
          type: 'shopmanage/updateBtnAction',
          payload: this.queryParamsFormater({
            ids:selectedRowKeys,
            actionType,
            cb:()=>{
              this.tableList.cleanSelectedKeys();
            }
          }, 2),
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
              type: 'shopmanage/fetch',
              payload: this.queryParamsFormater(payload, 1),
            });
          },
          handleFormReset: () => {
            this.setState({
              queryValues: {},
            });
            dispatch({
              type: 'shopmanage/fetch',
              payload: this.queryParamsFormater(),
            });
          },
        };
        return (
          <SearchForms {...props} />
        );
      }
      renderTable = () => {
        const { shopmanage, loading } = this.props;
        const { tableColumns } = PageConfig;
        const { data: { list, pagination } } = shopmanage;
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
              type: 'shopmanage/fetch',
              payload: this.queryParamsFormater(payload, 4),
            });
          },
          bordered: false,
          updateSelectedRowKeysHandle:this.updateSelectedRowKeysHandle
        };
        return (<TableList {...tableProps} ref={(ref)=>{this.tableList = ref}} />);
      }
      render() {
        const { detailFormItems ,selectedRowKeys} = this.state;
        const { shopmanage: { modalVisible, confirmLoading } } = this.props;
  
        return (
          <PageHeaderLayout>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  {this.renderSearchForm()}
                  <div className={styles.tableListOperator}>
                    <Button icon="plus" type="primary" onClick={() => this.showModalVisibel('create', {})}>
                      发布商品
                    </Button>
                    <Button disabled={selectedRowKeys.length===0} icon="arrow-up" onClick={()=>this.btnActions({actionType:'up'})}>上架</Button>
                    <Button disabled={selectedRowKeys.length===0} icon="arrow-down" onClick={()=>this.btnActions({actionType:'down'})}>下架</Button>
                    <Button disabled={selectedRowKeys.length===0} icon="delete" type="danger" onClick={()=>this.btnActions({actionType:'del'})}>删除</Button>
                  </div>
                  {this.renderTable()}
                </div>
              </div>
            </Card>
            <Modal
              width={800}
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
  
  