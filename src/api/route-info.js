import request from 'utils/request.js'

export default class RouteInfo {
  static getRouters () {
    return request({
      url: '/getRouters',
      method: 'get'
    })
  }

}