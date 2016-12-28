import Vue from 'vue'
import app from './admin.vue'

require('../assets/bootstrap.min.css')

import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import 'element-ui/lib/theme-default/index.css'
import {
  DatePicker,
  Table,
  TableColumn,
  Row,
  Col,
  Tag
} from 'element-ui'

locale.use(lang)

Vue.use(Tag);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Col);
Vue.use(Row);
Vue.use(DatePicker);

new Vue({
  el: '#app',
  render: h => h(app)
})