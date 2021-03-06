import request from '@/utils/request'

// 获取系统版本表数据分页列表
export function listVersionPage(page) {
  return request({
    url: 'gateway/platform/v1/version/pageList',
    method: 'post',
    data: page
  })
}

// 获取系统版本表所有数据列表
export function listVersion() {
  return request({
    url: 'gateway/platform/v1/version/list',
    method: 'post'
  })
}
// 新建系统版本表
export function postVersion(obj) {
  return request({
    url: 'gateway/platform/v1/version',
    method: 'post',
    data: obj
  })
}
// 根据主键ID获取系统版本表数据
export function getVersion(id, method) {
  return request({
    url: 'gateway/platform/v1/version/' + id,
    method: method || 'post'
  })
}
// 根据主键ID删除系统版本表一条数据
export function deleteVersion(id) {
  return request({
    url: 'gateway/platform/v1/version/' + id,
    method: 'delete'
  })
}
// 根据实体类数据更新系统版本表数据
export function putVersion(obj) {
  return request({
    url: 'gateway/platform/v1/version',
    method: 'put',
    data: obj
  })
}

// 获取版本的所有权限列表
export function listVersionPermissions(id) {
  return request({
    url: 'gateway/platform/v1/version/permissions/' + id,
    method: 'post'
  })
}

// 更新版本权限
export function putVersionPermissions(id, permissions) {
  return request({
    url: 'gateway/platform/v1/version/permissions/' + id,
    method: 'put',
    data: permissions
  })
}

// 根据权限ID获取系统版本子权限
export function listVersionChildPermissions(pid, versionId) {
  return request({
    url: 'gateway/platform/v1/version/listChild/' + pid + '?versionId=' + versionId,
    method: 'post'
  })
}
