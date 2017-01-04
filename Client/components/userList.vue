<template>
    <el-table :data="users" border style="width: 100%" class="unselectable">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="user" label="User">
        </el-table-column>
        <el-table-column prop="country" label="Country" sortable>
        </el-table-column>
        <el-table-column label="Operation">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </el-table-column>
    </el-table>
</template>
<script>
    export default {
        props: ['users']
    }
</script>