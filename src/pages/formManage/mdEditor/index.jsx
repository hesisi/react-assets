/*
 * @Descripttion: 
 * @version: 
 * @Author: hesisi
 * @Date: 2022-06-13 16:09:41
 * @LastEditors: hesisi
 * @LastEditTime: 2022-07-22 10:32:09
 */
import { Table, Button, message } from 'antd';
import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';

export default function IndexPage() {
	const [value, setValue] = useState()

	const onChange = e => {
		setValue(e)
	}

	return (
		<MDEditor
			value={value}
			onChange={onChange}
		/>
	);
}
