<template>
  <div class="drawer-content">
    <el-form ref="articleForm" label-position="top" :model="articleData" size="small">
      <el-form-item label="文章标题：" prop="articleTitle">
        <el-input v-model="articleData.articleTitle" placeholder="请输入文章标题" />
      </el-form-item>
      <!-- <el-form-item label="博客路径：" prop="url">
        <el-input v-model="articleData.url" placeholder="请输入文章访问路径，默认为文章标题" />
      </el-form-item> -->
      <el-form-item label="允许评论：" prop="allowComment">
        <el-radio-group v-model="articleData.allowComment">
          <el-radio label="ALLOWED_AUDITING">允许 | 需要审核</el-radio>
          <el-radio label="ALLOWED_PASSAUTO">允许 | 无需审核</el-radio>
          <el-radio label="UNALLOWED">不允许</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="置顶数值：" prop="topRank">
        <el-input-number v-model="articleData.topRank" controls-position="right" style="width: 100%" />
        <p class="input-tips">* 值越大越靠前</p>
      </el-form-item> -->
      <el-form-item label="博客分类：" prop="categoryId">
        <el-select v-model="articleData.category.id" placeholder="请选择博客分类" filterable>
          <el-option
            v-for="category in usedCategoryList"
            :key="category.id"
            :value="category.id"
            :label="category.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="博客标签：" prop="tags">
        <el-select
          v-model="selectedTagList"
          multiple
          filterable
          clearable
          allow-create
          placeholder="请选择文章标签"
        >
          <el-option
            v-for="tag in tagList"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
        <p class="input-tips">* 可以选择已有标签或输入新标签</p>
      </el-form-item>
      <el-form-item label="博客摘要：" prop="articleSummary">
        <el-input v-model="articleData.articleSummary" :rows="3" type="textarea" placeholder="不填写会自动生成" />
      </el-form-item>
      <el-form-item label="博客封面：" prop="articleThumbnail">
        <div @click="selectAttachment">
          <el-tooltip effect="dark" placement="top" content="点击选择封面图片">
            <v-image :src="articleData.articleThumbnail" class="thumbnail">
              <div slot="error" class="placeholder">
                <svg-icon icon-class="img-placeholder" class-name="icon" />
                <div class="text">No articleThumbnail</div>
              </div>
            </v-image>
          </el-tooltip>
        </div>
        <el-input v-model="articleData.articleThumbnail" clearable placeholder="请输入图片链接或选择图片" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { listAllCategory } from '@/api/category'
// import { listAllTags } from '@/api/tag'

import { findAllCategoryListApi, findAllTagsListApi } from '@/api/article'

export default {
  name: 'SettingDrawer',
  components: {
    'v-image': () => import('@/components/system/SimpleImage')
  },
  data() {
    return {
      drawer: false,
      articleData: {
        articleFormatContent: '',
        articleOriginalContent: '',
        articleTitle: '',
        url: '',
        articleSummary: '',
        articleThumbnail: '',
        category: { id: null, name: '' },
        tags: [],
        allowComment: 'ALLOWED_AUDITING'
      },
      usedCategoryList: [],
      tagList: [],
      selectedTagList: []
    }
  },
  created() {
    // this.findAllCategoryList()
    // this.findAllTagsList()
  },
  methods: {
    setData(data) {
      this.articleData = JSON.parse(JSON.stringify(data))
      if (!this.articleData.category) {
        this.articleData.category = { id: null, name: '' }
      }
      this.selectedTagList = []
      for (const tag of this.articleData.tags) {
        this.selectedTagList.push(tag.id)
      }
    },
    getData() {
      this.articleData.tags = []
      for (const tagId of this.selectedTagList) {
        let isFound = false
        for (const tag of this.tagList) {
          if (tagId === tag.id) {
            isFound = true
            this.articleData.tags.push({ id: tagId })
            break
          }
        }
        if (!isFound) {
          this.articleData.tags.push({ name: tagId })
        }
      }
      return this.articleData
    },
    selectAttachment() {
      this.$emit('attachmentSelected')
    },
    // 获取已经用的博客分类
    async findAllCategoryList() {
      const res = await findAllCategoryListApi()
      this.usedCategoryList = res.data
    },
    // 获取所有博客标签
    async findAllTagsList() {
      const res = await findAllTagsListApi()
      this.tagList = res.data
    }
  }
}
</script>

<style lang="scss">

.el-select {
  width: 100%;
}

.el-drawer__header {
  span[role=heading] {
    border: none;
  }
}

</style>

<style scoped lang="scss">

.drawer-content {
  // overflow-y: auto;
  // height: 100%;
   padding: 0 20px;
   margin-bottom: 100px;

  .thumbnail {
    margin-bottom: 5px;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;

    .placeholder {
      width: 100%;
      transition: all .5s;

      .icon {
        font-size: 100px;
      }

      .text {
        text-align: center;
        font-size: 20px;
        color: white;
      }
    }
  }
}

</style>
