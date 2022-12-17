import PageTitle from '@/components/PageTitle'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
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
  const { content } = params

  return (
    <>
      {
        <MDXLayoutRenderer
          layout={content.layout || DEFAULT_LAYOUT}
          mdxSource={content}
          frontMatter={content}
          prev={1}
          next={10}
        />
      }
    </>
  )
}
