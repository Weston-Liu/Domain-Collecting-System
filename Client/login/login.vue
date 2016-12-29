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
            <el-button native-type="submit" type="primary">Submit</el-button>
        </el-form>
    </div>
</template>
<style>
    #app {
        font-family: 'Avenir', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .container {
        padding: 50px
    }
</style>