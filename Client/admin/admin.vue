<template>
  <div id="app" class="container">
    <div class="logout">
      <span>Welcome! My lord!</span>
      <span> | </span>
      <a @click="changePass">password</a>
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
    <table id="data" class="unselectable table table-hover table-bordered">
      <thead class="thead-inverse">
        <tr>
          <th>#</th>
          <th>Site ID</th>
          <th>Domain / Email Addr</th>
          <th>Status</th>
          <th>Applicant</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(domain, index) of filteredDomain">
          <tr>
            <td>{{ index + 1 }}</td>
            <td>{{ domain.site }}</td>
            <td>{{ domain.domain }}</td>
            <td>{{ domain.status ? 'pending' : 'viewed' }}</td>
            <td>{{ domain.applicant }}</td>
          </tr>
        </template>
      </tbody>
    </table>


<el-row type="flex" class="row-bg" justify="space-between">
  <el-col :span="12">
    <div class="input-group">
      <span class="input-group-btn">
        <button @click="download" class="btn btn-info">Download</button>
      </span>
    </div>
  </el-col>
  <el-col :span="8"> 
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      align="right"
      placeholder="Choose Date Range"
      :picker-options="pickerOptions"
      >
    </el-date-picker>
  </el-col>
</el-row>


    
  </div>
</template>
<script>
export default {
	name: 'app',
	data() {
		return {
			domains: [],
			countryChecked: [],
      siteChecked: [],
      sites:[],
      input: '',
      dateRange: '',

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
		download: function(e) {

			fetch('api/admin/csv', {
				method: 'post',
				body: JSON.stringify(this.filteredDomain),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function(res) {
				return res.blob();
			}).then(function(blob) {
				var link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = 'Domains.csv';
				link.click();
				URL.revokeObjectURL(link.href);
			});
		},
		add: function(e) {

			if (!confirm(`This operation will add the following domain(s) to ${this.siteChecked.length} site(s), continue ?\n\n` + this.input.replace(/\,/g, '\n'))) return;

			fetch('/api/public/domain', {
				credentials: 'include',
				method: 'put',
				body: JSON.stringify({
					sites: this.siteChecked,
					domains: this.input.split(',').map(e => {
						return e.replace(/(^\s*)|(\s*$)/g, '')
					})
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(res => {
				if (res.status === 200) {
					location.reload();
				} else {
					alert('At least one of your domain already exists in the database, please check your input.');
				}
			});
		},
		changePass: function(e) {
			// @TODO: Change Password
		}
	},
	computed: {
		filteredDomain: function() {
			return this.domains.filter(e => {
				if (this.siteChecked.indexOf(e.sid) > -1) return e;
			});
		}
	},
	created: function() {
		!self.fetch && console.error('fetch API is not supported, please upgrade the browser.');
		
    fetch('api/admin/site', {
        credentials: 'include'
    }).then(res => {
        return res.json().then(json => {
            this.sites = json;
            for(let entry of json){
              this.countryChecked.push(entry.id)
            }
        });
    });

    fetch('api/admin/domain', {
        credentials: 'include'
    }).then(res => {
        return res.json().then(json => {
            this.domains = json
        });
    });
	}
}
</script>
<style>
  * {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
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

 .el-date-editor{
   display:block !important
 }
</style>