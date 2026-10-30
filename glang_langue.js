// GlanG the Mobster · pages web bilingues français / anglais (lot L5 de la version anglaise 0.20).
// Langue : ?lang=fr|en dans l'adresse, sinon le dernier choix (localStorage), sinon la langue du
// navigateur (français si elle commence par « fr », anglais sinon, comme dans le jeu).
// Les pages sont écrites en français ; ce script remplace chaque texte par sa traduction, y compris
// les messages posés plus tard par les scripts de la page (observateur). La bascule se fait sans
// recharger la page : le jeton du lien de mot de passe, retiré de l'adresse au chargement, est gardé.
(function () {
  var EN = {
    // Communs
    'GLANG THE MOBSTER · VERSION EN LIGNE': 'GLANG THE MOBSTER · ONLINE EDITION',
    // Page « Nouveau mot de passe »
    'Nouveau mot de passe · GlanG the Mobster': 'New Password · GlanG the Mobster',
    'Nouveau mot de passe': 'New password',
    'Choisis le nouveau mot de passe de ton compte.': 'Choose a new password for your account.',
    '6 caractères au moins': 'At least 6 characters',
    'Nouveau mot de passe, encore': 'New password, once more',
    'Afficher le mot de passe': 'Show password',
    'Masquer le mot de passe': 'Hide password',
    'Enregistrer': 'Save',
    'C’est fait : retourne dans le jeu et connecte-toi.': 'Done. Return to the game and sign in.',
    'Tu n’as rien demandé ? Ignore ce lien : ton mot de passe ne change pas.': 'Didn’t ask for this? Ignore this link: the password stays as it is.',
    'Un instant…': 'One moment…',
    'Mot de passe trop court (6 caractères au moins).': 'Password too short (at least 6 characters).',
    'Les deux mots de passe ne sont pas identiques.': 'The two passwords do not match.',
    'Pas de connexion au serveur.': 'No connection to the server.',
    'Trop de demandes : réessaie dans quelques minutes.': 'Too many requests: try again in a few minutes.',
    'Ce lien a expiré : redemande-le depuis le jeu.': 'This link has expired: request a new one from the game.',
    // Page d'accueil du site (confirmation d'inscription)
    'GlanG the Mobster · version en ligne': 'GlanG the Mobster · Online Edition',
    'Compte confirmé': 'Account confirmed',
    'Ton e-mail est confirmé : retourne dans le jeu et connecte-toi.': 'Your e-mail address is confirmed. Return to the game and sign in.',
    'Tu n’as rien demandé ? Ignore ce message : aucun compte n’est ouvert sans confirmation.': 'Didn’t ask for this? Ignore this message: no account is opened without confirmation.',
    'Lien expiré': 'Link expired',
    'Ce lien a expiré ou a déjà servi : essaie de te connecter dans le jeu.': 'This link has expired or has already been used. Try signing in from the game.'
  };
  var FR = {};
  Object.keys(EN).forEach(function (k) { FR[EN[k]] = k; });
  var CLE = 'glang_langue', ATTRS = ['aria-label', 'title', 'placeholder'];

  function lire() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'fr' || q === 'en') return q;
    try { var s = localStorage.getItem(CLE); if (s === 'fr' || s === 'en') return s; } catch (e) {}
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return /^fr\b/i.test(nav) ? 'fr' : 'en';
  }
  var langue = lire(), obs = null;

  function dico() { return langue === 'en' ? EN : FR; }
  function texte(t) {
    var d = dico(), c = t.trim();
    return (c && Object.prototype.hasOwnProperty.call(d, c)) ? t.replace(c, d[c]) : t;
  }
  function parcourir(racine) {
    var w = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null), n = racine;
    while (n) {
      if (n.nodeType === 3) {
        var p = n.parentNode && n.parentNode.nodeName;
        if (p !== 'SCRIPT' && p !== 'STYLE' && !(n.parentNode.closest && n.parentNode.closest('[data-sans-traduction]'))) {
          var t = texte(n.nodeValue);
          if (t !== n.nodeValue) n.nodeValue = t;
        }
      } else if (n.nodeType === 1 && !n.hasAttribute('data-sans-traduction')) {
        ATTRS.forEach(function (a) {
          if (n.hasAttribute(a)) { var v = texte(n.getAttribute(a)); if (v !== n.getAttribute(a)) n.setAttribute(a, v); }
        });
      }
      n = w.nextNode();
    }
  }
  function appliquer() {
    if (obs) obs.disconnect();
    document.documentElement.lang = langue;
    document.title = texte(document.title);
    parcourir(document.body);
    var b = document.getElementById('gmWebLangue');
    if (b) {
      b.textContent = langue === 'en' ? 'Français' : 'English';
      b.setAttribute('lang', langue === 'en' ? 'fr' : 'en');
      b.setAttribute('aria-label', langue === 'en' ? 'Afficher la page en français' : 'Show this page in English');
    }
    if (obs) obs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  window.glangLangue = function () { return langue; };

  function demarrer() {
    var bas = document.querySelector('.gmWeb .bas');
    if (bas && !document.getElementById('gmWebLangue')) {
      var b = document.createElement('button');
      b.type = 'button'; b.id = 'gmWebLangue'; b.className = 'langue'; b.setAttribute('data-sans-traduction', '');
      b.addEventListener('click', function () {
        langue = langue === 'en' ? 'fr' : 'en';
        try { localStorage.setItem(CLE, langue); } catch (e) {}
        appliquer();
      });
      bas.appendChild(document.createTextNode(' · '));
      bas.appendChild(b);
    }
    obs = new MutationObserver(function () { appliquer(); });
    appliquer();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
