<template>
  <div class="apps ">
    <div class="search">
      <input type="text" v-model="searchKey" placeholder="搜索应用名称、描述、链接" class="search-input">
            </div>
    <div class="container flex-div" v-if="Object.keys(apps).length>0">
            
            <div class="app-list" :class="gridClass">
            <div class="app flex-div " v-for="(item,i) in apps" :key="i">
                <img :src="loadImg(item.icon)" alt="" class="app-icon" @error="setDefaultImage">
                <div class="app-info">
                    <p class="app-name ">
                        {{ item.name }}
                    </p>
                    <div class="app-detail flex-div ">
                        <div class="plf detail">
                            <span class="detail-txt"> {{ item.platform }}</span>
                        </div>
                        <div class="ver detail">
                            <span  class="detail-txt">{{ item.ver }}</span>
                        </div>
                        <div class="lang detail">
                            <span  class="detail-txt">{{ item["zh-CN"]?"支持中文":"无中文" }}</span>
                        </div>
                    </div>
                    <div class="app-dec">
                        <p class="dec-txt">
                            {{ item.dec }}
                        </p>
                        <a v-if="item.url" :href="item.url" target="_blank" class="download-btn flex-div">
                            <i class="fa fa-arrow-down" aria-hidden="true" /></i>
                        </a>
                        <a v-if="item['related-url']" :href="item['related-url']" target="_blank" class="related-btn flex-div" title="相关链接">
                            <i :class="getClass(item['related-url'])"  aria-hidden="true" /></i>
                        </a>
                    </div>
                </div>
                    <div class="status" v-if="item.status !== undefined && item.status !== null">
                    <span class="status-txt" :class="getStatusClass(item.status)" title="网站状态"> ● {{ item.status }}</span>
                  </div>
            </div>
            </div>
            </div>
              <div class="applist load flex-div-col" v-else>
                 <img src="../assets/loading.gif" class="loading">
                    <p  v-if="this.searchKey">搜索不到捏...</p>
                    <p v-else>加载中...</p>
            </div>
            </div>

</template>

<script>
import axios from 'axios';
// import scrollReveal from "scrollreveal";
import defaultImage from '@/assets/crying_img.png';
export default {
  name: "Apk",
  props: {
    platform: String,
  },
  data(){
    return {
      apps: {},
      originalApps:{},
      gridClass: 'grid-div',
      searchKey:'',
    };
  },
  created() {
    const platform = this.$route.params.platform;
    this.fetchAndSetAppsData(platform);

  },
  watch: {
    '$route.params.platform': {
      immediate: true,
      handler: 'fetchAndSetAppsData'
    },
    apps: 
    {
      immediate: true,
      handler: function(newApps) {
      this.girdControl();
      },
    },
    searchKey: {
    handler: function() {
      this.applySearchFilter();
    },
  },
  },
  // mounted() {
  //   this.$nextTick(function () {
  //     scrollReveal().reveal(".app", { interval: 200 });
  //   })
  // },
  methods: {
    setDefaultImage(event){
      event.target.src = defaultImage;
    },
    loadImg(icon){
      let imgSrc;
      const urlPattern = /^(http|https):\/\/[a-zA-Z0-9\\-\\.]+(\.[a-zA-Z]{2,})+(\/\S*)?$/;
      if (urlPattern.test(icon)) {
        return icon;
      }
        try {
          imgSrc = require('../assets/' + icon);
        } catch (error) {
          imgSrc = require('../assets/crying_img.png');
        }
        return imgSrc;

    },
    getClass(url){
      const urlToClassMap = {
        'github': 'fa-github',
        'bilibili': 'fa-film',
        'zhihu': 'fa-book',
        'forum': 'fa-comments',
        'hellocq': 'fa-comments',
        'qq.com': 'fa-qq',
        'weibo': 'fa-weibo',
        'weixin': 'fa-weixin',
        'douyin': 'fa-film',
      }
      for (const [key, value] of Object.entries(urlToClassMap)) {
        if (url.includes(key)) {
          return 'fa ' + value;
        }
      }
      return 'fa fa-link';
    },
  async fetchAndSetAppsData(platform) {
    let apps = await this.updateData(platform);
      this.originalApps = JSON.parse(JSON.stringify(apps)); 
    this.apps = { ...apps };
    this.girdControl();
    this.applySearchFilter();
  },
    applySearchFilter() {
    let searchKey = this.searchKey.toLowerCase();
    let apps = this.originalApps;
    let filteredApps = {};
    if (searchKey === '') {
      this.apps = { ...apps };
      return;
    }
    for (const [key, value] of Object.entries(apps)) {
      if (value.name.toLowerCase().includes(searchKey) || value.dec.toLowerCase().includes(searchKey) || value.url.toLowerCase().includes(searchKey)) {
        filteredApps[key] = value;
      } else {
        for (const [key_, value_] of Object.entries(value)) {
          if (typeof value_ === 'string' && value_.toLowerCase().includes(searchKey)) {
            filteredApps[key] = value;
            break;
          }
        }
      }
    }
    this.apps = filteredApps;
  },
    async updateData(platform){
      let dataUrlMap={ 
        'm': 'https://jsd.seeku.site/yzyyz1387/hamSoftware/res-m.json',
        'pc': 'https://jsd.seeku.site/yzyyz1387/hamSoftware/res-pc.json',
        'web': 'https://jsd.seeku.site/yzyyz1387/hamSoftware/res-web.json'
      }
      let trueUrl;
      await axios.get(dataUrlMap[platform])
      .then((url_)=>{
        trueUrl = url_.data['url'];
      });
      if (trueUrl) {
        try {
          let appList = await axios.get(trueUrl);
          this.apps = appList.data;
          return this.apps;
        } catch (error) {
          console.log(error);
          let temp_ = {
              "暂无资源": {
                "name": "暂无资源",
                "dec": "...",
                "zh-CN": true,
                "icon": "loading.gif",
                "ver": "暂无资源",
                "platform": "暂无资源",
                "url": "",
                "related-url": ""
              },
          };
          this.apps = temp_;
          return temp_;
        }
      }
    },
    girdControl(){
      if (Object.keys(this.apps).length === 1) {
        this.gridClass =  'grid-one';
      }
      else{
         this.gridClass =  'grid-div';
      }
    },
      getStatusClass(status) {
        if (status === 200) {
          return 's-txt-green';
        } else if ((status >= 300 && status < 400) || status === "unknown") {
          return 's-txt-yellow';
        }
        else {
          return '';
        }
      },
  }
};
</script>

<style>

.search{
    margin: 30px 0 0px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.search-input{
    width: 50%;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 5px;
    font-size: 16px;
}
.status{
    padding: 5px;
    border-radius: 5px;
    /* 显示在父控件右上角 */
    position: absolute;
    left: 0px;
    top:0px
}
.status-txt{
    font-size: 12px;
    color: #fff;
    background-color: #ff0000;
    padding: 5px;
    border-radius: 5px;
}
.s-txt-green{
    background-color: #13bd60;
}
.s-txt-yellow{
    background-color: #ff9d00;
}
</style>