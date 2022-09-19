import { Button, Form, Input, message } from 'antd';
import { SearchOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useRef, useEffect, useState } from 'react';
import { creatRightTree } from './treeUtil';
import RoleTransfer from './roleTransfer';

import { getRoleUser, updateRoleUser } from '@/services/userManager';

const { TextArea } = Input;
export default function RoleUser({ groupItem, activeKey }) {
  const formRef = useRef(null);
  const saveKeysRef = useRef(null);
  const [form] = Form.useForm();
  const [roleUserList, setRoleUserList] = useState([]);
  const [roleUserTargetKeys, setRoleUserTargetKeys] = useState([]);

  const onFormChange = (values) => {
    formValueChange && formValueChange(values);
  };

  const onFinish = (values) => {
    formValueSubmit && formValueSubmit(values);
  };

  const onReset = () => {
    formRef.current && formRef.current.resetFields();
    formResetCallback && formResetCallback();
  };

  const formProps = {
    ref: formRef,
    layout: 'inline',
    form,
    initialValues: {},
    onValuesChange: onFormChange,
    onFinish,
    className: 'default-form-radios',
  };

  const temp = (data, keysChoose = []) => {
    data.forEach((item) => {
      item['key'] =
        !item?.groupId && item.groupId !== 0 ? item.sign : item.groupId;
      item['title'] = item.groupName || item.userName;
      keysChoose.push(item.key);
      if (item.children?.length > 0) {
        temp(item.children, keysChoose);
      }
    });
    return data;
  };

  useEffect(async () => {
    if (groupItem && activeKey === '2') {
      const chooseKeys = [];
      const roleUserData = await getRoleUser({
        roleId: groupItem.id,
      });
      const userTreeData = roleUserData?.data?.data?.groupUserList || [];
      const userList = temp(userTreeData);
      temp(roleUserData?.data?.data?.relationGroupUserList || [], chooseKeys);
      saveKeysRef.current = chooseKeys || [];
      setRoleUserList(userList);
      setRoleUserTargetKeys(chooseKeys);
    }
  }, [groupItem, activeKey]);

  const saveRoleUser = (targetIds, selectedKeys) => {
    // 调后端保存接口
    saveKeysRef.current = targetIds;
    handleSaveUser();
  };

  const handleSaveUser = async () => {
    const rightTree = creatRightTree(roleUserList, saveKeysRef.current);

    // let sendIds = saveKeysRef?.current || [];
    // sendIds = sendIds.filter((item) => {
    //   return (item + '').indexOf('-') !== -1;
    // });
    // sendIds = sendIds.map((item) => {
    //   const backItem = item.split('-')[1];
    //   return backItem;
    // });
    const updateR = await updateRoleUser(groupItem.id, rightTree);
    // message.success('保存成功');
  };

  return (
    <div className="table-search-wrapper">
      <RoleTransfer
        transIdenty="人员"
        groupItem={groupItem}
        transData={roleUserList}
        transTargetKeys={roleUserTargetKeys}
        saveRoleUser={saveRoleUser}
      />
      {/* <div style={{ marginTop: '15px' }}>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          htmlType="submit"
          onClick={handleSaveUser}
          style={{ marginRight: '10px' }}
        >
          保存
        </Button>
      </div> */}
    </div>
  );
}
