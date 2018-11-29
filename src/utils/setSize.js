//  设置比例
function setRatio() {
  const body = document.querySelector('body')
  let winWidth,winHeight;
  //获取窗口宽度
  if (window.innerWidth)
    winWidth = window.innerWidth;
  else if ((document.body) && (document.body.clientWidth))
    winWidth = document.body.clientWidth;
  //获取窗口高度
  if (window.innerHeight)
    winHeight = window.innerHeight;
  else if ((document.body) && (document.body.clientHeight))
    winHeight = document.body.clientHeight;
  //通过深入Document内部对body进行检测，获取窗口大小
  if (document.documentElement  && document.documentElement.clientHeight && document.documentElement.clientWidth)
  {
    winHeight = document.documentElement.clientHeight;
    winWidth = document.documentElement.clientWidth;
  }

  const ratio = Math.floor(winHeight/winWidth*10)
  if(ratio<=15){
    body.classList.add('ratio-lt-15')
  }else if(ratio<=16) {
    body.classList.add('ratio-lt-16')
  }
}

export  default function setFontSize() {
  const html = document.documentElement
  // const docEl = document.documentElement
  // const metaEl = document.querySelector('meta[name="viewport"]')
  const body = document.querySelector('body')
  // const dpr = window.devicePixelRatio || 1
  // const scale = 1 / dpr

  // 设置viewport，进行缩放，达到高清效果
  // metaEl.setAttribute('content', `width=${dpr * docEl.clientWidth},initial-scale=${scale},maximum-scale=${scale}, minimum-scale=${scale},user-scalable=no`)

  // root font size client width / 20 (iphone 5 字体是12px)
  html.style.fontSize = `${html.clientWidth / (320/12)}px`
  if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    body.classList.add('ios')
    if(window.screen.width===375 && window.screen.height===812) {
      body.classList.add('iosx')
    }
  }

  setRatio()
}