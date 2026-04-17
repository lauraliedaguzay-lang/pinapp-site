PINAPP — Séquences email (corps texte pour n8n / Gmail)
=======================================================

Chaque fichier .txt : première ligne = OBJET: … puis corps du message (UTF-8).

Les versions HTML « premium » (dark/light) restent dans /emails/ (01–06) pour les envois HTML si besoin.

Fichiers :
  A-post-diagnostic — séquence après formulaire diagnostic
  B-onboarding-client — après signature devis
  C-kit-prompts — après achat kit

Workflow n8n suggéré :
  - Déclencheur webhook diagnostic → email A1 + création Notion (voir docs/notion-crm-prospects.md)
  - Wait / If non contacté → A2 (J+2), A3 (J+7), A4 (J+30)
  - Déclencheur devis signé → B1…B5
  - Déclencheur achat kit → C1

QR diagnostic (impression) : assets/images/qr-diagnostic.svg et .png
URL cible : https://pinapp.fr/diagnostic/?source=qr
Regénérer : npm run qr:diagnostic
