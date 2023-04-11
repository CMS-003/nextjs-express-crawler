import _ from 'lodash'
import React, { useState, useCallback } from 'react';
import { Button, Modal, Input, Form, Select, Radio, Space, Table, Tag, notification, Popconfirm, Divider } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import ruleService from "~/services/rule";
import { Observer, useLocalObservable, } from 'mobx-react-lite';
import RuleEdit from "fe/modules/rule/edit";
import apis from 'fe/apis'
import { Wrap } from 'fe/component'

const Item = Form.Item;

export const getStaticProps = async (ctx) => {
  const result = await ruleService.getRules();
  return {
    props: {
      total: result.total,
      rules: result.items,
    },
    revalidate: 60 * 60 * 30,
  };
};

export default function RulePage(props) {
  const { rules, total } = props;
  const local = useLocalObservable(() => ({
    tempData: {},
    rules,
    page: 1,
    limit: 20,
  }))
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editData = useCallback(async (data) => {
    local.tempData = data;
    setIsModalOpen(true);
  })
  const getRules = useCallback(async () => {
    const result = await apis.getRules({ page: local.page, limit: local.limit })
    if (result.code === 0) {
      local.rules = result.data.items;
    } else {
      notification.error({ message: '获取数据失败' })
    }
  })
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: "_id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: '_id',
      dataIndex: '_id',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: '_id',
    },
    {
      title: '匹配规则',
      key: 'matches',
      dataIndex: '_id',
      render: (_, { urls }) => (
        <>
          {urls.map((url, i) => {
            return (
              <p key={i}>{url}</p>
            );
          })}
        </>
      ),
    },
    {
      title: '操作',
      key: '_id',
      render: (_, record) => (
        <Space size="middle">
          <EditTwoTone onClick={() => {
            editData(record);
          }} />
          <Popconfirm
            title="提示"
            description="确定要删除吗?"
            onConfirm={async () => {
              try {
                await apis.destroyRule(record)
                await getRules()
              } catch (e) {
                notification.error({ message: '删除失败' })
              }
            }}
            okText="确认"
            cancelText="取消"
          >
            <DeleteTwoTone />
          </Popconfirm>
        </Space>
      ),
    },
  ]
  return <Observer>{() => (<div>
    <Wrap size="middle">
      <Space size={"small"}>
        <Button type="primary" onClick={() => getRules()}>查询</Button>
        <Button type="primary" onClick={() => { local.tempData = {}; setIsModalOpen(true) }}>添加</Button>
      </Space>
    </Wrap>
    {isModalOpen && <RuleEdit cancel={() => setIsModalOpen(false)} data={local.tempData} save={async (data) => {
      const result = local.tempData._id ? await apis.updateRule(local.tempData._id, data) : await apis.createRule(data)
      if (result.code === 0) {
        notification.info({ message: '保存成功' });
        setIsModalOpen(false);
      } else {
        notification.warning({ message: result.message })
      }
    }} />}
    <Table columns={columns} dataSource={local.rules} rowKey="_id" pagination={{ position: ['bottomRight'] }} />
  </div>)}</Observer>;
}