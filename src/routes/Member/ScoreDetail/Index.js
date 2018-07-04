
  import React, { PureComponent } from 'react';
  import { connect } from 'dva';
  import { Link } from 'dva/router';
  import { Form, Card, Modal, Button, Popconfirm } from 'antd';
  import cloneDeep from 'lodash/cloneDeep';
  import pathToRegexp from 'path-to-regexp';
  
  import PageHeaderLayout from 'layouts/PageHeaderLayout';
  import SearchForms from 'components/GeneralSearchForm/Index';
  import TableList from 'components/GeneralTableList/Index';
  import { formaterObjectValue, formItemAddInitValue } from 'utils/utils';
  
  import DetailFormInfo from './ModalDetailForm';
  import { PageConfig } from './pageConfig.js';
  import styles from './Index.less';
  
  
  @connect(({ user, scoredetail, loading }) => ({
    currentUser: user.currentUser,
    scoredetail,
    loading: loading.models.scoredetail,
  }))
    @Form.create()
  export default class Index extends PureComponent {
      constructor(props){
        super(props);
        const {location} = props;
        const pathre = pathToRegexp('/member/scoredetail/:id');
        const memeberId = (pathre.exec(location.pathname))[1]-0||'';
        this.state = {
          showModalType: '',
          formValues: {},
          queryValues: {
            memeberId,
            type:'',
            date:''
          },
          detailFormItems: PageConfig.detailFormItems
        };
      }
      componentDidMount() {
        const { dispatch} = this.props;
        const { queryValues } = this.state;
        dispatch({
          type: 'scoredetail/fetch',
          payload: this.queryParamsFormater(queryValues,1)
        });
      }
      queryParamsFormater = (fields, type) => {
        // type 1:查询  2:update|delete  3:save  4:分页
        const { data: { pagination } } = this.props.scoredetail;
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
          type: 'scoredetail/modalVisible',
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
      deleteTableRowHandle = (id) => {
        this.props.dispatch({
          type: 'scoredetail/remove',
          payload: this.queryParamsFormater({ id }, 2),
        });
      }
      modalOkHandle = () => {
        this.modalForm.validateFields((err, fieldsValue) => {
          if (err) return;
          const { showModalType } = this.state;
          const fields = formaterObjectValue(fieldsValue);
          if (showModalType === 'create') {
            this.props.dispatch({
              type: 'scoredetail/add',
              payload: this.queryParamsFormater(fields, 3),
            });
          } else if (showModalType === 'update') {
            this.props.dispatch({
              type: 'scoredetail/update',
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
            const { date } = formValues;
            const { queryValues:{memeberId} } = this.state;
            const params = Object.assign(formValues, {
              date: date ? `${date[0].format('YYYY-MM-DD')}~${date[1].format('YYYY-MM-DD')}` : '',
              memeberId
            });
            const payload = formaterObjectValue(params);
            this.setState({
              queryValues: payload,
            });
            dispatch({
              type: 'scoredetail/fetch',
              payload: this.queryParamsFormater(payload, 1),
            });
          },
          handleFormReset: () => {
            const { queryValues }= this.state;
            this.setState((preState)=>{
              return {
                queryValues:{
                  memeberId:preState.queryValues.memeberId,
                  type:'',
                  date:''
                }
              }
            },()=>{
              const { queryValues } = this.state;
              dispatch({
                type: 'scoredetail/fetch',
                payload: this.queryParamsFormater(queryValues,1),
              });
            });
            
          },
        };
        return (
          <SearchForms {...props} />
        );
      }
      renderTable = () => {
        const { scoredetail, loading } = this.props;
        const { tableColumns } = PageConfig;
        const { data: { list, pagination } } = scoredetail;
        const newTableColumns = [...tableColumns];
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
              type: 'scoredetail/fetch',
              payload: this.queryParamsFormater(payload, 4),
            });
          },
          bordered: false,
        };
        return (<TableList {...tableProps} />);
      }
      render() {
        const { detailFormItems } = this.state;
        const { scoredetail: { modalVisible, confirmLoading } } = this.props;
  
        return (
          <PageHeaderLayout>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  {this.renderSearchForm()}
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
  
  