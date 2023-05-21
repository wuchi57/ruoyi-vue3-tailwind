import { defineStore } from 'pinia'
import { RouteInfo} from 'api'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    count: 1,
  }),
  actions: {
    generateRoutes() {
      return new Promise(resolve => {
        RouteInfo.getRouters().then(res => {

          console.warn('routes info: ')
          console.log(res)
          const sidebarData = JSON.parse(JSON.stringify(res.data))
          const rewriteData = JSON.parse(JSON.stringify(res.data))
          const defaultData = JSON.parse(JSON.stringify(res.data))

          console.log(sidebarData)
          // console.log(rewriteData)
          // console.log(defaultData)
        })
      })
    },
  },
})

// 遍历路由数组，转换为路由对象
function filterRoutes (routesArray, lastRouter = false, type = false) {
  return routesArray.filter(route => {
    // 有children的就过滤children
    if (route.children) {
      route.children = filterChildren(route.children)
    }
    // 特殊组件处理
    if (route.component) {
      switch (route.component) {
        case 'Layout':
          route.component = 'Layout'
          break
        case 'ParentView':
          route.component = 'ParentView'
          break
        case 'InnerLink':
          route.component = 'InnerLink'
          break
        default:
          route.component = 'xxx'
      }
    }
  })
}

function filterChildren (childrenArray, lastRouter = false) {
  const children = []
  childrenArray.forEach(i => {
    if (i.children && i.children.length) {

    }
  })
  return children
}


// 匹配views里面所有的.vue文件
const modules = import.meta.glob('../views/**/*.vue')
/**
 * modules 结构 [
 ../views/About.vue: () => import("/src/views/About.vue")
 ../views/Home.vue: () => import("/src/views/Home.vue?t=1684579196763")
 ../views/Login.vue: () => import("/src/views/Login.vue?t=1684587509697")
 ]
 */

Object.keys(modules).forEach(i => {
  console.log(i)
})
for (const key in modules) {
  const dir = key.split('views/')[1].split('.vue')[0]
  // console.log(dir)
}

function loadView (view) {
  let res
  for (const key in modules) {
    const name = key.split('views/')[1].split('.vue')[0]
    if (name === view) res = () => modules[key]()
  }
  return res
}