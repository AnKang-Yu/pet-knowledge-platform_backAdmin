<template>
  <div class="drawer-content">
    <el-form ref="articleForm" label-position="top" :model="articleData" size="small">
      <el-form-item label="文章标题：" prop="articleTitle">
        <el-input v-model="articleData.articleTitle" placeholder="请输入文章标题" />
      </el-form-item>
      <!-- <el-form-item label="博客路径：" prop="url">
        <el-input v-model="articleData.url" placeholder="请输入文章访问路径，默认为文章标题" />
      </el-form-item> -->
      <el-form-item label="允许评论：" prop="articleAllowComment">
        <el-radio-group v-model="articleData.articleAllowComment">
          <el-radio :label="1">允许 </el-radio>
          <el-radio :label="0">不允许</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="置顶数值：" prop="topRank">
        <el-input-number v-model="articleData.topRank" controls-position="right" style="width: 100%" />
        <p class="input-tips">* 值越大越靠前</p>
      </el-form-item> -->
      <el-form-item label="文章分类：" prop="articleCategoryid">
        <el-select v-model="articleData.articleCategoryid" placeholder="请选择博客分类" filterable>
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
          placeholder="请选择"
          :options="tagList"
          :props="cascaderProps"
          filterable
          :clearable="true"
          :show-all-levels="false"
          size="mini"
        />
        <!-- <el-select
          v-model="selectedTagList"
          multiple
          filterable
          clearable
          allow-create
          placeholder="请选择文章标签"
        >
          <el-option
            v-for="tag in tagList"
            :key="tag.dict_id"
            :label="tag.dict_value"
            :value="tag.dict_id"
          />
        </el-select> -->
        <p class="input-tips">* 选择已有标签</p>
      </el-form-item>
      <el-form-item label="文章摘要：" prop="articleSummary">
        <el-input v-model="articleData.articleSummary" :rows="3" type="textarea" placeholder="选填项目" />
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

import { findAllArticleCategoryListApi, findAllTagsListApi } from '@/api/article'

export default {
  name: 'SettingDrawer',
  components: {
    'v-image': () => import('@/components/system/SimpleImage')
  },
  // eslint-disable-next-line vue/require-prop-types
  props: {
    articleData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
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
      // 抽屉
      drawer: false,
      // articleData: {
      //   articleFormatContent: '',
      //   articleOriginalContent: '',
      //   articleTitle: '',
      //   url: '',
      //   articleSummary: '',
      //   articleThumbnail: '',
      //   articleCategoryid: '',
      //   articleTags: [],
      //   articleAllowComment: ''
      // },
      articleCategoryList: []
    }
  },
  watch: {
    articleData(newVal, we) {
      console.log('xxx')
    }
  },
  created() {
    this.findAllArticleCategoryList()
    this.findAllTagsList()
  },
  methods: {
    // setData(data) {
    //   // JSON.parse(JSON.stringify(data))
    //   this.articleData = data
    //   console.log('setData')
    //   console.log(this.articleData.articleTags)
    //   this.selectedTagList = this.articleData.articleTags
    //   console.log(this.selectedTagList)
    //   // if (!this.articleData.category) {
    //   //   this.articleData.category = { id: null, name: '' }
    //   // }
    //   // this.selectedTagList = []
    //   // for (const tag of this.articleData.articleTags) {
    //   //   this.selectedTagList.push(tag)
    //   // }
    // },
    // getData() {
    //   // this.articleData.articleTags = []
    //   // for (const dictId of this.selectedTagList) {
    //   //   let isFound = false
    //   //   for (const tag of this.tagList) {
    //   //     if (dictId === tag.dictId) {
    //   //       isFound = true
    //   //       this.articleData.articleTags.push({ dictId: dictId })
    //   //       break
    //   //     }
    //   //   }
    //   //   if (!isFound) {
    //   //     this.articleData.articleTags.push({ dictValue: dictId })
    //   //   }
    //   // }
    //   // return this.articleData
    // },
    selectAttachment() {
      this.$emit('attachmentSelected')
    },
    // 获取已经用的博客分类
    async findAllArticleCategoryList() {
      const res = await findAllArticleCategoryListApi()
      // console.log(res)
      if (res && res.code === 200) {
        this.articleCategoryList = res.data
      }
      console.log('父组件传来的')
      console.log(this.articleData)
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
