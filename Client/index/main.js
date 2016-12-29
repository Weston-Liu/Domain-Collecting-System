import Vue from 'vue'
import app from './index.vue'
require ('../assets/bootstrap.min.css')

import '../assets/common.css'

new Vue({
  el: '#app',
  render: h => h(app)
})
