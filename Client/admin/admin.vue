<template>
  <div id="app" class="container">
    <div class="right">
      <span>Welcome, My lord</span>
      <i class="el-icon-edit"></i>
      <a @click="changePassShow" type="text" class="link">password</a>
      <i class="el-icon-edit"></i>
      <a href="api/public/logout" class="link">Logout</a>
    </div>
    <h1>Domain Collecting System</h1>
    <el-tabs type="border-card" class="unselectable">
      <el-tab-pane label="Domain">
        <div>
          <div class="bold">Country</div>
          <div id="countries">
            <template>
              <el-checkbox-group v-model="countryChecked">
                <el-checkbox :label="country.id" v-for="country of sites">{{ country.name }}</el-checkbox>
              </el-checkbox-group>
            </template>
          </div>
          <template v-for="country of sites">
            <div v-if="countryChecked.indexOf(country.id) !== -1" class="sites">
              <el-tag class="cname" type="success" color="#e7faf0" close-transition>{{ country.name }}</el-tag>
              <div>
                <template>
                  <el-checkbox-group v-model="siteChecked">
                    <el-checkbox :label="site.id" v-for="site of country.sites">{{ site.name }}</el-checkbox>
                  </el-checkbox-group>
                </template>
              </div>
            </div>
          </template>
        </div>
        <domain-list :domains="paginatedDomain"></domain-list>
        <template>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="filteredDomain.length">
          </el-pagination>
        </template>
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
      </el-tab-pane>
      <el-tab-pane label="Category">
        <edit-site :country="sites" v-on:refsite="refreshSite" v-on:ressite="restoreSite"></edit-site>
      </el-tab-pane>
      <el-tab-pane label="User">
        <edit-user :user="users" :countries="sites" v-on:refuser="refreshUser"></edit-user>
      </el-tab-pane>
    </el-tabs>
    <change-pass :visible="changePass_visible" v-on:cpclosed="changePassClose"></change-pass>
  </div>
</template>
<script>
  import domainList from '../components/domainList.vue'
  import changePass from '../components/changePass.vue'
  import editSite from '../components/editSite.vue'
  import userList from '../components/userList.vue'

  export default {
    name: 'app',

    data() {
      return {

        // pagination
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 50, 100, 1000],
        // user list
        users: [],
        // domain list
        domains: [],
        countryChecked: [],
        siteChecked: [],
        sites: [],
        // date picker
        dateRange: [],
        // change pass dialog
        changePass_visible: false,
        // date picker
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

      // pagination
      handleSizeChange: function (val) {
        this.pageSize = val;
      },
      handleCurrentChange: function (val) {
        this.currentPage = val;
      },
      // domain list
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
      // change pass
      changePassShow: function () {
        this.changePass_visible = true
      },
      changePassClose: function () {
        this.changePass_visible = false
      },

      // custom envent handler
      refreshSite: function () {
        // fetch site data
        fetch('api/admin/site', {
          credentials: 'include'
        }).then(res => {
          return res.json().then(json => {
            this.sites = json;
            localStorage.sites = JSON.stringify(json);
          });
        }).catch(() => {
          this.$message.error('Network error, please try again later.')
        });
      },
      refreshUser: function () {
        fetch('api/admin/user', {
          credentials: 'include'
        }).then(res => {
          return res.json().then(json => {
            this.users = json;
            localStorage.users = JSON.stringify(json);
          });
        }).catch(() => {
          this.$message.error('Network error, please try again later.')
        });
      },
      restoreSite: function () {
        this.sites = JSON.parse(localStorage.sites);
      }

    },
    computed: {

      filteredDomain: function () {
        return this.domains.filter(e => {
          var d = new Date(e.cTime);
          if (this.siteChecked.indexOf(e.sid) > -1 && d > this.dateRange[0] && d < this.dateRange[1]) return e;
        });
      },
      paginatedDomain: function () {
        return this.filteredDomain.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
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
          localStorage.sites = JSON.stringify(json);
          /* Select All Countries */
          for (let entry of json) {
            this.countryChecked.push(entry.id);
            /* Select All Sites */
            for (let site of entry.sites) {
              this.siteChecked.push(site.id);
            }
          }
        });
      }).catch(() => {
        this.$message.error('Network error, please try again later.')
      });

      // fetch domain data
      fetch('api/admin/domain', {
        credentials: 'include'
      }).then(res => {
        return res.json().then(json => {
          for (let entry of json) {
            entry.status = (entry.cTime === entry.vTime ? 'New Request' : 'Viewed');
          }
          this.domains = json;
          if (json.length > 0)
            this.dateRange = [new Date(json[0].cTime), new Date(json[json.length - 1].cTime)];
        });
      }).catch(() => {
        this.$message.error('Network error, please try again later.')
      });

      // fetch user data
      fetch('api/admin/user', {
        credentials: 'include'
      }).then(res => {
        return res.json().then(json => {
          this.users = json;
          localStorage.users = JSON.stringify(json);
        });
      }).catch(() => {
        this.$message.error('Network error, please try again later.')
      });
    },
    components: {
      'domain-list': domainList,
      'change-pass': changePass,
      'edit-site': editSite,
      'edit-user': userList
    }
  }
</script>
<style>
  .el-row {
    margin-top: 1em
  }
  
  label {
    margin-right: 2em
  }
  
  .el-checkbox+.el-checkbox {
    margin-left: 0 !important
  }
  
  .sites {
    border-top: 1px dashed #777;
    padding: 1em 0 1em 0
  }
  
  .cname {
    float: right;
    position: relative;
    top: -2.3em;
  }
  
  .el-date-editor {
    display: block !important
  }
  
  .el-pagination {
    text-align: center;
    margin-top: 1em;
  }
  
  #countries {
    margin: 0.5em 0
  }
  
  .cname-modifier {
    margin-left: 0.5em
  }
  
  .cname-modifier:hover {
    color: #087b3b;
    cursor: pointer
  }
  
  .el-tabs--border-card {
    box-shadow: none !important
  }
</style>