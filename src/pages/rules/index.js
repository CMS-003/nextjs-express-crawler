import Link from "next/link";
import _ from 'lodash'
import React, { useState } from 'react';
import { Button, Modal, Input, Form, Select, Radio } from 'antd';
import ruleService from "services/rule";
import { Observer, useLocalStore } from 'mobx-react-lite';
import RuleEdit from "~/modules/rule/edit";

const Item = Form.Item;

export const getStaticProps = async (ctx) => {
  const result = await ruleService.getRules();
  return {
    props: {
      total: result.total,
      rules: [{ title: 'hello world', id: 1 }],
    },
    revalidate: 60 * 60 * 30,
  };
};

export default function FirstPost(props) {
  const { rules, total } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    {isModalOpen && <RuleEdit cancel={() => setIsModalOpen(false)} data={{}} save={data => {
      console.log(data, 'save');
    }} />}
    {rules.map(rule => (<div key={rule.id}>{rule.title}</div>))}
  </div>)}</Observer>;
}