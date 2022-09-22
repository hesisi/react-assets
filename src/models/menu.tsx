import { getMenuList } from '@/services/menu';

export interface davType {
  namespace: string;
  state: any;
  effects: {
    getMenu: any;
  };
  reducers: any;
}

const menuModel: davType = {
  namespace: 'menu',
  state: {
    data: {},
  },

  effects: {
    *getMenu({ payload, callback }, { call, put }) {
      const response = yield call(getMenuList);

      yield put({
        type: 'setData',
        payload: response,
      });
      if (callback) callback(response ? response : {});
    },
  },

  reducers: {
    setData(state: any, action: any) {
      return { ...state, data: action.payload };
    },
  },
};

export default menuModel;
