<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px;width:100%"
  >
    <!-- 左侧 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <span>
              操作
              <i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- 编辑部门和删除部门只会在子节点上显示 -->
              <!-- 默认值为false表示不是根节点 根节点为true的时候不显示 -->
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    // 定义传入的属性
    // treeNode是每一个节点的数据对象
    treeNode: {
      required: true,
      type: Object
    },
    // 非必传项 因为只有一个根节点 不是根节点默认值为false
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击 新增 删除 编辑 时触发
    operateDepts(type) {
      if (type === 'add') {
        // 添加子部门 在当前点击的部门下添加子部门
        // 要传入当前点击的组件 告诉父组件在哪个部门下添加子部门
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        // 编辑部门
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除部门
        // 通过treeNode获取id
        this.$confirm('您确定要删除该组织部门吗？').then(() => {
          // 点击确定就调用接口删除 因为是写在then里 所以采用原生Promise的方法继续.then
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 调用接口删除成功 此时后端数据变化但是前端没有变 需要子传父 通知父组件重新获取数据,重新渲染页面
          // 因为现在所处的位置是封装的组件 所以要回到父组件重新渲染页面
          this.$emit('delDepts')
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style>

</style>
