
  import {queryPost } from '../services/generalApi';
  import { showStautsMessageHandle } from '../utils/statusCode';
  export default {
    namespace: "scoredetail",
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
        const response = yield call(queryPost, payload, "/scoredetailentity/list");
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
      }
    },
  
    reducers: {
      save(state, action) {
        return {
          ...state,
          ...action.payload,
        };
      }
    }
  };
  
