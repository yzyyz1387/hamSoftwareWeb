<template>
  <div class="resource-container">
    <div class="search-container">
      <div class="search-wrapper">
        <i class="fa fa-search search-icon"></i>
        <input
          type="text"
          v-model="searchKey"
          placeholder="搜索应用名称、描述、链接"
          class="search-input"
        >
      </div>
    </div>

    <div class="apps-grid" v-if="Object.keys(apps).length>0">
      <div class="app-card" v-for="(item,i) in apps" :key="i" :data-platform="item.platform">
          <!-- 状态标签 -->
          <div class="status-badge" v-if="item.status !== undefined && item.status !== null">
            <span :class="['status-indicator', getStatusClass(item.status)]" :title="getStatusTitle(item.status)">
              <i class="fa fa-circle"></i> {{ getStatusText(item.status) }}
            </span>
          </div>
          <div class="app-icon-wrapper">
            <img :src="imgSrcs[i]" alt="" class="app-icon" @error="setDefaultImage">
          </div>
          <div class="app-content">
            <h3 class="app-title">{{ item.name }}</h3>

            <div class="app-tags">
              <span class="tag platform-tag">{{ item.platform }}</span>
              <span class="tag version-tag">{{ item.ver }}

              </span>
              <span :class="['tag', 'lang-tag', {'chinese': item['zh-CN']}]">
                {{ item["zh-CN"] ? "支持中文" : "无中文" }}
              </span>
            </div>

            <p class="app-description">{{ item.dec }}</p>

            <div class="app-actions">
              <button v-if="item.url" class="action-btn primary" @click="handleAction(item.url)">
                <i :class="item.platform === 'WEB' ? 'fa fa-home' : 'fa fa-download'"></i>
                {{ item.platform === 'WEB' ? '访问' : '下载' }}
              </button>
              <button v-if="item['related-url']" class="action-btn secondary" @click="handleAction(item['related-url'])">
                <i :class="getClass(item['related-url'])"></i>
                相关
              </button>
            </div>
          </div>
      </div>
    </div>

    <div class="loading-state" v-else>
      <img src="../assets/loading.gif" class="loading-icon" alt="loading">
      <p class="loading-text">{{ searchKey ? '搜索不到捏...' : '加载中...' }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import defaultImage from '@/assets/crying_img.png';

export default {
  name: "ResourceList",
  props: {
    platform: String, // 平台类型：m/pc/web
  },
  data() {
    return {
      apps: {},            // 当前显示的应用列表
      imgSrcs: [],         // 用于存储图片路径
      imageLoaded: [],     // 用于跟踪图片加载状态 //2025年2月10日 暂时废弃
      originalApps: {},    // 原始应用列表（用于搜索过滤）
      gridClass: 'grid-div', // 网格布局类名
      searchKey: '',       // 搜索关键词
      defaultIcon: require('@/assets/crying_img.png'), // 内联的默认图标
    };
  },
  created() {
    const platform = this.$route.params.platform;
    this.fetchAndSetAppsData(platform).then(() => {
      for (const [key, item] of Object.entries(this.apps)) {
        this.loadImg(item.icon).then(imgSrc => {
          this.$set(this.imgSrcs, key, imgSrc);
        });
      }
    });
  },
watch: {
  // 监听路由参数变化，重新获取数据
  '$route.params.platform': {
    immediate: true,
    handler: 'fetchAndSetAppsData'
  },
  // 合并所有对 apps 的监听
  apps: {
    immediate: true,
    handler: function () {
      this.girdControl();
    },
  },
  searchKey: {
    handler: function () {
      this.applySearchFilter();
    },
  },
},
  methods: {
    /**
     * 设置默认图片 - 图片加载失败时调用
     * @param {Event} event - 图片加载失败事件
     */
    setDefaultImage(i) {
      this.$set(this.imgSrcs, i, this.defaultIcon);
      this.$set(this.imageLoaded, i, true);
    },

    /**
     * 加载图片 - 处理图片URL并加载
     * @param {string} icon - 图片标识符或URL
     * @returns {Promise<string>} 处理后的图片URL
     */
    async loadImg(icon) {
      try {
        // 检查是否为完整URL
        const urlPattern = /^(http|https):\/\/[a-zA-Z0-9\\-\\.]+(\.[a-zA-Z]{2,})+(\/\S*)?$/;
        if (urlPattern.test(icon)) {
          return icon;
        }

        // 从CDN加载图片
        const temp_ = 'https://jsd.seeku.site/yzyyz1387/hamSoftware/img/' + icon;
        const response = await axios.get(temp_);
        return response.data.url || defaultImage;
      } catch (error) {
        console.error('图片加载失败:', error);
        return defaultImage;
      }
    },

    /**
     * 获取相关链接图标类名
     * @param {string} url - 相关链接URL
     * @returns {string} Font Awesome图标类名
     */
    getClass(url) {
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
      };

      for (const [key, value] of Object.entries(urlToClassMap)) {
        if (url.includes(key)) {
          return 'fa ' + value;
        }
      }
      return 'fa fa-link';
    },

    /**
     * 获取并设置应用数据
     * @param {string} platform - 平台类型
     */
    async fetchAndSetAppsData(platform) {
      try {
        // 清空现有图片源
        this.imgSrcs = [];
        const apps = await this.updateData(platform);

        // 保存原始数据和更新显示数据
        this.originalApps = JSON.parse(JSON.stringify(apps));
        this.apps = { ...apps };

        // 更新布局和过滤
        this.girdControl();
        this.applySearchFilter();

        // 异步加载所有图片
        for (const [key, item] of Object.entries(this.apps)) {
          const imgSrc = await this.loadImg(item.icon);
          this.$set(this.imgSrcs, key, imgSrc);
        }
      } catch (error) {
        console.error('数据加载失败:', error);
      }
    },

    /**
     * 应用搜索过滤
     * 支持中英文搜索，匹配名称、描述和链接
     */
    applySearchFilter() {
      let searchKey = this.searchKey.toLowerCase();
      let isChinese = /[\u4e00-\u9fa5]/.test(searchKey);
      if (isChinese) {
        searchKey = searchKey.split('');
      } else {
        searchKey = [searchKey];
      }
      let apps = this.originalApps;
      let filteredApps = {};
      if (searchKey[0] === '') {
        this.apps = {...apps};
        return;
      }
      for (const [key, value] of Object.entries(apps)) {
        let valueStr = value.name.toLowerCase() + value.dec.toLowerCase() + value.url.toLowerCase();
        if (searchKey.every(word => new RegExp(word).test(valueStr))) {
          filteredApps[key] = value;
        } else {
          for (const [, value_] of Object.entries(value)) {
            if (typeof value_ === 'string' && searchKey.every(word => new RegExp(word).test(value_.toLowerCase()))) {
              filteredApps[key] = value;
              break;
            }
          }
        }
      }
      this.apps = filteredApps;
    },

    /**
     * 从API获取应用数据
     * @param {string} platform - 平台类型
     * @returns {Promise<Object>} 应用数据对象
     */
    async updateData(platform) {
      const dataUrlMap = {
        'm': 'https://jsd.seeku.site/yzyyz1387/hamSoftware/res-m.json',
        'pc': 'https://jsd.seeku.site/yzyyz1387/hamSoftware/res-pc.json',
        'web': 'https://jsd.seeku.site/yzyyz1387/hamSoftware/res-web.json'
      };

      try {
        const urlResponse = await axios.get(dataUrlMap[platform]);
        const trueUrl = urlResponse.data.url;

        if (trueUrl) {
          const appList = await axios.get(trueUrl);
          return appList.data;
        }
      } catch (error) {
        console.error('数据加载失败:', error);
        // 返回默认数据结构
        return {
          "暂无资源": {
            "name": "暂无资源",
            "dec": "...",
            "zh-CN": true,
            "icon": "loading.gif",
            "ver": "暂无资源",
            "platform": "暂无资源",
            "url": "",
            "related-url": ""
          }
        };
      }
    },

    /**
     * 控制网格布局样式
     * 当只有一个应用时使用单列布局
     */
    girdControl() {
      this.gridClass = Object.keys(this.apps).length === 1 ? 'grid-one' : 'grid-div';
    },

    /**
     * 获取状态样式类名
     * @param {number|string} status - HTTP状态码或状态描述
     * @returns {string} 状态样式类名
     */
    getStatusClass(status) {
      if (status === 200) return 's-txt-green';
      if ((status >= 300 && status < 400) || status === "unknown") return 's-txt-yellow';
      return '';
    },

    /**
     * 获取状态文本
     * @param {number|string} status - HTTP状态码或状态描述
     * @returns {string} 状态显示文本
     */
    getStatusText(status) {
      // 只在状态为200时显示"正常"，其他情况不显示数字
      if (status === 200) return '正常';
      if (status === 'unknown') return '未知';
      return '异常';
    },

    /**
     * 获取状态提示文本
     * @param {number|string} status - HTTP状态码或状态描述
     * @returns {string} 状态提示文本
     */
    getStatusTitle(status) {
      return `网站状态: ${status}`;
    },

    handleAction(url) {
      if (url) {
        window.open(url, '_blank')
      }
    },
  }
};
</script>


