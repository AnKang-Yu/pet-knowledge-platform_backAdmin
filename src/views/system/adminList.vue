<template>
  <el-main>
    <!-- 主要区域容器elma -->
    <!-- 搜索框elf
             ref 表单id
         -->
    <el-form ref="searchAdmin" :model="params" label-width="80px" :inline="true" size="small">
      <el-form-item label="用户名">
        <el-input v-model="params.userName" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="findUserList">查询</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addUser">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作弹框 -->
    <sys-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :height="dialog.height"
      :width="dialog.width"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <!-- 新增员工弹窗 -->
        <el-form ref="addAdminForm" :model="AdminModel" :rules="rules" label-width="90px" :inline="true" size="normal">
          <el-form-item label="用户名:" prop="userName">
            <el-input v-model="AdminModel.userName" />
          </el-form-item>
          <el-form-item label="用户账户:" prop="userAccount">
            <el-input v-model="AdminModel.userAccount" />
          </el-form-item>
          <el-form-item label="密码:" prop="userPassword">
            <el-input v-model="AdminModel.userPassword" type="password" />
          </el-form-item>
          <el-form-item label="电话:" prop="userPhone">
            <el-input v-model="AdminModel.userPhone" />
          </el-form-item>
          <el-form-item label="确认密码:" prop="checkPass">
            <el-input v-model="AdminModel.checkPass" type="password" />
          </el-form-item>
          <el-form-item label="邮箱:" prop="userEmail">
            <el-input v-model="AdminModel.userEmail" />
          </el-form-item>
          <el-form-item style="width:46%" label="性别:" prop="userSex">
            <el-radio-group v-model="AdminModel.userSex">
              <el-radio :label="66">男</el-radio>
              <el-radio :label="67">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="width:46%" label="用户状态:" prop="userStatus">
            <el-radio-group v-model="AdminModel.userStatus">
              <el-radio :label="31">启用</el-radio>
              <el-radio :label="32">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户角色:" prop="userRoleId">
            <el-radio-group v-model="AdminModel.userRoleId">
              <el-radio :label="20">超级管理员</el-radio>
              <el-radio :label="21">管理员</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item>
                            <el-button type="primary" @click="onSubmit">立即创建</el-button>
                            <el-button>取消</el-button>
                        </el-form-item> -->
        </el-form>

      </div>
    </sys-dialog>
    <!-- 管理员列表elt -->
    <el-table :data="tableList" :height="tableHeight" empty-text="无数据" border stripe>
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="userAccount" label="账户名" />
      <el-table-column prop="userSex" label="用户性别" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.userSex=='66'" size="normal">男</el-tag>
          <el-tag v-show="scope.row.userSex=='67'" type="danger" size="normal">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userRoleId" label="角色" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.userRoleId=='21'" size="normal">管理员</el-tag>
          <el-tag v-show="scope.row.userRoleId=='20'" type="danger" size="normal">超级管理员</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userStatus" label="状态" align="center" width="140px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.userStatus"
            :active-value="31"
            active-text="启用"
            :inactive-value="32"
            inactive-text="停用"
            @change="changeUserStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="small" @click="editUser(scope.row)">编辑</el-button>
          <el-button icon="el-icon-delete" type="danger" size="small" @click="deleteUser(scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页
             @size-change 页容量改变触发的事件
         -->
    <el-pagination
      :current-page.sync="params.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="params.totalNum"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
    />

  </el-main>
</template>

<script>

import { findUserListApi, addUserApi, editUserApi, deleteUserApi } from '@/api/user'
// 引入自定义的对话框组件
import SysDialog from '@/components/system/SysDialog'

