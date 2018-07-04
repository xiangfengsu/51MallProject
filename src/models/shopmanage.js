
  import {message} from 'antd';
  import { create, update, remove, queryPost } from '../services/generalApi';
  import { showStautsMessageHandle } from '../utils/statusCode';
  import { formatterTableList,formatterTableListPic } from '../utils/utils';
  export default {
    namespace: "shopmanage",
    state: {
      data: {
        list: [],
        pagination: {}
      },
      modalVisible: false,
      confirmLoading: false
    },
  
    effects: {
      *fetch({ payload }, { call, put }) {
        const response = yield call(queryPost, payload, "/crm/product/list");
        if (response) {
          const { code , body, } = response;
          if(code === 200){
            yield put({
              type: "save",
              payload: {
                data: body
              }
            });
          }
          
        }else{
          showStautsMessageHandle('error');
        }
      },
      *update({ payload }, { call, put, select }) {
        yield put({
          type: "changgeConfirmLoading",
          payload: {
            confirmLoading: true
          }
        });
        const response = yield call(update, payload, "/crm/product/update");
        yield put({
          type: "changgeConfirmLoading",
          payload: {
            confirmLoading: false
          }
        });
        if (response) {
          const { code , body, } = response;
          if (code === 200) {
            yield put({
              type: "modalVisible",
              payload: {
                modalVisible: false
              }
            });
            yield put({
              type: "save",
              payload: {
                data: body
              }
            });
          }
          showStautsMessageHandle("general", "update", code);
        } else {
          showStautsMessageHandle("error");
        }
      },
      *updateBtnAction({ payload }, { call, put, select }) {
        const { form:{actionType,cb} } = payload;
        let fetchUrl = '';
        let messageInfo = '';
        switch(actionType){
          case 'up':
            fetchUrl = '/crm/product/pub';
            messageInfo = '上架成功';
            break;
          case 'down':
            fetchUrl = '/crm/product/off';
            messageInfo = '下架成功';
            break;
          case 'del': 
          default : 
                  fetchUrl = '/crm/product/del';
                  messageInfo = '删除成功';
        }
        delete payload.form.actionType // eslint-disable-line
        delete payload.form.cb // eslint-disable-line
        const response = yield call(update, payload, fetchUrl);
        if (response) {
          const { code , body } = response;
          if (code === 200) {
            yield put({
              type: "save",
              payload: {
                data: body
              }
            });
            message.success(messageInfo);
            cb&&cb();
          }else{
            message.error(`接口响应错误,code:${code}`);
          }
          
          
        } else {
          showStautsMessageHandle("error");
        }
      },
      *add({ payload }, { call, put }) {
        yield put({
          type: "changgeConfirmLoading",
          payload: {
            confirmLoading: true
          }
        });
        const response = yield call(create, payload, "/crm/product/save");
        yield put({
          type: "changgeConfirmLoading",
          payload: {
            confirmLoading: false
          }
        });
        if (response) {
          const { code , body, } = response;
          if (code === 200) {
            yield put({
              type: "modalVisible",
              payload: {
                modalVisible: false
              }
            });
            yield put({
              type: "save",
              payload: {
                data: body
              }
            });
          }
          showStautsMessageHandle("general", "add", code);
        } else {
          showStautsMessageHandle("error");
        }
      },
      *remove({ payload }, { call, put, select }) {
        const page = yield select(
          state => state.shopmanage.data.pagination.current
        );
        Object.assign(payload, { page });
        const response = yield call(remove, payload, "/crm/product/remove");
        if (response) {
          const { code , body, } = response;
          if (code === 200) {
            yield put({
              type: "save",
              payload: {
                data: body
              }
            });
          } 
          showStautsMessageHandle("general", "delete", code);
        }else{
          showStautsMessageHandle('error');
        }
      }
    },
  
    reducers: {
      modalVisible(state, { payload }) {
        return {
          ...state,
          ...payload
        };
      },
      changgeConfirmLoading(state, { payload }) {
        return {
          ...state,
          ...payload
        };
      },
      save(state, action) {
        const { data } = formatterTableList(action.payload.data,['category']);
        return {
          ...state,
          ...formatterTableListPic(data,['picUrl']),
        };
      }
    }
  };
  
