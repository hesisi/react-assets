/*
 * @Descripttion:
 * @version:
 * @Author: hesisi
 * @Date: 2022-06-16 15:29:56
 * @LastEditors: hesisi
 * @LastEditTime: 2022-07-21 14:31:27
 */
import 'antd/dist/antd.less';
import Style from './index.less';
import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  Designer, //设计器根组件，主要用于下发上下文
  DesignerToolsWidget, //画板工具挂件
  ViewToolsWidget, //视图切换工具挂件
  Workspace, //工作区组件，核心组件，用于管理工作区内的拖拽行为，树节点数据等等...
  OutlineTreeWidget, //大纲树组件，它会自动识别当前工作区，展示出工作区内树节点
  ResourceWidget, //拖拽源挂件
  HistoryWidget, //历史记录挂件
  StudioPanel, //主布局面板
  CompositePanel, //左侧组合布局面板
  WorkspacePanel, //工作区布局面板
  ToolbarPanel, //工具栏布局面板
  ViewportPanel, //视口布局面板
  ViewPanel, //视图布局面板
  SettingsPanel, //右侧配置表单布局面板
  ComponentTreeWidget, //组件树渲染器
} from '@designable/react';
import { SettingsForm } from '@designable/react-settings-form';
import {
  createDesigner,
  GlobalRegistry,
  Shortcut,
  KeyCode,
} from '@designable/core';
import {
  LogoWidget,
  ActionsWidget,
  PreviewWidget,
  SchemaEditorWidget,
  MarkupSchemaWidget,
} from './widgets';
// import { saveSchema } from '@/service'
import {
  Form,
  Field,
  Input,
  Select,
  TreeSelect,
  Cascader,
  Radio,
  Checkbox,
  Slider,
  Rate,
  NumberPicker,
  Transfer,
  Password,
  DatePicker,
  TimePicker,
  Upload,
  Switch,
  Text,
  Card,
  ArrayCards,
  ObjectContainer,
  ArrayTable,
  Space,
  FormTab,
  FormCollapse,
  FormLayout,
  FormGrid,
  Custom, // 自定义组件
} from './src';

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Layouts: '布局组件',
      Arrays: '自增组件',
      Displays: '展示组件',
      CustomComponents: '自定义组件',
    },
  },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Layouts: 'Layouts',
      Arrays: 'Arrays',
      Displays: 'Displays',
      CustomComponents: 'CustomComponents',
    },
  },
});

const FormDesigner = (props) => {
  const { type = 'form', getDesigner, onSave, saveDis } = props;

  const [inputsSource, setInputsSource] = useState([]);
  const [layoutsSource, setLayoutsSource] = useState([
    Card,
    FormGrid,
    FormTab,
    FormLayout,
    FormCollapse,
    Space,
  ]);
  const [arraysSource, setArraysSource] = useState([]);

  const engine = useMemo(
    () =>
      createDesigner({
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {
              // saveSchema(ctx.engine)
              // 调用保存借口
              console.log('ctx.engine:', ctx.engine);
            },
          }),
        ],
        rootComponentName: 'Form',
      }),
    [],
  );
  useEffect(() => {
    if (type === 'form') {
      // 可输入控件的配置
      setInputsSource([
        Input,
        Password,
        NumberPicker,
        Rate,
        Slider,
        Select,
        TreeSelect,
        Cascader,
        Transfer,
        Checkbox,
        Radio,
        DatePicker,
        TimePicker,
        Upload,
        Switch,
        ObjectContainer,
      ]);
    } else {
      setInputsSource([
        Input,
        NumberPicker,
        Rate,
        Slider,
        Select,
        TreeSelect,
        Cascader,
        Checkbox,
        Radio,
        DatePicker,
        TimePicker,
        Switch,
      ]);
    }
  }, [type]);

  return (
    <Designer engine={engine}>
      <StudioPanel
        // logo={<LogoWidget />}
        actions={
          <ActionsWidget
            type={type}
            getDesigner={getDesigner}
            onSave={onSave}
            saveDis={saveDis}
          />
        }
      >
        <CompositePanel>
          <CompositePanel.Item title="panels.Component" icon="Component">
            {/* 可输入控件 */}
            <ResourceWidget title="sources.Inputs" sources={inputsSource} />
            {/* 布局组件 */}
            <ResourceWidget title="sources.Layouts" sources={layoutsSource} />
            {/* 自增组件 */}
            {type === 'form' && (
              <ResourceWidget
                title="sources.Arrays"
                sources={[ArrayCards, ArrayTable]}
              />
            )}

            {/* 展示组件 */}
            {type === 'form' && (
              <ResourceWidget title="sources.Displays" sources={[Text]} />
            )}

            {/* 自定义组件 */}
            <ResourceWidget
              title="sources.CustomComponents"
              sources={[Custom]}
            />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
            <OutlineTreeWidget />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.History" icon="History">
            <HistoryWidget />
          </CompositePanel.Item>
        </CompositePanel>

        <Workspace id="form">
          <WorkspacePanel>
            {/* 工具栏 */}
            <ToolbarPanel>
              <DesignerToolsWidget />
              <ViewToolsWidget
                use={['DESIGNABLE', 'JSONTREE', 'MARKUP', 'PREVIEW']}
              />
            </ToolbarPanel>

            <ViewportPanel>
              {/* 设计器模式 */}
              <ViewPanel type="DESIGNABLE">
                {() => (
                  <ComponentTreeWidget
                    components={{
                      Form,
                      Field,
                      Input,
                      Select,
                      TreeSelect,
                      Cascader,
                      Radio,
                      Checkbox,
                      Slider,
                      Rate,
                      NumberPicker,
                      Transfer,
                      Password,
                      DatePicker,
                      TimePicker,
                      Upload,
                      Switch,
                      Text,
                      Card,
                      ArrayCards,
                      ArrayTable,
                      Space,
                      FormTab,
                      FormCollapse,
                      FormGrid,
                      FormLayout,
                      ObjectContainer,
                      Custom,
                    }}
                  />
                )}
              </ViewPanel>

              {/* JOSN TREE模式 */}
              <ViewPanel type="JSONTREE" scrollable={false}>
                {(tree, onChange) => (
                  <SchemaEditorWidget tree={tree} onChange={onChange} />
                )}
              </ViewPanel>

              {/* MARKUP 模式*/}
              <ViewPanel type="MARKUP" scrollable={false}>
                {(tree, onChange) => (
                  <MarkupSchemaWidget tree={tree} onChange={onChange} />
                )}
              </ViewPanel>

              {/* 预览模式 */}
              <ViewPanel type="PREVIEW">
                {(tree) => <PreviewWidget tree={tree} />}
              </ViewPanel>
            </ViewportPanel>
          </WorkspacePanel>
        </Workspace>
        <SettingsPanel title="panels.PropertySettings">
          <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
        </SettingsPanel>
      </StudioPanel>
    </Designer>
  );
};

export default FormDesigner;
