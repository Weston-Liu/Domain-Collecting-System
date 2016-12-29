<template>
    <el-table :data="domains" border style="width: 100%" class="unselectable">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="site" label="Site ID">
        </el-table-column>
        <el-table-column prop="domain" label="Domain / Email">
        </el-table-column>
        <el-table-column prop="status" label="Status" :filters="[{ text: 'Pending', value: 'Pending' }, { text: 'Viewed', value: 'Viewed' }]"
            :filter-method="filterTag" inline-template>
            <el-tag :type="row.status === 'Pending' ? 'warning' : 'success'" close-transition>{{ row.status }}</el-tag>
        </el-table-column>
        <el-table-column prop="applicant" label="Applicant">
        </el-table-column>
    </el-table>
</template>
<script>
    export default {
        props: ['domains'],
        methods: {
            filterTag: function (value, row) {
                return row.status === value;
            }
        }
    }
</script>