import _ from 'lodash'
import React, { useState, useCallback, useRef } from 'react';
import { useEffectOnce } from 'react-use';
import { Button, Space, Table, notification, Popconfirm, Modal, Select, Input, Form, } from 'antd';
import { EditTwoTone, DeleteTwoTone, RocketTwoTone, ReloadOutlined } from '@ant-design/icons'
import ruleService from "~/services/rule";
import { Observer, useLocalObservable, } from 'mobx-react-lite';
import RuleEdit from "fe/modules/rule/edit";
import apis from 'fe/apis'
import { Wrap } from '@/component'
import { match } from 'path-to-regexp'
import { parse } from 'url'

const RuleStatus = {
  0: { text: '开发中', color: 'blue' },
  1: { text: "使用中", color: 'green' },
  2: { text: "已废弃", color: "red" },
  3: { text: "待上线", color: "#cad100" },
}

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
  const [isChrome, setIsCrome] = useState(false);
  const local = useLocalObservable(() => ({
    tempData: {},
    rules,
    page: 1,
    limit: 20,
    matchURL: {
      open: false,
      loading: false,
      url: '',
      matched_rule_id: '',
      params: null,
      isComposition: false,
    }
  }))
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffectOnce(() => {
    setIsCrome(window.navigator.userAgent.includes('Chrome'))
  })
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
  function openMatch() {
    local.matchURL.matched_rule_id = '';
    local.matchURL.url = '';
    local.matchURL.open = true;
    local.matchURL.isComposition = false;
    local.matchURL.params = null;
  }
  function closeMatch() {
    local.matchURL.params = null;
    local.matchURL.open = false;
  }
  const onCrawl = useCallback(async () => {
    local.matchURL.loading = true
    try {
      const result = await apis.patchRule(local.matchURL.matched_rule_id, { url: local.matchURL.url, params: local.matchURL.params })
      console.log(result)
      local.matchURL.open = false
    } catch (e) {

    } finally {
      local.matchURL.loading = false;
    }
  })
  const matchUrl = useCallback((link) => {
    const uri = parse(link)
    let found = null;
    const origin = `${uri.protocol}//${uri.host}`;
    for (let i = 0; i < local.rules.length; i++) {
      const rule = local.rules[i];
      for (let j = 0; j < rule.urls.length; j++) {
        const url = rule.urls[j];
        const path = parse(url).pathname
        if (url.startsWith(origin)) {
          const fn = match(path, { decode: decodeURIComponent })
          const result = fn(uri.pathname)
          if (result) {
            found = result.params;
            local.matchURL.matched_rule_id = rule._id;
            local.matchURL.params = result.params
            break;
          }
        }
      }
      if (found) {
        break;
      }
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
      render: (status) => <span style={{ color: RuleStatus[status].color }} >{RuleStatus[status].text}</span>
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
        <Button type="primary" onClick={() => { local.tempData = {}; setIsModalOpen(true) }}>添加</Button>
        <Button type='primary' icon={<RocketTwoTone twoToneColor="#fe584e" />} onClick={openMatch}>抓取</Button>
        <Button type="primary">
          <ReloadOutlined onClick={() => getRules()} color="#blue" />
        </Button>
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
    <Table columns={columns} dataSource={local.rules} rowKey="_id" />
    <Modal
      open={local.matchURL.open}
      footer={<Space>
        <Button onClick={closeMatch}>取消</Button>
        <Button
          loading={local.matchURL.loading}
          type="primary"
          disabled={local.matchURL.matched_rule_id === ''}
          onClick={onCrawl}
        >抓取</Button>
      </Space>}
      onCancel={closeMatch}
    >
      <Form>
        <Form.Item label="规则" labelCol={{ span: 4 }} style={{ marginTop: 24 }} >
          <Select disabled value={local.matchURL.matched_rule_id}>
            <Select.Option value="">无</Select.Option>
            {local.rules.map(rule => (<Select.Option key={rule._id} value={rule._id}>{rule.name}</Select.Option>))}
          </Select>
        </Form.Item>
        <Form.Item label="地址" labelCol={{ span: 4 }}>
          {local.matchURL.open && <Input
            onPaste={(e) => {
              matchUrl(e.target.value)
            }}
            onChange={(e) => {
              if (!local.matchURL.isComposition) {
                matchUrl(e.target.value)
              }
            }}
            onCompositionStart={() => {
              local.matchURL.isComposition = true
            }}
            onCompositionEnd={(e) => {
              local.matchURL.isComposition = false
              matchUrl(e.target.value)
            }} />}

        </Form.Item>
      </Form>
    </Modal>
  </div>)
  }</Observer >;
}