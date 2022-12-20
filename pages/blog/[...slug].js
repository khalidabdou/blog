import PageTitle from '@/components/PageTitle'
import SyntaxHighlighter from 'react-syntax-highlighter'
import ReactHtmlParser, { domToReact } from 'html-react-parser'

import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import queries from 'pages/api/queries'
const DEFAULT_LAYOUT = 'PostLayout'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import Pre from '@/components/Pre'
import { PageSEO } from '@/components/SEO'
import { description } from '@/data/siteMetadata'
import Buy from '@/components/buy'

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
  const { content, title, introduction } = params
  const options = {
    replace: ({ attribs, children }) => {
      if (!attribs) {
        return
      }

      //if attribs.class start with ''
      if (attribs.class && attribs.class.startsWith('language')) {
        return (
          <Pre>
            <SyntaxHighlighter language="javascript" style={darcula}>
              {domToReact(children)}
            </SyntaxHighlighter>
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
              <h1 className="title mb-2">{title}</h1>
            </header>

            <h4 className="title mb-2 mt-2"> {introduction}</h4>
            {ReactHtmlParser(content, options)}
          </div>
          <hr />
        </article>
        <p>
          Hi there! I'm Abdellah Khalid, and I'm the creator of this site. I love sharing my
          knowledge and experience with others, and I'm grateful that you've stopped by to take a
          look. If you've found my site helpful and would like to support me in my efforts, please
          consider buying me a coffee. Your contribution helps me to keep this site up and running,
          and allows me to continue sharing valuable information and resources with others. Thank
          you for your support!
        </p>
        <Buy />
      </div>
    </>
  )
}
