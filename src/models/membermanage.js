
  import { create, update, remove, queryPost } from '../services/generalApi';
  import { showStautsMessageHandle } from '../utils/statusCode';
  import { formatterTableList } from '../utils/utils'; 
  export default {
    namespace: "membermanage",
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
        const response = yield call(queryPost, payload, "/member/memberentity/list");
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
        const {form:{updateType}} = payload;
        let fetchUrl = '';
        logs('payload',payload);
        if(updateType === 'personInfo'){
          fetchUrl = '/member/memberentity/update'
        }else{
          fetchUrl = '/member/memberentity/saveMemberTags';
        }
        delete payload.form.updateType  // eslint-disable-line
        const response = yield call(update, payload, fetchUrl);
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
        const response = yield call(create, payload, "/sys/membermanage/save");
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
          state => state.membermanage.data.pagination.current
        );
        Object.assign(payload, { page });
        const response = yield call(remove, payload, "/sys/membermanage/del");
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
          ...formatterTableList(action.payload.data,['tags']),
        };
      }
    }
  };
  
