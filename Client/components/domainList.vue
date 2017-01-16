<template>
    <el-table :data="domains" border style="width: 100%" class="unselectable" @sort-change="sortChange">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="site" label="Site ID" sortable="custom">
        </el-table-column>
        <el-table-column prop="domain" label="Domain / Email" sortable="custom">
        </el-table-column>
        <el-table-column label="Status" sortable="custom">
            <template scope="scope">
                <el-tag class="status" close-transition v-if="scope.row.cTime === scope.row.vTime" type="grey">New Request</el-tag>
                <el-tag class="status" close-transition v-if="scope.row.cTime !== scope.row.vTime" type="success">Viewed</el-tag>
                <br><small>{{ scope.row.cTime === scope.row.vTime ? `@ ${format(scope.row.cTime)}` : `@ ${format(scope.row.vTime)}` }}</small>
            </template>
        </el-table-column>
        <el-table-column prop="applicant" label="Applicant" sortable="custom">
        </el-table-column>
    </el-table>
</template>
<script>
    export default {
        props: ['domains'],
        methods: {
            format: function (s) {
                var date = new Date(s);
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            },
            sortChange: function(e){
                this.$emit('change-order', e);
            }
        }
    }
</script>
<style>
    .status{
        margin-top: 8px
    }
</style>