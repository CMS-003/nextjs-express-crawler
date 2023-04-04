import recordService from "src/services/record";

export const getStaticProps = async (ctx) => {
  const result = await recordService.getRecords();
  return {
    props: {
      total: result.total,
      articles: [{ title: 'hello world', id: 1 }],
    },
    revalidate: 60 * 60 * 30,
  };
};

export default function FirstPost(props) {
  const { articles, total } = props;
  return (<div>
    <h1>records: {total}</h1>
    {articles.map(article => (<div key={article.id}>{article.title}</div>))}
  </div>);
}