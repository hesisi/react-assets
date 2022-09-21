import { Redirect } from 'umi';

export default (props) => {
  const isLogin = window.localStorage.getItem('loginToken');
  if (isLogin) {
    return {props.children};
  } else {
    return <Redirect to="/login" />;
  }
};
