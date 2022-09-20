import { Redirect } from 'umi';

export default (props) => {
  const isLogin = window.localStorage.getItem('loginToken');
  if (isLogin) {
    return <div>{props.children}</div>;
  } else {
    return <Redirect to="/login" />;
  }
};
