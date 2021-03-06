<template>
  <div>
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
    >
      <template slot="filter-content" style="display: flex; align-items: flex-start">
        <depart-tree-select
          v-model="listQuery.params.departId"
          class="el-select filter-item el-select--medium "
          :options="treeData"
          :props="defaultProps"
          width="200px"
        />
        <el-select v-model="listQuery.params.state" placeholder="考试状态" class="filter-item" clearable>
          <el-option
            v-for="item in paperStates"
            :key="item.name"
            :label="item.value"
            :value="item.name"
            :disabled="item.status === 1"
          />
        </el-select>
      </template>
      <template slot="data-columns">
        <el-table-column
          label="考试名称"
          align="center"
          prop="title"
        />
        <el-table-column
          label="部门"
          align="center"
          prop="departName"
        />
        <el-table-column
          label="人员"
          align="center"
          prop="realName"
          width="100px"
        />
        <el-table-column
          label="用时/时长"
          align="center"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.userTime }} / {{ scope.row.totalTime }}分钟
          </template>
        </el-table-column>

        <!--      <el-table-column-->
        <!--        label="客观分"-->
        <!--        align="center"-->
        <!--        prop="subjScore"-->
        <!--      />-->

        <!--      <el-table-column-->
        <!--        label="主观分"-->
        <!--        align="center"-->
        <!--        prop="objScore"-->
        <!--      />-->

        <el-table-column
          label="得分/总分"
          align="center"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.userScore }} / {{ scope.row.totalScore }}分
          </template>
        </el-table-column>
        <el-table-column
          label="考试时间"
          align="center"
          prop="create_time"
          width="160px"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        >
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column
          label="考试评级"
          align="center"
          width="90px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.state===1">待阅卷</span>
            <span v-else-if="scope.row.state===0">待交卷</span>
            <span v-else>
              <span :style="{ color: rankColor[scope.row.rank] }">{{ getDicDetailValue(rankDics, scope.row.rank) }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="考试状态"
          align="center"
          width="90px"
        >
          <template slot-scope="scope">
            {{ getDicDetailValue(paperStates, scope.row.state) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="90px"
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.state===1 || scope.row.state===2" type="primary" size="small" @click="handleReview(scope.row.id)">去阅卷</el-button>
          </template>
        </el-table-column>
        <!--        <el-table-column
          label="视频截图"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleCapture(scope.row.id)">考试截图</el-button>
          </template>
        </el-table-column>-->
      </template>
    </data-table>
    <!--    <el-dialog title="考试截图" :visible.sync="dialogVisible" width="500px">
      <img v-for="item in captureList" :key="item.capture" :src="item.capture" style="width: 230px">
    </el-dialog>-->
  </div>
</template>

<script>
import DataTable from '@/views/exam/components/DataTable'
import DepartTreeSelect from '@/views/exam/components/DepartTreeSelect'
import { mapGetters } from 'vuex'
import { treeAllChildOrganiz } from '@/views/platform/organization/organization'

export default {
  name: 'ExamManagementReview',
  components: { DepartTreeSelect, DataTable },
  data() {
    return {
      rankDics: [],
      rankColor: {
        0: '#ff0000',
        1: '#00ff00',
        2: '#0000FF',
        3: '#FF00FF',
        4: '#ff8000'
      },
      dialogVisible: false,
      captureList: [],
      paperStates: [
        { value: 0, label: '考试中' },
        { value: 1, label: '待阅卷' },
        { value: 2, label: '已考完' },
        { value: 3, label: '已弃考' }
      ],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      listQuery: {
        current: 1,
        size: 10,
        params: {
          title: '',
          state: 1,
          departId: 0
        },
        sort: {
          sortOrder: 'DESC',
          sortName: 'create_time'
        },
        search: {
          column: 'title',
          input: '',
          placeholder: '搜索考试名称'
        }
      },
      options: {
        // 可批量操作
        multi: false,
        // 列表请求URL
        listUrl: 'gateway/exam/api/paper/paper/paging'
      }
    }
  },
  computed: {
    ...mapGetters(['ananUserInfo'])
  },
  created() {
    this.loadDictionaryById(143).then(res => {
      this.paperStates = res.details
    })
    this.loadDictionaryById(148).then(res => {
      this.rankDics = res.details
    })
    treeAllChildOrganiz(this.ananUserInfo.organizId).then(response => {
      this.treeData[0] = response.data || []
    }).catch((reason) => {
      this.$notify({
        title: '获取部门数失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
  },
  methods: {
    handleReview(id) {
      if (!id || id.length < 1) {
        this.$message({
          message: '试卷编号无效!',
          type: 'error'
        })
        return
      }
      this.$store.dispatch('pushToView', { name: 'ExamManagementReviewPaper', params: { paperId: id }})
    },
    handleCapture(paperId) {
      // this.dialogVisible = true
      // listCaptures(paperId).then(res => {
      //   this.captureList = res.data
      // })
    }
  }
}
</script>
