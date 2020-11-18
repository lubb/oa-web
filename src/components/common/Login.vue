<template>
  <div id="login">
    <el-row>
      <el-col :span="24" class="header-login">
        <el-col :span="8">
          <img src="../../assets/logo.png">
        </el-col>
      </el-col>
    </el-row>
    <el-row class="main" ref="mainRef">
      <el-col :span="16" class="login-left">
        <img src="../../assets/bg1.png">
      </el-col>
      <el-col :span="8" class="login-right" ref="rightRef">
        <el-form
          :model="userLoginForm"
          :rules="loginRules"
          status-icon
          ref="userLoginFormRef"
          label-position="left"
          label-width="0px"
          class="demo-ruleForm"
        >
          <h3 class="title">启赢科技OA办公系统</h3>
          <el-form-item prop="username">
            <el-input
              type="text"
              @keyup.enter.native="handleSubmit"
              v-model="userLoginForm.username"
              auto-complete="off"
              placeholder="用户名"
              prefix-icon="iconfont el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              @keyup.enter.native="handleSubmit"
              type="password"
              v-model="userLoginForm.password"
              auto-complete="off"
              placeholder="密码"
              prefix-icon="el-icon-suitcase-1"
            ></el-input>
          </el-form-item>
          <div></div>

          <el-checkbox v-model="checked" class="rememberme">记住密码</el-checkbox>
          <el-form-item style="width:100%;">
            <div style="float:right;">
              <el-button
                class="el-icon-mobile-phone"
                @click="handleSubmit"
                :loading="loading"
              >登录</el-button>
              <el-button class="el-icon-refresh" @click="resetForm">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="footer">
      Copyright @ 2004-2021 广东火壁虎建材有限公司 All Rights Reserved
    </el-row>
    <!-- 验证码 -->
    <Vcode
      :show="isShow"
      @success="success"
      @close="close"
      :canvasWidth="400"
      :canvasHeight="300"
    />
  </div>
</template>

<script>
  import Vcode from "_vue-puzzle-vcode@1.1.4@vue-puzzle-vcode";
  import http from '../../utils/http';

  export default {
    data() {
      return {
        isShow: false,
        dialogVisible: false,
        imgCode: undefined,
        //表单用户登入数据
        loading: false,
        userLoginForm: {
          username: "bajie",
          password: "1"
        },
        checked: false,
        windowHeight : null,
        //验证规则
        loginRules: {
          username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
          ],
          password: [
            { required: true, message: "请输入用户密码", trigger: "blur" },
            { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
          ]
        }
      };
    },
    components: {
      Vcode
    },

    methods: {
      //登入提交
      handleSubmit: function() {
        this.$refs.userLoginFormRef.validate(valid => {
          if (!valid) {
            return;
          } else {
            this.isShow = true;
          }
        });
      },
      //重置表单
      resetForm: function() {
        this.$refs.userLoginFormRef.resetFields();
      },
      //验证成功
      async success() {
        this.loading = true;
        //发起登入请求
        const { data: res , headers : headers} = await http.post(
          "/doLogin",{username:this.userLoginForm.username,password:this.userLoginForm.password}
        );
        if (res.status == 0) {
          this.$message({
            title: "登入成功",
            message: "欢迎你进入网站管理系统",
            type: "success"
          });
          localStorage.setItem("oa_token", headers.token);
          localStorage.setItem("userInfo", res.data);
          this.$store.dispatch("updateUserInfo", res.data);
          //跳转到home
          let path = this.$route.query.redirect;
          this.$router.replace((path == '/' || path == undefined) ? '/' : path);
        } else {
          this.isShow = false;
          this.$message.error({
            title: "登入失败",
            message: res.msg,
            type: "error"
          });
        }
        this.loading = false;
      },

      //设置背景的高度
      setContentHeight () {
        this.windowHeight = document.documentElement.clientHeight;
        this.$refs.mainRef.$el.style.height=this.windowHeight - 102 - 138 + 'px';
        let right = '0';
        let top = (this.windowHeight - 102 - 138)/3.8 + 'px';
        this.$refs.rightRef.$el.style.margin =top +' '+ right;
      },
      close() {
        this.isShow = false;
      }
    },
    created() {
    },
    mounted() {
      this.setContentHeight();
    }
  };
</script>

<style scoped>
  #login{
    position: relative;
  }

  .header-login{
    text-align: center;
    font-size: 1.4rem;
  }

  .header-login img{
    width: 30%;
    margin-top: 20px;
  }

  .main{
    background:url("../../assets/bg.png") no-repeat, -webkit-linear-gradient(-45deg, #48C8FF, #54B7FE);
    background:url("../../assets/bg.png") no-repeat, -moz-linear-gradient(-135deg, #48C8FF, #54B7FE);
    background:url("../../assets/bg.png") no-repeat, linear-gradient(-135deg, #48C8FF, #54B7FE);
    background-size: cover;
    width: 100%;
  }

  .login-left{
    margin-top: 9%;
    text-align: center;
  }

  .login-left img{
    width: 60%;
  }

  .login-right {
  }

  .demo-ruleForm{
    padding: 20px 25px 10px;
    background: #fff;
    border: 1px solid #eaeaea;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    position: relative;
    width: 300px;
  }

  label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
  }

  .footer{
    text-align: center;
    margin-top: 50px;
  }

</style>


