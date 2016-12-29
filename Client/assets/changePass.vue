<template>
    <el-dialog title="Change Password" v-model="visible" :show-close="false" :close-on-click-modal="false">
        <el-form>
            <el-form-item label="Original Password">
                <el-input v-model="op" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="New Password">
                <el-input v-model="np" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="Confirm New Password">
                <el-input v-model="cnp" auto-complete="off"></el-input>
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
            return {
                op: '',
                np: '',
                cnp: ''
            };
        },
        methods: {
            close: function () {
                this.$emit('cpclosed');
            }
        }
    };
</script>