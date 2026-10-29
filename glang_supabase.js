// GlanG the Mobster · branchement de la page « Nouveau mot de passe » à Supabase (0.19.0).
// Le lien de réinitialisation envoyé par Supabase ramène ici avec, dans l'ancre de l'adresse,
// #access_token=…&type=recovery (ou #error_code=otp_expired si le lien est périmé).
// Adresse du projet et clé PUBLIQUE seulement (les mêmes que data/en_ligne.cfg du jeu).
(function () {
  var URL_PROJET = 'https://cpltwppxxlifhxuujjvd.supabase.co';
  var CLE = 'sb_publishable_AKK6kHUG-C5zsJl92RkM0A_Ue2aJEy-';
  var p = new URLSearchParams(location.hash.replace(/^#/, ''));
  var jeton = p.get('access_token') || '';
  var perime = !!p.get('error_code') || !!p.get('error');
  // On retire le jeton de l'adresse (historique, copier-coller).
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  window.glangEnregistrer = function (mdp) {
    if (!jeton || perime) return Promise.reject('expire');
    return fetch(URL_PROJET + '/auth/v1/user', {
      method: 'PUT',
      headers: { 'apikey': CLE, 'Authorization': 'Bearer ' + jeton, 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: mdp })
    }).then(function (r) {
      if (r.ok) return;
      if (r.status === 401 || r.status === 403) throw 'expire';
      if (r.status === 429) throw 'tropDemandes';
      throw 'serveur';
    }, function () { throw 'serveur'; });
  };
})();
