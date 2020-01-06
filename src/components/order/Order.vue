<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList()">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加订单</el-button>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="250px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="支付状态" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditAddrDialogVisible"></el-button>
              <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressDialogVisible"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="修改地址" :visible.sync="editAddrDialogVisible" width="50%" @close="editAddrDialogVisibleClose">
      <el-form :model="editAddrForm" :rules="editAddrFormRules" ref="editAddrFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader expand-trigger="hover" :options="cityData" v-model="editAddrForm.address1" clearable>
        </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddrForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddrInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流状态" :visible.sync="progressDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      editAddrDialogVisible: false,
      editAddrForm: {
        address1: [],
        address2: ''
      },
      editAddrFormRules: {
        address1: [
          { required: true, message: '请选择省市区', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      progressDialogVisible: false,
      progressInfo: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showEditAddrDialogVisible () {
      this.editAddrDialogVisible = true
    },
    editAddrDialogVisibleClose () {
      this.$refs.editAddrFormRef.resetFields()
    },
    editAddrInfo () {},
    async showProgressDialogVisible () {
      this.progressDialogVisible = true
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.progressInfo = res.data
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-cascader {
  width: 100%;
}
</style>
