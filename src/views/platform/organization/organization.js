import request from '@/utils/request'

export function treeOrganiz(topId) {
  return request({
    url: '/platform/v1/organiz/tree/' + topId,
    method: 'post'
  })
}
export function listOrganizChild(pId) {
  return request({
    url: '/platform/v1/organiz/listChild/' + pId,
    method: 'post'
  })
}
export function listOrganizAllChild(pId) {
  return request({
    url: '/platform/v1/organiz/listAllChild/' + pId,
    method: 'post'
  })
}
export function listOrganiz() {
  return request({
    url: '/platform/v1/organiz/list',
    method: 'post'
  })
}
export function postOrganiz(obj) {
  return request({
    url: '/platform/v1/organiz/',
    method: 'post',
    data: obj
  })
}

export function getOrganiz(id, method) {
  return request({
    url: '/platform/v1/organiz/' + id,
    method: method || 'post'
  })
}

export function deleteOrganiz(id) {
  return request({
    url: '/platform/v1/organiz/' + id,
    method: 'delete'
  })
}

export function putOrganiz(obj) {
  return request({
    url: '/platform/v1/organiz',
    method: 'put',
    data: obj
  })
}
