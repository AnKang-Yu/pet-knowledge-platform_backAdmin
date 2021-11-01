<template>
  <div class="app-container">
    <el-form label-position="top" :model="articleData">
      <el-form-item prop="articleTitle">
        <el-input v-model="articleData.articleTitle" placeholder="请输入文章标题" />
      </el-form-item>
    </el-form>
    <!-- ishljs: 代码高亮
         change: 编辑区发生变化的回调事件(经过markdown解析后的结果为HTML)
         save: ctrl + s 的回调事件(保存按键,同样触发该回调)
         imgAdd: 图片文件添加回调事件(filename: 写在md中的文件名, File: File Object) @imgAdd="addImage"
         fullScreen: 切换全屏编辑的回调事件(boolean: 全屏开启状态)
         helpToggle: 查看帮助的回调事件(boolean: 帮助开启状态)
    -->
    <mavon-editor
      ref="editor"
      v-model="articleData.articleOriginalContent"
      class="editor"
      :ishljs="true"
      @change="editing"
      @save="saveDraftMsgBox"

      @fullScreen="editorFullscreen"
      @helpToggle="editorNotehelpToggle"
    />
    <div class="operation footer-toolbar">
      <el-button type="info" size="medium" @click="saveDraftMsgBox">保存草稿</el-button>
      <el-button type="primary" size="medium" @click="openPublishDrawer">提 交</el-button>
    </div>
    <!-- 发表文章Drawer
          visible: 是否显示 Drawer，支持 .sync 修饰符
          destroy-on-close: 控制是否在关闭 Drawer 之后将子元素全部销毁, 默认false
          direction: Drawer 打开的方向 , rtl从右往左打开
          before-close: 关闭前的回调，会暂停 Drawer 的关闭
          ,selectAttachmentDrawer?'inner-drawer-open':
    -->
    <el-drawer
      :visible.sync="ifOpenDrawer"
      destroy-on-close
      direction="rtl"
      title="文章设置"
      :class="['inner-drawer',selectAttachmentDrawer?'inner-drawer-open':'inner-drawer-close']"
      :before-close="closePublishDrawer"
    >
      <!-- @attachmentSelected="selectAttachmentDrawer = true" -->
      <article-setting ref="publishDrawer" />
      <div class="footer-toolbar" style="width: 30%">
        <el-button type="primary" size="medium" @click="addArticle">发 表</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { findArticleByIdApi, addArticleApi } from '@/api/article'
// import { uploadAttachment } from '@/api/attachment'
import ArticleSetting from '@/components/system/ArticleSetting'

export default {
  name: 'ArticleDetail',
  components: {
    ArticleSetting
  },
  data() {
    return {
      // 控制抽屉, 默认关闭
      ifOpenDrawer: false,
      selectAttachmentDrawer: false,
      articleData: {
        articleFormatContent: '',
        articleTitle: '',
        url: '',
        articleSummary: '',
        articleOriginalContent: '',
        articleThumbnail: '',
        category: { id: null, name: '' },
        tags: [],
        allowComment: 'ALLOWED_AUDITING'
      }
    }
  },
  // 监听到路由发生改变时，执行函数
  watch: {
    // 对路由变化作出响应...
    $route(to, from) {
      this.findArticleById()
    }
  },
  created() {
    this.findArticleById()
  },
  methods: {
    editing(md, html) {
      // 保存渲染后的html文本
      this.articleData.articleFormatContent = html
    },
    openPublishDrawer() {
      // 把抽屉打开
      this.ifOpenDrawer = true
      setTimeout(() => {
        this.$refs.publishDrawer.setData(this.articleData)
      }, 200)
    },
    closePublishDrawer(done) {
      // 关闭抽屉的时候保存一下
      this.articleData = this.$refs.publishDrawer.getData()
      done()
    },
    editorFullscreen(status, value) {
      const e = document.querySelector('.editor')
      if (e) {
        e.style['z-index'] = status ? 9999 : 1500
      }
    },
    editorNotehelpToggle(status, value) {
      setTimeout(function() {
        const e = document.querySelector('.v-note-help-wrapper')
        if (e) {
          e.style['z-index'] = status ? 9999 : 1600
        }
      }, 36)
    },
    // editor中的上传图片功能
    // addImage(pos, $file) {
    //   const formdata = new FormData()
    //   formdata.append('file', $file)
    //   uploadAttachment(formdata).then(resp => {
    //     this.$message.success(resp.message)
    //     const url = this.baseUrl + resp.data.path
    //     this.$refs.editor.$img2Url(pos, url)
    //   })
    // },
    // 把选择的附件url赋值给博客设置项的thumbnail
    setSelectedAttachmentUrl(data) {
      const path = this.baseUrl + data.path
      this.$refs.publishDrawer.articleData.thumbnail = path
      this.selectAttachmentDrawer = false
    },
    openDetailDrawer(data) {
      this.attachmentDetailDrawer = true
      setTimeout(() => {
        this.$refs.detailDrawer.setData(data)
      }, 200)
    },
    // 保存草稿确认框
    saveDraftMsgBox() {
      this.$confirm('您要把此文章保存至草稿箱吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认
        this.saveDraft()
      }).catch(() => { // 取消
      })
    },
    // 获取博客
    async findArticleById() {
      const blogId = this.$route.query.blogId
      if (blogId) {
        const res = await findArticleByIdApi(this.params)
        // 返回成功
        if (res.code === 200) {
          console.log(res)
          this.articleData.id = blogId
          this.articleData = res.data

        // console.log(res.data.records);
        }
      }
    },
    // 发表文章
    async addArticle() {
      const articleData = this.$refs.publishDrawer.getData()
      const res = await addArticleApi(articleData)
      if (res && res.code === 200) {
        // 请求成功 刷新列表
        console.log(res)
        // this.findUserList()
        this.$message.success(res.msg)
      }
    },
    // 保存草稿
    async saveDraft() {
      this.articleData.status = 'DRAFT'
      const res = await addArticleApi(this.articleData)
      if (res && res.code === 200) {
        // 请求成功 刷新列表
        console.log(res)
        // this.findUserList()
        this.$message.success(res.msg)
      }
    }
  }
}
</script>
<style lang="scss">
.openSidebar {
  .operation {
    width: calc(100% - 210px);
  }
}

.hideSidebar {
  .operation {
    width: calc(100% - 54px);
  }
}
.el-drawer__body{
  overflow: auto;
}
</style>

<style scoped lang="scss">
.editor {
  min-height: 75vh;
}

.operation {
  transition: all .3s;
}

.inner-drawer {
  // top: 0;
  // bottom: 0;
  transition: all .3s;
  // overflow-y: inherit;
  // height: 100%;
  &-open {
    margin-right: 150px;
  }

  &-close {
    margin-right: 0;
  }
}

</style>
