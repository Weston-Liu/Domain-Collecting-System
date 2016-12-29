<template>
    <el-dialog title="Change Password" v-model="visible" :show-close="false" :close-on-click-modal="false">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item label="Original Password" prop="op">
                <el-input v-model="ruleForm.op" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="New Password" prop="np">
                <el-input type="password" v-model="ruleForm.np" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="Confirm New Password" prop="cnp">
                <el-input type="password" v-model="ruleForm.cnp" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">Cancel</el-button>
            <el-button type="primary" @click="close">Submit</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        props: ['visible'],
        data() {
            var validateOldPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input the password.'));
                } else {
                    callback();
                }
            };
            var validateNewPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input the password.'));
                } else {
                    if (this.ruleForm.np !== '') {
                        this.$refs.ruleForm.validateField('cnp');
                    }
                    callback();
                }
            };
            var validateNewPassConfirm = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input the new password again.'));
                } else if (value !== this.ruleForm.np) {
                    callback(new Error('Two new passwords are not the same.'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    op: '',
                    np: '',
                    cnp: ''
                },
                rules: {
                    op: [{
                        validator: validateOldPass,
                        trigger: 'change'
                    }],
                    np: [{
                        validator: validateNewPass,
                        trigger: 'blur'
                    }],
                    cnp: [{
                        validator: validateNewPassConfirm,
                        trigger: 'change'
                    }]
                }
            };
        },
        methods: {
            close: function () {
                this.$emit('cpclosed');
            },
            submit: function (ev) {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    };
</script>