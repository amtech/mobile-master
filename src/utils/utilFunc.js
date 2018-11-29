export const backApp = () => {
  // 关闭当前窗口
  if(window.kara) {
    window.kara.closePage()
  }else{
    document.addEventListener('JSSDKReady', function(){
      window.kara.closePage()
    }, false);
  }
}