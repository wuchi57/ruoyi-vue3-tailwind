import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    // 网页标题
    title: '',
    staticTitle: 'XXX管理系统',
    // 侧边栏主题 深色主题theme-dark，浅色主题theme-light
    sideTheme: 'theme-dark',
    // 是否系统布局配置
    showSettings: false,
    // 是否显示顶部导航，默认不显示
    topNav: false,
    // 是否显示 tagsView，默认显示
    tagsView: true,
    // 是否固定头部，默认不固定
    fixedHeader: false,
    // 是否显示logo，默认显示
    sidebarLogo: true,
    // 是否显示动态标题，默认静态标题
    dynamicTitle: false,
    // 基本主题色
    themeColor: '#409EFF',
  }),
  actions: {
    // 重置
    reset() {
      this.title = ''
      this.staticTitle = 'XXX管理系统'
      this.sideTheme = 'theme-dark'
      this.showSettings = false
      this.topNav = false
      this.tagsView = false
      this.fixedHeader = false
      this.sidebarLogo = true
      this.dynamicTitle = false
      this.themeColor = '#409EFF'

    },
    // 修改布局设置
    changeSetting(data) {
      const { key, value } = data
      if (this.hasOwnProperty(key)) {
        this[key] = value
      }
    },
    // 设置网页标题
    setTitle(title) {
      this.title = title
      if (this.dynamicTitle) {
        document.title = this.title + ' - ' + this.staticTitle
      } else {
        document.title = this.title;
      }
    },
  }
})