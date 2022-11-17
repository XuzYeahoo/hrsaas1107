<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <PageTools>
        <template #after>
          <el-button size="small" type="primary" @click="addPermission(1,'0')">添加权限</el-button>
        </template>
      </PageTools>
      <!-- 表格 -->
      <!-- row-key="id"  指定id为唯一属性标识 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" prop="name" label="名称" />
        <el-table-column align="center" prop="code" label="标识" />
        <el-table-column align="center" prop="description" label="描述" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <!-- 添加按钮只在访问权的层级显示 当type=1时才显示添加按钮 -->
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2,row.id)">添加</el-button>
            <el-button type="text" @click="updatePermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增/编辑弹层 -->
    <el-dialog :visible="showDialog" :title="showTitle" @close="btnCancel">
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <!-- 当值为1时激活，值为0时不激活 -->
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
            style="width: 90%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOk">确定</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, updatePermission, delPermission, getPermissionDetail } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    delPermission(id) {
      this.$confirm('确定删除该权限点吗').then(() => {
        return delPermission(id)
      }).then(() => {
        this.$message.success('删除权限成功')
        // 重新渲染页面
        this.getPermissionList()
      })
    },
    addPermission(type, pid) {
      // 访问权type=1 操作权type=2
      // pid用来标记当前数据的父节点的标识
      // 记录当前添加的类型和父节点的标识
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    async btnOk() {
      try {
        await this.$refs.perForm.validate() // 验证表单
        if (this.formData.id) {
          // 编辑
          await updatePermission(this.formData)
        } else {
          // 新增
          await addPermission(this.formData)
        }
        this.$message.success('操作成功')
        this.getPermissionList() // 重新渲染页面
        this.showDialog = false // 关闭弹窗
      } catch (err) {
        console.log(err)
      }
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    async updatePermission(id) {
      this.formData = await getPermissionDetail(id) // 回显原数据
      this.showDialog = true // 显示弹层
    }
  }
}
</script>

<style></style>
