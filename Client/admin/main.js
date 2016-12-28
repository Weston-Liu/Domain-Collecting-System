import Vue from 'vue'
import app from './admin.vue'

require('../assets/bootstrap.min.css')

import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)
Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(app)
})