<template>
    <div>
        <el-collapse v-model="expandedTabs">
            <el-collapse-item name="country" title="Country">
                <template slot="title">
                    <span>Country</span>
                    <span style="position: absolute;right:2em">
                        <el-button size="mini" type="info" icon="plus" @click.stop="handleCountryAddClick()"></el-button>
                    </span>
                </template>
                <el-table :data="country" :show-header="false">
                    <el-table-column>
                        <template scope="scope">
                            <!-- new item name input -->
                            <el-input autofocus v-if="scope.row.name === undefined" v-model="input"></el-input>
                            <!-- normal name -->
                            <span v-if="scope.row.name!== undefined">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template scope="scope">
                            <div class="right">
                                <!-- new item buttom -->
                                <el-button v-if="scope.row.new" size="small" type="text" @click="$emit('ressite')">Cancel</el-button>
                                <el-button v-if="scope.row.new" size="small" type="info" @click="handleSiteAdd(country.id)" icon="edit">Confirm</el-button>
                                <!-- normal button -->
                                <el-popover v-if="scope.row.new === undefined" width="300" placement="top" v-model="editVisible[scope.row.id]">
                                    <p>You are editing the name of site <b>{{ scope.row.name }}</b> </p>
                                    <el-input v-model="input">
                                        <el-button size="mini" slot="append" @click="handleCountryEdit(scope.$index, scope.row)">Proceed</el-button>
                                    </el-input>
                                    <div slot="reference" class="operate-wrapper">
                                        <el-button size="small" @click="handleSiteEditClick(scope.$index, scope.row)" icon="edit">Edit</el-button>
                                    </div>
                                </el-popover>
                                <el-popover v-if="scope.row.new === undefined" placement="top" v-model="siteDeleteVisible[scope.row.id]">
                                    <p>Do you surely want to <strong>DELETE</strong> site <b>{{ scope.row.name }}?</b> </p>
                                    <p><em>All the data relating to this site will be deleted accordingly.</em></p>
                                    <div class="right">
                                        <el-button type="danger" size="mini" @click="handleCountryDelete(scope.$index, scope.row)">Proceed</el-button>
                                    </div>
                                    <div slot="reference" class="operate-wrapper">
                                        <el-button size="small" type="danger" icon="delete">Delete</el-button>
                                    </div>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="expandedTabs">
            <el-collapse-item v-for="country of country" :name="country.id + ''">
                <template slot="title">
                    <span>{{ country.name }}</span>
                    <span style="position: absolute;right:2em">

          <el-button size="mini" type="info" icon="plus" @click.stop="handleSiteAddClick(country.id)"></el-button>
      </span>
                </template>
                <el-table :data="country.sites" :show-header="false">
                    <el-table-column>
                        <template scope="scope">
                            <!-- new item name input -->
                            <el-input autofocus v-if="scope.row.name === undefined" v-model="input"></el-input>
                            <!-- normal name -->
                            <span v-if="scope.row.name!== undefined">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template scope="scope">
                            <div class="right">
                                <!-- new item buttom -->
                                <el-button v-if="scope.row.new" size="small" type="text" @click="$emit('ressite')">Cancel</el-button>
                                <el-button v-if="scope.row.new" size="small" type="info" @click="handleSiteAdd(country.id)" icon="edit">Confirm</el-button>
                                <!-- normal button -->
                                <el-popover v-if="scope.row.new === undefined" width="300" placement="top" v-model="editVisible[scope.row.id]">
                                    <p>You are editing the name of site <b>{{ scope.row.name }}</b> </p>
                                    <el-input v-model="input">
                                        <el-button size="mini" slot="append" @click="handleSiteEdit(scope.$index, scope.row)">Proceed</el-button>
                                    </el-input>
                                    <div slot="reference" class="operate-wrapper">
                                        <el-button size="small" @click="handleSiteEditClick(scope.$index, scope.row)" icon="edit">Edit</el-button>
                                    </div>
                                </el-popover>
                                <el-popover v-if="scope.row.new === undefined" placement="top" v-model="siteDeleteVisible[scope.row.id]">
                                    <p>Do you surely want to <strong>DELETE</strong> site <b>{{ scope.row.name }}?</b> </p>
                                    <p><em>All the data relating to this site will be deleted accordingly.</em></p>
                                    <div class="right">
                                        <el-button type="danger" size="mini" @click="handleSiteDelete(scope.$index, scope.row)">Proceed</el-button>
                                    </div>
                                    <div slot="reference" class="operate-wrapper">
                                        <el-button size="small" type="danger" icon="delete">Delete</el-button>
                                    </div>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
    export default {
        props: ['country'],

        data() {
            return {
                expandedTabs: ['1', '2', '3', '4', 'country'],
                editVisible: {
                    0: false
                },
                siteDeleteVisible: {
                    0: false
                },
                siteAddVisible: {
                    0: false
                },
                countryDeleteVisible: {
                    0: false
                },
                countryEditVisible: {
                    0: false
                },
                input: ''
            };
        },
        methods: {
            handleCountryEditClick: function (index, row) {
                this.input = row.name;
            },
            handleCountryAddClick: function (cid) {
                this.input = '';
                this.country.push({
                            id: null,
                            name: undefined,
                            new: true
                        });
            },
            handleSiteAddClick: function (cid) {
                this.input = '';
                for (let entry of this.country) {
                    if (entry.id === cid) {
                        entry.sites.push({
                            id: null,
                            name: undefined,
                            new: true
                        });
                    }
                }
            },
            handleSiteAdd: function (cid) {
                fetch('api/admin/site', {
                    credentials: 'include',
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        country: cid,
                        site: this.input
                    })
                }).then(res => {
                    if (res.ok) {
                        this.$emit('refsite');
                        this.input = '';
                        this.$message.success('Site name updated successfully.');
                    } else {
                        this.$message.error('The site is already in the selected country.');
                    }
                }).catch(() => {
                    this.$message.error('Network error, please try again later.')
                });
            },
            handleSiteEdit: function (index, row) {
                fetch('api/admin/site', {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: row.id,
                        name: this.input
                    })
                }).then(res => {
                    if (res.ok) {
                        this.editVisible[row.id] = false;
                        this.$message.success('Site name updated successfully.');
                        row.name = this.input;
                    } else {
                        this.$message.error('Something is wrong, please try again later.');
                    }
                }).catch(() => {
                    this.$message.error('Network error, please try again later.')
                });
            },
            handleSiteDelete: function (index, row) {
                fetch('api/admin/site', {
                    credentials: 'include',
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: row.id
                    })
                }).then(res => {
                    if (res.ok) {
                        this.siteDeleteVisible[row.id] = false;
                        this.$message.success('Site deleted successfully.');
                        this.$emit('refsite');
                    } else {
                        this.$message.error('Something is wrong, please try again later.');
                    }
                }).catch(() => {
                    this.$message.error('Network error, please try again later.')
                });
            },
            handleSiteEditClick: function (index, row) {
                this.input = row.name;
            }
        }
    };
</script>
<style>
    .operate-wrapper {
        display: inline-block
    }
    
    .el-collapse-item__content {
        padding: 10px !important
    }
</style>