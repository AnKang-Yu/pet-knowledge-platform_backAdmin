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
        <el-form :data="auditData" label-width="90px" :inline="true" size="small">
          <el-form-item label="申请单id" prop="formId">
            <el-input v-model="auditData.formId" :disabled="true" />
          </el-form-item>
          <el-form-item label="申请人id" prop="userId">
            <el-input v-model="auditData.userId" :disabled="true" />
          </el-form-item>
          <el-form-item label="文章id" prop="articleId">
            <el-input v-model="auditData.articleId" :disabled="true" />
          </el-form-item>
        </el-form>
        <el-form :model="articleData" :inline="true" label-width="90px">
          <el-form-item prop="articleTitle" label="文章标题">
            <el-input v-model="articleData.articleTitle" :disabled="true" />
          </el-form-item>
          <el-form-item label="文章分类：" prop="articleCategoryid">
            <el-select v-model="articleData.articleCategoryid" disabled>
              <el-option
                v-for="category in articleCategoryList"
                :key="category.dict_id"
                :value="category.dict_id"
                :label="category.dict_value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文章标签：" prop="articleTags">

            <el-cascader
              v-model="articleData.articleTags"
              :options="tagList"
              :props="cascaderProps"
              :show-all-levels="false"
              size="mini"
              disabled
            />
          </el-form-item>
          <el-form-item prop="articleSummary" label="文章摘要">
            <el-input v-model="articleData.articleSummary" :rows="1" type="textarea" :disabled="true" />
          </el-form-item>
        </el-form>
        <div>
          <mavon-editor
            ref="editor"
            v-model="articleData.articleOriginalContent"
            default-open="preview"
            :subfield="false"
            :ishljs="true"
            :editable="false"
            :toolbars-flag="false"
          />
        </div>

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
import { findArticleByIdApi, findAllArticleCategoryListApi, findAllTagsListApi } from '@/api/article'
import { editArticleApplicationFormSuccessApi, editArticleApplicationFormFailureApi } from '@/api/audit'
export default {
  name: 'ArticleDialog',
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
      articleData: {
        articleId: '',
        articleFormatContent: '',
        articleTitle: '',
        // url: '',
        articleSummary: '',
        articleOriginalContent: '',
        articleThumbnail: '',
        articleCategoryid: '',
        articleTags: [],
        articleAllowComment: '',
        file: null
      },
      // 级联选择器
      tagList: [],
      // selectedTagList: [],
      cascaderProps: {
        multiple: true,
        checkStrictly: true,
        value: 'dictId',
        label: 'dictValue',
        children: 'list'
      },
      articleCategoryList: []
    }
  },
  created() {
    this.findAllArticleCategoryList()
    this.findAllTagsList()
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
      const res = await editArticleApplicationFormSuccessApi(this.auditData)
      if (res.code === 200) {
        // console.log('审核通过')
        // console.log(res)
      }
      this.$parent.$parent.findArticleApplicationForm()
      // this.$emit('listenChildren')
      this.dialog.visible = false
      this.$message.success(res.msg)
    },
    // 审核不通过
    async auditFailure() {
      // 当前登录的管理员id作审核人id
      this.auditData.auditorId = this.$store.getters.userId
      const res = await editArticleApplicationFormFailureApi(this.auditData)
      if (res.code === 200) {
        // console.log('审核不通过')
        // console.log(res)
      }
      this.$parent.$parent.findArticleApplicationForm()
      // this.$emit('listenChildren')
      this.dialog.visible = false
      this.$message.success(res.msg)

    //   await this.$emit('findArticleApplicationForm')
    },
    // 获取博客
    async findArticleById(val) {
      console.log('尝试获取信息')
      // console.log(this.$store.userId)
      // console.log(this.$store.getters.userId)
      const param = {
        articleId: val
      }
      // console.log(param.articleId)
      if (param.articleId) {
        const res = await findArticleByIdApi(param)
        // 返回成功
        if (res.code === 200) {
          // console.log(res)
          // this.articleData.articleId = articleId
          this.articleData = res.data.articleData
          this.articleData.articleTags = res.data.articleTags
          // console.log(this.articleData)
          // console.log(res.data.records);
        }
      }
    },
    // 获取已经用的博客分类
    async findAllArticleCategoryList() {
      const res = await findAllArticleCategoryListApi()
      // console.log(res)
      if (res && res.code === 200) {
        this.articleCategoryList = res.data
      }
      // console.log('父组件传来的')
      // console.log(this.articleData)
    },
    // 获取所有博客标签
    async findAllTagsList() {
      const res = await findAllTagsListApi()
      // console.log('博客标签' + res.data)
      if (res && res.code === 200) {
        this.tagList = res.data
        // console.log(this.articleData)
      }
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
        }
    }
</style>

