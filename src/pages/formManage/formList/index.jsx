/*
 * @Descripttion: 
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-06-23 14:12:11
 */
import { Table, Button, message } from 'antd';
import { PreviewWidget } from '../formDesinger/widgets/PreviewWidget'
import { useEffect, useRef,useState } from 'react'
import {
	transformToTreeNode,
} from '@designable/formily-transformer'


export default function IndexPage() {
	const tree = transformToTreeNode(JSON.parse(localStorage.getItem('formily-schema')))
	console.log("====tree:",tree)
	
	const formRef = useRef(null)
	const [form, setForm] = useState(null)

	useEffect(() => {
		setForm(formRef.current.form)
		// console.log("===form:",formRef.current.form)
	}, [])

	const handleValidate = () => {
		// formRef.current.form.validate();
		form.validate()
	}

	const handleReset = () => {
		// form.reset();
		form.values = {}
	}

	const handleGetValues = () => {
		const values = form.values;
		message.info(`表单的值为: ${JSON.stringify(values)}`)
	}

	const handleAssign = () => {
		const initValue = {
			userName: '张三',
			description: '这是描述内容XXXXX',
			password: '123456',
			rate: 3,
			type: '2',
			time: '09:23:18',
			test1: {
				value1: 'value1',
				value2: 'value2',
				value3: 'value3',
			},
			test2: {
				value1: 'value1',
				value2: 'value2',
				value3: 'value3',
			},
		}

		form.values = initValue
	}

	const handleReadOnly = () => {
		form.disabled = true
	}

	const handlePreview = () => {
		form.editable = false
	}

	const handleSetFieldValue = () => {
		// form.setValues('userName', 'zhangsan')
		form.values.userName = 'username'
	}

	


	return (
		<div>
			<div style={{margin: "10px 0"}}>
				{/* 校验按钮 */}
				<Button type="primary" style={{margin: '0 10px'}} onClick={handleValidate}>校验</Button>
				{/* 清空按钮 */}
				<Button type="primary" style={{margin: '0 10px'}} onClick={handleReset}>清空</Button>
				{/* 赋值按钮 */}
				<Button type="primary" style={{margin: '0 10px'}} onClick={handleAssign}>赋值</Button>
				{/* 禁用按钮 */}
				<Button type="primary" style={{margin: '0 10px'}} onClick={handleReadOnly}>禁用</Button>
				{/*  */}
				<Button type="primary" style={{margin: '0 10px'}} onClick={handlePreview}>预览模式</Button>
				{/* 获取值 */}
				<Button type="primary" style={{margin: '0 10px'}} onClick={handleGetValues}>获取值</Button>
				{/* 设置username字段 */}
				<Button type="primary" style={{margin: '0 10px'}} onClick={handleSetFieldValue}>setFiledValue</Button>
			</div>

			<PreviewWidget 
				tree={tree} 
				ref={formRef}
				// slot={{
				// 	Custom: 
				// }}
			/>
		</div>
	);
}
