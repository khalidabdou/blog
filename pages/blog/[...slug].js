import PageTitle from '@/components/PageTitle'
import SyntaxHighlighter from 'react-syntax-highlighter'
import ReactHtmlParser, { domToReact } from 'html-react-parser'
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import queries from 'pages/api/queries'
const DEFAULT_LAYOUT = 'PostLayout'

// export async function getStaticPaths() {
//   const posts = getFiles('blog')
//   return {
//     paths: posts.map((p) => ({
//       params: {
//         slug: formatSlug(p).split('/'),
//       },
//     })),
//     fallback: false,
//   }
// }

// export async function getStaticProps({ params }) {
//   const allPosts = await getAllFilesFrontMatter('blog')
//   const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
//   const prev = allPosts[postIndex + 1] || null
//   const next = allPosts[postIndex - 1] || null
//   const post = await getFileBySlug('blog', params.slug.join('/'))
//   const authorList = post.frontMatter.authors || ['default']
//   const authorPromise = authorList.map(async (author) => {
//     const authorResults = await getFileBySlug('authors', [author])
//     return authorResults.frontMatter
//   })
//   const authorDetails = await Promise.all(authorPromise)

//   // rss
//   if (allPosts.length > 0) {
//     const rss = generateRss(allPosts)
//     fs.writeFileSync('./public/feed.xml', rss)
//   }

//   return { props: { post, authorDetails, prev, next } }
// }

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
  console.log(params)
  const { content, title } = params
  const options = {
    replace: ({ attribs, children }) => {
      if (!attribs) {
        return
      }

      //if attribs.class start with ''
      if (attribs.class && attribs.class.startsWith('language')) {
        return (
          <SyntaxHighlighter
            language=""
            style={dark}
            showLineNumbers={true}
            className={'mt-4 mb-4'}
            lineProps={''}
          >
            {domToReact(children)}
          </SyntaxHighlighter>
        )
      }
      //check if tag is image
    },
  }
  return (
    <>
      <div className="main-wrapper p-4 text-start">
        <article className="blog-post p-md-5 px-3 py-5">
          <div className="single-col-max-width container">
            <header className="blog-post-header">
              <h1 className="title mb-2">{title}</h1>
            </header>
            {ReactHtmlParser(content, options)}
          </div>
          <hr />
        </article>
      </div>
    </>
  )
}
