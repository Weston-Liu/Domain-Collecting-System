import Vue from 'vue'
import app from './login.vue'

import 'element-ui/lib/theme-default/index.css'
import '../assets/common.css'

import ElementUI from 'element-ui'


Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(app)
})
