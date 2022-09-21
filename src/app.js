import localForage from 'localforage';
import { getMenuList } from '@/services/menu';

export function render(oldRender) {
  const isLogin = window.localStorage.getItem('loginToken');
  if (isLogin) {
    getMenuList()
      .then(async (res) => {
        // console.log('callback', res);
        try {
          await localForage.setItem(
            'menuTreePermission',
            res?.data?.data || [],
          );
          oldRender && oldRender();
        } catch {
          oldRender && oldRender();
        }
      })
      .finally(() => {
        oldRender && oldRender();
      });
  } else {
    oldRender && oldRender();
  }
}
