<template>
  <!-- 放置弹层组件 -->
  <el-dialog title="新增部门" :visible="showDialog">
    <!-- 表单数据 -->
    <el-form :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in people" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 确定和取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small">确定</el-button>
        <el-button size="small" type="primary">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点数据
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // value是部门名称
      // 先获取最新的组织架构数据
      const { depts } = await getDepartments()
      // 去找同级部门下有没有和value相同的数据
      // 子部门的pid=父部门的id
      // filter先找出该部门下的所有子部门 再some判断有无同名部门
      const isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      isRepeat ? callback(new Error(`同级部门下已经存在${value}`)) : callback()
    }
    // 检查部门编码是否重复 部门编码在整个模块中都不允许重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先获取最新的组织架构数据
      const { depts } = await getDepartments()
      // 由于数据库中的历史数据有可能没有code 所以这里要加一个强制条件 就是value不能为空
      const isRepeat = depts.some(item => item.code === value && value)
      isRepeat ? callback(new Error(`组织架构下已经存在${value}编码`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      },
      people: [] // 接收获取的员工简单列表的数据
    }
  },
  methods: {
    async getEmployeeSimple() {
      // getEmployeeSimple()调用接口返回的是一个数组 里面是员工的id和username
      this.people = await getEmployeeSimple()
    }
  }
}
</script>

<style>

</style>
