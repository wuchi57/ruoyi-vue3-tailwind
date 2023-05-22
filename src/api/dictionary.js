import request from 'utils/request'

export default class Dictionary {
  // 添加字典分类
  static dictTypeAdd (data) {
    return request({
      url: '/system/dict/type',
      method: 'post',
      data,
    })
  }

  // 获取分类列表
  static dictTypeList (params) {
    return request({
      url: '/system/dict/type/list',
      method: 'get',
      params
    })
  }

  // 删除字典分类
  static dictTypeDelete (id) {
    return request({
      url: `/system/dict/type/${id}`,
      method: 'delete',
    })
  }

  // 更新字典分类
  static dictTypeUpdate (data) {
    return request({
      url: `/system/dict/type`,
      method: 'put',
      data,
    })
  }

  // 获取字典分类详情
  static dictTypeDetail (id) {
    return request({
      url: `/system/dict/type/${id}`,
      method: 'get',
    })
  }


  // 添加字典
  static dictAdd (data) {
    return request({
      url: '/system/dict/data',
      method: 'post',
      data,
    })
  }

  // 获取列表
  static dictList (params) {
    return request({
      url: '/system/dict/data/list',
      method: 'get',
      params
    })
  }

  // 删除字典
  static dictDelete (id) {
    return request({
      url: `/system/dict/data/${id}`,
      method: 'delete',
    })
  }

  // 更新字典
  static dictUpdate (data) {
    return request({
      url: `/system/dict/data`,
      method: 'put',
      data,
    })
  }

  // 获取字典详情
  static dictDetail (id) {
    return request({
      url: `/system/dict/data/${id}`,
      method: 'get',
    })
  }

  // 根据字典类型获取字典列表
  static dictTypeListDetail (dictType) {
    return request({
      url: `/system/dict/data/type/${dictType}`,
      method: 'get',
    })
  }

}