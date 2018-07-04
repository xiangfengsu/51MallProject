
  import React, { PureComponent } from 'react';
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
  
  
  @connect(({ user, membermanage, loading }) => ({
    currentUser: user.currentUser,
    membermanage,
    loading: loading.models.membermanage,
  }))
    @Form.create()
  export default class Index extends PureComponent {
      state = {
        showModalType: '',
        updateType:'',
        formValues: {},
        queryValues: {},
        detailFormItems: PageConfig.detailFormItems,
      }
      componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'membermanage/fetch',
          payload: this.queryParamsFormater(),
        });
      }
      queryParamsFormater = (fields, type) => {
        // type 1:查询  2:update|delete  3:save  4:分页
        const { data: { pagination } } = this.props.membermanage;
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
      updateFormItems = (record = {},flag='tags') => {
        let detailFormItems = [];
        if(flag === 'tags'){
          detailFormItems = cloneDeep(PageConfig.detailFormItems);
        }else if(flag === 'personInfo'){
          detailFormItems = cloneDeep(PageConfig.personalFormItems);
        }
        const newDetailFormItems = formItemAddInitValue(detailFormItems, record);
        this.setState({ detailFormItems: newDetailFormItems });
      };
      changeModalVisibel = (flag) => {
        this.props.dispatch({
          type: 'membermanage/modalVisible',
          payload: {
            modalVisible: flag,
          },
        });
      };
      showModalVisibel = (type, record,flag) => {
        this.setState({
          showModalType: type,
          updateType:flag
        },()=>{
          this.updateFormItems(record,flag);
          this.changeModalVisibel(true);
        });
      }
      hideModalVisibel = () => {
        this.changeModalVisibel(false);
      }
      deleteTableRowHandle = (id) => {
        this.props.dispatch({
          type: 'membermanage/remove',
          payload: this.queryParamsFormater({ id }, 2),
        });
      }
      extraTableColumnRender = () => {
        const columns = [
          {
            title: '操作',
            render: (text, record) => (
              <ul className={styles.actionList}>
                <li>
                  <a onClick={() => { this.showModalVisibel('update', record,'tags'); }}>编辑标签</a>
                </li>
                <li>
                  <Link to={`/member/scoredetail/${record.id}`}>积分记录</Link>
                </li>
                <li>
                  <a onClick={() => { this.showModalVisibel('update', record,'personInfo'); }}>个人资料</a>
                </li>
              </ul>
            ),
          },
        ];
        return columns;
      }
      modalOkHandle = () => {
        this.modalForm.validateFields((err, fieldsValue) => {
          if (err) return;
          const { showModalType,updateType } = this.state;
          let fields = {};
          if(updateType === 'personInfo'){
            const { birthday } = fieldsValue;
            fields = formaterObjectValue(Object.assign({},fieldsValue,{
              birthday:birthday?birthday.format('YYYY-MM-DD'):''
            }))
          }else{
            fields = formaterObjectValue(fieldsValue);
          }
           
          if (showModalType === 'create') {
            this.props.dispatch({
              type: 'membermanage/add',
              payload: this.queryParamsFormater(fields, 3),
            });
          } else if (showModalType === 'update') {
            
            this.props.dispatch({
              type: 'membermanage/update',
              payload: this.queryParamsFormater(Object.assign({},fields,{
                updateType
              }), 2),
            });
          }
        });
      }
      downloadExcel = () => {

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
            const { score, scoremin='',scoremax='' } = formValues;
            delete formValues.score; // eslint-disable-line
            const payload = formaterObjectValue(formValues);
            this.setState({
              queryValues: payload,
            });
            dispatch({
              type: 'membermanage/fetch',
              payload: this.queryParamsFormater(payload, 1),
            });
          },
          handleFormReset: () => {
            this.setState({
              queryValues: {},
            });
            dispatch({
              type: 'membermanage/fetch',
              payload: this.queryParamsFormater(),
            });
          },
        };
        return (
          <SearchForms {...props} />
        );
      }
      renderTable = () => {
        const { membermanage, loading } = this.props;
        const { tableColumns } = PageConfig;
        const { data: { list, pagination } } = membermanage;
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
              type: 'membermanage/fetch',
              payload: this.queryParamsFormater(payload, 4),
            });
          },
          bordered: false,
        };
        return (<TableList {...tableProps} />);
      }
      render() {
        const { detailFormItems,queryValues:{ mobile='',openid='',scoremax='',scoremin='',tagId=''} } = this.state;
        const { membermanage: { modalVisible, confirmLoading } } = this.props;
        const exportQueryParams = `mobile=${mobile}&openid=${openid}&scoremax=${scoremax}&scoremin=${scoremin}&tagId=${tagId}`;

        return (
          <PageHeaderLayout>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  {this.renderSearchForm()}
                  <div className={styles.tableListOperator}>
                    <Button icon="download" type="primary" href={`/member/memberentity/export?${exportQueryParams}`}>
                      导出
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
  
  