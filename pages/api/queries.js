import http from './http'
import { API } from './api'
import axios from 'axios'

import { Articles, Article, CreactEmail } from './GraphQl'

class queries {
  async getArticles(offset) {
    return await axios.post(API + '/graphql', { query: Articles(offset) })
  }

  async getArticle(slug) {
    //const reformatId=id.replace('-',' ')
    //console.log(reformatId);
    return axios.post(API + '/graphql', { query: Article(slug) })
  }

  async creactEmail(email) {
    return axios.post('https://strapi.khalidabdellah.com/graphql', { query: CreactEmail(email) })
  }
}

export default new queries()
