/**
 * Created by Berlin on 2018/5/10.
 */
/*
 样式替换在webpack中进行，所以修改此文件后请重新 npm start
 ant 默认样式地址
 https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
 */

const publicUrl =  (process.env.NODE_ENV === 'develop_server' || process.env.NODE_ENV === 'production') ? process.env.REACT_APP_ROOT_PATH : '';

const theme = {
  "font-size-base": "40.5px", // 默认字号
  "button-font-size": "40.5px", // btn默认字号
  "color-text-base": '#333', // 字体颜色
  // "icon-url": `"${publicUrl}/iconfont/iconfont"`,
  "brand-primary": '#ff8928', // 主色 凸显色
  "primary-button-fill": '#ff8928',
  "primary-button-fill-tap": '#ed7612',
  "ghost-button-fill-tap": '#ffd5b3',
  "radius-xs": "12px",
  "radius-sm": "18px",
  "radius-md": "24px",
  "radius-lg": "30px",
  "icon-size-xxs": "16px",
  "icon-size-xs": "24px",
  "icon-size-sm": "34px",
  "icon-size-md": "50px",
  "icon-size-lg": "60px",
}
module.exports = theme;