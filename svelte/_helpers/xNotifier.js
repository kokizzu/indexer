export function showToast(message, doc = document) {
  const wrap = doc.getElementById('toastWrap');
  if (!wrap) return;
  const el = doc.createElement('div');
  el.className = 'toast';
  el.textContent = String(message);
  wrap.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 5000);
}
