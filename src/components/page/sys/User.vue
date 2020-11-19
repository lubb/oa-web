<template>
  <div class="content-wrapper">
    <div class="container" v-loading="loading">
      <div class="handle-box">
        <el-form ref="form" :model="query" size="small" label-width="100px" :inline="true">
          <el-form-item label="部门">
            <el-select clearable @change="handleSearch" @clear="handleSearch" v-model="query.departmentId" placeholder="请选择所属部门">
              <el-option v-for="department in departments" :label="department.name" :key="department.id" :value="department.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="query.username" placeholder="请输入用户名" clearable/>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="query.email" placeholder="请输入邮箱" clearable/>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="query.nickname" placeholder="请输入昵称" clearable/>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="query.sex" label="1">男</el-radio>
            <el-radio v-model="query.sex" label="0">女</el-radio>
            <el-radio v-model="query.sex" label>全部</el-radio>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click='reSetForm'>重置</el-button>
          <el-button v-hasPermission="'user:add'" type="primary" icon="el-icon-plus" @click="addDialogVisible=true">添加</el-button>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <el-table :data="tableData" border stripe height="300" class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="username" label="用户名" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nickname" label="昵称" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sex" :formatter="showSex" label="性别" width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.sex==1">男</span>
            <span v-else>女</span>
          </template>
        </el-table-column>
        <el-table-column prop="departmentName" label="所属部门" width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="birth" label="生日" width="150" sortable>
          <template slot-scope="scope" >
            <span>{{formatDate(scope.row.birth)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phoneNumber" label="电话" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isban" label="是否禁用" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="changUserStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" sortable show-overflow-tooltip>
          <template slot-scope="scope" >
            <span>{{formatDateTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="210" align="center">
          <template slot-scope="scope">
            <el-button   v-hasPermission="'user:edit'" size="small" type="text" icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
            <el-button v-hasPermission="'user:delete'" type="text" size="small" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
            <el-button v-hasPermission="'user:assign'" type="text" size="small" icon="el-icon-s-tools" @click="assignRoles(scope.row.id)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
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
      </div>

      <!-- 添加对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%;">
        <!-- 表单 -->
        <span>
          <el-form
            :model="addForm"
            :label-position="labelPosition"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="80px"
          >
            <el-row>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="部门" prop="departmentId">
                    <el-select v-model="addForm.departmentId" placeholder="请选择所属部门">
                      <el-option
                        v-for="department in departments"
                        :key="department.id"
                        :label="department.name"
                        :value="department.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="addForm.nickname"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="addForm.sex">
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phoneNumber">
              <el-input v-model="addForm.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item prop="birth" label="生日">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择出生日期"
                  v-model="addForm.birth"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
          </el-form>
        </span>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addUser"
            :loading="btnLoading"
            :disabled="btnDisabled"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改对话框 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
        <span>
          <el-form
            :model="editForm"
            :label-position="labelPosition"
            :rules="addFormRules"
            ref="editFormRef"
            label-width="80px"
          >
            <el-row>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" :disabled="true"></el-input>
                    <el-input
                      type="hidden"
                      v-model="editForm.id"
                      :disabled="true"
                      style="display:none;"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="部门" prop="departmentId">
                    <el-select v-model="editForm.departmentId" placeholder="请选择所属部门">
                      <el-option
                        v-for="department in departments"
                        :key="department.id"
                        :label="department.name"
                        :value="department.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="editForm.nickname"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="editForm.sex">
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="editForm.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item prop="birth" label="生日">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  value-format="yyyy年MM月dd日"
                  placeholder="选择出生日期"
                  v-model="editForm.birth"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
          </el-form>
        </span>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="updateUser"
            :loading="btnLoading"
            :disabled="btnDisabled"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色对话框 -->
      <el-dialog center title="分配角色" :visible.sync="assignDialogVisible" width="50%">
        <span>
          <template>
            <el-transfer
              filterable
              :titles="['未拥有','已拥有']"
              :button-texts="['到左边', '到右边']"
              v-model="value"
              :data="roles"
            ></el-transfer>
          </template>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="assignDialogVisible = false" class="el-icon-close">取消分配</el-button>
          <el-button
            v-hasPermission="'user:assign'"
            type="primary"
            @click="doAssignRoles"
            class="el-icon-check"
            :loading="btnLoading"
            :disabled="btnDisabled"
          >确定分配</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import http from '../../../utils/http';
export default {
  name:'user',
  data() {
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
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
      btnLoading: false,
      btnDisabled: false,
      departments: [],
      loading: true,
      pageTotal: 0,
      addDialogVisible: false, //添加对话框,
      editDialogVisible: false, //修改对话框
      assignDialogVisible: false, //分配角色对话框
      labelPosition: "right", //lable对齐方式
      //查询对象
      query: {
        pageNo: 1,
        pageSize: 10,
        username: "",
        sex: "",
        nickname: "",
        departmentId:"",
        email:""
      },
      tableData: [],
      addForm: {
        username: "",
        nickname: "",
        password: "",
        email: "",
        phoneNumber: "",
        sex: "",
        birth: ""
      }, //添加表单
      editForm: {}, //更新表单
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 1, max: 12, message: "长度在 1 到 12 个字符", trigger: "blur" }
        ],
        departmentId: [
          { required: true, message: "请选择部门", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        birth: [{ required: true, message: "请填写出生日期", trigger: "blur" }],
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
        phoneNumber: [
          {
            required: true,
            message: "请输入联系方式",
            validator: checkPhone,
            trigger: "blur"
          }
        ],
        nickname: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ]
      }, //添加表单验证规则
      roles: [], //角色
      value: [], //用户拥有的角色
      uid: ""
    };
  },
  methods: {

    /**
     * 触发搜索按钮
     */
    handleSearch() {
      this.$set(this.query, 'pageNo', 1);
      this.getUserList();
    },

    /**
     * 重置功能
     */
    reSetForm() {
      this.query = {
        pageNo: 1,
        pageSize: 10,
        username: "",
        sex: "",
        nickname: "",
        departmentId:"",
        email:""
      };
      this.getUserList();
    },

    /**
     * 弹出用户分配角色
     */
    async assignRoles(id) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const { data: res } = await http.get("/user/" + id + "/roles");
      if (res.status == 0) {
        this.roles = res.data.roles;
        this.value = res.data.values;
        this.uid = id;
        setTimeout(() => {
          loading.close();
          this.assignDialogVisible = true;
        }, 400);
      }
    },

    /**
     * 确定分配角色
     */
    async doAssignRoles() {
      this.assignDialogVisible = true;
      this.btnLoading = true;
      this.btnDisabled = true;
      const { data: res } = await http.post(
        "/user/" + this.uid + "/assignRoles",
        this.value
      );
      if (res.status == 0) {
        this.$notify.success({
          title:'操作成功',
          message:'用户角色分配成功',
        });
      } else {
        this.$message.error("分配角色失败:" + res.msg);
      }
      this.assignDialogVisible = false;
      this.btnLoading = false;
      this.btnDisabled = false;
    },

    /**
     * 加载用户列表
     */
    async getUserList() {
      this.loading = true;
      http.post("/user/findUserList", this.query)
        .then(res => {
          this.loading = false;
          if (res.data.status == 0) {
            const {list, total} = res.data.data;
            this.tableData = list;
            this.pageTotal = total - 0;
          } else {
            this.$message.warning(res.data.msg || '获取用户列表失败');
          }
        }).catch((error) => {
        console.log(error);
      });
    },

    /**
     * 显示用户性别
     */
    showSex(row, column) {
      return row.sex == 1 ? "男" : "女";
    },

    /**
     * 删除用户
     */
    async del(id) {
      var res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
        const { data: res } = await http.delete("/user/delete/" + id);
        if (res.status == 0) {
          this.$notify.success({
            title:'操作成功',
            message:'用户删除成功',
          });
          this.getUserList();
          this.getDepartmets();
        } else {
          this.$message.error(res.msg);
        }
      }
    },

    /**
     * 添加用户
     */
    async addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          this.btnLoading = true;
          this.btnDisabled = true;
          const { data: res } = await http.post("/user/add", this.addForm);
          if (res.status == 0) {
            this.$notify.success({
              title:'操作成功',
              message:'用户添加成功',
            });
            this.addForm = {};
            this.getUserList();
            this.getDepartmets();
          } else {
            return this.$message.error("用户添加失败:" + res.msg);
          }
          this.addDialogVisible = false;
          this.btnLoading = false;
          this.btnDisabled = false;
        }
      });
    },

    /**
     * 更新用户
     */
    async updateUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          this.btnLoading = true;
          this.btnDisabled = true;
          const { data: res } = await http.put(
            "/user/update/" + this.editForm.id,
            this.editForm
          );
          if (res.status == 0) {
            this.$notify({
              title: "操作成功",
              message: "用户基本信息已更新",
              type: "success"
            });
            this.editForm = {};
            this.getUserList();
            this.getDepartmets();
          } else {
            this.$message.error("用户信息更新失败:" + res.msg);
          }
          this.editDialogVisible = false;
          this.btnLoading = false;
          this.btnDisabled = false;
        }
      });
    },

    /**
     * 修改用户信息
     */
    async edit(id) {
      const { data: res } = await http.get("/user/edit/" + id);
      if (res.status == 0) {
        this.editForm = res.data;
        this.editDialogVisible = true;
      } else {
        return this.$message.error("用户信息编辑失败:" + res.msg);
      }
    },

    /**
     *  改变页码
     */
    handleSizeChange(newSize) {
      this.query.pageSize = newSize;
      this.getUserList();
    },

    /**
     * 翻页
     */
    handleCurrentChange(current) {
      this.query.pageNo = current;
      this.getUserList();
    },

    /**
     * 禁用启用用户
     */
    async changUserStatus(row) {
      const { data: res } = await http.put(
        "/user/updateStatus/" + row.id + "/" + row.status
      );
      if (res.status !== 0) {
        this.$message.error("更新用户状态失败:" + res.msg);
        row.status = !row.status;
      } else {
        var message=row.status?'用户状态已禁用':'用户状态已启用';
        this.$notify.success({
          title: '操作成功',
          message: message,
        });
      }
    },

    /**
     * 加载所有部门
     */
    async getDepartmets() {
      const { data: res } = await http.get("/department/findAll");
      if (res.status !== 0) return this.$message.error("获取部门列表失败");
      this.departments = res.data;
    }
  },

  created() {
    this.getUserList();
    this.getDepartmets();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },

  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function (to, from) {
      if (this.$route.fullPath.indexOf('user') > -1) {
        this.getUserList();
      }
    },
  },
};
</script>
