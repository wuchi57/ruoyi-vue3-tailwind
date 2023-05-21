<script setup>

import { Service, Setting, Document, Coin, Position, User, House} from '@element-plus/icons-vue'
import {ref} from 'vue'
const isCollapse = ref(false)
</script>

<template>
<div class="fixed w-[200px] h-full shadow-bs02">
  <div class="text-center py-4">Sidebar Logo</div>
  <ElMenu
      default-active="2"
      :collapse="isCollapse"
      :collapse-transition="false"
  >
    <router-link to="/">
      <el-menu-item index="1">
        <el-icon><House/></el-icon>
        <template #title>首页</template>
      </el-menu-item>
    </router-link>

    <el-sub-menu index="2">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>系统管理</span>
      </template>

      <router-link to="/system/menu">
        <el-menu-item index="2-1">
          <el-icon><Document /></el-icon>
          <template #title>菜单管理</template>
        </el-menu-item>
      </router-link>

      <router-link to="/system/role">
        <el-menu-item index="2-2">
          <el-icon><Coin/></el-icon>
          <template #title>角色管理</template>
        </el-menu-item>
      </router-link>

      <router-link to="/system/user">
        <el-menu-item index="2-3">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
      </router-link>

    </el-sub-menu>

    <router-link to="/login">
      <el-menu-item index="3">
        <el-icon><Position /></el-icon>
        <template #title>Login</template>
      </el-menu-item>
    </router-link>

    <router-link to="/about">
      <el-menu-item index="4">
        <el-icon><Service /></el-icon>
        <template #title>About</template>
      </el-menu-item>
    </router-link>
  </ElMenu>
</div>
</template>