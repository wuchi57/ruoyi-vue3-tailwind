<script setup>
import { Edit, Delete, Search, Refresh, Plus, Sort } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDict } from 'hooks/useDict.js'
import { Menu } from 'api'
import { handleTree } from 'utils/tools.js'

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
    menuType: 'M',
    menuName: '',
    orderNum: 0,
    path: ''
  },
  rules: {
    menuName: [{required: true, message: '请输入必填项'},],
    orderNum: [{required: true, message: '请输入必填项'},],
    path: [{required: true, message: '请输入必填项'},],
  },
})
const tableData = reactive({
  total: 0,
  params: {
    pageNum: 1,
    pageSize: 5,
  },
  columns: [
    {prop: 'menuName', label: '菜单名称', width: '160'},
    {prop: 'icon', label: '图标', width: '100'},
    {prop: 'orderNum', label: '排序', width: '60'},
    {prop: 'perms', label: '权限标识',},
    {prop: 'component', label: '组件路径'},
    {prop: 'status', label: '状态', width: '80'},
    {prop: 'createTime', label: '操作时间', width: '210'},
    {prop: 'options', label: '操作', width: '210'},
  ],
  data: [],
  info: {
    loading: false,
    showTable: true,
    isExpandAll: false
  }
})
const dialog = reactive({
  visible: false,
  title: '',
  type: 'add', // add view
  id: null,
})
const options = reactive({
  menu: []
})

const { sys_show_hide, sys_normal_disable } = useDict('sys_show_hide', 'sys_normal_disable');











const settingArr = [
  {title: '个人设置', id: 'idx-1', path: '/setting/person', iconName: 'menu_icon_setting_self'},
  {
    title: '组织设置', id: 'idx-2', path: '/idx-2', iconName: 'menu_icon_setting_organization', children: [
      {title: '组织管理', id: 'idx-2-1', path: '/setting/organization-manage'},
      {title: '角色设置', id: 'idx-2-2', path: '/setting/organization-role'},
      {title: '账号管理', id: 'idx-2-3', path: '/setting/organization-account'},
      {title: '企业管理', id: 'idx-2-4', path: '/setting/organization-company'},
    ],
  },
  {
    title: '系统设置', id: 'idx-3', path: '/idx-3', iconName: 'menu_icon_setting_system', children: [
      {title: '基础设置', id: 'idx-3-1', path: '/setting/system-base'},
      {title: '运维设置', id: 'idx-3-2', path: '/setting/system-devops'},
      {title: '字典管理', id: 'idx-3-3', path: '/setting/system-dict'},
      {title: '操作日志', id: 'idx-3-4', path: '/setting/system-operation-log'},
      {title: '菜单管理', id: 'idx-3-5', path: '/setting/system-menu'},
    ],
  },
]
const operationArr = [
  {
    title: '产品管理', id: 'idx-1', path: '/idx-1', iconName: 'menu_icon_product', children: [
      {title: '产品注册', id: 'idx-2-1', path: '/operation/product-register'},
      {title: '设备注册', id: 'idx-2-2', path: '/operation/device-register'},
      {title: '设备标识码', id: 'idx-2-3', path: '/operation/device-identify'},
    ],
  },
  {title: '设备配置', id: 'idx-2', path: '/operation/device-config', iconName: 'menu_icon_device'},
  {title: '设备监控', id: 'idx-3', path: '/operation/device-monitor', iconName: 'menu_icon_monitor'},
  {title: '一键优化', id: 'idx-4', path: '/operation/optimization', iconName: 'menu_icon_optimization'},
  {title: '一键节能', id: 'idx-5', path: '/operation/energy-saving', iconName: 'menu_icon_energy'},
]
const workOrderArr = [
  {title: '我的工单', id: 'idx-1', path: '/order/self', iconName: 'menu_icon_work_order'},
  {title: '工单管理', id: 'idx-2', path: '/order/manage', iconName: 'menu_icon_work_order_manage'},
]

