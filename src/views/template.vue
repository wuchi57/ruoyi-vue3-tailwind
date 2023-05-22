<script setup>
const formSearchRef = ref(null)
const formSearchData = reactive({
  form: {
    coId: null,
    coName: null,
    companyCode: null,
  },
  rules: {
  },
})
const formRef = ref(null)
const formData = reactive({
  form: {
    coId: null,
    coName: null,
    companyCode: null,
  },
  rules: {
  },
})
const tableData = reactive({
  total: 0,
  params: {
    pageNum: 1,
    pageSize: 5,
    roleName: null,
    status: null,
  },
  columns: [
    {prop: 'companyName', label: '企业名称'},
    {prop: 'createBy', label: '账号'},
  ],
  data: [],
})
const dialog = reactive({
  visible: false,
  title: '',
  type: 'add', // add view
  companyId: null,
})
</script>

<template>
<div class="p-5">
  <!-- 数据搜索 -->
  <el-form>
    <el-form-item></el-form-item>
    <el-form-item></el-form-item>
    <el-form-item></el-form-item>
  </el-form>

  <!-- 数据操作 -->
  <el-row></el-row>

  <!-- 数据展示 -->
  <el-table>
    <el-table-column></el-table-column>
    <el-table-column></el-table-column>
  </el-table>

  <!-- 添加或修改对话框 -->
  <el-dialog>
    <el-form>
      <el-form-item></el-form-item>
      <el-form-item></el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary">确 定</el-button>
      <el-button >取 消</el-button>
    </template>
  </el-dialog>
</div>
</template>