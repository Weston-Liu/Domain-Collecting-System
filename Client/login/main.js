import Vue from 'vue'
import app from './admin.vue'
require ('../assets/bootstrap.min.css')

new Vue({
  el: '#app',
  render: h => h(app)
})