<style>
.resource-container {
  padding: 20px;
}

/* 搜索框样式 */
.search-container {
  max-width: 600px;
  margin: 0 auto 40px;
}

.search-wrapper {
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.search-wrapper:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 44px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  color: #1e293b;
  background: transparent;
}

.search-input:focus {
  outline: none;
}

/* 应用网格布局 */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 0 20px;
}

/* 应用卡片样式 */
.app-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  height: 100%;  /* 确保所有卡片高度一致 */
  display: flex;
  flex-direction: column;
}

.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.app-link {
  text-decoration: none;
  color: inherit;
  display: block;
  pointer-events: none; /* 默认禁用点击事件 */
}

/* 只有 WEB 平台的链接可以点击 */
.app-card[data-platform="WEB"] .app-link {
  pointer-events: auto;
  cursor: pointer;
}

.app-icon-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-bottom: 12px;
  background: #f8fafc;
}



.app-icon {
  width: auto;
  height: 100%;
  max-height: 80px;
  border-radius: 4px;
  object-fit: contain;
  position: absolute;
  transition: opacity 0.2s ease;
}

.default-icon {
  position: relative;
  opacity: 0.6;
}

.app-content {
  padding: 20px;
  flex: 1;  /* 让内容区域占满剩余空间 */
  display: flex;
  flex-direction: column;
}

