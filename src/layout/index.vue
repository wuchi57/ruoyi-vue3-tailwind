<script setup>
import Sidebar from 'layout/Sidebar.vue'
import Navbar from 'layout/Navbar.vue'
import AppMain from 'layout/AppMain.vue'

</script>

<template>
<div class="layout-main">
  <Sidebar />
  <div class="ml-[200px]">
    <div>
      <Navbar />
    </div>
    <AppMain/>
  </div>
</div>
</template>