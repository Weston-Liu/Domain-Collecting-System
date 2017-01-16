<template>
    <div id="app" class="container">
        <h1>Domain Collecting System Login</h1>
        <el-form ref="form" method="post" action="api/public/login" label-position="top">
            <el-form-item label="Username">
                <el-input name="u" id="user" type="text" placeholder="Username"></el-input>
            </el-form-item>
            <el-form-item label="Password">
                <el-input name="p" id="pass" type="password" placeholder="Username"></el-input>
            </el-form-item>
            <el-row type="flex" justify="space-between">
                <el-col :span="5">
                    <el-button native-type="submit" icon="edit" type="primary">Login</el-button>
                </el-col>
                <el-col :span="5">
                    <div class="box-right">
                        <el-button :plain="true" @click="forget" icon="information" class="right" type="warning">Forget Password ?</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    export default {
        methods: {
            forget: function () {
                this.$notify.error({
                    title: 'Shame!!!',
                    message: 'How dare you forget your password!!!',
                    duration: 3000
                });
                this.$message.error({
                    message: 'What a Shame!!!',
                    duration: 3000
                });
            }
        }
    }
</script>