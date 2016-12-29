import Vue from 'vue'
import app from './login.vue'

import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui'

import '../assets/common.css'

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(app)
})
