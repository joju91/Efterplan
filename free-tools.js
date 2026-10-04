// Klick-delegation för de fristående gratisverktygen (arvskifte-mall,
// dodsannons, gratis-checklista-abonnemang). Sidorna laddar inte app.js,
// så data-action-knapparna behöver en egen dispatcher (jfr T260 i app.js).
document.addEventListener('click', function freeToolAction(e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;
  const call = name => { if (typeof window[name] === 'function') window[name](); };
  switch (a) {
    case 'generateNotice': case 'generateFreeLetter': case 'generateAgreement':
    case 'copyNotice': case 'copyFreeLetter': case 'copyAgreement':
    case 'addHeir': case 'addAsset':
      call(a); break;
    case 'print': window.print(); break;
    case 'plausibleFreeToApp':
      if (window.plausible) window.plausible('free_tool_to_app_click', { props: { area: el.dataset.arg || '' } });
      break;
    case 'removeHeir': {
      const node = document.getElementById('am-heir-' + el.dataset.id);
      if (node) node.remove();
      call('renderAssetOwnerOptions');
      break;
    }
    case 'removeAsset': {
      const node = document.getElementById('am-asset-' + el.dataset.id);
      if (node) node.remove();
      break;
    }
  }
});
