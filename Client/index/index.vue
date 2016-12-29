<template>
    <div id="app" class="container">
        <div class="right">
            <span>{{ name }}</span>
            <span> | </span>
            <a @click="changePass">password</a>
            <span> | </span>
            <a href="api/public/logout">Logout</a></div>
        <h1>Domain Collecting System</h1>
        <h4>Country: {{ country }}
        </h4>
        <label>Select Site</label>
        <div class="unselectable">
            <template v-for="site of sites">
                <label class="custom-control custom-checkbox">
                    <input type="checkbox" v-model="checked" :value="site.id" class="custom-control-input">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">{{ site.name }}</span>
                </label>
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
            <div class="col-lg-6">
                <div class="input-group">
                    <span class="input-group-btn">
         <button @click="download" class="btn btn-info">Download</button>
      </span>
                </div>
            </div>
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
                name: '',
                country: '',
                sites: [],
                domains: [],
                checked: [],
                input: ''
            }
        },
        methods: {
            download: function (e) {

                fetch('api/public/xlsx', {
                        method: 'post',
                        body: JSON.stringify(this.filteredDomain),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function (res) {
                        return res.blob();
                    })
                    .then(function (blob) {
                        var link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = 'Domains.xlsx';
                        link.click();
                        URL.revokeObjectURL(link.href);
                    });
            },
            add: function (e) {

                if (!confirm(
                        `This operation will add the following domain(s) to ${this.checked.length} site(s), continue?\n\n` +
                        this.input.replace(/\,/g, '\n'))) return;

                fetch('/api/public/domain', {
                    credentials: 'include',
                    method: 'put',
                    body: JSON.stringify({
                        sites: this.checked,
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
                        alert(
                            'At least one of your domain already exists in the database, please check your input.'
                        );
                    }
                });
            },
            changePass: function (e) {
                // @TODO: Change Password
            }
        },
        computed: {
            filteredDomain: function () {
                return this.domains.filter((e, i, a) => {
                    if (this.checked.indexOf(e.sid) > -1)
                        return e;
                });
            },
            hasWarning: function () {
                return this.checked.length > 1;
            },
            hasDanger: function () {
                return this.checked.length === 0 || !
                    /^([\w\-]+@)?[a-zA-Z\d]((\-)?[a-zA-Z\d])*(\.[a-zA-Z\d]((\-)?[a-zA-Z\d])*)*(\.[a-zA-Z]{2,4})(,([\w\-]+@)?[a-zA-Z\d]((\-)?[a-zA-Z\d])*(\.[a-zA-Z\d]((\-)?[a-zA-Z\d])*)*(\.[a-zA-Z]{2,4}))*$/
                    .test(this.input);
            },
            warnInfo: function () {
                return this.checked.length > 1 ?
                    `Attention: You are adding domain to ${this.checked.length} sites. ` : '';
            },
            errorInfo: function () {
                return this.hasDanger ?
                    (this.checked.length === 0 ? 'Error: Please choose a targeted site.' :
                        'Error: Domain format  error.') : '';
            },
            validated: function () {
                return !this.warnInfo && !this.errorInfo;
            }
        },
        created: function () {
            !self.fetch && console.error('fetch API is not supported, please upgrade the browser.');

            fetch('api/public/info', {
                credentials: 'include'
            }).then((res) => {
                return res.json().then((json) => {
                    this.name = json.name;
                    this.country = json.country;
                    this.sites = json.sites;

                    for (let entry of this.sites) {
                        this.checked.push(entry.id);
                    }
                });
            });

            fetch('api/public/domain', {
                credentials: 'include'
            }).then((res) => {
                return res.json().then((json) => {
                    for (let entry of json) {
                        entry.status = entry.cTime == entry.vTime;
                    }
                    this.domains = json;
                });
            });
        }
    }
</script>
<style>
    label {
        margin-right: 2em
    }
    
    .custom-control+.custom-control {
        margin-left: 0 !important
    }
    
    .col-lg-6 {
        margin-bottom: 1em;
    }
</style>