<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <!-- 给表格绑定数据 -->
            <el-table border :data="list">
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="120"
              />
              <el-table-column
                align="center"
                prop="name"
                label="角色名称"
                width="240"
              />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 右侧内容 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :closable="false"
              :show-icon="true"
            />
            <el-form
              ref="roleForm"
              label-width="120px"
              style="margin-top: 50px"
            >
              <el-form-item label="企业名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="电话">
                <el-input
                  v-model="formData.companyPhone"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置一个弹层组件 -->
    <!-- close事件 在点击的时候会触发 -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
        <!-- footer -->
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button
              size="small"
              type="primary"
              @click="btnOK"
            >确定</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 放置分配权限的弹出层 -->
    <el-dialog :visible="showPermDialog" title="权限设置" @close="btnPermCancel">
      <!-- 权限是树形结构 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="selectChecked"
      />
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnPermCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnPermOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
  assignPerm
} from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      formData: {
        // 公司信息
      },
      showDialog: false, // 控制弹层显示
      showPermDialog: false, // 控制权限弹层
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      permData: [], // 接收权限数据
      defaultProps: {
        label: 'name'
      }, // 定义显示字段的名称 和 子属性的字段名称
      roleId: null, // 记录角色的id
      selectChecked: []
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage
      // 重新渲染页面
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      try {
        // 提示用户是否确认删除
        await this.$confirm('确认删除该角色吗？')
        // 只有点击了确认 才能执行下面的代码
        await deleteRole(id)
        // 重新渲染页面
        this.getRoleList()
        // 提示用户删除成功
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      // 先获取数据再回显 不会有延迟(一闪)
      this.roleForm = await getRoleDetail(id) // 获取数据回显
      this.showDialog = true // 显示弹层
    },
    async btnOK() {
      try {
        // 无论编辑还是新增 都需要先验证表单数据
        await this.$refs.roleForm.validate() // 表单校验
        // roleForm有id是编辑 没有是新增
        if (this.roleForm.id) {
          // 编辑
          // 通过才会执行如下代码
          await updateRole(this.roleForm) // 发请求更新数据
        } else {
          // 新增业务
          await addRole(this.roleForm)
        }
        this.getRoleList() // 重新渲染页面
        this.$message.success('操作成功') // 提示用户
        this.showDialog = false // 关闭弹层 => 触发el-dialog的close事件
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      // 清空表单
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验规则
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 获取权限点数据
    async assignPerm(id) {
      this.roleId = id
      // 调用接口获得的数据不是树形 要调用方法处理成树形结构
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      // 根据id获取该角色拥有的权限点id
      const { permIds } = await getRoleDetail(id)
      // console.log(permIds)
      this.selectChecked = permIds
      // console.log(permIds)
      // 回显该角色拥有的权限 自动选中
      this.showPermDialog = true
    },
    async btnPermOk() {
      // 调用el-tree实例的getCheckedNodes方法获取选中的节点的集合
      // this.$refs.permTree.getCheckedKeys() 返回的是数组
      await assignPerm({ id: this.roleId, permIds: this.$refs.permTree.getCheckedKeys() })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectChecked = []
      this.showPermDialog = false
    }
  }
}
</script>

<style></style>
