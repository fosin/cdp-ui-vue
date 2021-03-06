<template>
  <div class="app-container" :style="dynamicStyle">
    <h2 class="text-center">{{ paperData.title }}</h2>
    <p class="text-center" style="color: #666">{{ paperData.createTime }}</p>
    <el-row :gutter="24" style="margin-top: 50px">
      <el-col :span="4" class="text-center">
        考生姓名：{{ userInfo.username }}
      </el-col>
      <el-col :span="3" class="text-center">
        考试用时：{{ paperData.userTime }}分钟
      </el-col>
      <el-col :span="4">
        考试状态：{{ getDicDetailValue(paperStates, paperData.state) }}
      </el-col>
      <el-col :span="4" class="text-center">
        合格分/总分：{{ paperData.qualifyScore }} / {{ paperData.totalScore }}
      </el-col>
      <el-col v-if="paperData.state === 2 || paperData.state === 3" :span="4" class="text-center">
        考试评级：<span :style="{ color: rankColor[paperData.rank] }">{{ getDicDetailValue(rankDics, paperData.rank) }}</span>
      </el-col>
      <el-col v-if="paperData.state === 2 || paperData.state === 3" :span="5" class="text-center">
        得分/正确率：{{ paperData.userScore }} / {{ paperData.accuracy }}%
      </el-col>
    </el-row>
    <el-card v-if="paperData.showPaper" style="margin-top: 20px">
      <div v-for="item in paperData.quList" :key="item.id" class="qu-content">
        <el-row>
          <el-col v-if="showResult" :span="1">
            <div v-if="showResult">
              <div v-if="item.quType === 4">
                <el-tag v-if="paperData.state===1" type="warning">待阅卷</el-tag>
                <div v-else>
                  <el-tag v-if="item.actualScore > 0" type="success">对,{{ item.actualScore }}分</el-tag>
                  <el-tag v-else type="danger">错,{{ item.actualScore }}分</el-tag>
                </div>
              </div>
              <div v-else>
                <el-tag v-if="item.isRight" type="success">对,{{ item.actualScore }}分</el-tag>
                <div v-else>
                  <el-tag v-if="item.actualScore > 0" type="warning">得,{{ item.actualScore }}分</el-tag>
                  <el-tag v-else type="danger">错,{{ item.actualScore }}分</el-tag>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="23">
            <el-input v-model="item.quTitle" autosize type="textarea" readonly resize="none" style="margin-bottom: 20px;border: 0" />
          </el-col>
        </el-row>
        <div v-if="item.quType === 1 || item.quType===3">
          <el-radio-group v-model="radioValues[item.id]">
            <el-radio v-for="an in item.answerList" :key="an.id" :label="an.id">
              {{ an.abc }}.  【{{ an.content }}】
            </el-radio>
          </el-radio-group>
          <el-row :gutter="24">
            <el-col v-if="!item.isRight && showAnswer" :span="12" style="color: #24da70">
              正确答案：{{ radioRights[item.id] }}
            </el-col>
          </el-row>
        </div>
        <div v-if="item.quType === 2">
          <el-checkbox-group v-model="multiValues[item.id]">
            <el-checkbox v-for="an in item.answerList" :key="an.id" :label="an.id">{{ an.abc }}.  【{{ an.content }}】</el-checkbox>
          </el-checkbox-group>
          <el-row :gutter="24">
            <el-col v-if="!item.isRight && showAnswer" :span="12" style="color: #24da70">
              正确答案：{{ multiRights[item.id].join(',') }}
            </el-col>
          </el-row>
        </div>
        <div v-if="item.quType === 4">
          <el-row>
            <el-col :span="24">
              我的回答：
              <el-input v-model="item.answer" autosize type="textarea" readonly resize="none" style="margin-bottom: 10px;border: 0" />
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>

import { paperResult } from '@/views/exam/paper/exam/exam'
import { getUser } from '@/views/platform/user/user'
import { controlCopy } from '@/utils/documentUtil'

export default {
  name: 'ExamOnlineDoResult',
  data() {
    return {
      // 试卷ID
      dynamicStyle: {},
      paperStates: [],
      rankDics: [],
      rankColor: {
        0: '#ff0000',
        1: '#00ff00',
        2: '#0000FF',
        3: '#FF00FF',
        4: '#ff8000'
      },
      paperId: '',
      paperData: {
        quList: []
      },
      showAll: 0,
      showAnswer: false,
      showResult: false,
      userInfo: {},
      radioValues: {},
      multiValues: {},
      radioRights: {},
      multiRights: {},
      myRadio: {},
      myMulti: {}
    }
  },
  created() {
    this.loadDictionaryById(143).then(res => {
      this.paperStates = res.details
    })
    this.loadDictionaryById(148).then(res => {
      this.rankDics = res.details
    })
    const params = this.$route.params.id.split(',')
    const id = params[0]
    if (typeof id !== 'undefined') {
      this.paperId = id
      this.showAll = params[1]
      this.fetchData(id)
    }
  },
  beforeDestroy() {
    if (!this.paperData.paperCopy) {
      controlCopy(false)
    }
  },
  methods: {
    fetchData(id) {
      const params = { id: id }
      paperResult(params).then(response => {
        // 试卷内容
        this.paperData = response.data
        this.showAnswer = this.paperData.showAnswer || this.showAll === '1'
        this.showResult = this.paperData.showResult || this.showAll === '1'
        getUser(this.paperData.userId).then(res => {
          this.userInfo = res.data
        })
        // 禁止复制试卷内容
        if (!this.paperData.paperCopy) {
          this.dynamicStyle = {
            '@media print': {
              body: { display: 'none' }
            }
          }
          controlCopy(true)
        }
        // 填充该试题的答案
        this.paperData.quList.forEach((item) => {
          let radioValue = ''
          let radioRight = ''
          let myRadio = ''
          const multiValue = []
          const multiRight = []
          const myMulti = []
          item.quTitle = (item.sort + 1) + '、' + item.content
          item.answerList.forEach((an) => {
            // 用户选定的
            if (an.checked) {
              if (item.quType === 1 || item.quType === 3) {
                radioValue = an.id
                myRadio = an.abc
              } else {
                multiValue.push(an.id)
                myMulti.push(an.abc)
              }
            }

            // 正确答案
            if (an.isRight) {
              if (item.quType === 1 || item.quType === 3) {
                radioRight = an.abc
              } else {
                multiRight.push(an.abc)
              }
            }
          })

          this.multiValues[item.id] = multiValue
          this.radioValues[item.id] = radioValue

          this.radioRights[item.id] = radioRight
          this.multiRights[item.id] = multiRight

          this.myRadio[item.id] = myRadio
          this.myMulti[item.id] = myMulti
        })
      }).catch((reason) => {
        this.$notify({
          title: '获取考试结果失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    }
  }
}
</script>

<style scoped>

  .qu-content{

    border-bottom: #eee 1px solid;
    padding-bottom: 10px;

  }

  .qu-content div{
    line-height: 30px;
  }

  .el-checkbox-group label,.el-radio-group label{
    width: 100%;
  }

  .card-title{
    background: #eee;
    line-height: 35px;
    text-align: center;
    font-size: 14px;
  }
  .card-line{
    padding-left: 10px
  }
  .card-line span {
    cursor: pointer;
    margin: 2px;
  }
</style>

