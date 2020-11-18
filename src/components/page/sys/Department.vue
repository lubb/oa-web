<template>
  <div class="content-wrapper">
    <div class="container" v-loading="loading">
      <div class="handle-box">
        <el-form
          ref="form"
          :model="query"
          size="small"
          label-width="140px"
          :inline="true"
        >
          <el-form-item>
            <el-input v-model="query.name" placeholder="部门名称" clearable/>
          </el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >搜索
          </el-button>
          <el-button
            plain
            type="primary"
            icon="el-icon-refresh"
            @click='reSetForm'
          >重置
          </el-button>
          <el-button
            v-hasPermission="'department:add'"
            type="primary"
            icon="el-icon-plus"
          >添加</el-button>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        height="300"
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="name" label="部门名称" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" label="办公电话" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mgrName" label="部门负责人" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" sortable show-overflow-tooltip>
          <template slot-scope="scope" >
            <span>{{formatDateTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="modifiedTime" label="修改时间" sortable show-overflow-tooltip>
          <template slot-scope="scope" >
            <span>{{formatDateTime(scope.row.modifiedTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-hasPermission="'department:edit'"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="edit(scope.row.id)"
            >编辑</el-button>

            <el-button
              v-hasPermission="'department:delete'"
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="del(scope.row.id)"
            >删除</el-button>
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
      </div>
    </div>
  </div>
</template>

<script>
  import http from '../../../utils/http';

  export default {
    name: 'department',
    data() {
      return {
        loading: false,
        pageTitle: '部门管理',
        query: {
          name: '',
          pageNo: 1,
          pageSize: 10
        },
        tableData: [],
        pageTotal: 0,
      };
    },
    methods: {
      // 获取数据列表
      getTableData() {
        this.loading = true;
        http.post("/department/findDepartmentList", this.query)
          .then(res => {
            this.loading = false;
            if (res.data.status == 0) {
              const { list, total} = res.data.data;
              this.tableData = list;
              this.pageTotal = total - 0;
            } else {
              this.$message.warning(res.data.msg || '请求失败');
            }
          }).catch((error) => {
          console.log(error);
        });
      },

      edit(id){

      },

      del(id){

      },

      // 触发搜索按钮
      handleSearch() {
        this.$set(this.query, 'pageNo', 1);
        this.getTableData();
      },

      // 重置
      reSetForm() {
        this.query = {
          pageNo: 1,
          pageSize: 10,
          recordTime: [],
        };
        this.getTableData();
      },

      //分页
      //控制每页条数
      handleSizeChange(val) {
        this.query.pageSize = val;
        this.getTableData();
      },

      //控制跳转到指定页
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
      '$route': function(to, from) {
        if(this.$route.fullPath.indexOf('department') > -1) {
          this.getTableData();
        }
      },
    },
  };
</script>
