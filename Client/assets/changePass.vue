<template>
    <el-dialog class="unselectable" title="Change Password" v-model="visible" :show-close="false" :close-on-click-modal="false">
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
                                console.log('ok');
                            } else {
                                console.log('err');
                            }
                        }).catch(() => {});

                    }
                });
            }
        }
    };
</script>