import localForage from 'localforage';
import { getMenuList } from '@/services/menu';

export function render(oldRender) {
  getMenuList().then(async (res) => {
    console.log('callback', res);
    await localForage.setItem('menuTreePermission', res?.data?.data || []);
    oldRender && oldRender();
  });
}
