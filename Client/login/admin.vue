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
    <div class="row">
      <div class="col-lg-3">
        <div class="input-group">
          <span class="input-group-btn">
            <button @click="download" class="btn btn-info">Download</button>
          </span>
        </div>
      </div>
      <div class="col-lg-3"></div>
      <div class="col-lg-6">
        <div class="form-group" :class="{'has-warning': hasWarning, 'has-danger': hasDanger, 'has-success':validated}">
          <div class="input-group">
            <input type="text" class="form-control" :class="{'form-control-warning': hasWarning, 'form-control-danger': hasDanger, 'form-control-success':validated}"
              v-model="input" placeholder="Input domain...">
            <span class="input-group-btn">
              <button @click="add" :disabled="hasDanger" id="add" class="btn btn-secondary" :class="{'btn-danger':hasDanger,'btn-warning':hasWarning, 'btn-success':validated}" type="button">Add</button>
            </span>
          </div>
          <small class="form-text text-muted">You can use comma to seperate mutiple domains.</small>
          <div class="form-control-feedback">{{ warnInfo }}</div>
          <div class="form-control-feedback">{{ errorInfo }}</div>
        </div>
      </div>
    </div>
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
      input: ''
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
				link.download = 'Domains.xlsx';
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
					domains: this.input.split(',').map((e) => {
						return e.replace(/(^\s*)|(\s*$)/g, '')
					})
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((res) => {
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
			return this.domains.filter((e) => {
				if (this.siteChecked.indexOf(e.sid) > -1) return e;
			});
		},
		hasWarning: function() {
			return this.siteChecked.length > 1;
		},
		hasDanger: function() {
			return this.siteChecked.length === 0 || !/^([\w\-]+@)?[a-zA-Z\d]((\-)?[a-zA-Z\d])*(\.[a-zA-Z\d]((\-)?[a-zA-Z\d])*)*(\.[a-zA-Z]{2,4})(,([\w\-]+@)?[a-zA-Z\d]((\-)?[a-zA-Z\d])*(\.[a-zA-Z\d]((\-)?[a-zA-Z\d])*)*(\.[a-zA-Z]{2,4}))*$/.test(this.input);
		},
		warnInfo: function() {
			return this.siteChecked.length > 1 ? `Attention : You are adding domain to ${this.siteChecked.length} sites.`: '';
		},
		errorInfo: function() {
			return this.hasDanger ? (this.siteChecked.length === 0 ? 'Error: Please choose a targeted site.' : 'Error: Domain format  error.') : '';
		},
		validated: function() {
			return !this.warnInfo && !this.errorInfo;
		}
	},
	created: function() {
		!self.fetch && console.error('fetch API is not supported, please upgrade the browser.');
		
    this.domains = [{"sid":3,"site":"krsmb_unit","domain":"123","cTime":"2016-11-21T10:03:57.000Z","vTime":"2016-11-21T10:03:57.000Z","applicant":"user"},{"sid":6,"site":"kraffinity_unit","domain":"123","cTime":"2016-11-21T10:03:57.000Z","vTime":"2016-11-21T10:03:57.000Z","applicant":"user"},{"sid":4,"site":"krepp_unit","domain":"123","cTime":"2016-11-21T10:03:57.000Z","vTime":"2016-11-21T10:03:57.000Z","applicant":"user"}];

    this.sites = [{"id":2,"name":"HK","sites":[{"id":7,"name":"hkcepp_lenovo_unit"},{"id":8,"name":"hkeducation_unit"},{"id":9,"name":"hksmb_lenovo_unit"},{"id":10,"name":"hkepp_lenovo_unit"},{"id":11,"name":"hkcepp_mc_lenovo_unit"}]},{"id":1,"name":"KR","sites":[{"id":1,"name":"krcepp_lenovo_unit"},{"id":2,"name":"kreducation_unit"},{"id":3,"name":"krsmb_unit"},{"id":4,"name":"krepp_unit"},{"id":5,"name":"krpartner_unit"},{"id":6,"name":"kraffinity_unit"}]},{"id":3,"name":"SG","sites":[{"id":12,"name":"sgcepp_lenovo_unit"},{"id":13,"name":"sgcepp01_unit"},{"id":14,"name":"sgnonprofit_unit"},{"id":15,"name":"sgepp_lenovo_unit"},{"id":16,"name":"sgpartner_unit"},{"id":17,"name":"sgstcepp_lenovo_unit"}]},{"id":4,"name":"TW","sites":[{"id":18,"name":"twepp_unit"},{"id":19,"name":"twedu_unit"}]}];
 
	}
}
</script>
<style>
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
  .custom-control+.custom-control{
    margin-left:0 !important
  }
  .sites{
    border-top: 1px dashed #777;
    padding: 1em 0 1em 0
  }
  .cname{
    float: right;
    position: relative;
    top: -2em;
  }

</style>