<template>
  <el-dialog
    top="1vh"
    :title="dialog.title"
    :visible.sync="dialog.visible"
    :width="dialog.width+'px'"
  >
    <!-- 对话框主体 -->
    <div class="container" :style="{height: dialog.height+'px'}">
      <slot name="content">
        <el-form :data="auditData" :inline="true" size="small">

          <el-form-item label="申请人id" prop="userId">
            <el-input v-model="auditData.userId" :disabled="true" />
          </el-form-item>
          <span v-if="auditData.formType===107">&ensp;←←&ensp; </span>
          <!-- <span v-if="auditData.formType===107">←←</span> -->
          <span v-else>&ensp;→→&ensp; </span>
          <el-form-item label="宠物id" prop="articleId">
            <el-input v-model="auditData.petId" :disabled="true" />
          </el-form-item>
          <span v-if="auditData.formType===107"> &ensp;←←&ensp; </span>
          <span v-else> &ensp;→→&ensp; </span>
          <el-form-item label="目标用户id" prop="articleId">
            <el-input v-model="auditData.targetId" :disabled="true" />
          </el-form-item>
        </el-form>
        <el-form :model="petData" :inline="true" label-width="90px">
          <el-form-item label="宠物名" prop="petName">
            <el-input v-model="petData.petName" :disabled="true" />
          </el-form-item>
          <el-form-item label="宠物分类：" prop="petVarietyName">
            <el-input v-model="petData.petVarietyName" :disabled="true" />
          </el-form-item>
          <el-form-item label="宠物状态：" prop="petStatusName">
            <el-input v-model="petData.petStatusName" :disabled="true" />
          </el-form-item>
          <el-form-item label="宠物性别：" prop="petSex">
            <el-tag v-show="petData.petSex=='66'" size="normal">雄</el-tag>
            <el-tag v-show="petData.petSex=='67'" type="danger" size="normal">雌</el-tag>
            <!-- <el-input v-model="petData.petSex" :disabled="true" /> -->
          </el-form-item>
          <el-form-item label="绝育情况：" prop="petNeutered">
            <el-tag v-show="petData.petNeutered=='31'" size="normal">已绝育</el-tag>
            <el-tag v-show="petData.petNeutered=='32'" type="danger" size="normal">未绝育</el-tag>
            <!-- <el-input v-model="petData.petSex" :disabled="true" /> -->
          </el-form-item>
          <el-form-item label="宠物年龄：" prop="petBirthday">
            <template>
              {{ getFormatDate(petData.petBirthday) }}
            </template>
            <!-- <el-input :model="getFormatDate(petData.petBirthday)" :disabled="true" /> -->

            <!--  -->
          </el-form-item>
        </el-form>

        <el-form :data="auditData" label-width="90px" size="small">
          <el-form-item label="审批意见: " prop="auditOpinion">
            <el-input v-model="auditData.auditOpinion" :rows="2" type="textarea" />
          </el-form-item>
        </el-form>
      </slot>

    </div>
    <span slot="footer">
      <el-button type="primary" @click="auditSuccess">审核通过</el-button>
      <el-button type="danger" @click="auditFailure">审核不通过</el-button>
      <el-button type="danger" @click="onClose">取消</el-button>
    </span>
  </el-dialog>
  <!-- <sys-dialog
    :title="dialog.title"
    :visible="dialog.visible"
    :height="dialog.height"
    :width="dialog.width"
    @onClose="onClose"
    @onConfirm="onConfirm"
  >
    <div slot="content">

      <el-form :data="auditData" label-width="90px" :inline="true" size="small">
        <el-form-item label="文章审批申请单id" prop="formId">
          <el-input v-model="auditData.formId" :disabled="true" />
        </el-form-item>
      </el-form>
    </div>
  </sys-dialog> -->
</template>

<script>
// import SysDialog from '@/components/system/SysDialog'
import { findPetByIdApi } from '@/api/pet'
import { toMonths } from '@/utils'
import { editSuccourApplicationFormSuccessApi, editSuccourApplicationFormFailureApi } from '@/api/audit'
export default {
  name: 'SuccourDialog',
  components: {
    // SysDialog
  },
  props: {
    dialog: {
      type: Object,
      default() {
        return {}
      }
    },
    auditData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      petData: {
        petId: '',
        petName: '',
        petVarietyId: '',
        petVarietyName: '',
        petSex: '',
        petNeutered: '',
        petBirthday: ''
      }
    }
  },
  created() {
    // this.findAllArticleCategoryList()
    // this.findAllStatusList()
  },
  mounted() {
  },
  methods: {
    // 对话框关闭
    onClose() {
      console.log('关闭对话框')
      this.dialog.visible = false
    },
    // 审核通过
    async auditSuccess() {
      // 当前登录的管理员id作审核人id
      this.auditData.auditorId = this.$store.getters.userId
      const res = await editSuccourApplicationFormSuccessApi(this.auditData)
      if (res.code === 200) {
        console.log('审核通过')
        console.log(res)
      }
      this.$parent.$parent.findRescueApplicationFormList()
      // this.$emit('listenChildren')
      this.dialog.visible = false
      this.$message.success(res.msg)
    },
    // 审核不通过
    async auditFailure() {
      // 当前登录的管理员id作审核人id
      this.auditData.auditorId = this.$store.getters.userId
      const res = await editSuccourApplicationFormFailureApi(this.auditData)
      if (res.code === 200) {
        console.log('审核不通过')
        console.log(res)
      }
      this.$parent.$parent.findRescueApplicationFormList()
      // this.$emit('listenChildren')
      this.dialog.visible = false
      this.$message.success(res.msg)

    //   await this.$emit('findArticleApplicationForm')
    },
    // 获取宠物
    async findPetById(val) {
      console.log('尝试获取信息')
      // console.log(this.$store.userId)
      // console.log(this.$store.getters.userId)
      const param = {
        petId: val
      }
      // console.log(param.articleId)
      if (param.petId) {
        const res = await findPetByIdApi(param)
        // 返回成功
        if (res.code === 200) {
          // console.log(res)
          // this.articleData.articleId = articleId
          this.petData = res.data
          // this.articleData.articleTags = res.data.articleTags
          // console.log(this.articleData)
          // console.log(res.data.records);
        }
      }
    },
    // 获取格式化后的日期,转换成多少个月
    getFormatDate(date) {
      return toMonths(date)
    }
  }
}
</script>

<style lang="scss" scoped>
    //自定义弹框样式
    .el-dialog__wrapper{
        ::v-deep .el-dialog{
            //圆角框
            border-top-left-radius: 7px;
            border-top-right-radius: 7px;
            .el-dialog__header{
                background-color: #1890ff;
                .el-dialog__title{
                    //字体颜色
                    color: #FFF;
                }
                .el-dialog__close{
                    color: white;
                }
            }
            //对话框主体
            .el-dialog__body{
                padding: 15px;
            }
            //对话框底部
            .el-dialog__footer{
                padding: 10px;
                border-top: 1px solid black !important;
            }
        }
    }
    //边框主体显示
    .container{
        overflow-x: inherit;
        overflow-y: auto;
        .el-form{
            border-bottom: 1px solid black !important;
            span{
                font-size: 20px;
            }
        }
    }
</style>

