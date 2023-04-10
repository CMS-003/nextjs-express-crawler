import _ from 'lodash'
import React, { useState, useRef } from 'react';
import { Button, Modal, Input, Form, Select, Radio, notification, Space } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import { Observer, useLocalStore } from 'mobx-react-lite';

const Item = Form.Item;

export default function RuleEdit({ data, cancel, save }) {
  const local = useLocalStore(() => ({
    editORadd: data._id ? 'edit' : 'add',
    data: data._id ? _.cloneDeep(data) : { type: 'single', tags: [], types: [], poster: '', urls: [], open: false, status: 0 },
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
  const urlRef = useRef(null)
  return <Observer>{() => (<div>
    <Modal title={local.editORadd === 'add' ? '添加' : "修改"}
      open={true}
      okText={local.editORadd === 'add' ? '添加' : "修改"}
      cancelText="取消"
      onOk={async () => {
        local.loading = true
        await save(local.data);
        local.loading = false;
      }}
      onCancel={() => {
        cancel();
      }}>
      <Form>
        <Item label="唯一标志:" labelCol={{ span: 4 }}>
          <Input disabled={local.editORadd === 'edit'} onChange={e => local.data._id = e.target.value} defaultValue={local.data._id} />
        </Item>
        <Item label="名称:" labelCol={{ span: 4 }}>
          <Input value={local.data.title} autoFocus onChange={e => local.data.title = e.target.value} defaultValue={local.data.name} />
        </Item>
        <Item label="描述:" labelCol={{ span: 4 }} defaultValue={local.data.desc}>
          <Input />
        </Item>
        <Item>
          <Item label="规则类型:" labelCol={{ span: 4 }}>
            <Select defaultValue={local.data.type} onChange={v => {
              local.data.type = v;
            }}>
              <Select.Option key="single" value="single">单页</Select.Option>
              <Select.Option key="pagination" value="pagination">单页</Select.Option>
            </Select>
          </Item>
          <Item label="状态:" labelCol={{ span: 4 }}>
            <Radio.Group name="status" defaultValue={local.data.status} onChange={e => {
              local.data.status = e.target.value;
            }}>
              <Radio value={0}>已创建</Radio>
              <Radio value={1}>运行中</Radio>
              <Radio value={2}>已废弃</Radio>
              <Radio value={3}>等待中</Radio>
            </Radio.Group>
          </Item>
        </Item>
        <Item label="匹配规则:" labelCol={{ span: 4 }}>
          <Space direction='vertical'>
            {local.data.urls.length === 0 && <label style={{ lineHeight: '32px' }}>暂无数据</label>}
            {local.data.urls.map((url, i) => <Input key={i} value={url} readOnly addonAfter={<CloseCircleTwoTone onClick={() => {
              local.data.urls.splice(i, 1)
            }} />} />)}
            <Input addonBefore="添加" ref={ref => urlRef.current = ref} addonAfter={<CheckCircleTwoTone onClick={() => {
              if (urlRef.current) {
                const url = urlRef.current.input.value.trim();
                if (url) {
                  local.data.urls.push(url);
                } else {
                  notification.warning({ message: '请输入有效规则' })
                }
              }
            }} />} />
          </Space>
        </Item>
      </Form>
    </Modal>
  </div>)}</Observer>;
}