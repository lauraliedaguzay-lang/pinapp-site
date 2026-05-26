(function () {
  'use strict';

  var CONFIG = {
    proxyUrl: 'https://pinapp-chat.pinapp.workers.dev',
    botName: 'Aurora',
    avatarSrc: '/assets/img/aurora.png',
    greeting:
      "Hey ! Moi c'est Aurora, l'assistante IA de Pinapp. Pose-moi n'importe quelle question sur nos services 😊",
    suggestions: [
      'Combien coûte un site ?',
      "C'est quoi un film IA ?",
      'Vous êtes basés où ?',
      'Comment ça se passe ?',
      'Je veux un diagnostic gratuit',
    ],
    systemPrompt:
      "Tu es Aurora, l'assistante IA de Pinapp, studio digital premium à Bordeaux (Mérignac). Cofondateurs : Lauralie Daguzay (dev, IA, automatisation) et Michaël Bouilhac (graphiste, vidéaste, films IA).\n\nSERVICES ET TARIFS :\n- Sites web premium : à partir de 2 500€ HT (vitrine) → 4 500€ (cinématique Awwwards) → 8 000€ (sur-mesure)\n- Automatisation n8n/IA : à partir de 1 200€ HT\n- IA sur mesure (assistants, chatbots comme moi !) : à partir de 2 000€ HT\n- Production vidéo : à partir de 650€ HT\n- Films IA (10 photos → court-métrage) : à partir de 1 000€ HT\n- Film IA cadeau : 1 500€ HT\n- Formations IA & automatisation : bientôt disponibles\n\nPROCESSUS :\n1. Diagnostic gratuit (30 min, sans engagement)\n2. Proposition sur mesure sous 48h\n3. Validation et début du projet\n4. Livraison + 30 jours satisfait ou remboursé\n\nCONTACT : contact@pinapp.fr · Bordeaux, Nouvelle-Aquitaine\n\nRÈGLES :\n- Réponds en français, max 3 phrases courtes\n- Sois chaleureuse, naturelle, comme une vraie personne\n- Tutoie le visiteur\n- Propose toujours le diagnostic gratuit comme prochaine étape\n- Ne donne pas de prix exact sans connaître le besoin, dis 'à partir de X€'\n- Si hors sujet, ramène gentiment vers Pinapp\n- 1-2 emojis max par message\n- Tu es Aurora, pas Claude. Ne mentionne jamais Claude.\n- Signe 'Aurora 🌙' à la fin de ta première réponse seulement",
  };

  var isOpen = false;
  var messages = [];
  var isTyping = false;

  function countRole(role) {
    var n = 0;
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].role === role) n++;
    }
    return n;
  }

  function shouldAppendFirstSignature() {
    return countRole('assistant') === 1 && countRole('user') >= 1;
  }

  function maybeSignFirstReply(text) {
    var t = text;
    if (shouldAppendFirstSignature() && t.indexOf('Aurora') === -1) {
      t = t + '\n\nAurora 🌙';
    }
    return t;
  }

  function createWidget() {
    if (document.getElementById('pp-chat-widget')) return;

    var widget = document.createElement('div');
    widget.id = 'pp-chat-widget';
    widget.innerHTML =
      '<button type="button" id="pp-chat-toggle" aria-label="Parler à Aurora">' +
      '<img src="' +
      CONFIG.avatarSrc +
      '" alt="" class="pp-chat-avatar-btn" width="56" height="56" decoding="async" loading="lazy">' +
      '<span class="pp-chat-close" aria-hidden="true">&times;</span>' +
      '<span class="pp-chat-badge" id="pp-chat-badge" style="display:none;">1</span>' +
      '<span class="pp-chat-pulse" aria-hidden="true"></span>' +
      '</button>' +
      '<div id="pp-chat-panel" role="dialog" aria-label="Discussion avec Aurora">' +
      '<div class="pp-chat-header">' +
      '<div class="pp-chat-header-info">' +
      '<img src="' +
      CONFIG.avatarSrc +
      '" alt="" class="pp-chat-header-avatar" width="36" height="36" decoding="async" loading="lazy">' +
      '<div>' +
      '<strong>Aurora</strong>' +
      '<span class="pp-chat-status">En ligne · Pinapp · Bordeaux</span>' +
      '</div>' +
      '</div>' +
      '<button type="button" class="pp-chat-minimize" aria-label="Fermer la discussion">&times;</button>' +
      '</div>' +
      '<div class="pp-chat-messages" id="pp-chat-messages" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<div class="pp-chat-suggestions" id="pp-chat-suggestions"></div>' +
      '<div class="pp-chat-input-wrap">' +
      '<label for="pp-chat-input" class="sr-only">Message à Aurora</label>' +
      '<input type="text" id="pp-chat-input" placeholder="Demande-moi ce que tu veux..." autocomplete="off">' +
      '<button type="button" id="pp-chat-send" aria-label="Envoyer le message">&rarr;</button>' +
      '</div>' +
      '<div class="pp-chat-footer">' +
      'Aurora par Pinapp · <a href="/diagnostic/">Diagnostic gratuit &rarr;</a>' +
      '</div>' +
      '</div>';

    document.body.appendChild(widget);

    document.getElementById('pp-chat-toggle').addEventListener('click', toggleChat);
    widget.querySelector('.pp-chat-minimize').addEventListener('click', toggleChat);
    document.getElementById('pp-chat-send').addEventListener('click', sendMessage);
    document.getElementById('pp-chat-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage();
    });

    addBotMessage(CONFIG.greeting);
    renderSuggestions();

    window.setTimeout(function () {
      if (!isOpen) {
        try {
          if (sessionStorage.getItem('pp-chat-opened')) return;
        } catch (e) {}
        var badge = document.getElementById('pp-chat-badge');
        if (badge) badge.style.display = 'flex';
      }
    }, 6000);
  }

  function toggleChat() {
    isOpen = !isOpen;
    var w = document.getElementById('pp-chat-widget');
    if (!w) return;
    w.classList.toggle('open', isOpen);
    if (isOpen) {
      try {
        sessionStorage.setItem('pp-chat-opened', '1');
      } catch (e) {}
      var badge = document.getElementById('pp-chat-badge');
      if (badge) badge.style.display = 'none';
      var inp = document.getElementById('pp-chat-input');
      if (inp) inp.focus();
    }
  }

  function addBotMessage(text) {
    messages.push({ role: 'assistant', content: text });
    var container = document.getElementById('pp-chat-messages');
    if (!container) return;
    var msg = document.createElement('div');
    msg.className = 'pp-chat-msg pp-chat-bot';
    msg.innerHTML =
      '<img src="' +
      CONFIG.avatarSrc +
      '" alt="" class="pp-chat-msg-avatar" width="28" height="28" decoding="async" loading="lazy">' +
      '<div class="pp-chat-msg-text">' +
      escapeHtml(text).replace(/\n/g, '<br>') +
      '</div>';
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function addUserMessage(text) {
    messages.push({ role: 'user', content: text });
    var container = document.getElementById('pp-chat-messages');
    if (!container) return;
    var msg = document.createElement('div');
    msg.className = 'pp-chat-msg pp-chat-user';
    msg.innerHTML = '<div class="pp-chat-msg-text">' + escapeHtml(text) + '</div>';
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function showTyping() {
    isTyping = true;
    var container = document.getElementById('pp-chat-messages');
    if (!container) return;
    var typing = document.createElement('div');
    typing.className = 'pp-chat-msg pp-chat-bot';
    typing.id = 'pp-chat-typing';
    typing.innerHTML =
      '<img src="' +
      CONFIG.avatarSrc +
      '" alt="" class="pp-chat-msg-avatar" width="28" height="28" decoding="async">' +
      '<div class="pp-chat-msg-text"><span class="pp-typing-dots"><span>.</span><span>.</span><span>.</span></span></div>';
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  }

  function hideTyping() {
    isTyping = false;
    var t = document.getElementById('pp-chat-typing');
    if (t) t.remove();
  }

  function renderSuggestions() {
    var container = document.getElementById('pp-chat-suggestions');
    if (!container) return;
    container.innerHTML = '';
    CONFIG.suggestions.forEach(function (q) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pp-chat-suggestion';
      btn.textContent = q;
      btn.addEventListener('click', function () {
        var inp = document.getElementById('pp-chat-input');
        if (inp) inp.value = q;
        sendMessage();
        container.innerHTML = '';
      });
      container.appendChild(btn);
    });
  }

  var offlineResponses = {
    'prix|co[uû]t|combien|tarif|budget':
      "Nos sites commencent à 2 500€ HT pour une vitrine, et 4 500€ pour un site cinématique niveau Awwwards. Le mieux c'est qu'on en parle en diagnostic gratuit — 30 min, sans engagement 😊",
    'film|vid[eé]o|court-m[eé]trage|cin[eé]ma':
      "Les films IA c'est notre spécialité ! 10 photos de toi suffisent, et on crée un court-métrage cinématique. À partir de 1 000€ HT, livré en 5-7 jours. Regarde le Star Wars sur notre accueil, c'est Lauralie & Michaël dedans !",
    'o[uù]|bordeaux|locali|m[eé]rignac|adresse':
      'On est à Mérignac, juste à côté de Bordeaux ! Mais on travaille avec des clients partout en France, tout se fait en visio 🙌',
    'comment|processus|[eé]tape|d[eé]roule':
      "C'est simple : 1) Diagnostic gratuit 30 min 2) Proposition sur mesure sous 48h 3) On bosse 4) Livraison + 30 jours satisfait ou remboursé. Zéro stress !",
    'qui|[eé]quipe|fondateur|lauralie|micha':
      "On est deux : Lauralie (la dev IA qui code tout) et Michaël (le graphiste vidéaste qui donne vie aux projets). Et moi Aurora, leur assistante IA 😄",
    'diagnostic|rdv|rendez|appel|contact':
      "Le diagnostic c'est 30 min, gratuit, sans engagement. On analyse ton activité et on te montre exactement ce qu'on peut faire. Réserve ici → pinapp.fr/diagnostic",
    'formation|apprendre|cours':
      "Nos formations IA & automatisation arrivent bientôt ! On y apprend à utiliser l'IA et n8n pour automatiser son business. Inscris-toi sur la waitlist via le diagnostic.",
    'bonjour|salut|hello|coucou|hey': "Salut ! Ravie de te parler 😊 Je suis Aurora, l'assistante IA de Pinapp. Comment je peux t'aider ?",
    'merci|super|g[eé]nial|top':
      "Avec plaisir ! Si tu veux aller plus loin, le diagnostic gratuit c'est le meilleur premier pas. On analyse tout ensemble en 30 min 🍍",
  };

  function getOfflineReply(text) {
    var t = text.toLowerCase();
    try {
      t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    } catch (e) {}
    for (var pattern in offlineResponses) {
      if (Object.prototype.hasOwnProperty.call(offlineResponses, pattern)) {
        if (new RegExp(pattern, 'i').test(t)) return offlineResponses[pattern];
      }
    }
    return "Bonne question ! Pour te répondre au mieux, le plus simple c'est de réserver un diagnostic gratuit. 30 min, gratuit, sans engagement → pinapp.fr/diagnostic 😊";
  }

  function parseApiReply(data) {
    if (!data) return '';
    if (typeof data.reply === 'string' && data.reply) return data.reply;
    if (data.content && data.content[0] && typeof data.content[0].text === 'string') return data.content[0].text;
    return '';
  }

  function sendMessage() {
    var input = document.getElementById('pp-chat-input');
    if (!input) return;
    var text = input.value.trim();
    if (!text || isTyping) return;
    input.value = '';
    var sug = document.getElementById('pp-chat-suggestions');
    if (sug) sug.innerHTML = '';
    addUserMessage(text);
    showTyping();

    var apiMessages = messages.map(function (m) {
      return { role: m.role, content: m.content };
    });

    fetch(CONFIG.proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages, system: CONFIG.systemPrompt }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error('API error');
        return r.json();
      })
      .then(function (data) {
        hideTyping();
        var raw = parseApiReply(data) || getOfflineReply(text);
        addBotMessage(maybeSignFirstReply(raw));
        showFollowUp();
      })
      .catch(function () {
        hideTyping();
        window.setTimeout(function () {
          addBotMessage(maybeSignFirstReply(getOfflineReply(text)));
          showFollowUp();
        }, 800);
      });
  }

  function showFollowUp() {
    if (messages.length < 6) return;
    var container = document.getElementById('pp-chat-suggestions');
    if (!container) return;
    container.innerHTML = '';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pp-chat-suggestion pp-chat-cta';
    btn.textContent = 'Réserver mon diagnostic gratuit';
    btn.addEventListener('click', function () {
      window.open('/diagnostic/', '_blank', 'noopener,noreferrer');
    });
    container.appendChild(btn);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function boot() {
    createWidget();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
