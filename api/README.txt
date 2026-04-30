Uploader diagnostic.php sur Hostinger : hPanel → File Manager → public_html/api/
Tester : POST JSON depuis pinapp.fr (CORS déjà listé dans le fichier PHP).

Le compte contact@pinapp.fr DOIT exister sur Hostinger avec forward configuré vers les 2 Gmail. Si pas configuré : les emails partiront mais resteront sur le serveur sans alerter Lauralie/Micha.

Payload JSON (wizard 4 étapes voyage-v9) : nom_complet, email, telephone, entreprise, secteur, categorie, description, references, pack_envisage, budget, delai, contact_preference, creneau (optionnel), rgpd_consent (bool true obligatoire), website (honeypot vide), source. Réponse succès : {"ok":true}. Un email d’accusé de réception est envoyé au visiteur si mail() interne réussit.
