import _ from 'lodash'
import React, { useState } from 'react';
import { Button, Modal, Input, Form, Select, Radio } from 'antd';
import { Observer, useLocalStore } from 'mobx-react-lite';

const Item = Form.Item;

export default function RuleEdit({ data, cancel, save }) {
  console.log(data, '?')
  const local = useLocalStore(() => ({
    data: data.id ? _.cloneDeep(data) : { tags: [], types: [], poster: '', urls: [], open: false, status: 'finished' },
    loading: false,
    ref: '',
    poster: data.poster || '',
    maps: [],
    tagAddVisible: false,
    typeAddVisible: false,
    urlAddVisible: false,
    tempTag: '',
    tempType: '',
    tempUrl: '',
  }))
  return <Observer>{() => (<div>
    <h3>records: {total}</h3>
    <Link href={"/rules/create"}>添加规则</Link>
    <Button type="primary" onClick={() => { setIsModalOpen(true) }}>添加</Button>

    <Modal title="编辑"
      open={true}
      okText="确定"
      cancelText="取消"
      onOk={() => {
        save(local.data);
      }}
      onCancel={() => {
        cancel();
      }}>
      <Form>
        <Item label="唯一标志" labelCol={{ span: 3 }}>
          <Input disabled={!!local.data._id} onChange={e => local.data._id = e.target.value} />
        </Item>
        <Item label="名称" labelCol={{ span: 3 }}>
          <Input value={local.data.title} autoFocus onChange={e => local.data.title = e.target.value} />
        </Item>
        <Item label="描述" labelCol={{ span: 3 }}>
          <Input />
        </Item>
        <Item>
          <Item label="规则类型" labelCol={{ span: 3 }}>
            <Select defaultValue={local.data.type} onChange={v => {
              local.data.type = v;
            }}>
              <Select.Option key="single" value="single">单页</Select.Option>
              <Select.Option key="pagination" value="pagination">单页</Select.Option>
            </Select>
          </Item>
          <Item label="状态" labelCol={{ span: 3 }}>
            <Radio.Group name="status" defaultValue={local.data.status} onChange={v => {
              local.data.status = v;
            }}>
              <Radio value={0}>已创建</Radio>
              <Radio value={1}>运行中</Radio>
              <Radio value={2}>已废弃</Radio>
              <Radio value={3}>等待中</Radio>
            </Radio.Group>
          </Item>
        </Item>
        <Item label="匹配规则" labelCol={{ span: 3 }}>

        </Item>
      </Form>
    </Modal>
    {rules.map(rule => (<div key={rule.id}>{rule.title}</div>))}
  </div>)}</Observer>;
}