<template>
  <!-- 放置弹层组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
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
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addDepartments, getDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
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
      let isRepeat = false
      if (this.formData.id) {
        // 编辑
        // 要编辑的部门本身在数据库中就存在 所以要筛选出除了本身之外的所有同级部门再进行比较看是否重复
        // 同级部门的pid都是相同的 可以通过this.formData.pid获得当前部门的pid 再查找所有的同级部门(查找结果包括本身)
        isRepeat = depts.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id).some(item => item.name === value)
      } else {
        // 新增
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经存在${value}`)) : callback()
    }
    // 检查部门编码是否重复 部门编码在整个模块中都不允许重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先获取最新的组织架构数据
      const { depts } = await getDepartments()
      // 由于数据库中的历史数据有可能没有code 所以这里要加一个强制条件 就是value不能为空
      let isRepeat = false
      if (this.formData.id) {
        // 编辑
        // 要求在整个数据库中都不能有一样的code
        // 在除了自己以外的所有数据中查重
        isRepeat = depts.filter(item => item.id !== this.formData.id).some(item => item.code === value && value)
      } else {
        // 新增
        isRepeat = depts.some(item => item.code === value && value)
      }
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
  computed: {
    showTitle() {
      // 如果是新增部门 formData中没有数据 如果是新增子部门 formData有数据
      return this.formData.id ? '编辑部门' : '添加子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      // getEmployeeSimple()调用接口返回的是一个数组 里面是员工的id和username
      this.people = await getEmployeeSimple()
    },
    async btnOK() {
      const valide = await this.$refs.deptForm.validate()
      if (valide) {
        if (this.formData.id) {
          // 编辑部门 调用接口
          await updateDepartments(this.formData)
        } else {
          // 新增部门
          // 表单校验通过 新增部门
          // 因为表单不知道要在哪个部门后面新增部门 所以传入参数中要求添加pid属性
          // 此时，将当前点击的部门的id赋值给要添加的部门的pid，就成为了子部门
          await addDepartments({ ...this.formData, pid: this.treeNode.id })
        }
        // 子传父 告诉父组件重新获取数据 重新渲染页面
        this.$emit('addDepts')
        // 关闭弹窗 此时需要修改showDialog为false
        this.$emit('update:showDialog', false)
        // 关闭dialog的时候 会触发el-dialog的close事件 会重置表单 所以不需要再单独重置数据
      }
    },
    btnCancel() {
      // 必须要手动重置数据 因为resetFields只能重置表单组件明面上的四个数据 而通过接口获取的数据中还有id
      // 所以必须重置formData 不重置id会一直存在
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹窗 此时需要修改showDialog为false
      this.$emit('update:showDialog', false)
      // 重置表单以及表单校验 只能重置 定义在data中的数据
      this.$refs.deptForm.resetFields()
    },
    // 获取部门详情 因为是子组件要用部门详情的数据 所以在子组件调用接口
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style>

</style>
