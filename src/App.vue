<template>
  <div>
    <div>
        <div class="router flex-div">
        <router-link to="/m" class="router-link" active-class="active">手机</router-link>
        <router-link to="/pc" class="router-link" active-class="active">电脑</router-link>
        <router-link to="/web" class="router-link" active-class="active">网站</router-link>

    </div>
        <router-view></router-view>    
    </div>

    <div class="note">
            更多内容等待添加...
    </div>

    <div class="bottom flex-div-col">
            <hr class="hr-ss">
            <h3>感谢名单</h3>
            <HamList/>
 
           
        </div>
   
  </div>
</template>

<script>
    import Resource from './components/Resource'
    // import Exe from './components/Exe'
    import HamList from './components/HamList'

    export default {
            name: 'App',
            components:{
                Resource,
                // Exe,
                HamList
                
            },
    }
</script>

<style>

</style>