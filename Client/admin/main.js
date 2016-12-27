import Vue from 'vue'

import app from './admin.vue'

require('../assets/bootstrap.min.css')
import 'element-ui/lib/theme-default/index.css'
import {
  DatePicker,
  Row,
  Col
} from 'element-ui'

Vue.use(Col);
Vue.use(Row);
Vue.use(DatePicker);

new Vue({
  el: '#app',
  render: h => h(app)
})