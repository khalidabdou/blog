import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import queries from './api/queries'

export const POSTS_PER_PAGE = 5

// export async function getStaticProps() {
//   const posts = await getAllFilesFrontMatter('blog')
//   const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
//   const pagination = {
//     currentPage: 1,
//     totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
//   }

//   return { props: { initialDisplayPosts, posts, pagination } }
// }

export const getServerSideProps = async () => {
  //const posts = await getAllFilesFrontMatter('blog')
  let posts = null
  const response = (await queries.getArticles(0)).data

  posts = await response.data.articles.data

  console.log(posts)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return { props: { initialDisplayPosts, posts, pagination } }
}

export default function Blog({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  )
}
