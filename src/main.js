import Vue from 'vue'
import App from './App.vue'
//导入路由
import router from './router'
import store from './router/store/index'

import toast from 'components/common/toast'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue();

//安装toast插件
Vue.use(toast)

new Vue({
  render: h => h(App),
  router,//注册路由
  store
}).$mount('#app')

