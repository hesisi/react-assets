/*
 * @Descripttion: 第定义组件通过value接收值，以及通过onChange传递值给form
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-21 17:15:58
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-23 17:40:32
 */
import React, { useEffect, useState } from "react";
import { observer } from "@formily/reactive-react";
import { Button, Input } from 'antd'
import { createBehavior, createResource } from "@designable/core";
import { DnFC } from "@designable/react";
import { createFieldSchema, createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

interface FieldProps {
  value?: {
    value1: string
    value2: string
    value3: string
  };
  onChange?: (value: Object) => {}
}

export const Custom: DnFC<FieldProps> = observer(
  (props) => {
    const { value, children, onChange } = props
    console.log("=====props:", props)

    const [customValue, setCustomValue] = useState<{
      value1: string
      value2: string
      value3: string
    }>()  // 用props的参数初始化state

    useEffect(() => {
      setCustomValue(value)
    }, [])

    return (
      <div>
        自定义组件内容test
        {/* <Input value={customValue?.value1 || ''} onChange={e => {
          setCustomValue({
            ...customValue,
            value1: e.target.value
          })
        }} />
        <Input value={customValue?.value2 || ''} onChange={e => {
          setCustomValue({
            ...customValue,
            value2: e.target.value
          })
        }} />
        <Input value={customValue?.value3 || ''} onChange={e => {
          setCustomValue({
            ...customValue,
            value3: e.target.value
          })
        }} /> */}

        <div>{JSON.stringify(value)}</div>

        <Button onClick={() => {
          onChange && onChange({
            value1: '111',
            value2: '222',
            value3: '333'
          })
        }}>传值</Button>
      </div>
    );
  }
);

Custom.Behavior = createBehavior({
  name: "Custom",
  // extends: ['Field'],
  selector: (node) => !!node.props && node.props["x-component"] === "Custom",
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Custom),
  },
  designerLocales: AllLocales.Custom,
});

Custom.Resource = createResource({
  icon: 'CascaderSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Custom',
        'x-decorator': 'FormItem',
        'x-component': 'Custom',
      },
    },
  ],
})