import { Button, Form, Input, message } from 'antd';
import { SearchOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useRef, useEffect, useState } from 'react';
import RoleTransfer from './roleTransfer';
import { creatRightTree } from './treeUtil';
import { getRoleFunction, updateRoleFunction } from '@/services/userManager';

const { TextArea } = Input;
export default function RoleFunction({ groupItem, activeKey }) {
  const formRef = useRef(null);
  const saveKeysRef = useRef(null);
  const [form] = Form.useForm();
  const [roleFList, setRoleFList] = useState([]);
  const [roleFTargetKeys, setRoleFTargetKeys] = useState([]);

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

  const temp = (data, keysChoose = []) => {
    data.forEach((item) => {
      item['key'] = item.id;
      item['title'] = item.name;
      item['children'] = item?.['children'] || [];
      keysChoose.push(item.key);
      if (item.children?.length > 0) {
        temp(item.children, keysChoose);
      }
    });
    return data;
  };

  useEffect(async () => {
    if (groupItem && activeKey === '3') {
      let chooseKeys = [];
      const roleUserData = await getRoleFunction({
        roleId: groupItem.id,
      });
      const userTreeData = roleUserData?.data?.data?.permissionList || [];
      const userList = temp(userTreeData);
      chooseKeys = roleUserData?.data?.data?.relationPermissionList || [];
      saveKeysRef.current =
        chooseKeys.map((item) => {
          return item + '';
        }) || [];
      setRoleFList(userList);
      setRoleFTargetKeys(
        chooseKeys.map((item) => {
          return item + '';
        }),
      );
    }
  }, [groupItem, activeKey]);

  const handleSaveUser = async () => {
    const rightTree = creatRightTree(roleFList, saveKeysRef.current);
    const sendIds = [];
    temp(rightTree, sendIds);
    const updateR = await updateRoleFunction(groupItem.id, sendIds);
    // message.success('保存成功');
  };

  const saveRoleUser = (targetIds) => {
    // 调后端保存接口
    saveKeysRef.current = targetIds;
    handleSaveUser();
  };

  return (
    <div className="table-search-wrapper">
      <RoleTransfer
        transIdenty="功能"
        groupItem={groupItem}
        transData={roleFList}
        transTargetKeys={roleFTargetKeys}
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