const init = async () => {
  let res = []
  let list = [
    {parentId: 0, menuType: 'M', menuName: '运维', orderNum: 0, path: 'operation'},
    {parentId: 0, menuType: 'M', menuName: '项目', orderNum: 0, path: 'project'},
    {parentId: 0, menuType: 'M', menuName: '工单', orderNum: 0, path: 'work-order'},
    {parentId: 0, menuType: 'M', menuName: '设置', orderNum: 0, path: 'setting'},
  ]
  // let arr = []
  // list.forEach(i => arr.push(Menu.addMenu(i)))
  // await Promise.all(arr)
  res = Menu.listMenu({})
  console.log(res)
}

init()
















/** 更新表格 **/
async function refresh () {
  tableData.info.loading = true
  const res = await Menu.listMenu({...formData.query, ...formSearchData.form})
  /**
   将 {
    children: [],
    component: "system/role/index",
    icon:"peoples",
    isCache:"0",
    isFrame:"1",
    menuId:101,
    menuName:"角色管理",
    menuType:"C",
    orderNum:2,
    parentId:1,
    path:"role",
    perms:"system:role:list",
    status:"0",
    visible:"0",
  } 转换为 tree 结构
  **/
  tableData.data = handleTree(res.data, "menuId");
  tableData.info.loading = false
}

/** 切换扩展 **/
function toggleExpand () {
  tableData.info.showTable = false
  tableData.info.isExpandAll = !tableData.info.isExpandAll
  nextTick(() => {
    tableData.info.showTable = true
  })
}

/** 搜索 **/
function handleQuery () {
  refresh()
}

/** 重置搜索 **/
function handleQueryReset () {
  formSearchRef.value.resetFields()
  refresh()
}

/** 重置表单 **/
function resetForm () {
  formData.form.menuId = undefined
  formData.form.parentId = 0
  formData.form.menuName = undefined
  formData.form.icon = undefined
  formData.form.menuType = "M"
  formData.form.orderNum = 0
  formData.form.isFrame = "1"
  formData.form.isCache = "0"
  formData.form.visible = "0"
  formData.form.status = "0"
  formRef.value && formRef.value.resetFields()
}

/** 获取菜单下拉框 **/
async function getTreeSelect () {
  const res = await Menu.listMenu()
  options.menu = []
  const menu = { menuId: 0, menuName: "主类目", children: [] };
  menu.children = handleTree(res.data, "menuId");
  options.menu.push(menu)
}

/** 添加菜单 **/
async function handleAdd (row) {
  resetForm()
  await getTreeSelect()
  formData.form.parentId = (row && row.menuId) ? row.menuId : 0
  dialog.title = '添加菜单'
  dialog.visible = true
}

/** 提交修改 **/
function handleSubmit () {
  formRef.value.validate(valid => {
    if (valid) {
      if (formData.form.menuId !== undefined) {
        Menu.updateMenu(formData.form).then(res => {
          ElMessage.success('修改成功')
          dialog.visible = false
          refresh()
        })
      } else {
        Menu.addMenu(formData.form).then(res => {
          ElMessage.success('新增成功')
          dialog.visible = false
          refresh()
        })

      }
    }
  })
}

/** 取消提交 **/
function handleCancel () {
  dialog.visible = false
  resetForm()
}

/** 修改菜单 **/
async function handleModify (row) {
  resetForm()
  await getTreeSelect()
  const res = await Menu.getMenu(row.menuId)
  formData.form = res.data
  dialog.visible = true
  dialog.title = '修改菜单'
}

/** 删除菜单 **/
function handleDelete (row) {
  const content = '是否确认删除名称为"' + row.menuName + '"的数据项?'
  ElMessageBox.confirm(content, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  }).then(async () => {
    await Menu.delMenu(row.menuId)
    await refresh()
    ElMessage.success('删除成功')
  })
}

refresh()

</script>

