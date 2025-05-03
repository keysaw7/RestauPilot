# Vulnérabilités Connues

## Vulnérabilités Actuelles (2024)

### Vulnérabilités Élevées
- **Package**: nth-check
- **Impact**: Vulnérabilité aux attaques DoS via expressions régulières complexes
- **Chemin de dépendance**: nth-check → css-select → svgo → @svgr/plugin-svgo → @svgr/webpack → react-scripts
- **Statut**: À résoudre dans une prochaine mise à jour majeure

### Vulnérabilités Modérées
- **Package**: PostCSS
- **Impact**: Problème de parsing des styles CSS
- **Chemin de dépendance**: postcss → resolve-url-loader → react-scripts
- **Statut**: À résoudre dans une prochaine mise à jour majeure

## Plan d'Action
Ces vulnérabilités seront adressées lors d'une prochaine mise à jour majeure du projet, en coordination avec les mises à jour de dépendances principales.

## Notes
- Ces vulnérabilités n'affectent pas directement la sécurité des données
- Le risque d'exploitation est considéré comme faible
- Les solutions nécessiteront des tests approfondis pour éviter les régressions 