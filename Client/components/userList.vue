<template>
    <div>
        <div class="bold">Add User</div>
        <small>The default password is 000000</small>
        <el-form :inline="true" :rules="rules" ref="ruleForm" :model="form" class="addUser">
            <el-form-item prop="name">
                <el-input v-model="form.name" placeholder="Name"></el-input>
            </el-form-item>
            <el-form-item prop="role">
                <el-select v-model="form.role" placeholder="Role">
                    <el-option label="Admin" :value="9"></el-option>
                    <el-option label="User" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="country">
                <el-select v-model="form.country" placeholder="Country">
                    <el-option v-for="country in countries" :label="country.name" :value="country.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleAdd">Add</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="user">
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="name" label="Name">
            </el-table-column>
            <el-table-column label="Role">
                <template scope="scope">
                    <span>{{ scope.row.role === 9 ? 'Admin': 'User'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="country" label="Country"></el-table-column>
            <el-table-column>
                <template scope="scope">
                    <div class="right">
                        <!-- Delete Popup -->
                        <el-popover v-if="!scope.row.new" placement="top" v-model="deleteVisible[scope.row.id]">
                            <p>Do you surely want to <strong>DELETE</strong> user <b>{{ scope.row.name }}?</b> </p>
                            <p><em>All the data relating to this user will be deleted accordingly.</em></p>
                            <div class="right">
                                <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">Proceed</el-button>
                            </div>
                            <div slot="reference" class="operate-wrapper">
                                <el-button size="small" type="danger" icon="delete">Delete</el-button>
                            </div>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        props: ['user', 'countries'],

        data() {
            return {
                form: {
                    name: null,
                    role: null,
                    country: null
                },
                rules: {
                    name: [{
                        required: true,
                        message: 'Please input the user name',
                        trigger: 'blur'
                    }],
                    role: [{
                        type: 'number',
                        required: true,
                        message: 'Please select the role of the user',
                        trigger: 'blur'
                    }],
                    country: [{
                        type: 'number',
                        required: true,
                        message: 'Please select the country of the user',
                        trigger: 'blur'
                    }]
                },
                deleteVisible: {}
            };
        },
        methods: {
            handleAdd: function (name) {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        fetch('api/admin/user', {
                            credentials: 'include',
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                country: this.form.country,
                                name: this.form.name,
                                role: this.form.role
                            })
                        }).then(res => {
                            if (res.ok) {
                                this.$emit('refuser');
                                this.$refs['ruleForm'].resetFields();
                                this.$message.success('User added successfully.');
                            } else {
                                this.$message.error('The User has already been added.');
                            }
                        }).catch(() => {
                            this.$message.error('Network error, please try again later.')
                        });
                    }
                })
            },
            handleDelete: function (uid) {
                fetch('api/admin/user', {
                    credentials: 'include',
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: uid
                    })
                }).then(res => {
                    if (res.ok) {
                        this.deleteVisible[uid] = false;
                        this.$message.success('User deleted successfully.');
                        this.$emit('refuser');
                    } else {
                        this.$message.error('Something is wrong, please try again later.');
                    }
                }).catch(() => {
                    this.$message.error('Network error, please try again later.')
                });
            }
        }
    };
</script>
<style scoped>
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
    
    small {
        margin: 10px 0;
        padding-left: 8px;
        display: block;
        border-left: 3px solid #ddd
    }
</style>