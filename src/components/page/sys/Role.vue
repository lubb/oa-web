<template>
  <div class="content-wrapper">
    <div class="container" v-loading="loading">
      <div class="handle-box">
        <el-form ref="form" :model="query" size="small" label-width="140px" :inline="true">
          <el-form-item>
            <el-input v-model="query.roleName" placeholder="部门名称" clearable/>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click='reSetForm'>重置</el-button>
          <el-button v-hasPermission="'role:add'" type="primary" icon="el-icon-plus" @click="addDialogVisible=true">添加</el-button>
        </el-form>
      </div>
      <el-table :data="tableData" border stripe height="300" class="table" ref="multipleTable" header-cell-class-name="table-header">
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column prop="roleName" label="角色名" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
          <el-table-column prop="isban" label="是否禁用" width="100">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" @change="changRoleStatus(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="150" show-overflow-tooltip>
            <template slot-scope="scope" >
              <span>{{formatDateTime(scope.row.createTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="grant(scope.row.id)" type="text" icon="el-icon-present" size="small">授权</el-button>
              <el-button @click="edit(scope.row.id)" v-hasPermission="'role:edit'" type="text" icon="el-icon-edit" size="small">编辑</el-button>
              <el-button @click="del(scope.row.id)"  v-hasPermission="'role:delete'" type="text" icon="el-icon-delete" size="small">删除</el-button>
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
      <!-- 添加弹框 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%">
        <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRoles">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="描述信息" prop="remark">
            <el-input type="textarea" v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole" :loading="btnLoading" :disabled="btnDisabled">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑弹框 -->
      <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="40%">
        <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="addFormRoles">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="描述信息" prop="remark">
            <el-input type="textarea" v-model="editForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateRole" :loading="btnLoading" :disabled="btnDisabled" v-hasPermission="'role:update'">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 角色授权弹出框 -->
      <el-dialog title="分配菜单权限" :visible.sync="grantDialogVisible" width="38%">
        <span>
          <el-tree :auto-expand-parent="false" :data="data" show-checkbox node-key="id" :default-expanded-keys="open" :props="defaultProps" ref="tree" highlight-current></el-tree>
          <!-- check-strictly -->
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="grantDialogVisible = false">取 消</el-button>
          <el-button v-hasPermission="'role:authority'" type="primary" icon="el-icon-setting" @click="authority" :loading="btnLoading" :disabled="btnDisabled">授 权</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import http from '../../../utils/http';
  export default {
    name: 'role',
    data() {
      return {
        btnLoading: false,
        btnDisabled: false,
        loading: true,
        pageTotal: 0,
        query: { roleName: "", pageNo: 1, pageSize: 10 }, //查询条件
        tableData: [], //角色表格数据
        addForm: {}, //添加数据
        editForm: {}, //编辑数据
        addDialogVisible: false, //添加弹框的显示
        editDialogVisible: false, //编辑弹框
        grantDialogVisible: false, //授权弹出框
        data: [],
        open: [], //展开
        grantId: "",
        tableHeight:null,
        defaultProps: {
          children: "children",
          label: "menuName"
        },
        addFormRoles: {
          roleName: [
            { required: true, message: "请输入角色名称", trigger: "blur" },
            { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
          ],
          remark: [
            { required: true, message: "请输入角色描述信息", trigger: "blur" },
            { min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" }
          ]
        } //添加验证规则
      };
    },
    methods: {

      /**
       * 触发搜索按钮
       */
      handleSearch() {
        this.$set(this.query, 'pageNo', 1);
        this.getRoleList();
      },

      /**
       * 加载角色列表
       */
      async getRoleList() {
        this.loading = true;
        http.post("/role/findRoleList", this.query)
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
       * 授权
       * @param newSize
       */
      async authority() {
        this.btnDisabled = true;
        this.btnLoading = true;
        const { data: res } = await http.post(
          "/role/authority/" + this.grantId,
          [].concat(
            this.$refs.tree.getCheckedKeys(),
            this.$refs.tree.getHalfCheckedKeys()
          )
        );
        if (res.status == 0) {
          this.$notify({
            title: "成功",
            message: "角色授权成功",
            type: "success"
          });
        } else {
          this.$message.error("角色授权失败:" + res.msg);
        }
        this.btnDisabled = false;
        this.btnLoading = false;
        this.grantDialogVisible = false;
      },

      /**
       * 授权获取选中的节点
       * @param newSize
       */
      async grant(id) {
        //加载所有菜单以及用户拥有的菜单权限id
        const { data: res } = await http.get("/role/findRoleMenu/" + id);
        if (res.status == 0) {
          //默认选中的树的数据
          let that = this;
          setTimeout(function() {
            res.data.mids.forEach(value => {
              that.$refs.tree.setChecked(value, true, false);
            });
          }, 100);
          this.data = res.data.tree;
          this.open = res.data.open;
          this.grantId = id; //需要授权的id
        }
        this.grantDialogVisible = true;
      },

      /**
       * 授权获取选中的节点
       * @param newSize
       */
      async addRole() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) {
            return;
          } else {
            this.btnDisabled = true;
            this.btnLoading = true;
            const { data: res } = await http.post("/role/add", this.addForm);
            if (res.status == 0) {
              this.$notify({
                title: "成功",
                message: "角色添加成功",
                type: "success"
              });
              this.addDialogVisible = false;
              this.btnDisabled = false;
              this.btnLoading = false;
              this.addForm = {};
              this.getRoleList();
            } else {
              return this.$message.error("角色添加失败:" + res.msg);
            }
          }
        });
      },

      /**
       * 编辑
       * @param newSize
       */
      async edit(id) {
        const { data: res } = await http.get("/role/edit/" + id);
        if (res.status == 0) {
          this.editForm = res.data;
          this.editDialogVisible = true;
        } else {
          return this.$message.error("角色编辑失败:" + res.msg);
        }
      },

      /**
       * 更新用户
       * @param newSize
       */
      async updateRole() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) {
            return;
          } else {
            this.btnDisabled = true;
            this.btnLoading = true;
            const { data: res } = await http.put(
              "/role/update/" + this.editForm.id,
              this.editForm
            );
            if (res.status == 0) {
              this.$notify({
                title: "成功",
                message: "角色信息更新",
                type: "success"
              });
              this.getRoleList();
            } else {
               this.$message.error("角色信息更新失败:" + res.msg);
            }
            this.editDialogVisible = false;
            this.btnDisabled = false;
            this.btnLoading = false;
            this.editForm = {};
          }
        });
      },

      /**
       * 删除
       * @param newSize
       */
      async del(id) {
        var res = await this.$confirm(
          "此操作将永久删除该角色, 是否继续?",
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
          const { data: res } = await http.delete("/role/delete/" + id);
          if (res.status == 0) {
            this.$notify({
              title: "成功",
              message: "角色删除成功",
              type: "success"
            });
            this.getRoleList();
          } else {
            this.$message.error("删除失败:" + res.msg);
          }
        }
      },

      /**
       * 改变角色状态
       * @param newSize
       */
      async changRoleStatus(row) {
        const { data: res } = await http.put(
          "/role/updateStatus/" + row.id + "/" + row.status
        );
        if (res.status !== 0) {
          this.$message.error("更新状态失败:" + res.msg);
          row.status = !row.status;
        } else {
          this.$notify({
            title: "成功",
            message: "更新状态成功",
            type: "success"
          });
        }
      },

      /**
       * 重置功能
       */
      reSetForm() {
        this.query = {
          pageNo: 1,
          pageSize: 10,
          roleName: '',
        };
        this.getRoleList();
      },

      /**
       * 改变页码
       * @param newSize
       */
      handleSizeChange(newSize) {
        this.query.pageSize = newSize;
        this.getRoleList();
      },

      /**
       * 翻页
       * @param current
       */
      handleCurrentChange(current) {
        this.query.pageNum = current;
        this.getRoleList();
      }
    },

    created() {
      this.getRoleList();
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },

    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': function (to, from) {
        if (this.$route.fullPath.indexOf('role') > -1) {
          this.getTableData();
        }
      },
    },
  };
</script>
