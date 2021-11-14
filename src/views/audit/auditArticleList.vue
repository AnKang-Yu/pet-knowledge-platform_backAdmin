<template>
  <el-main>
    <!-- 主要区域容器elma -->

    <!-- 搜索框elf
             ref 表单id
         -->
    <!-- 宠物列表elt -->
    <el-table :data="auditArticleTable" :height="tableHeight" empty-text="无数据" border stripe>
      <el-table-column prop="formId" label="申请ID" width="70px" align="center" />
      <el-table-column prop="userId" label="申请人Id" align="center" />
      <el-table-column prop="articleId" label="文章Id" align="center" />
      <el-table-column prop="updateTime" min-width="150px" label="申请时间" align="center">
        <template slot-scope="scope">
          {{ getFormatDate(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="formStatusName" label="申请状态" align="center" />
      <el-table-column prop="auditTime" min-width="150px" label="审批时间" align="center">
        <template slot-scope="scope">
          {{ getFormatDate(scope.row.auditTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button v-show="scope.row.formStatus===103" icon="el-icon-edit" type="primary" size="mini" @click="openAuditArticleDetail(scope.row)">审核</el-button>
            <!-- <el-popconfirm
              placement="top-start"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :title="`您要永久删除该宠物【${scope.row.petId}】吗？`"
              @onConfirm="deletePet(scope.row)"
            >
              <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-popconfirm> -->
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
    <audit-article-dialog ref="articleDialog" :dialog.sync="dialog" :audit-data.sync="auditData" />
  </el-main>
</template>

<script>
import { findArticleApplicationFormApi } from '@/api/audit'
import { toDate } from '@/utils'
export default {
  name: '',
  components: {
    'audit-article-dialog': () => import('./audioArticleDialog')
  },
  data() {
    return {
      // 搜索表单数据
      params: {
        currentPage: 1,
        pageSize: 10,
        totalNum: 0,
        // 申请单状态
        formStatus: ''
      },
      // 审核文章表格
      auditArticleTable: [],
      // 表格高度
      tableHeight: 0,
      // 弹框组件
      dialog: {
        title: '文章审批申请',
        visible: false,
        height: 560,
        width: 890
      },
      auditData: {}
    }
  },
  watch: {

  },
  created() {
    this.findArticleApplicationForm()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 200
    })
  },
  methods: {
    async findArticleApplicationForm() {
      console.log('查询所有申请单方法')
      const res = await findArticleApplicationFormApi(this.params)
      // 返回成功
      if (res.code === 200) {
        // console.log(res)
        // console.log(res.data.records.length)
        this.auditArticleTable = res.data.records
        this.params.totalNum = res.data.total
        // console.log(res.data.records);
      }
    },
    // 页面容量改变
    sizeChange(val) {
      // console.log('页面容量val: ' + val)
      // console.log('页面容量:' + this.params.pageSize)
      // 改变页码，重新渲染页面
      this.findArticleApplicationForm()
    },
    // 页数改变时触发
    currentChange(val) {
      // console.log('当前页面：' + val)
      // console.log(`当前页:` + this.params.currentPage)
      this.params.currentPage = val
      // 改变页码，重新渲染页面
      this.findArticleApplicationForm()
    },
    // 获取格式化后的日期
    getFormatDate(date) {
      return toDate(date)
    },
    // 打开审批文章弹窗
    openAuditArticleDetail(val) {
      console.log('打开审批文章弹窗')
      console.log(val)
      this.auditData = val
      this.$refs.articleDialog.dialog.visible = true
      this.$refs.articleDialog.findArticleById(this.auditData.articleId)
    }
    // 监听
    // listenChildren() {
    //   this.findArticleApplicationForm()
    // }

  }
}
</script>

<style lang='scss' scoped>

</style>
