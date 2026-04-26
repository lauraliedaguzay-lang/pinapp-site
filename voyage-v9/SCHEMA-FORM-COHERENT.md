# ⚠️ Document legacy — ne plus utiliser comme référence opérationnelle

**Remplacé par** : [`docs/SCHEMA-WORKFLOWS-N8N.md`](../docs/SCHEMA-WORKFLOWS-N8N.md)

La **source de vérité** pour le routage diagnostic **voyage-v9** est le code : objet `n8nMap` et branche `auto-pack` dans `voyage-v9/index.html` (champ `n8n_route_tag` dans le payload webhook).

Ce fichier existait dans les notes projet sous le nom « schéma forme cohérent » ; les anciens alias (`#site`, `#ia`, `#pack-duo`, `#formation-N`, etc.) **ne correspondent plus** au code livré après PR #64 / itération v+1. Renommer les workflows n8n pour suivre les tags documentés dans **SCHEMA-WORKFLOWS-N8N.md**, pas l’inverse.

---

*En-tête legacy ajouté pour éviter toute divergence doc ↔ prod.*
