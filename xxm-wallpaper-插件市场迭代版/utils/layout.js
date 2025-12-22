const SYSTEM_INFO = uni.getSystemInfoSync();

/**
 * 获取状态栏高度
 * @return {number}
 */
export const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || (SYSTEM_INFO.uniPlatform === 'web' ? 0 : 25)

// titleBar上下内边距高度(胶囊按钮与titleBar边框的距离)
export const getTitleBarPadding = ()=> {
  if(SYSTEM_INFO.uniPlatform === 'mp-weixin') {
    const {top} = uni.getMenuButtonBoundingClientRect()
    const statusBarHeight = getStatusBarHeight()
    return  top - statusBarHeight
  }
  // 非微信小程序无法动态获取
  return 8
}

/**
 * 获取胶囊按钮布局信息
 * @return {{}}
 */
export const getMpMenuRect = () => {
  // 胶囊按钮高度
  let mpMenuHeight = 0
  // 胶囊按钮距离屏幕边缘距离
  let mpMenuMargin = 0
  // 胶囊按钮宽度
  let mpMenuWidth = 0

  if (['mp-weixin', 'mp-alipay'].includes(SYSTEM_INFO.uniPlatform)) {
    if (uni.getMenuButtonBoundingClientRect) {
      const {top = 0, bottom = 0, right, width = 0} = uni.getMenuButtonBoundingClientRect()
      mpMenuHeight = bottom - top
      mpMenuMargin = SYSTEM_INFO.screenWidth - right
      mpMenuWidth = width
    } else {
      // 钉钉小程序平台无法获取胶囊按钮位置信息，但有支付宝小程序平台的titleBarHeight，这里默认mpMenuHeight为tileBar - titleBarPadding * 2
      // 默认为 mpMenuMargin = 10 mpMenuWidth = 80
      mpMenuHeight = SYSTEM_INFO.titleBarHeight - getTitleBarPadding() * 2
      mpMenuMargin = 10
      mpMenuWidth = 80
    }
  }

  return {
    mpMenuMargin,
    mpMenuWidth,
    mpMenuHeight,
    mpMenuLeft: mpMenuWidth + mpMenuMargin * 2
  }
}


/**
 * 获取titleBar高度，为胶囊按钮高度 + titleBar内边距高度
 * @return {number}
 */
export const getTitleBarHeight = () => {
  const minHeight = SYSTEM_INFO.osName === "ios" ? 48 : 44;
  let height = getMpMenuRect().mpMenuHeight + getTitleBarPadding() * 2
  if(SYSTEM_INFO.uniPlatform === 'mp-weixin') return height
  return height > minHeight ? height : minHeight
}


/**
 * 获取导航栏总高度
 * @return {number}
 */
export const getNavBarHeight = () => {
  return getStatusBarHeight() + getTitleBarHeight()
}


/**
 * 获取底部导航栏高度，不使用常量而是函数是因为以后可能因不同tabBar内容产生不同高度，如自定义的中部突出的菜单按钮
 * @return {number}
 */
export const getTabBarHeight = () => 50

/**
 * 获取底部安全区高度
 * @return {number}
 */
export const getSafeAreaHeight = () => SYSTEM_INFO.safeArea ? SYSTEM_INFO.screenHeight - SYSTEM_INFO.safeArea.bottom : 50

/**
 * 获取底部栏总高度
 * @return {number}
 */
export const getBottomHeight = () => getTabBarHeight() + getSafeAreaHeight()


/**
 * 常用的内联样式模板
 * @param {number} [height]
 * @param {number} [width]
 */
export const toHeightStyle = (height = 0, width) => `width:${width !== undefined ? `${width}px` : '100%'};height:${height}px`
