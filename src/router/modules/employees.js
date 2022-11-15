// 导出员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/employees', // 路由地址
  name: 'employees', // 给模块的一级路由加一个name属性
  component: Layout, // employees是一级路由 因为要显示布局Layout
  children: [
    {
      // 默认路由
      // 如果写path:'/xxx',要想显示二级路由就必须在路径中写上 '/employees/xxx'
      path: '', // 这里不写表示 => 当我们输入/employees 不仅能访问到一级路由Layout,还能直接显示二级路由的内容
      component: () => import('@/views/employees'),
      // meta:路由元信息 其实就是一个存储数据的地方，可以放任何内容
      meta: {
        title: '员工管理', // 这里加title是因为左侧导航读取了这里的title值
        icon: 'people'
      }
    },
    {
      path: 'detail/:id', // 动态路由传参 ?表示该参数可传可不传
      component: () => import('@/views/employees/detail'),
      hidden: true,
      meta: {
        title: '员工详情'
      }
    }
  ]
}
