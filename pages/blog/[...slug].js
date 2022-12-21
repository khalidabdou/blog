import ReactHtmlParser, { domToReact } from 'html-react-parser'
import queries from 'pages/api/queries'

import Pre from '@/components/Pre'
import { PageSEO } from '@/components/SEO'
import siteMetadata, { description } from '@/data/siteMetadata'
import CodeBlock from '@/components/prism'
import Buy from '@/components/buy'

export async function getServerSideProps(context) {
  const { slug } = context.query
  let post = null
  const response = (await queries.getArticle(slug)).data
  if (response.data.articles.data.length === 0) {
    context.res.statusCode = 404
    return {
      redirect: {
        destination: `/404`,
        permanent: true,
      },
    }
  }
  post = await response.data.articles.data[0].attributes
  //console.log(post);
  return {
    props: {
      params: post || slug,
    }, // will be passed to the page component as props
  }
}

export default function Blog({ params }) {
  //console.log(params)
  const { content, title, introduction } = params
  const options = {
    replace: ({ attribs, children }) => {
      if (!attribs) {
        return
      }

      //if attribs.class start with ''
      if (attribs.class && attribs.class.startsWith('language')) {
        //return <CodeBlock code="const foo = 'bar';" language="javascript" />
        return (
          <Pre>
            {/* <SyntaxHighlighter language="javascript" style={darcula}>
              {domToReact(children)}
            </SyntaxHighlighter> */}
            <CodeBlock code={domToReact(children)} language="javascript" />
          </Pre>
        )
      }
      //check if tag is image
    },
  }

  return (
    <>
      <PageSEO title={title} description={introduction} />
      <div className="main-wrapper p-4 text-start">
        <article className="blog-post p-md-5 px-3 py-5">
          <div className="single-col-max-width container">
            <header className="blog-post-header">
              <h1 className="title  mb-2">{title}</h1>
            </header>
            <h4 className="title mb-2 mt-2"> {introduction}</h4>
            {ReactHtmlParser(content, options)}
          </div>
          <hr />
          <p>{siteMetadata.spon}</p>
          <Buy />
        </article>
      </div>
    </>
  )
}
