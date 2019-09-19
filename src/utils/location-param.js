export default name => {
  const reg = new RegExp(`${name}=([^&]*)(&|$)`);
  const index = window.location.href.indexOf('?');
  const r = window.location.href.substr(index).match(reg);
  if (r != null) return decodeURIComponent(r[1]);
  return '';
};
