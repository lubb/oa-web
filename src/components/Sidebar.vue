<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.children">
          <el-submenu :index="item.id+''" :key="item.id" ref="submenu">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.menuName }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-submenu :id="subItem.id" v-if="subItem.children.length>0" :index="subItem.url" :key="subItem.id">
                <template slot="title">{{ subItem.menuName }}</template>
                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.id+''">{{ threeItem.menuName }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :id="subItem.id" :index="subItem.url" :key="subItem.id">{{ subItem.menuName }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.item.id+''" :key="item.id" :id="item.id">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.menuName }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>

    <!-- 折叠按钮 -->
    <div
      class="collapse-btn"
      @click="collapseChage"
    >
      <i
        v-if="!collapse"
        class="el-icon-s-fold"
      ></i>
      <i
        v-else
        class="el-icon-s-unfold"
      ></i>
    </div>
  </div>
</template>

<script>
  import bus from '../assets/js/bus';
  import http from '../utils/http';

  export default {
    data() {
      return {
        collapse: false,
        items: [],
      };
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace('/', '');
      },
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg;
        bus.$emit('collapse-content', msg);
      });
      this.menuInit();
    },
    methods: {
      // 侧边栏折叠
      collapseChage() {
        this.collapse = !this.collapse;
        bus.$emit('collapse', this.collapse);
      },
      menuInit() {
        http.get("/user/findMenu", {}).then(res => {
          if (res.data.status == 0) {
            if (res.data && res.data.data && res.data.data.length > 0) {
              this.items = res.data.data;
            }
          }
        });
      },
    },
  };
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }

  .sidebar > ul {
    height: 100%;
  }
</style>