.app-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

/* 标签样式 */
.app-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.platform-tag {
  background: #e0f2fe;
  color: #0369a1;
}

.version-tag {
  background: #f1f5f9;
  color: #64748b;
}

.lang-tag {
  background: #fee2e2;
  color: #dc2626;
}

.lang-tag.chinese {
  background: #dcfce7;
  color: #16a34a;
}

.app-description {
  flex: 1;
  margin-bottom: 16px;
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
}

.app-actions {
  margin-top: auto;
  display: flex;
  gap: 8px;
  align-items: flex-end;
  pointer-events: auto;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: #0ea5e9;
  color: white;
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #64748b;
}

.action-btn:hover {
  transform: scale(1.05);
}

/* 状态标签样式 */
.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  backdrop-filter: blur(4px); /* 毛玻璃效果 */
}

.status-indicator i {
  font-size: 8px;
}

.s-txt-green {
  background: rgba(22, 163, 74, 0.9) !important;
}

.s-txt-yellow {
  background: rgba(234, 179, 8, 0.9) !important;
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading-icon {
  width: 60px;
  margin-bottom: 16px;
}

.loading-text {
  color: #64748b;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resource-container {
    padding: 16px;
  }

  .search-container {
    margin: 0 20px 30px;
  }

  .apps-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0;
  }

  .app-card {
    margin: 0 20px;
  }
}

/* 防止图标和标签被选中 */
.app-icon,
.app-tags,
.app-actions,
.status-indicator {
  user-select: none;
  -webkit-user-select: none;  /* Safari */
  -moz-user-select: none;     /* Firefox */
  -ms-user-select: none;      /* IE/Edge */
}

/* 只允许描述文本和标题可以被选中 */
.app-description,
.app-title {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

/* Win98 主题 */
:root.win98-theme {
  --title-bar-bg: #000080;  /* 经典的深蓝色标题栏 */
  --title-bar-text: #ffffff;
  --title-bar-height: 24px;
  --title-bar-buttons: #c0c0c0;
}

/* Win98 窗口标题栏 */
:root.win98-theme .app-card {
  position: relative;
  padding-top: var(--title-bar-height);
  border: 2px solid var(--border-darker);
  border-radius: 0;
  box-shadow: 2px 2px 0 var(--border-dark);
  background: #ffffff;
}

:root.win98-theme .app-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--title-bar-height);
  background: var(--title-bar-bg);
  display: flex;
  align-items: center;
  padding: 0 4px;
}

:root.win98-theme .app-card::after {
  content: "应用";  /* 窗口标题 */
  position: absolute;
  top: 0;
  left: 4px;
  height: var(--title-bar-height);
  color: var(--title-bar-text);
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: 12px;
}

/* 窗口按钮 */
:root.win98-theme .app-card .window-buttons {
  position: absolute;
  top: 3px;
  right: 3px;
  display: flex;
  gap: 2px;
  z-index: 1;
}

:root.win98-theme .app-card .window-button {
  width: 16px;
  height: 14px;
  background: var(--button-face);
  border: 1px outset var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  padding: 0;
}

/* 调整卡片内容的位置 */
:root.win98-theme .app-card .app-content {
  padding: 12px;
  background: var(--card-bg);
}

/* Win98 主题下的图标样式 */
:root.win98-theme .app-icon-wrapper {
  background: white;
}
:root.win98-theme .app-icon{
  background: var(--button-face);
  border: 2px outset var(--border-light);
  color: black;
  backdrop-filter: none;
}
</style>