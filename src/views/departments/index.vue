<template>
  <div class="dashboard-container">
    <div class="app-container" />
    <!-- 组织架构的内容 - 头部 -->
    <el-card class="tree-card">
      <!-- 放置内容 -->
      <!-- 两个不同的组件实例，可以传入不同的值,互不影响 -->
      <!-- 根节点传入true -->
      <TreeTools :tree-node="company" :is-root="true" />
      <!-- 放置一个el-tree -->
      <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
        <!-- 传入内容 => 插槽内容 会循环多次 有多少节点就循环多少次 -->
        <!-- 放置内容 -->
        <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据 data是每个节点的数据对象 -->
        <TreeTools slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" />
      </el-tree>
    </el-card>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人' }
      // 组织结构的内容在depts中，但是需要将其转化成树形结构
      // this.departs = result.depts 行不通，结构不同
      this.departs = tranListToTreeData(result.depts, '')
      console.log(result)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
