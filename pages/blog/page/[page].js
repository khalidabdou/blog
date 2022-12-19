import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'

import ListLayout from '@/layouts/ListLayout'
import { POSTS_PER_PAGE } from '../../blog'
import queries from '../../api/queries'

// export async function getStaticPaths() {
//   const totalPosts = await getAllFilesFrontMatter('blog')
//   const totalPages = Math.ceil(totalPosts.length / POSTS_PER_PAGE)
//   const paths = Array.from({ length: totalPages }, (_, i) => ({
//     params: { page: (i + 1).toString() },
//   }))

//   return {
//     paths,
//     fallback: false,
//   }
// }

export const getServerSideProps = async (context) => {
  //const posts = await getAllFilesFrontMatter('blog')
  var { page } = context.query
  console.log(page)
  let posts = null

  var offset = 5 * parseInt(page - 1)
  console.log('offset ' + offset)
  const response = (await queries.getArticles(offset)).data

  posts = await response.data.articles.data
  var paginationMeta = response.data.articles.meta.pagination

  let pageNumber = parseInt(0)
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  console.log(paginationMeta)
  var pagination = {
    currentPage: page,
    totalPages: paginationMeta.pageCount,
  }

  return {
    props: {
      posts,
      initialDisplayPosts,
      pagination,
    },
  }
}

// export async function getStaticProps(context) {
//   const {
//     params: { page },
//   } = context
//   const posts = await getAllFilesFrontMatter('blog')
//   const pageNumber = parseInt(page)
//   const initialDisplayPosts = posts.slice(
//     POSTS_PER_PAGE * (pageNumber - 1),
//     POSTS_PER_PAGE * pageNumber
//   )
//   const pagination = {
//     currentPage: pageNumber,
//     totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
//   }

//   return {
//     props: {
//       posts,
//       initialDisplayPosts,
//       pagination,
//     },
//   }
// }

export default function PostPage({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  )
}
