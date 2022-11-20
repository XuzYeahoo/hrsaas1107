// 多语言实例化文件
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie'
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 中文包
import elementEN from 'element-ui/lib/locale/lang/en' // 英文包
import customZH from './zh'
import customEN from './en'
Vue.use(VueI18n) // 完成全局注册
export default new VueI18n({
  // i18n的选项
  // locale指的是当前的多语音类型 是随意定义的字符串 zh / en
  locale: Cookie.get('language') || 'zh',
  // messages指的是当前的语言包 有多少类型就有多少语言包
  messages: {
    // 语言包 ：element-ui的语言包 + 自定义语言包
    zh: {
      ...elementZH,
      ...customZH
    },
    en: {
      ...elementEN,
      ...customEN
    }
  }
})
