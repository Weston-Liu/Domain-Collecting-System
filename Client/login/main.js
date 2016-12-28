import Vue from 'vue'
import app from './login.vue'

require ('../assets/bootstrap.min.css')

new Vue({
  el: '#app',
  render: h => h(app)
})
