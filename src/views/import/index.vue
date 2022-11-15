<template>
  <div>
    <UploadExcel :on-success="success" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      // header和results中的数据都是中文
      // header是表格列名称（数组） results是每一个员工的数据集合（数组）[{},{},{},...]
      // 新增的员工 属性是一致的
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // var arr = []
      // // 现在要把中文的key全部转换成userRelations中对应的英文
      // results.forEach(item => {
      //   var userInfo = {}
      //   // item是每个员工的数据
      //   Object.keys(item).forEach(key => {
      //     // 此时的key是中文
      //     userInfo[userRelations[key]] = item[key] // 将原来中文key对应的值赋值给英文key对应的值
      //   })
      //   arr.push(userInfo)
      // })
      var newArr = results.map(item => {
        var userInfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // 后端接口限制了不能是字符串 要求转化时间类型
            userRelations[key] = new Date(this.formatDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo
      })
      // console.log(newArr)
      await importEmployee(newArr)
      this.$message.success('导入Excel成功')
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
