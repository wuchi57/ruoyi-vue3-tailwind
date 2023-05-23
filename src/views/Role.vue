<script setup>
import { Edit, Delete, Search, Refresh, Plus, Download, CircleCheck, User } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, } from 'element-plus'
import { useDict } from 'hooks/useDict.js'
import { Menu, Role } from 'api'

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
    roleId: undefined,
    roleName: undefined,
    roleKey: undefined,
    roleSort: 0,
    status: '0',
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true, // 父子联动
    deptCheckStrictly: true, // 父子联动
    remark: undefined,
  },
  rules: {
    roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
    roleKey: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
    roleSort: [{ required: true, message: "角色顺序不能为空", trigger: "blur" }]
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
  width: '500px',
  companyId: null,
})

const { sys_show_hide, sys_normal_disable } = useDict('sys_show_hide', 'sys_normal_disable');
const options = reactive({
  menu: [],
  status: sys_normal_disable
})
const treeRef = ref(null)


/** 更新数据 **/
async function getList () {
  const res = await Role.listRole()
  console.log(res)
  tableData.total = res.total
  tableData.data = res.rows
}

/** 重置表单 **/
function resetForm () {
  treeRef.value && treeRef.value.setCheckedKeys([])
  formRef.value && formRef.value.resetFields()
  formData.form.roleId = undefined
  formData.form.roleName = undefined
  formData.form.roleKey = undefined
  formData.form.roleSort = 0
  formData.form.status = '0'
  formData.form.menuIds = []
  formData.form.deptIds = []
  formData.form.menuCheckStrictly = true
  formData.form.deptCheckStrictly = true
  formData.form.remark = undefined
}

/** 获取菜单下拉框 **/
function getMenuTreeSelect () {
  Menu.treeselect().then(res => {
    options.menu = res.data
  })
}

/** 根据角色获取角色菜单 **/
function getRoleMenuTreeSelect (id) {
  return Menu.roleMenuTreeselect(id).then(res => {
    options.menu = res.menus
    return res
  })
}

/** 添加角色 **/
function handleAdd () {
  resetForm()
  getMenuTreeSelect()
  dialog.visible = true
  dialog.title = '添加角色'
}

/** 更新角色 **/
function handleUpdate (row) {
  resetForm()
  const roleId = row.roleId
  const roleMenu = getRoleMenuTreeSelect(roleId)
  Role.getRole(roleId).then(res => {
    formData.form = res.data
    formData.form.roleSort = Number(formData.form.roleSort)
    dialog.visible = true
    nextTick(() => {
      roleMenu.then(response => {
        let checkedKeys = response.checkedKeys
        console.log(res)
        checkedKeys.forEach(i => {
          nextTick(() => {
            treeRef.value.setChecked(i, true, false)
          })
        })
      })
    })
  })
}

/** 删除角色 **/
function handleDelete (row) {
  const roleId = row.roleId
  let content = '是否确认删除角色编号为"' + roleId + '"的数据项?'
  ElMessageBox.confirm(content, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  }).then(async () => {
    await Role.delRole(roleId)
    await getList()
    ElMessage.success('删除成功')
  })
}

/** 获取菜单ids **/
function getMenuAllCheckedKeys () {
  // 目前被选中的菜单节点
  let checkedKeys = treeRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = treeRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

/** 提交修改 **/
function handleSubmit () {
  formRef.value.validate(async valid => {
    if (valid) {
      formData.form.menuIds = getMenuAllCheckedKeys()
      if (formData.form.roleId !== undefined) {
        await Role.updateRole(formData.form)
        ElMessage.success('修改成功')
      } else {
        await Role.addRole(formData.form)
        ElMessage.success('新增成功')
      }
      dialog.visible = false
      await getList()
    }
  })
}

/** 取消添加 **/
function handleCancel () {
  resetForm()
  dialog.visible = false
}

getList()

</script>

<template>
<div class="p-5">
  <!-- 数据搜索 -->
  <el-form ref="formSearchRef" :model="formSearchData.form" inline>
    <el-form-item prop="roleName" label="角色名称">
      <el-input
        v-model="formSearchData.form.roleName"
        @keyup.enter=""
        style="width: 200px"
        placeholder="请输入角色名称"
        clearable
      />
    </el-form-item>
    <el-form-item prop="roleKey" label="权限字符">
      <el-input placeholder="请输入权限字符"></el-input>
    </el-form-item>
    <el-form-item></el-form-item>
    <el-form-item prop="status" label="状态">
      <el-select v-model="formSearchData.form.status" style="width: 200px" placeholder="角色状态" clearable>
        <el-option
          v-for="dict in sys_normal_disable"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="创建时间">
      <el-date-picker
        value-format="YYYY-MM-DD"
        type="daterange"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      />
    </el-form-item>
    <el-form-item>
      <el-button @click="" type="primary" :icon="Search">搜索</el-button>
      <el-button @click="" :icon="Refresh">重置</el-button>
    </el-form-item>
  </el-form>

  <!-- 数据操作 -->
  <el-row :gutter="10" class="mb-4">
    <el-col :span="1.5">
      <el-button
        @click="handleAdd"
        type="primary"
        plain
        :icon="Plus"
      >新增</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button
        type="success"
        plain
        :icon="Edit"
      >修改</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button
        type="danger"
        plain
        :icon="Delete"
      >删除</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button
        type="warning"
        plain
        :icon="Download"
      >导出</el-button>
    </el-col>
  </el-row>

  <!-- 数据展示 -->
  <el-table :data="tableData.data">
    <el-table-column type="selection" width="55" align="center"/>
    <el-table-column label="角色编号" prop="roleId" width="120"/>
    <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150"/>
    <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150"/>
    <el-table-column label="显示顺序" prop="roleSort" width="100"/>
    <el-table-column label="状态" align="center" width="100">
      <template #default="scope">
        <el-switch
          v-model="scope.row.status"
          active-value="0"
          inactive-value="1"
        />
      </template>
    </el-table-column>
    <el-table-column label="创建时间" align="center" prop="createTime">
      <template #default="scope">
        <span>{{scope.row.createTime}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button @click="handleUpdate(scope.row)" type="primary" :icon="Edit" link>编辑</el-button>
        <el-button @click="handleDelete(scope.row)" type="primary" :icon="Delete" link>删除</el-button>
        <el-button type="primary" :icon="CircleCheck" link>数据权限</el-button>
        <el-button type="primary" :icon="User" link>分配用户</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 添加或修改对话框 -->
  <el-dialog v-model="dialog.visible" :title="dialog.title" :width="dialog.width">
    <el-form ref="formRef" :model="formData.form" :rules="formData.rules" label-width="80">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="formData.form.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input v-model="formData.form.roleKey" placeholder="请输入权限字符" />
      </el-form-item>
      <el-form-item label="角色顺序" prop="roleSort">
        <el-input-number v-model="formData.form.roleSort" :min="0" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="formData.form.status">
          <el-radio
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.value"
          >{{ dict.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-checkbox>展开/折叠</el-checkbox>
        <el-checkbox>全选/全不选</el-checkbox>
        <el-checkbox>父子联动</el-checkbox>
        <el-tree
          ref="treeRef"
          :data="options.menu"
          show-checkbox
          node-key="id"
          empty-text="加载中，请稍候"
          :props="{label: 'label', children: 'children'}"
          class="w-full border !border-[#e5e6e7] rounded"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.form.remark" type="textarea" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleSubmit" type="primary">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </template>
  </el-dialog>
</div>
</template>