/*
 * @Descripttion: 
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-16 16:39:48
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-23 10:51:44
 */
import React, { useEffect } from 'react'
import { Space, Button, Radio } from 'antd'
import { useDesigner, TextWidget } from '@designable/react'
import { GlobalRegistry } from '@designable/core'
import { observer } from '@formily/react'
// import { loadInitialSchema, saveSchema } from '../utils'
import { Engine } from '@designable/core'
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable/formily-transformer'


export const ActionsWidget = observer(() => {
  const designer = useDesigner() || Engine

  useEffect(() => {
    // 初始化
    designer.setCurrentTree(
      transformToTreeNode(JSON.parse(localStorage.getItem('formily-schema')))
    )
  }, [])

  const supportLocales = ['zh-cn', 'en-us', 'ko-kr']

  useEffect(() => {
    if (!supportLocales.includes(GlobalRegistry.getDesignerLanguage())) {
      GlobalRegistry.setDesignerLanguage('zh-cn')
    }
  }, [])
  return (
    <Space style={{ marginRight: 10 }}>
      {/* <Button href="https://designable-fusion.formilyjs.org">
        Alibaba Fusion
      </Button> */}
      <Radio.Group
        value={GlobalRegistry.getDesignerLanguage()}
        optionType="button"
        options={[
          { label: 'English', value: 'en-us' },
          { label: '简体中文', value: 'zh-cn' },
          // { label: '한국어', value: 'ko-kr' },
        ]}
        onChange={(e) => {
          GlobalRegistry.setDesignerLanguage(e.target.value)
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          const schemaJsonStr = JSON.stringify(transformToSchema(designer.getCurrentTree()))
          localStorage.setItem('formily-schema', schemaJsonStr)
        }}
      >
        <TextWidget>Save</TextWidget>
      </Button>
      {/* <Button
        type="primary"
        onClick={() => {
          saveSchema(designer)
        }}
      >
        <TextWidget>Publish</TextWidget>
      </Button> */}
    </Space>
  )
})