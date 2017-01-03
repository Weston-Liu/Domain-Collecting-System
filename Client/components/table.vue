<template>
    <el-table :data="domains" border style="width: 100%" class="unselectable">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="site" label="Site ID" sortable>
        </el-table-column>
        <el-table-column prop="domain" label="Domain / Email">
        </el-table-column>
        <el-table-column prop="status" label="Status" sortable>
        </el-table-column>
        <el-table-column prop="applicant" label="Applicant" sortable>
        </el-table-column>
    </el-table>
</template>
<script>
    export default {
        props: ['domains']
    }
</script>