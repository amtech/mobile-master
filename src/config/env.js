/**
 * Created by Berlin on 2018/5/18.
 */
function env(){
  if(process.env.REACT_APP_ENV === 'development'){
    // 开发
    return {
      ENV:'development',
      ROOT_PATH:'/mobileapps/ai-public-approve-mobileweb',
      GATEWAY:'https://xin-sandbox.asiainfo.com:16020/api/',
    }
  } else if(process.env.REACT_APP_ENV === 'test'){
    // 测试
    return {
      ENV:'test',
      ROOT_PATH:'/mobileapps/ai-public-approve-mobileweb',
      GATEWAY:'https://xin-sandbox.asiainfo.com:16020/api/',
    }
  } else{
    // 生产 process.env.REACT_APP_ENV === 'production'
    return {
      ENV:'production',
      ROOT_PATH:'/mobileapps/ai-public-approve-mobileweb',
      GATEWAY:'https://karagw.asiainfo.com/api/',
    }
  }
}

export default env()