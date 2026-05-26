export function showToast(message, doc = document) {
  const wrap = doc.getElementById('toastWrap');
  if (!wrap) return;
  const el = doc.createElement('div');
  el.className = 'toast';
  const text = String(message);
  if (/(\binvalid\b|\berror\b|\bfailed\b|\bfail\b|\bpassword\b|\brequired\b|\boutside\b|\bunsupported\b|\bcannot\b|\bmissing\b)/i.test(text)) {
    el.classList.add('toastError');
  } else {
    el.classList.add('toastSuccess');
  }
  el.textContent = text;
  wrap.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 5000);
}
