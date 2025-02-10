<template>
  <div>
    <!-- 使用顶栏组件 -->
    <PageHeader>
      <!-- 如果需要在左侧添加内容 -->
      <template #left>
      </template>
      <!-- 如果需要在右侧添加其他内容 -->
      <template #right>
      </template>
    </PageHeader>

    <div class="app-container">
      <nav class="nav-tabs">
        <router-link to="/m" class="nav-link" active-class="active">手机</router-link>
        <router-link to="/pc" class="nav-link" active-class="active">电脑</router-link>
        <router-link to="/web" class="nav-link" active-class="active">网站</router-link>
      </nav>

        <router-view></router-view>    

    <div class="note">
            更多内容等待添加...
    </div>

      <footer class="footer">
        <hr class="divider">
        <h3 class="footer-title">感谢名单</h3>
            <HamList/>
      </footer>
        </div>
  </div>
</template>

<script>
    // import Resource from './components/Resource'
    // import Exe from './components/Exe'
    import HamList from './components/HamList'
    import PageHeader from './components/Header'

    export default {
            name: 'App',
            components:{
                // Resource,
                // Exe,
                HamList,
                PageHeader
                
            },
    }
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  line-height: 1.5;
}

/* 容器样式 */
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 80px;  /* 增加顶部内边距 */
}

/* 标题样式 */
.main-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: #0f172a;
  margin: 2rem 0;
}

/* 导航标签样式 */
.nav-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-link {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #0ea5e9;
  background: #f1f5f9;
}

.nav-link.active {
  color: #0ea5e9;
  background: #e0f2fe;
}

/* 注释样式 */
.note {
  text-align: center;
  color: #64748b;
  margin: 2rem 0;
  font-style: italic;
}

/* 页脚样式 */
.footer {
  margin-top: 4rem;
  padding-top: 2rem;
  text-align: center;
}

.divider {
  border: none;
  height: 1px;
  background: #e2e8f0;
  margin: 2rem 0;
}

.footer-title {
  color: #0f172a;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

/* 通用工具类 */
.flex-div {
  display: flex;
  align-items: center;
}

.flex-div-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-container {
    padding-top: 60px;
  }

  .main-title {
    font-size: 1.5rem;
    margin: 1.5rem 0;
  }

  .nav-tabs {
    flex-wrap: wrap;
  }

  .nav-link {
    padding: 0.5rem 1rem;
  }
}

/* 主题变量 */
:root {
  --bg-color: #f8fafc;
  --text-color: #1e293b;
  --header-bg: rgba(255, 255, 255, 0.9);
  --card-bg: white;
  --shadow-color: rgba(0, 0, 0, 0.05);
}

/* 暗黑主题 */
:root.dark-theme {
  --bg-color: #1a1a1a;
  --text-color: #e5e7eb;
  --header-bg: rgba(26, 26, 26, 0.9);
  --card-bg: #2d2d2d;
  --shadow-color: rgba(0, 0, 0, 0.2);
}

/* 护眼主题 */
:root.eye-theme {
  --bg-color: #f0f9eb;
  --text-color: #2c3e50;
  --header-bg: rgba(240, 249, 235, 0.9);
  --card-bg: #fcfff6;
  --shadow-color: rgba(0, 0, 0, 0.05);
}

