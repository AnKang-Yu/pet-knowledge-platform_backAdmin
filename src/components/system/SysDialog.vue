/* eslint-disable indent */
<template>
  <el-dialog
    top="1vh"
    :title="title"
    :visible.sync="visible"
    :width="width+'px'"
    :before-close="onClose"
  >
    <!-- 对话框主体 -->
    <div class="container" :style="{height: height+'px'}">
      <slot name="content" />
    </div>
    <span slot="footer">
      <el-button type="primary" @click="onConfirm">确认</el-button>
      <el-button type="danger" @click=" onClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  // 接收父组件参数
  props: {
    // Dialog 的标题
    title: {
      type: String,
      default: '标题'
    },
    // 是否显示 Dialog
    visible: {
      type: Boolean,
      default: false
    },
    // Dialog 的宽度
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {}
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 取消事件
    onClose() {
      // 触发父组件的取消事件
      // eslint-disable-next-line indent
          this.$emit('onClose')
    },
    onConfirm() {
      // 触发父组件的确认事件
      this.$emit('onConfirm')
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
    }
</style>
