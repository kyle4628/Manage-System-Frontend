import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      user_id: localStorage.getItem('user_id')
    }
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      user_id: localStorage.getItem('user_id')
    }
  })
}

export function queryTagList() {
  return request({
    url: '/query/get_tag_list',
    method: 'post',
    baseURL: 'http://localhost:57680',
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  })
}

export function queryPlaceInfoList() {
  return request({
    url: '/query/get_place_info',
    method: 'post',
    baseURL: 'http://localhost:57680',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      user_id: localStorage.getItem('user_id')
    }
  })
}

export function queryPlaceSelectoin() {
  return request({
    url: '/query/get_place_selection',
    method: 'post',
    baseURL: 'http://localhost:57680'
  })
}

export function queryTagSelectoin() {
  return request({
    url: '/query/get_tag_selection',
    method: 'post',
    baseURL: 'http://localhost:57680'
  })
}

export function testPlaceList() {
  return request({
    url: '/query/get_place_list',
    method: 'post',
    baseURL: 'http://localhost:57680',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      user_id: localStorage.getItem('user_id')
    }
  })
}

export function createMember(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data,
    baseURL: 'http://localhost:57680'
    // headers: {
    //   Authorization: 'Bearer ' + localStorage.getItem('token'),
    //   user_id: localStorage.getItem('user_id')
    // }
  })
}

export function createList(data) {
  return request({
    url: '/user/create_list',
    method: 'post',
    data,
    baseURL: 'http://localhost:57680',
    headers: {
      session_id: 1
    }
  })
}

export function updateMember(data) {
  return request({
    url: '/query/update_member',
    method: 'post',
    data,
    baseURL: 'http://localhost:57680'
    // headers: {
    //   Authorization: 'Bearer ' + localStorage.getItem('token'),
    //   user_id: localStorage.getItem('user_id')
    // }
  })
}

export function updatePlaceList(data) {
  return request({
    url: '/query/update_placelist',
    method: 'post',
    data,
    baseURL: 'http://localhost:57680',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      user_id: localStorage.getItem('user_id')
    }
  })
}
