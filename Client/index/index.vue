<template>
    <div id="app" class="container">
        <div class="right">
            <span>Welcome, {{ name }}</span>
            <i class="el-icon-edit"></i>
            <a @click="changePassShow" type="text" class="link">password</a>
            <i class="el-icon-edit"></i>
            <a href="api/public/logout" class="link">Logout</a>
        </div>
        <h1>Domain Collecting System</h1>
        <h4>Country: {{ country }}
        </h4>
        <div class="unselectable" id="sites">
            <template>
                <el-checkbox-group v-model="checked">
                    <el-checkbox :label="site.id" v-for="site of sites">{{ site.name }}</el-checkbox>
                </el-checkbox-group>
            </template>
        </div>
        <el-input placeholder="Input domain..." v-model="input">
            <el-button @click="add" :disabled="hasDanger" slot="append" icon="upload2">Add</el-button>
        </el-input>
        <small>You can use comma to seperate mutiple domains.</small>
        <div v-if="warnInfo" class="warn"><i class="el-icon-warning"></i>{{ warnInfo }}</div>
        <div v-if="errorInfo" class="error"><i class="el-icon-circle-cross"></i>{{ errorInfo }}</div>
        <domain-list :domains="paginatedDomain"></domain-list>
        <template>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes"
                :page-size="pageSize" layout="sizes, prev, pager, next" :total="filteredDomain.length">
            </el-pagination>
        </template>
        <el-button @click="download" type="info">Download</el-button>
        <change-pass :visible="changePassVisible" v-on:cpclosed="changePassClose"></change-pass>
    </div>
</template>
<script>
    import domainList from '../components/domainList.vue'
    import changePass from '../components/changePass.vue'
    export default {
        name: 'app',
        data() {
            return {
                // pagination
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 50, 100, 1000],
                //basic info
                name: '',
                country: '',
                // domain list
                sites: [],
                domains: [],
                checked: [],
                input: '',
                // change pass dialog
                changePassVisible: false,
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
            // add domains
            add: function (e) {
                // confirm operation
                this.$confirm(
                    `This operation will add the following domain(s) to ${this.checked.length} site(s), continue?\n\n` +
                    this.input.replace(/\,/g, '\n'), 'Attention', {
                        type: 'warning'
                    }).then(() => {
                    // add domain to server
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
                            // show success msg
                            this.$message({
                                type: 'success',
                                message: 'Success.',
                                duration: 4000
                            });
                            // fetch new domain list 
                            fetch('api/public/domain', {
                                credentials: 'include'
                            }).then((res) => {
                                return res.json().then((json) => {
                                    for (let entry of json) {
                                        entry.status = (entry.cTime === entry.vTime ?
                                            'Pending' : 'Viewed');
                                    }
                                    this.domains = json;
                                });
                            });
                        } else {
                            // show error msg
                            this.$message({
                                type: 'error',
                                message: 'At least one of your domain already exists in the database, please check your input.',
                                duration: 4000
                            });
                        }
                    });
                }).catch(() => {});
            },
            // change pass
            changePassShow: function () {
                this.changePassVisible = true;
            },
            changePassClose: function () {
                this.changePassVisible = false;
            }
        },
        computed: {
            filteredDomain: function () {
                return this.domains.filter((e, i, a) => {
                    if (this.checked.indexOf(e.sid) > -1)
                        return e;
                });
            },
            paginatedDomain: function () {
                return this.filteredDomain.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
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
                    ` You are adding domain to ${this.checked.length} sites. ` : '';
            },
            errorInfo: function () {
                return this.hasDanger ?
                    (this.checked.length === 0 ? ' Please choose a site.' :
                        ' Domain format error.') : '';
            },
            validated: function () {
                return !this.warnInfo && !this.errorInfo;
            }
        },
        created: function () {
            // compatibility check
            !self.fetch && this.$notify.error({
                title: 'Warning',
                message: 'fetch API is not supported, please upgrade the browser.',
                duration: 0
            });

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
                        entry.status = (entry.cTime === entry.vTime ? 'Pending' : 'Viewed');
                    }
                    this.domains = json;
                });
            });
        },
        components: {
            'domain-list': domainList,
            'change-pass': changePass
        }
    }
</script>
<style>
    label {
        margin-right: 2em
    }
    
    .warn {
        font-size: 14px;
        color: #F7BA2A
    }
    
    .error {
        font-size: 14px;
        color: #FF4949;
        margin-bottom: 1em
    }
    
    .el-checkbox+.el-checkbox {
        margin-left: 0 !important
    }
    
    .el-pagination {
        text-align: center;
        margin: 1em 0 1em 0;
    }
    
    #sites {
        margin: 1em 0
    }
</style>