<template>
<div class="p-5">
  <!-- 数据搜索 -->
  <el-form ref="formSearchRef" :model="formSearchData.form" inline>
    <el-form-item prop="menuName" label="菜单名称">
      <el-input
        v-model="formSearchData.form.menuName"
        @keyup.enter=""
        style="width: 200px"
        placeholder="请输入菜单名称"
        clearable
      />
    </el-form-item>
    <el-form-item prop="status" label="状态">
      <el-select v-model="formSearchData.form.status" style="width: 200px" placeholder="菜单状态" clearable>
        <el-option
          v-for="dict in sys_normal_disable"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleQuery" type="primary" :icon="Search">搜索</el-button>
      <el-button @click="handleQueryReset" :icon="Refresh">重置</el-button>
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
        @click="toggleExpand"
        type="info"
        plain
        :icon="Sort"
      >展开/折叠</el-button>
    </el-col>
    <div class="inline-block ml-auto">
      <el-tooltip effect="dark" content="刷新" placement="top">
        <el-button @click="refresh" circle :icon="Refresh" />
      </el-tooltip>
    </div>
  </el-row>

  <!-- 数据展示 -->
  <el-table
    v-if="tableData.info.showTable"
    :data="tableData.data"
    row-key="menuId"
    :default-expand-all="tableData.info.isExpandAll"
    v-loading="tableData.info.loading"
  >
    <el-table-column
      v-for="i in tableData.columns"
      :key="i.prop"
      :prop="i.prop"
      :label="i.label"
      :width="i.width"
    >
      <template v-if="i.prop === 'status'" #default="{ row, column, $index}">
        <el-tag v-if="Number(row.status) === 0">正常</el-tag>
        <el-tag v-else type="danger">停用</el-tag>
      </template>
      <template v-if="i.prop === 'options'" #default="{ row, column, $index}">
        <el-button @click="handleModify(row)" link type="primary" :icon="Edit" >修改</el-button>
        <el-button @click="handleAdd(row)" link type="primary" :icon="Plus" >新增</el-button>
        <el-button @click="handleDelete(row)" link type="primary" :icon="Delete" >删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 添加或修改对话框 -->
  <el-dialog v-model="dialog.visible" :title="dialog.title" >
    <el-form ref="formRef" :model="formData.form" :rules="formData.rules" label-width="80">
      <el-row :gutter="80">
        <el-col :span="12">
          <el-form-item label="上级菜单">
            <el-tree-select
              v-model="formData.form.parentId"
              :data="options.menu"
              :props="{ value: 'menuId', label: 'menuName', children: 'children'}"
              value-key="menuId"
              placeholder="选择上级菜单"
              check-strictly
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="formData.form.orderNum" :min="0" controls-position="right" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="formData.form.menuType">
            <el-radio label="M">目录</el-radio>
            <el-radio label="C">菜单</el-radio>
            <el-radio label="F">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row :gutter="80">
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="formData.form.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.form.menuType !== 'F'">
          <el-form-item label="菜单图标" prop="icon">
            <el-input v-model="formData.form.icon" placeholder="输入图标名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="80">
        <el-col :span="12"  v-if="formData.form.menuType !== 'F'">
          <el-form-item label="路由地址" prop="path">
            <el-input v-model="formData.form.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.form.menuType === 'C'">
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="formData.form.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="80">
        <el-col :span="12" v-if="formData.form.menuType === 'C'">
          <el-form-item label="路由参数">
            <el-input v-model="formData.form.query" placeholder="请输入路由参数" maxlength="255" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.form.menuType !== 'M'">
          <el-form-item label="权限字符">
            <el-input v-model="formData.form.perms" placeholder="请输入权限标识" maxlength="100" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="80">
        <el-col :span="12"  v-if="formData.form.menuType !== 'F'">
          <el-form-item label="是否外链">
            <el-radio-group v-model="formData.form.isFrame">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="formData.form.menuType === 'C'">
          <el-form-item label="是否缓存">
            <el-radio-group v-model="formData.form.isCache">
              <el-radio label="0">缓存</el-radio>
              <el-radio label="1">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="80">
        <el-col :span="12" v-if="formData.form.menuType !== 'F'">
          <el-form-item label="显示状态">
            <el-radio-group v-model="formData.form.visible">
              <el-radio
                v-for="dict in sys_show_hide"
                :key="dict.value"
                :label="dict.value"
              >{{ dict.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.form.menuType !== 'F'">
          <el-form-item label="菜单状态">
            <el-radio-group v-model="formData.form.status">
              <el-radio
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
              >{{ dict.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="handleSubmit" type="primary">确 定</el-button>
      <el-button @click="handleCancel" >取 消</el-button>
    </template>
  </el-dialog>
</div>
</template>