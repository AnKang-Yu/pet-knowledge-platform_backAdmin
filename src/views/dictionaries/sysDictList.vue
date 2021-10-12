<template>
    <el-main>
        <!-- 主要区域容器elma -->
        <!-- 搜索框elf
             ref 表单id
         -->
        <el-form :model="params" ref="searchDict"  label-width="80px" :inline="true" size="small">

             <el-cascader
                placeholder="请选择"
                :options="options"
                :props="props"
                filterable
                :clearable="true"
                :show-all-levels="false"
                :change-on-select="true"
                @change="handleChange"
                size="mini"
            ></el-cascader>

            <!-- <el-form-item label="字典">
                <el-input v-model="params.dictParentId"></el-input>
            </el-form-item> -->
            <el-form-item>
                <el-button @click="addDict" type="primary" icon="el-icon-circle-plus-outline" >新增</el-button>
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
                <!-- 新增字典弹窗 -->
                    <el-form :model="DictModel" ref="addDictForm" :rules="rules" label-width="90px" :inline="true" size="normal">
                        <el-form-item label="字典Id:" prop="dictId">
                            <el-input v-model="DictModel.dictId"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="字典Code:" prop="dictCode">
                            <el-input v-model="DictModel.dictCode"></el-input>
                        </el-form-item>
                        <el-form-item label="字典名称:" prop="dictValue">
                            <el-input v-model="DictModel.dictValue"></el-input>
                        </el-form-item>
                        <el-form-item label="字典备注:" prop="dictRemark">
                            <el-input v-model="DictModel.dictRemark"></el-input>
                        </el-form-item>
                        <el-form-item label="父字典Id:" prop="dictParentId">
                            <el-cascader
                                v-model="DictModel.dictParentId"
                            	ref="cascaderDict"
                                placeholder="请选择"
                                :options="options"
                                :props="props"
                                filterable
                                :clearable="true"
                                :show-all-levels="false"
                                :change-on-select="true"
                                @change="dialogOperationChange"
                                size="mini"
                            ></el-cascader>
                        </el-form-item> 
                        <el-form-item style="width:46%" label="字典状态:" prop="dictStatus">
                            <el-radio-group v-model="DictModel.dictStatus">
                                <el-radio :label="1">启用</el-radio>
                                <el-radio :label="0">停用</el-radio>
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
        <el-table :data="tableList" :height="tableHeight" empty-text="无数据" border stripe >
            <el-table-column prop="dictId" label="字典ID" width="70px" align="center"></el-table-column>
            <el-table-column prop="dictCode" label="字典码" min-width="100px" align="center"></el-table-column>
            <el-table-column prop="dictValue" label="字典名" align="center"></el-table-column>
            <el-table-column prop="dictRemark" label="字典备注" align="center"></el-table-column>
            <el-table-column prop="dictParentId" label="父字典ID" align="center"></el-table-column>
            <el-table-column prop="dictParentValue" label="父字典名" align="center"></el-table-column>
           
            <el-table-column prop="dictStatus" label="字典状态" align="center" width="140px">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.dictStatus" :active-value="1" 
                    active-text="启用" :inactive-value="0" inactive-text="停用" 
                    @change="changeDictStatus(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column  label="操作" align="center" width="180px">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit" type="primary" size="small" @click="editDict(scope.row)">编辑</el-button>
                    <el-button icon="el-icon-delete" type="danger" size="small" @click="deleteDict(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页
             @size-change 页容量改变触发的事件
         -->
        <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page.sync="params.currentPage"
            :page-sizes="[10, 20, 40, 80, 100]"
            :page-size="params.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="params.totalNum" background>
            
        </el-pagination>
        
    </el-main>
</template>

<script>

import {findDictListApi,addDictApi,editDictApi,deleteDictApi,findAllDictByParentIdApi} from '@/api/dict'
//引入自定义的对话框组件
import SysDialog from '@/components/system/SysDialog'


