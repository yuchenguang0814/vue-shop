<template>
<el-container class="home-container">
  <el-header>
    <div>
      <img src="" alt="">
      <span>后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="isCollapse?'64px':'200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activPath">
        <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
          <template slot="title">
            <i :class="iconsObj[item.id]"></i>
            <span>{{item.authName}}</span>
          </template>
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-s-grid"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main><router-view></router-view></el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activPath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activPath = window.sessionStorage.getItem('activPath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activPath) {
      window.sessionStorage.setItem('activPath', activPath)
      this.activPath = activPath
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left:70px;
    align-items: center;
      span {
        font-size:20px;
        color:skyblue;
      }
  }

  .el-aside {
    background-color: #333744;
    .toggle-button {
      background-color: #4a5064;
      font-size:10px;
      color:#fff;
      text-align:center;
      line-height: 24px;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu {
      border-right:none;
    }
    .iconfont {
      margin-right:10px;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
</style>
