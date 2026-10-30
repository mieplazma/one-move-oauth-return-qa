// PREPARED ONLY. No OAuth credential exchange, session creation or storage here.
// The original Core tab must still prove its state, browser proof and CSRF.
(() => {
  'use strict';
  const target = 'https://script.google.com/macros/s/AKfycbxlC6GL_KIiU3NBlWw1-tqnFNOVQSaX3LcWCnKsOj7TfPkMEuZZ76Pe75O05FBs2LY/exec';
  const query = window.location.search;
  const fragment = window.location.hash;
  // Remove the response from browser history before parsing or rendering it.
  window.history.replaceState(null, '', window.location.pathname);
  const status = document.getElementById('status');
  const link = document.getElementById('continue');
  try {
    if (window.location.protocol !== 'https:' || query.length > 8192 || fragment) throw Error();
    const params = new URLSearchParams(query);
    if (params.has('access_token') || params.has('id_token')) throw Error();
    const single = name => {
      const values = params.getAll(name);
      if (values.length > 1 || (values[0] || '').length > 4096) throw Error();
      return values[0] || '';
    };
    const state = single('state'), code = single('code'), error = single('error');
    if ((!/^[a-f0-9]{64}$/i.test(state) && !/^(?:tenant_|owner_transfer_)[a-f0-9]{64}$/.test(state)) || Boolean(code) === Boolean(error)) throw Error();
    if (code && (code.length < 8 || /[\u0000-\u001f\u007f]/.test(code))) throw Error();
    if (error && !/^[A-Za-z0-9_]{1,80}$/.test(error)) throw Error();
    const response = new URLSearchParams({state});
    response.set(code ? 'code' : 'error', code || error);
    // No Google account routing fields, user-provided destination or tokens.
    const destination = target + (state.startsWith('owner_transfer_') ? '?ownerTransfer=1' : state.startsWith('tenant_') ? '?tenant=1' : '') + '#' + response.toString();
    link.href = destination;
    link.hidden = false;
    window.location.replace(destination);
  } catch (_) {
    status.textContent = 'Не удалось завершить вход. Вернитесь в кабинет и начните вход заново.';
    link.href = target;
    link.textContent = 'Открыть кабинет';
    link.hidden = false;
  }
})();

