<template>
    <el-dialog class="unselectable" title="Change Password" v-model="visible" :show-close="false" size="small" :close-on-press-escape="false" :close-on-click-modal="false" :lock-scroll="false">
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
            <el-button type="primary" @click="submit">Submit</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        props: ['visible'],
        data() {
            var validateNewPassConfirm = (rule, value, callback) => {
                if (value !== this.ruleForm.np) {
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
                        required: true,
                        message: 'Please input the old password.',
                        trigger: 'blur'
                    }],
                    np: [{
                        required: true,
                        message: 'Please input the new password.',
                        trigger: 'blur'
                    }],
                    cnp: [{
                        required: true,
                        message: 'Please input the new password again.',
                        trigger: 'blur'
                    }, {
                        validator: validateNewPassConfirm,
                        trigger: 'blur'
                    }]
                }
            };
        },
        methods: {
            close: function () {
                this.$emit('cpclosed');
            },
            submit: function () {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        // fetch
                        fetch('api/public/password', {
                            credentials: 'include',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(this.ruleForm)
                        }).then(res => {
                            if (res.ok) {
                                this.$message.success('Password changed successfully.');
                                this.$emit('cpclosed');
                            } else {
                                this.$message.error('The old password is wrong, please check your input.');
                            }
                        }).catch(() => {
                            this.$message.error('Network error, please try again later.')
                        });

                    }
                });
            }
        }
    };
</script>