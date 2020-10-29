import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function queryUser() {
  return request({
    url: '/query/get_user_list',
    method: 'post',
    baseURL: 'http://localhost:57680'
  })
}

export function userLogin(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
    baseURL: 'http://localhost:57680'
  })
}

export function userLogout() {
  return request({
    url: '/auth/logout',
    method: 'post',
    baseURL: 'http://localhost:57680'
  })
}
