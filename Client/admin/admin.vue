<template>
  <div id="app" class="container">
    <div class="logout">
      <span>Welcome! My lord!</span>
      <span> | </span>
      <a class="link" @click="changePassShow">password</a>
      <span> | </span>
      <a href="api/public/logout">Logout</a></div>
    <h1>Domain Collecting System</h1>
    <div class="unselectable">
      <label>Select Country</label>
      <div id="countries">
        <template v-for="country of sites">
          <label class="custom-control custom-checkbox">
              <input type="checkbox" v-model="countryChecked" :value="country.id" class="custom-control-input">
              <span class="custom-control-indicator"></span>
              <span class="custom-control-description">{{ country.name }}</span>
          </label>
        </template>
      </div>
      <template v-for="country of sites">
        <div v-if="countryChecked.indexOf(country.id) !== -1" class="sites">
          <span class="tag tag-pill tag-success cname">{{ country.name }}</span>
          <div>
            <template v-for="site of country.sites">
              <label class="custom-control custom-checkbox">
                <input type="checkbox" v-model="siteChecked" :value="site.id" class="custom-control-input">
                <span class="custom-control-indicator"></span>
                <span class="custom-control-description">{{ site.name }}</span>
              </label>
            </template>
          </div>
        </div>
      </template>
    </div>
    <domain-list :domains="filteredDomain"></domain-list>
    <template>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[50, 100, 1000]"
          :page-size="50" layout="total, sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>
    </template>
    <site-management></site-management>
    <template>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="12">
          <el-button @click="download" type="info">Download</el-button>
        </el-col>
        <el-col :span="8">
          <el-date-picker v-model="dateRange" type="daterange" align="right" placeholder="Choose Date Range" :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
      </el-row>
    </template>
    <change-pass :visible="changePassVisible" v-on:cpclosed="changePassClose"></change-pass>
  </div>
</template>
<script>
  import table from './table.vue'
  import dialog from './changePass.vue'
  import siteManagement from './siteManagement.vue'

  export default {
    name: 'app',

    //mixins: [dialog],

    data() {
      return {
        currentPage4: 4,
        domains: [],
        countryChecked: [],
        siteChecked: [],
        sites: [],
        dateRange: [],
        changePassVisible: false,

        pickerOptions: {
          shortcuts: [{
            text: 'Last Week',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Last Month',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Last 3 Months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    methods: {

      handleSizeChange: function (val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange: function (val) {
        this.currentPage = val;
        console.log(`当前页: ${val}`);
      },

      download: function () {
        var ret = 'Site-ID,domain,unitType\n';

        for (let entry of this.filteredDomain) {
          ret += `${entry.site},${entry.domain},b2cUnit\n`;
        }

        var blob = new Blob([ret], {
          type: "text/plain"
        });

        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Domains.csv';
        link.click();
        URL.revokeObjectURL(link.href);

      },
      changePassShow: function () {
        this.changePassVisible = true;
      },
      changePassClose: function () {
        this.changePassVisible = false;
      }
    },
    computed: {
      filteredDomain: function () {
        return this.domains.filter(e => {
          var d = new Date(e.cTime);
          if (this.siteChecked.indexOf(e.sid) > -1 && d > this.dateRange[0] && d < this.dateRange[1]) return e;
        });
      }
    },
    created: function () {

      // compatibility check
      !self.fetch && this.$notify.error({
        title: 'Warning',
        message: 'fetch API is not supported, please upgrade the browser.',
        duration: 0
      });

      // fetch site data
      fetch('api/admin/site', {
        credentials: 'include'
      }).then(res => {
        return res.json().then(json => {
          this.sites = json;
          /* Select All Countries*/
          for (let entry of json) {
            this.countryChecked.push(entry.id);
            /* Select All Sites*/
            for (let site of entry.sites) {
              this.siteChecked.push(site.id);
            }
          }
        });
      });

      // fetch domain data
      fetch('api/admin/domain', {
        credentials: 'include'
      }).then(res => {
        return res.json().then(json => {
          for (let entry of json) {
            entry.status = (entry.cTime === entry.vTime ? 'Pending' : 'Viewed');
          }
          this.domains = json;
          if (json.length > 0)
            this.dateRange = [new Date(json[0].cTime), new Date(json[json.length - 1].cTime)];
        });
      });
    },
    components: {
      'domain-list': table,
      'change-pass': dialog,
      'site-management': siteManagement
    }
  }
</script>
<style>
  #app {
    font-family: 'Avenir', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .el-row {
    margin-top: 1em
  }
  
  .container {
    padding: 50px
  }
  
  .logout {
    float: right;
  }
  
  label {
    margin-right: 2em
  }
  
  .unselectable {
    user-select: none;
  }
  
  .custom-control+.custom-control {
    margin-left: 0 !important
  }
  
  .sites {
    border-top: 1px dashed #777;
    padding: 1em 0 1em 0
  }
  
  .cname {
    float: right;
    position: relative;
    top: -2em;
  }
  
  .col-lg-6 {
    margin-bottom: 1em;
  }
  
  .el-date-editor {
    display: block !important
  }
  
  .link {
    cursor: pointer;
  }
</style>