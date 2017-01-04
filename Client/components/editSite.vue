<template>
    <el-collapse v-model="activeNames">
        <el-collapse-item v-for="country of country" :title="country.name" :name="country.id + ''">
            <el-table :data="country.sites" :show-header="false">
                <el-table-column prop="name" label="Site">
                </el-table-column>
                <el-table-column label="Operate">
                    <template scope="scope">
                        <div class="right">
                            <el-popover width="300" placement="top">
                                <p>You are editing the name of site <b>{{ scope.row.name }}</b> </p>
                                <el-input v-model="input">
                                    <el-button size="mini" slot="append" @click="handleEdit(scope.$index, scope.row)">Proceed</el-button>
                                </el-input>
                                <div slot="reference" class="operate-wrapper">
                                    <el-button size="small" @click="handleEditClick(scope.$index, scope.row)">Edit</el-button>
                                </div>
                            </el-popover>
                            <el-popover placement="top">
                                <p>Do you surely want to <strong>DELETE</strong> site <b>{{ scope.row.name }}?</b> </p>
                                <p><em>All the data relating to this site will be deleted accordingly.</em></p>
                                <div class="right">
                                    <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">Proceed</el-button>
                                </div>
                                <div slot="reference" class="operate-wrapper">
                                    <el-button size="small" type="danger">Delete</el-button>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
    export default {
        props: ['country'],

        data() {
            return {
                activeNames: ['1', '2', '3', '4'],
                input: ''
            };
        },
        methods: {
            handleEdit: function (index, row) {
                // fetch
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
                        this.$message.success('Site name updated successfully.');
                        row.name = this.input;
                    } else {
                        this.$message.error('Something is wrong, please try again later.');
                    }
                }).catch(() => {
                    this.$message.error('Network error, please try again later.')
                });
            },
            handleDelete: function (index, row) {
                console.log(row.id);
                // fetch
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
                        this.$message.success('Site deleted successfully.');
                        this.$emit('refsite');
                    } else {
                        this.$message.error('Something is wrong, please try again later.');
                    }
                }).catch(() => {
                    this.$message.error('Network error, please try again later.')
                });
            },
            handleEditClick: function (index, row) {
                this.input = row.name;
            }
        }
    };
</script>
<style>
    .operate-wrapper {
        display: inline-block
    }

    .el-collapse-item__content{
        padding:1em !important
    }
</style>