<template>
  <div>
    <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
      <!-- 定义多选框组件 -->
      <el-checkbox-group v-model="roleIds">
        <!-- 要循环的选项 -->
        <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <!-- 定义footer插槽 -->
      <template v-slot:footer>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK">确认</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 负责存储所有的角色
      roleIds: [] // 负责存储当前用户所拥有的角色
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    },
    // 因为props传值是异步的 所以这里不能用this.userId
    // 这个方法是给父组件调用的
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      // 将用户所拥有的角色 赋值给当前用户的对象
      this.roleIds = roleIds
    },
    async btnOK() {
      // 保存用户角色
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      // 关闭弹窗
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.roleIds = [] // 重置复选框
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
