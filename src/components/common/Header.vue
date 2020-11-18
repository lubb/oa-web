<template>
  <div class="header">
    <div class="header-left">
      <img src="../../assets/img/xinwise-slogan.png" class="logo-img" alt="芯智慧"/>
      <div class="logo">物联云平台</div>
    </div>

    <div class="header-right">
      <div class="header-user-con">
        <div class="btn-icon" @click="handleGoSso">
          <el-tooltip
            effect="dark"
            content="和院管理系统"
            placement="bottom"
          >
            <i class="el-icon-setting"></i>
          </el-tooltip>
        </div>

        <!-- 全屏显示 -->
        <div
          class="btn-fullscreen"
          @click="handleFullScreen"
        >
          <el-tooltip
            effect="dark"
            :content="fullscreen?`取消全屏`:`全屏`"
            placement="bottom"
          >
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>

        <div class="user-name">
          <span>您好，{{username}}</span>
        </div>
        <div class="btn-icon" @click="handleLoginOut">
          <el-tooltip
            effect="dark"
            content="退出登录"
            placement="bottom"
          >
            <i class="el-icon-switch-button"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import bus from '../../assets/js/bus';

  export default {
    data() {
      return {
        fullscreen: false,
        name: 'xinwis',
        message: 2,
      };
    },
    computed: {
      username() {
        let username = localStorage.getItem('ms_username');
        return username ? username : this.name;
      },
    },
    methods: {

      // 全屏事件
      handleFullScreen() {
        let element = document.documentElement;
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
          }
        }
        this.fullscreen = !this.fullscreen;
      },

      // 跳转到SSO页面
      handleGoSso () {
        let url = '/sso';
        window.open(url,"_blank")
      },

      // 退出登录
      async handleLoginOut() {
        var res = await this.$confirm("此操作将退出系统, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出登入"
          });
        });
        if (res == "confirm") {
          window.localStorage.clear();
          this.$router.push("/login");
        }
      }
    },
  };
</script>
<style scoped>
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    font-size: 22px;
    color: #fff;
    display: flex;
    justify-content: space-between;
  }

  .header .logo {
    line-height: 50px;
    font-weight: lighter;
  }
  .header .logo-img {
    width: 120px;
    margin-right: 5px;
  }

  .header-left {
    display: flex;
    align-items: center;
    padding-left: 16px;
  }

  .header-right {
    padding-right: 20px;
  }

  .header-user-con {
    display: flex;
    height: 100%;
    align-items: center;
  }

  .btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
  }

  .btn-icon, .btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
    padding: 0 5px;
  }

  .user-name {
    font-size: 14px;
    margin-left: 10px;
    font-weight: lighter;
  }
  .user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

</style>
