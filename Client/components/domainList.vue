<template>
    <el-table :data="domains" border style="width: 100%" class="unselectable">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="site" label="Site ID" sortable>
        </el-table-column>
        <el-table-column prop="domain" label="Domain / Email" sortable>
        </el-table-column>
        <el-table-column label="Status" align="center" sortable>
            <template scope="scope">
                <el-tag close-transition v-if="scope.row.cTime === scope.row.vTime" type="success">New Request</el-tag>
                <el-tag close-transition v-if="scope.row.cTime !== scope.row.vTime" type="primary">Viewed</el-tag>
                <br><small>{{ scope.row.cTime === scope.row.vTime ? `@ ${scope.row.cTime}` : `@ ${scope.row.vTime}` }}</small>
            </template>
        </el-table-column>
        <el-table-column prop="applicant" label="Applicant">
        </el-table-column>
    </el-table>
</template>
<script>
    export default {
        props: ['domains']
    }
</script>