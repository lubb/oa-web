<template>
  <div class="content-wrapper">
    <div class="container" v-loading="loading">
      <div class="handle-box">
        <el-form ref="form" :model="query" size="small" label-width="140px" :inline="true">
          <el-form-item>
            <el-input v-model="query.name" placeholder="部门名称" clearable/>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click='reSetForm'>重置</el-button>
          <el-button v-hasPermission="'department:add'" type="primary" icon="el-icon-plus" @click="addDialogVisible=true">添加
          </el-button>
        </el-form>
      </div>
      <el-table :data="tableData" border stripe height="300" class="table" ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column type="index" width="50" label="序号"/>
        <el-table-column prop="name" label="部门名称" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" label="办公电话" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mgrName" label="部门负责人" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" sortable show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{formatDateTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="modifiedTime" label="修改时间" sortable show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{formatDateTime(scope.row.modifiedTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-hasPermission="'department:edit'" type="text" size="mini" icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
            <el-button v-hasPermission="'department:delete'" type="text" size="mini" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="query.pageNo"
          :total="pageTotal"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>

        <!-- 部门别添加弹出框 -->
        <el-dialog title="添加部门" :visible.sync="addDialogVisible" width="50%">
          <span>
            <el-form :model="addRuleForm" :rules="addRules" ref="addRuleFormRef" label-width="100px" class="demo-ruleForm">
              <el-form-item label="部门名称" prop="name">
                <el-input v-model="addRuleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="部门负责人" prop="mgrName">
                <el-input v-model="addRuleForm.mgrName"></el-input>
              </el-form-item>
              <el-form-item label="办公电话" prop="phone">
                <el-input v-model="addRuleForm.phone"></el-input>
              </el-form-item>
              <el-form-item label="办公地址" prop="address">
                <el-input type="textarea" v-model="addRuleForm.address"></el-input>
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="add" :disabled="btnDisabled" :loading="btnLoading">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 部门别编辑弹出框 -->
        <el-dialog title="更新部门" :visible.sync="editDialogVisible" width="50%">
          <span>
            <el-form :model="editRuleForm" :rules="addRules" ref="editRuleFormRef" label-width="100px" class="demo-ruleForm">
              <el-form-item label="部门名称" prop="name">
                <el-input v-model="editRuleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="部门负责人" prop="mgrName">
                <el-input v-model="editRuleForm.mgrName"></el-input>
              </el-form-item>
              <el-form-item label="办公电话" prop="phone">
                <el-input v-model="editRuleForm.phone"></el-input>
              </el-form-item>
              <el-form-item label="办公地址" prop="address">
                <el-input type="textarea" v-model="editRuleForm.address"></el-input>
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="update" :disabled="btnDisabled" :loading="btnLoading">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import http from '../../../utils/http';

  export default {
    name: 'department',
    data() {
      var checkPhone = (rule, value, callback) => {
        const phoneReg = /^1[34578]\d{9}$$/;
        if (!value) {
          return callback(new Error("电话号码不能为空"));
        }
        setTimeout(() => {
          if (!Number.isInteger(+value)) {
            callback(new Error("请输入数字值"));
          } else {
            if (phoneReg.test(value)) {
              callback();
            } else {
              callback(new Error("电话号码格式不正确"));
            }
          }
        }, 100);
      };
      return {
        loading: false,
        btnLoading: false,
        btnDisabled: false,
        pageTitle: '部门管理',
        query: {
          name: '',
          pageNo: 1,
          pageSize: 10
        },
        tableData: [],
        pageTotal: 0,
        addRuleForm: {}, //添加表单数据
        editRuleForm: {}, //修改表单数据
        editDialogVisible: false,
        addDialogVisible: false, //添加弹框是否显示
        addRules: { //添加验证
          name: [
            {required: true, message: "请输入部门名称", trigger: "blur"},
            {min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur"}
          ],
          address: [
            {required: true, message: "请输入办公地址", trigger: "blur"},
            {min: 4, max: 12, message: "长度在 4 到 12 个字符", trigger: "blur"}
          ],
          mgrName: [
            {required: true, message: "请填写部门负责人", trigger: "blur"},
            {min: 1, max: 12, message: "长度在 1 到 12 个字符", trigger: "blur"}
          ],
          phone: [
            {
              required: true,
              message: "请输入联部门方式",
              validator: checkPhone,
              trigger: "blur"
            }
          ]
        }
      };
    },
    methods: {
      /**
       * 获取刘表数据
       */
      getTableData() {
        this.loading = true;
        http.post("/department/findDepartmentList", this.query)
          .then(res => {
            this.loading = false;
            if (res.data.status == 0) {
              const {list, total} = res.data.data;
              this.tableData = list;
              this.pageTotal = total - 0;
            } else {
              this.$message.warning(res.data.msg || '请求失败');
            }
          }).catch((error) => {
          console.log(error);
        });
      },

      /**
       * 提交新增页面
       */
      add() {
        this.$refs.addRuleFormRef.validate(async valid => {
          if (!valid) {
            return;
          } else {
            (this.btnLoading = true), (this.btnDisabled = true);
            const {data: res} = await http.post(
              "/department/add",
              this.addRuleForm
            );
            if (res.status == 0) {
              this.$notify({
                title: "成功",
                message: "部门添加成功",
                type: "success"
              });
              this.addRuleForm = {};
              this.getTableData();
            } else {
              return this.$message.error("部门添加失败:" + res.msg);
            }
            this.addDialogVisible = false;
            (this.btnLoading = false), (this.btnDisabled = false);
          }
        });
      },

      /**
       * 获取编辑表单数据
       * @param id
       * @returns {Promise<*>}
       */
      async edit(id) {
        const {data: res} = await http.get("/department/edit/" + id);
        if (res.status == 0) {
          this.editRuleForm = res.data;
        } else {
          return this.$message.error("部门信息编辑失败" + res.msg);
        }
        this.editDialogVisible = true;
      },

      /**
       * 删除部门信息
       * @param id
       */
      async del(id) {
        var res = await this.$confirm(
          "此操作将永久删除该部门, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
        if (res == "confirm") {
          const {data: res} = await http.delete(
            "/department/delete/" + id
          );
          if (res.status == 0) {
            this.$notify({
              title: "成功",
              message: "部门删除成功",
              type: "success"
            });
            this.getTableData();
          } else {
            this.$message.error(res.msg);
          }
        }
      },

      /**
       * 更新用户
       */
      async update() {
        this.$refs.editRuleFormRef.validate(async valid => {
          if (!valid) {
            return;
          } else {
            (this.btnLoading = true), (this.btnDisabled = true);
            const {data: res} = await http.put(
              "/department/update/" + this.editRuleForm.id,
              this.editRuleForm
            );
            if (res.status == 0) {
              this.$notify({
                title: "成功",
                message: "部门信息更新",
                type: "success"
              });
              this.getTableData();
            } else {
              this.$message.error("部门信息更新失败:" + res.msg);
            }
            this.editRuleForm = {};
            this.btnDisabled = false;
            this.btnLoading = false;
            this.editDialogVisible = false;
          }
        });
      },

      /**
       * 触发搜索按钮
       */
      handleSearch() {
        this.$set(this.query, 'pageNo', 1);
        this.getTableData();
      },

      /**
       * 重置功能
       */
      reSetForm() {
        this.query = {
          pageNo: 1,
          pageSize: 10,
          recordTime: [],
        };
        this.getTableData();
      },

      /**
       * 分页
       //控制每页条数
       */
      handleSizeChange(val) {
        this.query.pageSize = val;
        this.getTableData();
      },

      /**
       * 控制跳转到指定页
       * @param val
       */
      handleCurrentChange(val) {
        this.query.pageNo = val;
        this.getTableData();
      }
    },

    created() {
      this.getTableData();
    },

    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': function (to, from) {
        if (this.$route.fullPath.indexOf('department') > -1) {
          this.getTableData();
        }
      },
    },
  };
</script>
