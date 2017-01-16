<template>
    <div>
        <!-- Countries -->
        <el-collapse class="countryList" v-model="expandedTabs">
            <el-collapse-item name="country" title="Country">
                <template slot="title">
                    <span>Country</span>
                    <span class="plus">
                        <el-button size="mini" type="info" :disabled="adding" icon="plus" @click.stop="handleAddClick()"></el-button>
                    </span>
                </template>
                <el-table :data="country" :show-header="false">
                    <el-table-column>
                        <template scope="scope">
                            <!-- new item name input -->
                            <el-input autofocus v-if="scope.row.new" size="small" v-model="input"></el-input>
                            <!-- normal name -->
                            <span v-if="scope.row.name!== undefined">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template scope="scope">
                            <div class="right">
                                <!-- new item buttom -->
                                <el-button v-if="scope.row.new" size="small" type="text" @click="handleCancel(undefined)">Cancel</el-button>
                                <el-button v-if="scope.row.new" size="small" type="info" @click="handleAdd(undefined)" icon="edit">Confirm</el-button>
                                <!-- normal button -->
                                <!-- Edit Popup -->
                                <el-popover v-if="!scope.row.new" width="300" placement="top" v-model="editVisible['c' + scope.row.id]">
                                    <p>You are editing the name of site <b>{{ scope.row.name }}</b> </p>
                                    <el-input v-model="input">
                                        <el-button size="mini" slot="append" @click="handleEdit(scope.row)">Proceed</el-button>
                                    </el-input>
                                    <div slot="reference" class="operate-wrapper">
                                        <el-button size="small" @click="handleEditClick(scope.row)" :disabled="adding" icon="edit">Edit</el-button>
                                    </div>
                                </el-popover>
                                <!-- Delete Popup -->
                                <el-popover v-if="!scope.row.new" placement="top" v-model="deleteVisible['c' + scope.row.id]">
                                    <p>Do you surely want to <strong>DELETE</strong> country <b>{{ scope.row.name }}?</b> </p>
                                    <p><em>Any data relating to this country will be deleted accordingly,</em></p>
                                    <p>including any related
                                        <u>users, sites, and domains.</u>
                                    </p>
                                    <div class="right">
                                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">Proceed</el-button>
                                    </div>
                                    <div slot="reference" class="operate-wrapper">
                                        <el-button size="small" type="danger" :disabled="adding" icon="delete">Delete</el-button>
                                    </div>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
        <!-- Sites -->
        <el-collapse v-model="expandedTabs">
            <el-collapse-item v-for="country of country" :name="country.id + ''">
                <template slot="title">
                    <span>{{ country.name }}</span>
                    <span class="plus">
                        <el-button size="mini" type="info" :disabled="adding" icon="plus" @click.stop="handleAddClick(country.id)"></el-button>
                     </span>
                </template>
                <el-table :data="country.sites" :show-header="false">
                    <el-table-column>
                        <template scope="scope">
                            <!-- new item name input -->
                            <el-input autofocus v-if="scope.row.new" size="small" v-model="input"></el-input>
                            <!-- normal name -->
                            <span v-if="!scope.row.new">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template scope="scope">
                            <div class="right">
                                <!-- new item buttom -->
                                <el-button v-if="scope.row.new" size="small" type="text" @click="handleCancel(country.id)">Cancel</el-button>
                                <el-button v-if="scope.row.new" size="small" type="info" @click="handleAdd(country.id)" icon="edit">Confirm</el-button>
                                <!-- normal button -->
                                <!--                           EDIT                                  -->
                                <el-popover v-if="!scope.row.new" width="300" placement="top" v-model="editVisible['s' + scope.row.id]">
                                    <p>You are editing the name of site <b>{{ scope.row.name }}</b> </p>
                                    <el-input v-model="input">
                                        <el-button size="mini" slot="append" @click="handleEdit(scope.row)">Proceed</el-button>
                                    </el-input>
                                    <div slot="reference" class="operate-wrapper">
                                        <el-button size="small" :disabled="adding" @click="handleEditClick(scope.row)" icon="edit">Edit</el-button>
                                    </div>
                                </el-popover>
                                <!--                           DELETE                                  -->
                                <el-popover v-if="!scope.row.new" placement="top" v-model="deleteVisible['s' + scope.row.id]">
                                    <p>Do you surely want to <strong>DELETE</strong> site <b>{{ scope.row.name }}?</b> </p>
                                    <p><em>Any data relating to this site will be deleted accordingly,</em></p>
                                    <p>including any related
                                        <u>domains.</u>
                                    </p>
                                    <div class="right">
                                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">Proceed</el-button>
                                    </div>
                                    <div slot="reference" class="operate-wrapper">
                                        <el-button size="small" type="danger" :disabled="adding" icon="delete">Delete</el-button>
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
                editVisible: {},
                deleteVisible: {},
                input: '',
                adding: false
            };
        },
        computed: {
            expandedTabs: function () {
                var ret = ['country'];
                for (let country of this.country) {
                    ret.push(country.id + '');
                }
                return ret;
            }
        },
        methods: {
            handleEditClick: function (row) {
                this.input = row.name;
            },
            handleAddClick: function (cid) {

                this.input = '';
                this.adding = true;
                // site
                if (cid !== undefined) {
                    for (let country of this.country) {
                        if (country.id === cid) {
                            country.sites.push({
                                new: true
                            });
                        }
                    }
                } else {
                    // country
                    this.country.push({
                        new: true
                    });
                }
            },
            handleAdd: function (cid) {
                if (this.input === '')
                    return;
                /** DO NOT TOUCH THIS **/
                this.handleCancel(cid);
                /** DO NOT TOUCH THIS **/
                const isCountry = cid === undefined;

                fetch(`api/admin/${isCountry? 'country': 'site'}`, {
                    credentials: 'include',
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        country: cid,
                        name: this.input
                    })
                }).then(res => {
                    if (res.ok) {
                        this.$emit('refsite');
                        this.input = '';
                        this.adding = false;
                        this.$message.success(`${isCountry? 'Country': 'Site'} added successfully.`);
                    } else {
                        this.$message.error(`The ${isCountry? 'country': 'site'} has already been added.`);
                    }
                }).catch(() => {
                    this.$message.error('Network error, please try again later.')
                });
            },
            handleEdit: function (row) {
                if (this.input === '')
                    return;
                const isCountry = row.sites !== undefined;
                fetch(`api/admin/${isCountry? 'country': 'site'}`, {
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
                        this.editVisible[(isCountry ? 'c' : 's') + row.id] = false;
                        this.$message.success(`${isCountry? 'Country': 'Site'} name updated successfully.`);
                        row.name = this.input;
                    } else {
                        this.$message.error('The name is already existed.');
                    }
                }).catch(() => {
                    this.$message.error('Network error, please try again later.')
                });
            },
            handleDelete: function (row) {
                const isCountry = row.sites !== undefined;
                fetch(`api/admin/${isCountry? 'country': 'site'}`, {
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
                        this.deleteVisible[(isCountry ? 'c' : 's') + row.id] = false;
                        this.$message.success(`${isCountry? 'Country': 'Site'} deleted successfully.`);
                        this.$emit('refsite');
                    } else {
                        this.$message.error('Something is wrong, please try again later.');
                    }
                }).catch(() => {
                    this.$message.error('Network error, please try again later.')
                });
            },
            handleCancel: function (cid) {
                const isCountry = cid === undefined;
                this.adding = false;
                if (isCountry) {
                    this.country.pop();
                } else {
                    for (let country of this.country)
                        if (country.id === cid)
                            country.sites.pop();
                }
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
    
    .plus {
        position: absolute;
        right: 2em
    }
    
    .countryList {
        margin-bottom: 1em
    }
</style>