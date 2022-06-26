<template>
  <el-main>
    <!-- 主要区域容器elma -->

    <!-- 搜索框elf
             ref 表单id
         -->
    <!-- 文章列表elt -->
    <el-table :data="ArticleTable" :height="tableHeight" empty-text="无数据" border stripe>
      <el-table-column prop="articleId" label="文章ID" width="70px" align="center" />
      <!-- <el-table-column prop="articleCreated" label="文章创建时间" min-width="100px" align="center" /> -->
      <el-table-column prop="articleModified" label="文章更新时间" align="center" min-width="150px">
        <template slot-scope="scope">
          {{ getFormatDate(scope.row.articleModified) }}
        </template>
      </el-table-column>
      <el-table-column prop="articleAuthorName" label="文章作者" align="center" />
      <el-table-column prop="articleTitle" label="文章标题" align="center" />
      <el-table-column prop="articleCategoryName" label="文章分类" align="center" />
      <el-table-column prop="articleStatusName" label="文章状态" align="center" />
      <el-table-column prop="articleTags" label="文章标签" align="center">
        <template slot-scope="scope">
          <div class="tag-group">
            <el-tag v-for="(tag,index) in scope.row.articleTags" :key="index" :type="getRandomTagType()" size="mini">
              {{ tag.tagName }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="articleAllowComment" label="评论" align="center" width="100px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.articleAllowComment"
            :active-value="1"
            active-text="开"
            :inactive-value="0"
            inactive-text="关"
            @change="changeArticleAllowCommentStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180px">
        <template slot-scope="scope">
          <el-button-group>
            <!-- createArticle.vue的name 就是 ArticleModel -->
            <router-link
              class="el-button el-button--primary el-button--mini"
              :to="{name:'ArticleModel', query:{articleId:scope.row.articleId}}"
            >编辑
            </router-link>
            <el-popconfirm
              placement="top-start"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :title="scope.row.articleStatusId===97
                ?`您要永久删除博客【${scope.row.articleTitle}】吗？`
                :`您要将博客【${scope.row.articleTitle}】移至回收站吗？`"
              @onConfirm="deleteArticle(scope.row)"
            >
              <el-button v-if="scope.row.articleStatusId===97" slot="reference" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              <el-button v-else slot="reference" type="danger" size="mini" icon="el-icon-delete">回收站</el-button>
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

import { findArticleListApi, changeArticleAllowCommentStatusApi, deleteArticleApi } from '@/api/article'
// import { fmtDate } from '@utils/Date.js'
import { toDate, randomTagType } from '@/utils'
export default {
  name: '',
  // components: {
  //   mavonEditor
  // },
  data() {
    return {
      params: {
        // 搜索表单数据
        currentPage: 1,
        pageSize: 10,
        totalNum: 0,
        articleStatus: ''
      },
      // 表格高度
      tableHeight: 0,
      // 在线文章列表数据
      ArticleTable: []
    }
  },
  created() {
    // 调用方法
    this.findArticleList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 200
    })
  },
  methods: {
    // 获取文章列表
    async findArticleList() {
      const res = await findArticleListApi(this.params)
      // 返回成功
      if (res.code === 200) {
        this.ArticleTable = res.data.records
        this.params.totalNum = res.data.total
        // console.log(res.data.records);
      }
    },

    // 获取随机标签样式
    getRandomTagType() {
      return randomTagType()
    },
    // 获取格式化后的日期
    getFormatDate(date) {
      return toDate(date)
    },
    // 更改文章评论状态事件
    async changeArticleAllowCommentStatus(row) {
      // console.log(row)
      const param = {
        articleId: row.articleId,
        articleAllowComment: row.articleAllowComment
      }
      const res = await changeArticleAllowCommentStatusApi(param)
      if (res && res.code === 200) {
        // 更改成功,刷新列表
        this.findArticleList()
        this.$message.success(res.msg)
      }
    },
    // 删除文章,更改文章的状态, 不是回收站状态的移入回收站，是回收站的就彻底删除
    async deleteArticle(row) {
      // console.log('11223')
      // console.log(row)
      const param = {
        articleId: row.articleId
        // articleStatusId: row.articleStatusId
      }
      const res = await deleteArticleApi(param)
      if (res && res.code === 200) {
        // 删除成功,刷新列表
        this.findArticleList()
        this.$message.success(res.msg)
      }
    },
    // 页面容量改变
    sizeChange(val) {
      // console.log('页面容量val: ' + val)
      // console.log('页面容量:' + this.params.pageSize)
      // 改变页码，重新渲染页面
      this.findArticleList()
    },
    // 页数改变时触发
    currentChange(val) {
      // console.log('当前页面：' + val)
      // console.log(`当前页:` + this.params.currentPage)
      this.params.currentPage = val
      // 改变页码，重新渲染页面
      this.findArticleList()
    }
  }
}
</script>

<style lang='scss' scoped>
.tag-group {
  .el-tag {
    margin-right: 3px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
