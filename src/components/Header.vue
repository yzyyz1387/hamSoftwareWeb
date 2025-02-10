<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-content">
      <!-- 左侧预留空间 -->
      <div class="header-left">
        <slot name="left"></slot>
      </div>
      
      <!-- 右侧图标区域 -->
      <div class="header-right">
        <button class="icon-button" @click="toggleTheme" :title="currentTheme === 'dark' ? '切换到日间模式' : '切换到夜间模式'">
          <i class="fa" :class="currentTheme === 'dark' ? 'fa-sun-o' : 'fa-moon-o'"></i>
        </button>
        <div class="menu-container">
          <button class="icon-button" @click="toggleMenu">
            <i class="fa fa-bars"></i>
          </button>
          <!-- 下拉菜单 -->
          <div class="dropdown-menu" v-show="isMenuOpen">
            <!-- 主题切换菜单 -->
            <div class="menu-item" @click="toggleThemeMenu">
              <i class="fa fa-cog"></i>
              <span>主题设置</span>
              <i class="fa fa-angle-right menu-arrow"></i>
            </div>
            <!-- 主题子菜单 -->
            <div class="submenu" v-show="isThemeMenuOpen">
              <div class="menu-item" 
                   v-for="theme in themes" 
                   :key="theme.name"
                   @click="selectTheme(theme.value)"
                   :class="{ 'active': currentTheme === theme.value }"
              >
                <i :class="['fa', theme.icon]"></i>
                <span>{{ theme.name }}</span>
                <i class="fa fa-check check-icon" v-if="currentTheme === theme.value"></i>
              </div>
            </div>
            <!-- 其他菜单项 -->
<!--            <a href="#" class="menu-item">-->
<!--              <i class="fa fa-info-circle"></i>-->
<!--              <span>测试条目 2</span>-->
<!--            </a>-->
            <!-- <a href="#" class="menu-item">
              <i class="fa fa-cog"></i>
              <span>测试条目 3</span>
            </a> -->
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'PageHeader', // 修改组件名以符合多词规范
  data() {
    return {
      isScrolled: false,
      isMenuOpen: false,
      isThemeMenuOpen: false,
      currentTheme: 'light',
      previousTheme: null, // 添加这个来记住上一次的主题
      themes: [
        { name: '明亮模式', value: 'light', icon: 'fa-sun-o' },
        { name: '暗黑模式', value: 'dark', icon: 'fa-moon-o' },
        { name: 'Win98', value: 'win98', icon: 'fa-windows' },
        { name: '护眼模式', value: 'eye', icon: 'fa-leaf' },

      ]
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('click', this.handleClickOutside)
    // 从本地存储恢复主题设置
    this.currentTheme = localStorage.getItem('theme') || 'light'
    this.previousTheme = localStorage.getItem('previousTheme') || this.currentTheme
    this.applyTheme(this.currentTheme)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50
    },
    toggleTheme() {
      // 在当前主题和暗黑模式之间切换
      if (this.currentTheme === 'dark') {
        // 如果当前是暗黑模式，切换回之前的主题
        this.selectTheme(this.previousTheme)
      } else {
        // 如果当前不是暗黑模式，记住当前主题并切换到暗黑模式
        this.previousTheme = this.currentTheme
        localStorage.setItem('previousTheme', this.previousTheme)
        this.selectTheme('dark')
      }
    },
    applyTheme(theme) {
      // 移除所有主题类
      document.documentElement.classList.remove('dark-theme', 'eye-theme', 'win98-theme')
      // 添加选中的主题类
      if (theme !== 'light') {
        document.documentElement.classList.add(`${theme}-theme`)
      }
    },
    toggleMenu(event) {
      event.stopPropagation()
      this.isMenuOpen = !this.isMenuOpen
    },
    handleClickOutside(event) {
      const menu = document.querySelector('.menu-container')
      if (menu && !menu.contains(event.target)) {
        this.isMenuOpen = false
      }
    },
    toggleThemeMenu(event) {
      event.stopPropagation()
      this.isThemeMenuOpen = !this.isThemeMenuOpen
    },
    selectTheme(theme) {
      this.currentTheme = theme
      localStorage.setItem('theme', theme)
      this.applyTheme(theme)
      this.isMenuOpen = false
      this.isThemeMenuOpen = false
    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 0;
  transition: all 0.3s ease;
  background: transparent;
}

.header-scrolled {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.icon-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-color, #0f172a);
  font-size: 1.2rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  color: #0ea5e9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 12px 0;
  }

  .icon-button {
    font-size: 1.1rem;
  }
}

.menu-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--card-bg, white);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  padding: 8px 0;
  z-index: 1000;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-color, #1e293b);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #0ea5e9;
}

.menu-item i {
  width: 20px;
  text-align: center;
}

/* 深色主题适配 */
:root.dark-theme .menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 动画效果 */
.dropdown-menu {
  transform-origin: top right;
  animation: dropDown 0.2s ease;
}

@keyframes dropDown {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.menu-arrow {
  margin-left: auto;
  font-size: 0.9em;
  opacity: 0.6;
}

.submenu {
  background: var(--card-bg, white);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 4px;
  width: 100%;
  animation: slideDown 0.2s ease;
}

.check-icon {
  margin-left: auto;
  color: #0ea5e9;
}

.menu-item.active {
  color: #0ea5e9;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 