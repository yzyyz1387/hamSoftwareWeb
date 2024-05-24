<template>
<div class="">
    <div class="flex-div-col">
        <div class="grid-div tks">
                <span class="call" v-for="(ham,i) in hams" :key="i" >{{ ham }}</span>
        </div>
        <div class="note">
            投稿请至<a href="https://github.com/yzyyz1387/hamSoftware" target="_blank">Github</a>提交PR，或联系BD8CWG
        </div>
    </div>
      <div class="copyright">
        <span class="icp">
            <a href="http://beian.miit.gov.cn/" target="_blank">{{ icp }}</a>
          </span> |
        Copyright © <a href="https://yzyyz.top/" target="_blank">BD8CWG</a> {{copyyear}}</div>
</div>
</template>

<script>
import axios from 'axios';
import config from '../config.js';

export default {
    name:'HamList',
    data(){
        return{
            hams:['BD8CWG'],
            copyyear:'',
            icp: config.icp
            };
    },
    async created() {
        let year = new Date().getFullYear();
        this.copyyear = year>2024?`2024-${year}`:'2024';
        try {
        const response = await axios.get('https://jsd.seeku.site/yzyyz1387/hamSoftware/contributors.json');
        await axios.get(response.data['url']).then((res)=>{
            this.hams = res.data;
        });
        } catch (error) {
        console.error(error);
        }
  },
    
}
</script>

<style scoped>
.icp a{
  color: #888;

}
.icp::before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url("../assets/icp.png") no-repeat;
  background-size: 100%;
  margin-right: 5px;
  vertical-align: middle;
}
</style>