export default {
  name: '',
  // 注册组件
  components: {
    SysDialog
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.AdminModel.checkPass !== '') {
          this.$refs.addAdminForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value !== this.AdminModel.userPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      // 弹框组件
      dialog: {
        title: '',
        visible: false,
        height: 410,
        width: 610
      },
      // AdminModel 管理员表单
      AdminModel: {
        userId: '',
        // 判断是添加1还是编辑0
        apiType: '',
        userName: '',
        // 66 男  67女
        userSex: '',
        userAccount: '',
        userPhone: '',
        userEmail: '',
        userPassword: '',
        // 31 启用 32 停用
        userStatus: '',
        checkPass: '',
        userRoleId: ''
      },
      // 表单验证规则
      rules: {
        userName: [{
          required: true, message: '请输入用户名', trigger: 'blur'
        }],
        userSex: [{
          required: true, message: '请选择性别', trigger: 'change'
        }],
        userStatus: [{
          required: true, message: '请选择用户初始状态', trigger: 'change'
        }],
        userPassword: [{
          required: true, validator: validatePass, trigger: 'blur'
        }],
        checkPass: [{
          required: true, validator: validatePass2, trigger: 'blur'
        }],
        userEmail: [{
          validator: this.formValidation.validateEmail, trigger: 'blur'
        }],
        userPhone: [{
          validator: this.formValidation.validatePhone, trigger: 'blur'
        }]
      },
      // 表格高度
      tableHeight: 0,
      params: {
        // 搜索框表单数据
        userName: '',
        currentPage: 1,
        pageSize: 10,
        totalNum: 0,
        dictParentId: 10
      },
      // 管理员表格数据
      tableList: []
    }
  },
  created() {
    // 调用方法
    this.findUserList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 200
    })
  },
  methods: {
    // 更改管理员状态事件
    async changeUserStatus(row) {
      // console.log(row)
      const param = {
        userId: row.userId,
        userStatus: row.userStatus
      }
      const res = await editUserApi(param)
      if (res && res.code === 200) {
        // 更改成功,刷新列表
        this.findUserList()
        this.$message.success(res.msg)
      }
    },
    // 获取管理员列表
    async findUserList() {
      const res = await findUserListApi(this.params)
      // 返回成功
      if (res.code === 200) {
        // console.log(res)
        // console.log(res.data.records.length)
        this.tableList = res.data.records
        this.params.totalNum = res.data.total
        // console.log(res.data.records);
      }
    },
    // 新增管理员
    addUser() {
      // 先清空表单数据,因为新增编辑用的同一个
      this.$resetForm('addAdminForm', this.AdminModel)
      // 新增标识
      this.AdminModel.apiType = '1'
      // this.AdminModel.userRoleId = '21';
      this.dialog.title = '新增用户'
      this.dialog.visible = true
    },
    // 编辑管理员
    editUser(row) {
      // 先清空表单数据,因为新增编辑用的同一个
      this.$resetForm('addAdminForm', this.AdminModel)
      // 编辑标识
      this.AdminModel.apiType = '0'
      this.dialog.title = '编辑用户'
      // 回显数据
      this.$objCoppy(row, this.AdminModel)
      this.dialog.visible = true
      // console.log(row)
    },
    // 删除管理员
    async deleteUser(row) {
      const confirm = await this.$myconfirm('确定删除该用户吗？')
      // console.log(confirm)
      if (confirm) {
        const res = await deleteUserApi({ userId: row.userId })
        if (res && res.code === 200) {
          // 删除成功,刷新列表
          this.findUserList()
          this.$message.success(res.msg)
        }
      }
    },
    // 确认对话框
    onConfirm() {
      this.$refs.addAdminForm.validate(async valid => {
        if (valid) {
          // 验证通过
          let res = null
          if (this.AdminModel.apiType === '1') {
            // 新增
            res = await addUserApi(this.AdminModel)
          } else {
            // 编辑
            res = await editUserApi(this.AdminModel)
          }
          if (res && res.code === 200) {
            // 请求成功 刷新列表
            // console.log(res)
            this.findUserList()
            this.$message.success(res.msg)
          }
          this.dialog.visible = false
        }
      })
    },
    // 对话框关闭
    onClose() {
      this.dialog.visible = false
    },
    // 页面容量改变
    sizeChange(val) {
      // console.log('页面容量val: ' + val)
      // console.log('页面容量:' + this.params.pageSize)
      // 改变页码，重新渲染页面
      this.findUserList()
    },
    // 页数改变时触发
    currentChange(val) {
      // console.log('当前页面：' + val)
      // console.log(`当前页:` + this.params.currentPage)
      this.params.currentPage = val
      // 改变页码，重新渲染页面
      this.findUserList()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