/* 极简主题 */
:root.minimal-theme {
  --bg-color: #ffffff;
  --text-color: #333333;
  --header-bg: rgba(255, 255, 255, 0.9);
  --card-bg: #ffffff;
  --shadow-color: rgba(0, 0, 0, 0.03);
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 修改顶栏背景色 */
.header-scrolled {
  background: var(--header-bg) !important;
}

/* 修改卡片背景色 */
.app-card {
  background: var(--card-bg);
}

/* Win98 主题 */
:root.win98-theme {
  --bg-color: #008080;  /* 经典 Win98 蓝绿色背景 */
  --text-color: #000000;
  --header-bg: #c0c0c0;  /* 经典灰色 */
  --card-bg: #ffffff;
  --shadow-color: rgba(0, 0, 0, 0.5);
  --border-light: #ffffff;
  --border-dark: #808080;
  --border-darker: #404040;
  --button-face: #c0c0c0;
  --window-frame: #000080;  /* 深蓝色窗口标题栏 */
  --title-bar-bg: #000080;  /* 经典的深蓝色标题栏 */
  --title-bar-text: #ffffff;
  --title-bar-height: 24px;
  --title-bar-buttons: #c0c0c0;
  font-family: "MS Sans Serif", "Microsoft Sans Serif", "Segoe UI", sans-serif;
}

/* Win98 特殊样式 */
:root.win98-theme .header {
  background: var(--button-face);
  border-bottom: 2px solid var(--border-dark);
  box-shadow: none;
}

:root.win98-theme .icon-button {
  background: var(--button-face);
  border: 2px outset var(--border-light);
  padding: 4px 8px;
  box-shadow: 
    1px 1px 0 var(--border-dark),
    -1px -1px 0 var(--border-light);
}

:root.win98-theme .icon-button:active {
  border-style: inset;
  padding: 5px 7px 3px 9px;
}

/* Win98 主题下的菜单样式 */
:root.win98-theme .dropdown-menu {
  background: var(--button-face);
  border: 2px solid var(--border-darker);
  border-radius: 0;
  box-shadow: 2px 2px 0 var(--border-dark);
  padding: 2px;
}

:root.win98-theme .menu-item {
  color: black;
  border: 1px solid transparent;
  padding: 4px 8px;
}

:root.win98-theme .menu-item:hover {
  background: var(--window-frame);
  color: white;
  border: 1px dotted var(--border-dark);
}

:root.win98-theme .submenu {
  background: var(--button-face);
  border: 2px solid var(--border-darker);
  border-radius: 0;
  box-shadow: 2px 2px 0 var(--border-dark);
}

:root.win98-theme .menu-item.active {
  background: var(--window-frame);
  color: white;
}

:root.win98-theme .check-icon {
  color: black;
}

:root.win98-theme .menu-item.active .check-icon {
  color: white;
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
  content: attr(data-name);  /* 使用应用名称作为窗口标题 */
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
:root.win98-theme .active{
  box-shadow: 0 0 0 2px var(--border-dark);
}
:root.win98-theme .nav-link.active{
  background: var(--button-face);
  border: 2px outset var(--border-light);
  color: black;
  backdrop-filter: none;
}
:root.win98-theme .action-btn:hover,
:root.win98-theme .nav-link:hover{
  background: var(--window-frame);
  color: white;
}
/* Win98 主题搜索框样式 */
:root.win98-theme .search-wrapper {
  border-radius: 0;
  background: white;
  border: 2px inset var(--border-light);
  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 8px; /* 添加图标和输入框之间的间距 */
}

:root.win98-theme .search-input {
  border: none;
  background: transparent;
  color: black;
  padding: 0;
  outline: none;
  width: 100%; /* 确保输入框占满剩余空间 */
  font-family: "MS Sans Serif", "Microsoft Sans Serif", "Segoe UI", sans-serif;
}

:root.win98-theme .search-input::placeholder {
  color: #666;
  opacity: 1; /* 确保占位符文字可见 */
}

:root.win98-theme .search-icon {
  color: #000;
  opacity: 0.7;
  flex-shrink: 0; /* 防止图标被压缩 */
  width: 14px; /* 固定图标宽度 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 标签样式 */
:root.win98-theme .tag {
  border-radius: 0;
  border: 1px solid var(--border-dark);
  background: var(--button-face);
  color: black;
}

/* 版权信息样式 */
:root.win98-theme .copyright,
:root.win98-theme .note {
  color: white;  /* 确保底部文字在深色背景上清晰可见 */
}

:root.win98-theme .copyright a,
:root.win98-theme .note a {
  color: #ffff00;  /* 链接使用黄色，提高可见度 */
}

/* 呼号样式 */
:root.win98-theme .call {
  color: white;  /* 确保呼号在深色背景上清晰可见 */
}

:root.win98-theme .call:hover {
  color: #ffff00;
}

/* 修改滚动条样式 */
:root.win98-theme ::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

:root.win98-theme ::-webkit-scrollbar-track {
  background: var(--button-face);
  border: 2px solid var(--border-dark);
}

:root.win98-theme ::-webkit-scrollbar-thumb {
  background: var(--button-face);
  border: 2px outset var(--border-light);
}

:root.win98-theme ::-webkit-scrollbar-button {
  background: var(--button-face);
  border: 2px outset var(--border-light);
  height: 16px;
  width: 16px;
}

/* Win98 主题下的状态标签位置调整 */
:root.win98-theme .status-badge {
  top: calc(var(--title-bar-height) + 12px);  /* 标题栏高度 + 原来的间距 */
  right: 12px;
  z-index: 2;
}

/* 确保状态标签样式符合 Win98 风格 */
:root.win98-theme .status-indicator {
  border-radius: 0;
  background: var(--button-face);
  border: 2px outset var(--border-light);
  color: black;
  backdrop-filter: none;
}

:root.win98-theme .action-btn{
  background: var(--button-face);
  border: 2px outset var(--border-light);
  color: black;
  backdrop-filter: none;
}
:root.win98-theme .nav-tabs{
  background: var(--button-face);
  border: 2px outset var(--border-light);
  color: black;
  backdrop-filter: none;
   border-radius: 0;
}

:root.win98-theme .search-icon{
  display: none;
}
/* Win98 主题下的标题样式 */
:root.win98-theme .web-title,
:root.win98-theme .footer-title {
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

:root.win98-theme .web-title {
  margin-top: 30px;  /* 增加与顶栏的距离 */
}
</style>