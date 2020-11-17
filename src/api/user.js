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
    // baseURL: 'http://localhost:57680',
    baseURL: 'https://fuenml.azurewebsites.net/',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      user_id: localStorage.getItem('user_id')
    }
  })
}

export function userLogin(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    // baseURL: 'http://localhost:57680',
    baseURL: 'https://fuenml.azurewebsites.net/'
  })
}

export function userLogout() {
  return request({
    url: '/auth/logout',
    method: 'post',
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    // baseURL: 'http://localhost:57680',
    baseURL: 'https://fuenml.azurewebsites.net/'
  })
}

export function userTest() {
  return request({
    url: '/auth/test',
    method: 'post',
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    // baseURL: 'http://localhost:57680',
    baseURL: 'https://fuenml.azurewebsites.net/'
  })
}

export function get_user_growth() {
  return request({
    url: '/query/get_user_growth',
    method: 'post',
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    // baseURL: 'http://localhost:57680',
    baseURL: 'https://fuenml.azurewebsites.net/'
  })
}
export function get_all_data() {
  return request({
    url: '/query/get_all_data_count',
    method: 'post',
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    // baseURL: 'http://localhost:57680',
    baseURL: 'https://fuenml.azurewebsites.net/'
  })
}
export function get_tag_count() {
  return request({
    url: '/query/get_tag_count',
    method: 'post',
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    // baseURL: 'http://localhost:57680',
    baseURL: 'https://fuenml.azurewebsites.net/'
  })
}
export function get_tag_event_count() {
  return request({
    url: '/query/get_tag_event_count',
    method: 'post',
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    // baseURL: 'http://localhost:57680',
    baseURL: 'https://fuenml.azurewebsites.net/'
  })
}
export function get_place_tag_count() {
  return request({
    url: '/query/get_place_tag_count',
    method: 'post',
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    // baseURL: 'http://localhost:57680',
    baseURL: 'https://fuenml.azurewebsites.net/'
  })
}

export function sendEmail(data) {
  return request({
    url: '/query/send_email_test',
    method: 'post',
    data,
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    // baseURL: 'http://localhost:57680',
    baseURL: 'https://fuenml.azurewebsites.net/'
  })
}

export function userEventCount() {
  return request({
    url: '/query/get_user_event_count',
    method: 'post',
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    // baseURL: 'http://localhost:57680',
    baseURL: 'https://fuenml.azurewebsites.net/'
  })
}
