<template>
  <el-main>
    <!-- 主要区域容器elma -->
    <el-form ref="searchPet" :model="params" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-button type="primary" icon="el-icon-add" size="small" @click="addPet">添加</el-button>
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
      <!-- :rules="rules" -->
      <div slot="content">
        <!-- 新增宠物弹窗 -->
        <el-form ref="petForm" :model="petModel" label-width="90px" :inline="true" size="small">
          <el-form-item style="width:46%" label="宠物名:" prop="petName">
            <el-input v-model="petModel.petName" />
          </el-form-item>
          <el-form-item style="width:46%" label="宠物状态：" prop="petStatusId">
            <el-select v-model="petModel.petStatusId" placeholder="请选择宠物状态" filterable>
              <el-option
                v-for="status in petStatusList"
                :key="status.dictIid"
                :value="status.dictId"
                :label="status.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="width:46%" label="性别:" prop="petVarietyId">
            <el-radio-group v-model="petModel.petSex">
              <el-radio :label="66">雄</el-radio>
              <el-radio :label="67">雌</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="width:46%" label="绝育状况:" prop="petNeutered">
            <el-radio-group v-model="petModel.petNeutered">
              <el-radio :label="31">已绝育</el-radio>
              <el-radio :label="32">未绝育</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生日期:" prop="petBirthday">
            <el-date-picker
              v-model="petModel.petBirthday"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="所属分类:" prop="petVarietyId">
            <el-cascader
              v-model="petModel.petVarietyId"
              placeholder="请选择"
              :options="varietyList"
              :props="cascaderProps"
              filterable
              :clearable="true"
              :show-all-levels="false"
              size="mini"
            />
            <!-- <el-select v-model="petModel.petVarietyId" placeholder="请选择该宠物分类" filterable>
              <el-option
                v-for="category in articleCategoryList"
                :key="category.dict_id"
                :value="category.dict_id"
                :label="category.dict_value"
              />
            </el-select> -->
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
    <!-- 搜索框elf
             ref 表单id
         -->
    <!-- 宠物列表elt -->
    <el-table :data="PetTable" :height="tableHeight" empty-text="无数据" border stripe>
      <el-table-column prop="petId" label="宠物ID" width="70px" align="center" />
      <el-table-column prop="petOwnerId" label="宠物主人Id" align="center" />
      <el-table-column prop="petName" label="宠物名" align="center" />
      <el-table-column prop="petVarietyName" label="宠物品种" align="center" />
      <el-table-column prop="petSex" label="宠物性别" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.petSex=='66'" size="normal">雄</el-tag>
          <el-tag v-show="scope.row.petSex=='67'" type="danger" size="normal">雌</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="petNeutered" label="绝育情况" align="center">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.petNeutered=='31'" size="normal">已绝育</el-tag>
          <el-tag v-show="scope.row.petNeutered=='32'" type="danger" size="normal">未绝育</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="petStatusName" label="宠物状态" align="center" width="100px" />
      <el-table-column prop="petBirthday" label="宠物年龄" align="center" width="100px">
        <template slot-scope="scope">
          {{ getFormatDate(scope.row.petBirthday) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="editPet(scope.row)">编辑</el-button>
            <el-popconfirm
              placement="top-start"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :title="`您要永久删除该宠物【${scope.row.petId}】吗？`"
              @onConfirm="deletePet(scope.row)"
            >
              <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
          </el-button-group>
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
import { findAllVarietyListApi, findAllStatusListApi, findPetListApi, addPetApi, editPetApi, deletePetApi } from '@/api/pet'
import { toMonths } from '@/utils'
// 引入自定义的对话框组件
import SysDialog from '@/components/system/SysDialog'
export default {
  name: '',
  // 注册组件
  components: {
    SysDialog
  },
  data() {
    return {
      // 日期时间选择器
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }],
        // 禁用之后的日期选择
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      },
      // 级联选择器
      varietyList: [],
      cascaderProps: {
        multiple: false,
        checkStrictly: false,
        value: 'dictId',
        label: 'dictValue',
        children: 'list'
      },
      petStatusList: [],
      // 弹框组件
      dialog: {
        title: '',
        visible: false,
        height: 210,
        width: 640
      },
      petModel: {
        petId: '',
        petName: '',
        petVarietyId: '',
        petSex: '',
        petNeutered: '',
        petBirthday: ''
      },
      // 搜索表单数据
      params: {
        currentPage: 1,
        pageSize: 10,
        totalNum: 0,
        // 宠物主人Id
        petOwnerId: '',
        // 宠物品种
        petVarietyId: '',
        // 绝育情况
        petNeutered: ''
      },
      // 宠物表格数据
      PetTable: [],
      // 表格高度
      tableHeight: 0
    }
  },
  created() {
    // 调用方法
    this.findPetList()
    this.findAllVarietyList()
    this.findAllStatusList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 200
    })
  },
  methods: {
    // 查询
    async findPetList() {
      const res = await findPetListApi(this.params)
      // 返回成功
      if (res.code === 200) {
        // console.log(res)
        // console.log(res.data.records.length)
        this.PetTable = res.data.records
        this.params.totalNum = res.data.total
        // console.log(res.data.records);
      }
    },
    /**
     * 查询宠物所有分类列表
     */
    async findAllVarietyList() {
      const res = await findAllVarietyListApi()
      if (res && res.code === 200) {
        this.varietyList = res.data
      }
    },
    /**
     * 查询宠物所有状态列表
     */
    async findAllStatusList() {
      const res = await findAllStatusListApi()
      if (res && res.code === 200) {
        this.petStatusList = res.data
      }
    },
    // 获取格式化后的日期,转换成多少个月
    getFormatDate(date) {
      return toMonths(date)
    },
    // 新增宠物
    addPet() {
      // 先清空表单数据,因为新增编辑用的同一个
      this.$resetForm('petForm', this.petModel)
      // 新增标识
      this.petModel.apiType = '1'
      this.petModel.petOwnerId = 0
      this.dialog.title = '新增宠物'
      this.dialog.visible = true
    },
    // 编辑宠物
    editPet(row) {
      // 先清空表单数据,因为新增编辑用的同一个
      this.$resetForm('petForm', this.petModel)
      // 编辑标识
      this.petModel.apiType = '0'
      this.dialog.title = '编辑宠物'
      // 回显数据
      this.$objCoppy(row, this.petModel)
      this.dialog.visible = true
      // console.log(row)
    },
    async deletePet(row) {
      const param = {
        petId: row.petId
      }
      const res = await deletePetApi(param)
      if (res && res.code === 200) {
        // 删除成功,刷新列表
        this.findPetList()
        this.$message.success(res.msg)
      }
    },
    // 确认对话框
    onConfirm() {
      this.$refs.petForm.validate(async valid => {
        if (valid) {
          // 验证通过
          let res = null
          // 原先获取的是一个数组，取最后算是该宠物的分类列表ID
          const val = this.petModel.petVarietyId
          this.petModel.petVarietyId = val[val.length - 1]
          if (this.petModel.apiType === '1') {
            // 新增
            console.log(this.petModel)
            res = await addPetApi(this.petModel)
          } else {
            // 编辑
            console.log(this.petModel)
            res = await editPetApi(this.petModel)
          }
          if (res && res.code === 200) {
            // 请求成功 刷新列表
            // console.log(res)
            this.findPetList()
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
      this.findPetList()
    },
    // 页数改变时触发
    currentChange(val) {
      // console.log('当前页面：' + val)
      // console.log(`当前页:` + this.params.currentPage)
      this.params.currentPage = val
      // 改变页码，重新渲染页面
      this.findPetList()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
