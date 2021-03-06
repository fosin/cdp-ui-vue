import { postRequest, upload, download } from '@/utils/request'

/**
 * 题库详情
 * @param data
 */
export function fetchDetail(id) {
  return postRequest('gateway/exam/api/qu/qu/detail', { id: id })
}

/**
 * 保存题库
 * @param data
 */
export function saveData(data) {
  return postRequest('gateway/exam/api/qu/qu/save', data)
}

/**
 * 导出
 * @param data
 */
export function exportExcel(data) {
  return download('gateway/exam/api/qu/qu/export', data)
}

/**
 * 导入模板
 * @param data
 */
export function importTemplate() {
  return download('gateway/exam/api/qu/qu/import/template')
}

/**
 * 导出
 * @param data
 */
export function importExcel(file) {
  return upload('gateway/exam/api/qu/qu/import', file)
}

