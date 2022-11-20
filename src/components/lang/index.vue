<template>
  <el-dropdown @command="changeLanguage">
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="$i18n.locale === 'zh'" command="zh">中文</el-dropdown-item>
        <el-dropdown-item :disabled="$i18n.locale === 'en'" command="en">En</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  methods: {
    changeLanguage(type) {
      // 将选择切换的类型存入cookie
      Cookie.set('language', type)
      // i18n和router类似 都绑定到Vue上了
      this.$i18n.locale = type // 将当前的多语言改变成对应的类型
      this.$message.success('切换多语言成功')
    }
  }
}
</script>

<style>

</style>
