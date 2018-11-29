export default function QueryParam(url, name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
  const r = url.match(reg);
  return r != null && r.length >= 2 ? decodeURIComponent(r[2]) : "";
};