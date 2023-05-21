// import { useUserStore } from 'store'

import { getToken } from 'utils/auth.js'
import { usePermissionStore, useSettingStore, useUserStore } from 'store'

const whiteList = ['/login', '/register']

export default function interceptor (to, from, next) {

  if (getToken()) {

    // 设置动态标题
    to.meta.title && useSettingStore().setTitle(to.meta.title)
    // 判断路由是否已获取
    if (useUserStore().roles.length !== 0) {
      // 获取用户信息
      useUserStore().getInfo().then((response) => {
        // 根据roles权限生成动态路由
        console.warn('user info: ')
        // console.log(response)
        usePermissionStore().generateRoutes().then(res => {
          console.log(res)
        })
      })
    }


    // 具备token
    next()

  } else {

    // 不具备token
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
    }

  }
}
