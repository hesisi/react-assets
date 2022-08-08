/*
 * @Descripttion: 
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-08-03 14:59:15
 */
import { Col, Row, Table, Form, Input, Button, Space, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'umi';
// import { initFormListData } from './dataJson'
import { getUUID } from '@/utils/utils.js'
import moment from 'moment'
import { timeFormat } from '@/utils/constants.js'
import { cloneDeep } from 'lodash'
import Styles from './index.less'

const { TextArea } = Input;

const initFormInfo = {
	formName: '',
	formDesc: '',
	formCode: '',
	createName: '',
	createCode: '',
	createTime: '',
	updateTime: ''
}
export default function FormList() {
	const [dataSource, setDataSource] = useState([])
	const [visible, setVisible] = useState(false)
	const [operateType, setOperateType] = useState('add')  // 区分新建还是编辑表单
	const [formInfo, setFormInfo] = useState(initFormInfo)
	const history = useHistory()

	const columns = [
		{
			title: '表单名称',
			dataIndex: 'formName',
			key: 'formName',
			render: (text, record) => <a onClick={() => handleShowDesigner(record)}>{text}</a>,
		},
		{
			title: '描述',
			dataIndex: 'formDesc',
			key: 'formDesc',
		},
		{
			title: '表单code',
			dataIndex: 'formCode',
			key: 'formCode',
		},
		{
			title: '创建人名称',
			dataIndex: 'createName',
			key: 'createName',
		},
		{
			title: '创建人code',
			dataIndex: 'createCode',
			key: 'createCode',
		},
		{
			title: '创建时间',
			dataIndex: 'createTime',
			key: 'createTime',
		},
		{
			title: '修改时间',
			dataIndex: 'updateTime',
			key: 'updateTime',
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<Space size="middle">
					<a onClick={() => handleDelete(record)}>删除</a>
					<a onClick={() => handleUpdate(record)}>修改</a>
					<a onClick={() => handlePreview(record)}>预览</a>
				</Space>
			),
		},
	];

	useEffect(() => {
		// 初始化dataSource
		getFormList()
	}, [])

	// 获取formList
	const getFormList = () => {
		const data = localStorage.getItem("formList") && JSON.parse(localStorage.getItem("formList")) || []
		setDataSource(data);
	}

	// 保存至缓存中
	const saveFormList = (data) => {
		data && localStorage.setItem("formList", JSON.stringify(data))
	}

	// 删除
	const handleDelete = (record) => {
		Modal.confirm({
			title: '确定要删除吗',
			content: '该操作不可逆，请谨慎操作！',
			onOk: () => {
				const data = dataSource.filter(item => item.formCode !== record.formCode)
				setDataSource(data)
				saveFormList(data)
			}
		});

	}

	// 修改
	const handleUpdate = (record) => {
		setOperateType("update")
		setVisible(true)
		setFormInfo(record)
	}

	// 预览
	const handlePreview = (record) => {
		// 页面跳转方法
		history.push({pathname: '/formManage/formPreview', search: `formCode=${record.formCode}`})
	}

	const onChange = (value) => {
		setFormInfo({
			...formInfo,
			...value
		})
	}

	const handleOk = () => {
		const currentTime = moment().format(timeFormat)
		if (operateType === "add") {
			const item = {
				formName: formInfo.formName,
				formDesc: formInfo.formDesc,
				formCode: getUUID(),
				createName: 'admin',
				createCode: 'admin',
				createTime: currentTime,
				updateTime: currentTime
			}

			const data = cloneDeep(dataSource)
			data.push(item)
			setDataSource(data)
			saveFormList(data)
		} else {
			const item = {
				...formInfo,
				createName: 'admin',
				createCode: 'admin',
				updateTime: currentTime
			}
			const data = dataSource && dataSource.map(i => {
				if (i.formCode === formInfo.formCode) {
					i = item
				}
				return i
			})
			setDataSource(data)
			saveFormList(data)
		}

		setVisible(false)
		// 清空
		setFormInfo(initFormInfo)
	}

	const handleCancel = () => {
		setVisible(false)
		// 清空
		setFormInfo(initFormInfo)
	}

	const handleAdd = () => {
		setVisible(true)
		setOperateType("add")
	}

	// 点击跳转到设计器页面
	const handleShowDesigner = (record) => {
		// 页面跳转方法
		history.push({pathname: '/formManage/formAndTable', search: `formCode=${record.formCode}`})
	}

	return (
		<div style={{ padding: '20px 10px' }}>
			{/* 筛选框 */}
			<div>
				<Form
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
				>
					<Row>
						<Col span={6}>
							<Form.Item label="表单名称">
								<Input />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label="表单code">
								<Input />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label="创建人名称">
								<Input />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label="创建人code">
								<Input />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>

			{/* 操作按钮 */}
			<div className={Styles["operation-container"]}>
				<Button onClick={handleAdd}>新增</Button>
				{/* <Button>删除</Button> */}
			</div>

			{/* 列表部分 */}
			<Table columns={columns} dataSource={dataSource} />

			{/* 弹框 */}
			<Modal title={`${operateType === "add" ? "新建" : "修改"}表单`} destroyOnClose visible={visible} onOk={handleOk} onCancel={handleCancel}>
				<Form
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 20 }}
				>
					<Form.Item label="表单名称">
						<Input value={formInfo.formName} onChange={e => onChange({
							formName: e.target.value
						})} />
					</Form.Item>

					<Form.Item label="描述">
						<TextArea value={formInfo.formDesc} onChange={e => onChange({
							formDesc: e.target.value
						})} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