export default {
  name: '',
  //注册组件
  components:{
      SysDialog
  },
  data () {
    return {
        // ParentId:[],
         //selectedOptions:'',
         //cascaderDict:'',
         //级联选择器
         options:[],
         props:{
             value:'dictId',
             label:'dictValue',
             children:'list'
         },
        //弹框组件
        dialog:{
            title: "",
            visible: false,
            height: 410,
            width: 610
        },
        //DictModel 字典表单
        DictModel:{
            dictId:'',
            //判断是添加1还是编辑0
            apiType:'',
            dictValue: '',
            dictParentId: '',
            dictParentValue: '',
            //1 启用 0 停用
            dictStatus: '',
            dictRemark: '',
            dictCode: ''
        },
        //表单验证规则
        rules:{
            // dictValue:[{
            //      required: true, message: '请输入字典名', trigger: 'blur'
            // }]
        },
        //表格高度
        tableHeight: 0,
        params:{
            // 搜索框表单数据
            dictParentId: '',
            currentPage: 1,
            pageSize: 10,
            totalNum: 0
        },
        //字典表格数据
        tableList:[]
    }
  },
  methods: {
      // 根据父字典Id查字典
      async findAllDictByParentId(){
        //   if(this.ParentDict ==''){
        //       this.ParentDict = 0;
        //   }
         
          let res = await findAllDictByParentIdApi();
          console.log(res);
          //返回成功
          if(res.code == 200){
            //console.log(res);
            this.options = res.data;
          }
      },
      //查询的级联选择器
        handleChange(val){
            val = val.toString();
           //获取最后一个/的位置
            var site = val.lastIndexOf(",");
            //截取最后一个/后的值
            var result =  val.substring(site + 1, val.length);
            console.log("下拉菜单  "+result);
            this.params.dictParentId = result;
            this.findDictList();
      },
      //操作的级联选择器
      dialogOperationChange(val){
            //console.log("val"+val)
            console.log("操作的级联选择器"+val)
            
            console.log("进去了")
            val = val.toString();
            //获取最后一个/的位置
            var site = val.lastIndexOf(",");
            //截取最后一个/后的值
            var result =  val.substring(site + 1, val.length);
            console.log("dictParentId = "+result)
            this.DictModel.dictParentId = result;
            console.log("dictParentId = "+this.DictModel.dictParentId)
            //console.log("修改前的dictParentValue = " +  this.DictModel.dictParentValue)
            //console.log(this.$refs['cascaderDict'].getCheckedNodes()[0].label)
           if(val != null && val ){
               console.log("val=" +val)
               this.DictModel.dictParentValue = this.$refs['cascaderDict'].getCheckedNodes()[0].label
           }
            
                
            
            
            //console.log("修改后的dictParentValue = " +  this.DictModel.dictParentValue)
                  
      },
      //更改字典状态事件
      async changeDictStatus(row){
          console.log(row);
          let param = {
              dictId: row.dictId,
              dictStatus: row.dictStatus
          }
          let res = await editDictApi(param);
          if(res && res.code == 200){
                 //更改成功,刷新列表
                 this.findDictList();
                 this.$message.success(res.msg);
            }
      },
      //获取字典列表
      async findDictList(){
          let res = await findDictListApi(this.params);
          console.log(res);
          //返回成功
          if(res.code == 200){
            console.log(res);
            console.log(res.data.records.length);
            this.tableList = res.data.records;
            this.params.totalNum = res.data.total;
            //console.log(res.data.records);
          }
      },
      //新增字典
      addDict(){
          //先清空表单数据,因为新增编辑用的同一个
          this.$resetForm('addDictForm',this.DictModel);
          
        //   this.$refs['cascaderDict'].panel.activePath = []
        //   this.$refs['cascaderDict'].panel.calculateCheckedNodePaths()
          //新增标识
          this.DictModel.apiType = '1';
          this.dialog.title = "新增字典";
          this.dialog.visible = true;
      },
      //编辑字典
      editDict(row){
           //先清空表单数据,因为新增编辑用的同一个
          this.$resetForm('addDictForm',this.DictModel);
        //   this.$nextTick(function () { // 等待this.$refs生成
        //         let obj = {}
        //         obj.stopPropagation = () => {}
        //         try{
        //             this.$refs.cascaderDict.clearValue(obj)
        //         }catch(err){
        //             this.$refs.cascaderDict.handleClear(obj)
        //         }
        //     });
                
               
            //  this.$refs['cascaderDict'].panel.activePath = []
            // this.$refs['cascaderDict'].panel.calculateCheckedNodePaths()

          //编辑标识
          this.DictModel.apiType = '0';
          this.dialog.title = "编辑字典";
          //回显数据
          this.$objCoppy(row,this.DictModel)
          this.dialog.visible = true;
          //console.log(row);
      },
      //删除字典
      async deleteDict(row){
         let confirm = await this.$myconfirm("确定删除该字典吗？")
         console.log(confirm);
         if(confirm){
             let  res = await deleteDictApi({dictId : row.dictId});
             if(res && res.code == 200){
                 //删除成功,刷新列表
                 this.findDictList();
                 this.$message.success(res.msg);
             }
         }
      },
      //确认对话框
      onConfirm(){
          this.$refs.addDictForm.validate(async valid=>{
              if(valid){
                  //验证通过
                  let res = null;
                  console.log(this.DictModel.dictParentId)
                  if(this.DictModel.apiType ==='1'){
                      //新增
                      res = await addDictApi(this.DictModel);
                  }else{
                      //编辑
                      res = await editDictApi(this.DictModel);
                  }
                  if(res && res.code === 200){
                      //请求成功 刷新列表
                      console.log(res);
                      console.log("刷新")
                      //新增或编辑字典后在查询会导致一些奇怪的错误，原因是因为之前查询的时候当前页面还是保持着
                      //原先的页面数，导致在后端查询显示无数据
                      this.params.currentPage = 1;
                      this.findDictList();
                      this.$message.success(res.msg);
                  }
                  this.dialog.visible = false;
              }
          })
      },
      //对话框关闭
      onClose(){
          this.dialog.visible = false;
          this.$nextTick(function () { // 等待this.$refs生成
                // let obj = {}
                // obj.stopPropagation = () => {}
                // try{
                //     this.$refs.cascaderDict.clearValue(obj)
                // }catch(err){
                //     this.$refs.cascaderDict.handleClear(obj)
                // }
                // 清空级联选择器选中状态
                this.$refs.cascaderDict.$refs.panel.clearCheckedNodes()
                this.$refs.cascaderDict.$refs.panel.calculateCheckedNodePaths()
            });
      },
       //页面容量改变
      sizeChange(val){
          console.log("页面容量val: "+ val);
          console.log("页面容量:"+ this.params.pageSize);
          //改变页码，重新渲染页面
          this.findDictList()
      },
      //页数改变时触发
      currentChange(val){
          console.log("当前页面：" + val);
          console.log(`当前页:`+this.params.currentPage);
          this.params.currentPage = val; 
          //改变页码，重新渲染页面
          this.findDictList()
      },
     
  },
  created () {
     //调用方法
      this.findDictList();
      this.findAllDictByParentId();
  },
  mounted () {
      this.$nextTick(()=>{
          this.tableHeight = window.innerHeight - 200;
      });
  },
}
</script> 

<style lang='scss' scoped>

</style>
