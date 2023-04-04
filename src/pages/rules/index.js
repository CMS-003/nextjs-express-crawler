import ruleService from "src/services/rule";

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
  return (<div>
    <h3>records: {total}</h3>
    {rules.map(rule => (<div key={rule.id}>{rule.title}</div>))}
  </div>);
}