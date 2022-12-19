export const Articles = (offset) =>
  `query Articles {
    articles(pagination: { limit: 5 ,start : ` +
  offset +
  `}) {
      data {
        id
        attributes {
          title
          introduction
          slug
          publishedAt
          image {
            data {
              id
              attributes{
                url
              }
            }
          }          
        }
      }
      meta {
        pagination {
          page
          pageSize
          total
          pageCount
        }
      }
    }
  }`

export const Article = (slug) => {
  return (
    `query Articles {
      articles (filters:{slug:{eq:"` +
    slug +
    `"}}) {
        data {
          id
    
          attributes {
            title
            introduction
            content
            slug
            publishedAt
            users_permissions_user {
              data{
                attributes{
                  username
                  profile
                }
              }
            }
           
          }
        }
      }
    } `
  )
}

export const CreactEmail = (email) => {
  return (
    `mutation createEmail{
      createEmail(data: { email: "` +
    email +
    `"}) {
        data {
          id
          attributes {
            email
          }
        }
      }
    }`
  )
}
