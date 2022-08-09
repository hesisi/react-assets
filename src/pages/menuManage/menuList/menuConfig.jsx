import { Form, Select } from 'antd';
import { useState, useEffect, forwardRef } from 'react';

const menuConfig = forwardRef((props, ref) => {
  const modeList = ['inline', 'horizontalAndVertical']; // 激活显示type

  const selectList = {
    mode: [
      { value: 'horizontal', label: '水平' },
      { value: 'inline', label: '垂直' },
      { value: 'horizontalAndVertical', label: '常规' },
    ],
    theme: [
      { value: 'dark', label: '深色' },
      { value: 'light', label: '浅色' },
    ],
    type: [
      { value: 'inline', label: '内嵌' },
      { value: 'vertical', label: '弹出' },
    ],
  };

  const [modeSelectShow, setModeSelectShow] = useState(false);
  const [formData] = useState({
    mode: 'horizontalAndVertical',
    theme1: 'light',
    theme2: 'dark',
    type: 'inline',
  });
  const [form, setForm] = Form.useForm();
  const handleChange = (e) => {
    setModeSelectShow(modeList.includes(e) ? true : false);
  };

  const onValuesChange = (changedFields, allFields) => {
    // 字符改变时
    props.setMenuConfig({
      ...allFields,
    });
  };

  useEffect(() => {
    // 初始化
    props.setMenuConfig({
      ...form.getFieldsValue(),
    });

    const objInit = JSON.parse(window.localStorage.getItem('menuConfig')) || {}; // 预览时存入的数据
    if (Object.keys(objInit).length > 0) {
      form.setFieldsValue({ ...objInit });
    }
    setModeSelectShow(
      modeList.includes(form.getFieldValue('mode')) ? true : false,
    );
  }, []);

  return (
    <Form
      name="basic"
      labelCol={{ span: 10 }}
      className="config-panel__form"
      initialValues={formData}
      form={form}
      onValuesChange={onValuesChange}
      ref={ref}
    >
      <Form.Item label="形态" name="mode">
        <Select onChange={(e) => handleChange(e)}>
          (
          {selectList.mode.map((e, i) => (
            <Select.Option value={e.value} key={i}>
              {e.label}
            </Select.Option>
          ))}
          )
        </Select>
      </Form.Item>
      {/*
      {modeSelectShow ? (
        <> */}
      <Form.Item label="类型" name="type">
        <Select>
          (
          {selectList.type.map((e, i) => (
            <Select.Option value={e.value} key={i}>
              {e.label}
            </Select.Option>
          ))}
          )
        </Select>
      </Form.Item>
      {/* </>
      ) : (
        <></>
      )} */}

      <Form.Item label="侧边栏风格" name="theme1">
        <Select>
          (
          {selectList.theme.map((e, i) => (
            <Select.Option value={e.value} key={i}>
              {e.label}
            </Select.Option>
          ))}
          )
        </Select>
      </Form.Item>

      <Form.Item label="顶部菜单风格" name="theme2">
        <Select>
          (
          {selectList.theme.map((e, i) => (
            <Select.Option value={e.value} key={i}>
              {e.label}
            </Select.Option>
          ))}
          )
        </Select>
      </Form.Item>
    </Form>
  );
});

export default menuConfig;
