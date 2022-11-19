<template>
  <!-- 日历组件 -->
  <div>
    <el-row type="flex" justify="end">
      <!-- 年  -->
      <!-- 父组件传入一个日期，从日期获取年，取前5年+后5年 -->
      <el-select v-model="currentYear" size="small" style="width: 120px" @change="changeDate">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <!-- 月 -->
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px" @change="changeDate">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template #dateCell="{date,data}">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      // 回调函数式的返回值
      default: () => new Date() // 如果父组件没有传值 就取当前时间
    }
  },
  data() {
    return {
      yearList: [], // 要遍历的年的数组
      currentYear: null, // 记录当前年份
      currentMonth: null, // 记录当前月份
      currentDate: null // 记录最新时间
    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear() // 获取当前年份
    this.currentMonth = this.startDate.getMonth() + 1 // 获取当前月份
    // 快速生成数组
    // Array(11) 生成数组长度为11 值为undefined的数组
    // Array.from([],callback)
    this.yearList = Array.from(Array(11), (value, index) => index + this.currentYear - 5)
    this.changeDate()
  },
  methods: {
    changeDate() {
      // 生成新的时间 从1号开始
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
    },
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style  scoped>
 /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>
