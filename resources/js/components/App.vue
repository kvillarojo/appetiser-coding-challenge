<template>
    <div class="main">
        <Header />
        <div class="container-fluid">
            <router-view> </router-view>
        </div>
    </div>
</template>

<script>
    import Header from './Header'

    export default {
        name: "Main",
        components : {
            Header
        }
    }
</script>
