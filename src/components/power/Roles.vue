<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1)">
                {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2)">
                    {{item2.authName}}
                    </el-tag>
                  <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag :class="[i3 === 0 ? '':'bdtop']" type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3)">
                    {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色说明" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="setRightDialog" width="50%" @close="setRightDialogClose">
      <el-tree :data="rightList" :props="defaultProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      setRightDialog: false,
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('角色列表查询失败')
      }
      this.roleList = res.data
    },
    async removeRightById (role, right) {
      const confirmResult = await this.$confirm(`此操作将删除${role.roleName}下的${right.authName}权限, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${right.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      this.$message.success('删除权限成功！')
      role.children = res.data
    },
    async showSetRightDialog (roles) {
      const { data: res } = await this.$http.get('rights/tree')
      this.roleId = roles.id
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightList = res.data
      this.getLeafKeys(roles, this.defKeys)
      this.setRightDialog = true
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightDialogClose () {
      this.setRightDialog = false
      this.defKeys = []
    },
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('更新权限失败')
      }
      this.$message.success('更新权限成功')
      this.setRightDialog = false
      this.getRoleList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
