
  import { create, update, remove, queryPost } from '../services/generalApi';
  import { showStautsMessageHandle } from '../utils/statusCode';
  export default {
    namespace: "category",
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
        const response = yield call(queryPost, payload, "/crm/product/categoty/list");
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
        const page = yield select(
          state => state.category.data.pagination.current
        );
        Object.assign(payload, { page });
        const response = yield call(update, payload, "/crm/product/categoty/update");
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
      *add({ payload }, { call, put }) {
        yield put({
          type: "changgeConfirmLoading",
          payload: {
            confirmLoading: true
          }
        });
        const response = yield call(create, payload, "/crm/product/categoty/add");
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
          state => state.category.data.pagination.current
        );
        Object.assign(payload, { page });
        const response = yield call(remove, payload, "/crm/product/categoty/del");
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
        return {
          ...state,
          ...action.payload,
        };
      }
    }
  };
  
