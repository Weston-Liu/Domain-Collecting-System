<template>
    <el-table :data="domains" border style="width: 100%" class="unselectable">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="site" label="Site ID">
        </el-table-column>
        <el-table-column prop="domain" label="Domain / Email">
        </el-table-column>
        <el-table-column prop="status" label="Status">
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