/**
 * Contenus français **à parité** avec les versions anglaises pour les guides
 * dont la traduction initiale était volontairement courte.
 *
 * Source de vérité éditoriale : ce fichier est fusionné par-dessus `guidesFr`
 * (défini dans app/guides/[id]/page.tsx) — il a donc la priorité.
 * Il est également lu par `scripts/import-guides.mjs` (npm run db:import-guides)
 * pour alimenter le champ `contentHtmlFr` des articles.
 */

export type GuideFrEntry = { title: string; description: string; content: string };

export const guidesFrExtended: Record<string, GuideFrEntry> = {
  rsi: {
    title: "Guide de l'indicateur RSI",
    description:
      "Utiliser le RSI pour repérer surachat/survente, qualifier le momentum et construire un plan d'exécution complet.",
    content: `
      <h2>Comprendre l'indicateur RSI</h2>
      <p>Le Relative Strength Index (RSI) est un oscillateur borné entre 0 et 100 qui compare l'amplitude des gains et des pertes récents. Il mesure la <em>vitesse</em> du mouvement plus que le prix lui-même. Bien utilisé, il met en évidence la qualité d'une tendance, l'épuisement du momentum, les retournements cachés et les replis tactiques.</p>

      <h3>Comment il est calculé</h3>
      <p>Le RSI découle du rapport entre la moyenne des clôtures haussières et celle des clôtures baissières sur une période donnée (14 bougies par défaut). Inutile de le recalculer à la main : retenez qu'il mesure l'<strong>équilibre entre pression acheteuse et vendeuse</strong>, ce qui garantit des seuils comparables d'un marché et d'une unité de temps à l'autre.</p>

      <h3>Principes clés à connaître</h3>
      <ul>
        <li><strong>Seuils :</strong> 70/30 (classiques), 80/20 (tendances fortes), 60/40 (filtres de tendance).</li>
        <li><strong>Zones de tendance :</strong> en tendance haussière, le RSI tient souvent au-dessus de 40 ; en baissière, il reste sous 60. C'est plus fiable que le simple franchissement de 70 ou 30.</li>
        <li><strong>Ligne médiane (50) :</strong> pivot du momentum ; un franchissement accompagné de structure confirme un changement de régime.</li>
        <li><strong>Divergences :</strong> le prix fait un nouvel extrême sans que le RSI confirme (divergence classique), ou l'inverse (divergence cachée).</li>
        <li><strong>Failure swings :</strong> le RSI se retourne avant l'extrême puis casse un sommet/creux précédent — un des signaux historiques de Wilder.</li>
      </ul>

      <h3>Lecture en tendance et en range</h3>
      <ul>
        <li><strong>Tendance haussière :</strong> acheter les replis vers 40–50 quand le prix revient sur un support ; ignorer les « surachats » persistants.</li>
        <li><strong>Tendance baissière :</strong> symétriquement, vendre les rebonds vers 50–60.</li>
        <li><strong>Range :</strong> les extrêmes 70/30 redeviennent exploitables si le prix respecte les bornes du range.</li>
      </ul>

      <h3>Workflow top-down</h3>
      <ol>
        <li>Définir le régime de l'unité de temps supérieure (tendance ou range, supports/résistances clés).</li>
        <li>Appliquer le RSI(14) sur l'unité d'exécution ; ajouter éventuellement une moyenne mobile pour le contexte.</li>
        <li>Choisir <em>un</em> type de signal : repli vers 40/60, divergence sur niveau, failure swing, ou cassure avec RSI &gt; 60 en tendance haussière.</li>
        <li>Confirmer par la structure de prix (sommets/creux, zones d'offre et de demande, liquidité).</li>
        <li>Placer le stop derrière le dernier swing structurel et dimensionner la position au risque.</li>
        <li>Sorties partielles à 1R et 2R, suivi du reste sur la structure ou un stop basé sur l'ATR.</li>
      </ol>

      <h3>Quatre stratégies pratiques</h3>
      <h4>1) Repli de tendance (RSI 40/60)</h4>
      <p>En tendance haussière, attendre que le RSI reflue vers 40–50 pendant que le prix corrige dans une zone de support, puis valider par une bougie de reprise ou la cassure d'un swing mineur. Symétriquement en tendance baissière (zone 50–60).</p>
      <h4>2) Divergence classique sur niveau clé</h4>
      <p>Quand le prix inscrit un plus haut au contact d'une résistance alors que le RSI fait un plus bas, le momentum faiblit. On attend un déclencheur (cassure de structure) plutôt que d'anticiper : les divergences sont plus fiables lorsqu'elles coïncident avec un niveau supérieur.</p>
      <h4>3) Failure swing</h4>
      <p>Repérer un RSI qui échoue sous 70 puis casse son dernier creux (ou l'inverse sous 30). Combiner avec un rejet de zone pour améliorer le ratio.</p>
      <h4>4) Cassure avec filtre de momentum</h4>
      <p>Sur une cassure de range, exiger RSI &gt; 60 (achat) ou &lt; 40 (vente) : cela élimine une partie des fausses cassures.</p>

      <h3>Checklist d'exécution</h3>
      <ul>
        <li>Contexte de l'unité supérieure clair ?</li>
        <li>Type de signal identifié (repli, divergence, failure swing, cassure) ?</li>
        <li>Confluence présente (niveau, moyenne mobile, volume, VWAP) ?</li>
        <li>Risque défini, taille calculée, R:R ≥ 1:2 ?</li>
        <li>Plan de sortie écrit (objectifs, trailing, invalidation) ?</li>
      </ul>

      <h3>Erreurs fréquentes</h3>
      <ul>
        <li>Vendre systématiquement un RSI « suracheté » dans une tendance forte.</li>
        <li>Ignorer le contexte supérieur et la liquidité autour des extrêmes.</li>
        <li>Prendre une divergence sans attendre la confirmation de structure.</li>
      </ul>

      <h3>Backtest et journal</h3>
      <p>Définir des déclencheurs objectifs, étiqueter le régime (tendance/range) lors de la prise de position, puis suivre le taux de réussite, le R moyen, l'espérance et le drawdown. Validez hors échantillon et en paper trading sur 20 à 30 trades avant d'augmenter la taille.</p>
    `,
  },

  leverage: {
    title: "Comprendre l'effet de levier",
    description:
      "Fonctionnement du levier, marge, prix de liquidation, coûts réels et garde-fous indispensables.",
    content: `
      <h2>Effet de levier : définition</h2>
      <p>L'effet de levier permet de contrôler une position de taille supérieure au capital déposé. Avec 1 000 € et un levier de 1:100, on peut ouvrir une position de 100 000 €. Le levier amplifie les gains <em>et</em> les pertes : il ne modifie pas l'espérance de la stratégie, il modifie la vitesse à laquelle le compte évolue — et le risque de ruine.</p>

      <h3>Marge et exigences de marge</h3>
      <ul>
        <li><strong>Marge initiale :</strong> montant immobilisé pour ouvrir la position (taille ÷ levier).</li>
        <li><strong>Marge de maintenance :</strong> niveau minimum exigé pour conserver la position.</li>
        <li><strong>Appel de marge :</strong> quand l'équité approche du seuil, le courtier demande un complément.</li>
        <li><strong>Marge libre :</strong> capital encore disponible pour absorber les variations.</li>
      </ul>

      <h3>Prix de liquidation</h3>
      <p>Sur un achat, la liquidation survient approximativement quand le prix atteint :</p>
      <p><strong>Prix de liquidation ≈ prix d'entrée × (1 − 1 ÷ levier)</strong></p>
      <p>Exemple à 1:100 : environ 1 % de baisse suffit à liquider la position. À 1:10, il faut environ 10 % — d'où l'intérêt d'un levier faible pour une exposition identique.</p>

      <h3>Exemple chiffré comparatif</h3>
      <ul>
        <li>Compte : 10 000 € ; risque souhaité : 1 % (100 €) ; stop : 2 % du prix.</li>
        <li><strong>Levier 1:100 :</strong> on pourrait ouvrir 1 000 000 € de notionnel, mais la taille correcte au regard du risque (10 000 × 1 % ÷ 2 %) reste 5 000 € de notionnel → levier effectif 0,5:1.</li>
        <li><strong>Levier 1:10 :</strong> la même position de 5 000 € est possible sans pression de marge.</li>
        <li>Conclusion : le levier <em>disponible</em> ne doit jamais dicter la taille ; c'est la distance de stop qui la détermine.</li>
      </ul>

      <h3>Les coûts réels du levier</h3>
      <ul>
        <li><strong>Spread :</strong> payé à l'entrée et à la sortie, proportionnel au nombre d'allers-retours.</li>
        <li><strong>Financement overnight (swap) :</strong> sur les positions conservées, surtout avec un levier élevé.</li>
        <li><strong>Slippage :</strong> accentué sur les actifs peu liquides et lors des annonces macro.</li>
        <li><strong>Liquidations en cascade :</strong> les mouvements violents touchent d'abord les positions les plus leveragées.</li>
      </ul>

      <h3>Garde-fous à appliquer</h3>
      <ul>
        <li>Risque par trade de 0,5–2 % du capital, jamais plus.</li>
        <li>Levier effectif (notionnel ÷ capital) plafonné, par exemple à 3:1 pour un compte discrétionnaire.</li>
        <li>Taille ajustée à la volatilité (ATR) plutôt qu'à un nombre de lots fixe.</li>
        <li>Risque agrégé limité sur les actifs corrélés (panier USD, indices, crypto).</li>
        <li>Plafonds journaliers/hebdomadaires (ex. −3R puis pause obligatoire).</li>
      </ul>

      <h3>Checklist avant chaque position</h3>
      <ul>
        <li>Distance de stop définie et justifiée par la structure.</li>
        <li>Taille calculée à partir du risque, pas du levier disponible.</li>
        <li>Prix de liquidation calculé et situé loin du stop (marge de sécurité).</li>
        <li>Coûts estimés (spread + financement) intégrés au calcul de R:R.</li>
      </ul>

      <h3>Erreurs fréquentes</h3>
      <ul>
        <li>Utiliser le levier maximal « parce qu'il est disponible ».</li>
        <li>Élargir un stop pour éviter la liquidation : la perte devient incontrôlable.</li>
        <li>Empiler des positions corrélées, ce qui revient à prendre un risque unique démultiplié.</li>
      </ul>
    `,
  },

  ichimoku: {
    title: "Stratégie Ichimoku",
    description:
      "Tenkan, Kijun, nuage (Senkou A/B) et Chikou : lecture complète et signaux exploitables.",
    content: `
      <h2>Vue d'ensemble</h2>
      <p>L'Ichimoku Kinko Hyo est un système complet : il fournit à la fois la tendance, des supports/résistances dynamiques et des signaux d'entrée. Toutes ses lignes dérivent des plus hauts et plus bas, ce qui en fait un outil « auto-adaptatif » à la volatilité.</p>

      <h3>Les cinq composantes</h3>
      <ul>
        <li><strong>Tenkan-sen (9) :</strong> ligne de conversion — réactivité court terme.</li>
        <li><strong>Kijun-sen (26) :</strong> ligne de base — référence du momentum et des stops.</li>
        <li><strong>Senkou Span A :</strong> moyenne de Tenkan et Kijun, projetée 26 périodes en avant.</li>
        <li><strong>Senkou Span B (52) :</strong> milieu du range de 52 périodes, projeté 26 périodes en avant.</li>
        <li><strong>Chikou Span :</strong> clôture projetée 26 périodes en arrière — filtre de confirmation.</li>
      </ul>
      <p>Le <strong>nuage (Kumo)</strong> est la zone entre Senkou A et B : épais, il marque une consolidation ; fin, il annonce un potentiel de cassure.</p>

      <h3>Lecture de la tendance</h3>
      <ol>
        <li>Prix au-dessus du nuage = biais haussier ; en dessous = biais baissier ; dans le nuage = range (on réduit l'exposition).</li>
        <li>Tenkan au-dessus de Kijun = momentum court terme haussier.</li>
        <li>Nuage projeté haussier (Senkou A &gt; Senkou B à venir) = contexte favorable aux achats.</li>
        <li>Chikou au-dessus des prix passés = confirmation.</li>
      </ol>

      <h3>Signaux exploitables</h3>
      <ul>
        <li><strong>Croisement Tenkan/Kijun hors du nuage :</strong> signal de continuation dans le sens du nuage.</li>
        <li><strong>Rebond sur Kijun :</strong> entrée de continuation en tendance, stop de l'autre côté de la ligne.</li>
        <li><strong>Cassure du nuage avec Chikou libre :</strong> signal de retournement, plus fort si le nuage est fin.</li>
        <li><strong>Triple confirmation (prix + Tenkan/Kijun + Chikou) :</strong> meilleur compromis qualité/fréquence.</li>
      </ul>

      <h3>Méthode pas à pas</h3>
      <ol>
        <li>Choisir une unité de temps de référence (H4 ou D1 pour le swing).</li>
        <li>Vérifier la position du prix par rapport au nuage et l'orientation du nuage projeté.</li>
        <li>Attendre un croisement Tenkan/Kijun ou un pullback sur Kijun dans le sens du biais.</li>
        <li>Confirmer par le Chikou et par la structure (sommets/creux).</li>
        <li>Stop derrière le Kijun ou le dernier swing ; objectif sur le bord du nuage ou un multiple de R.</li>
      </ol>

      <h3>Checklist rapide</h3>
      <ul>
        <li>Prix du bon côté du nuage ?</li>
        <li>Nuage projeté orienté dans le sens du trade ?</li>
        <li>Chikou dégagé ?</li>
        <li>Stop et taille calculés, R:R ≥ 1:2 ?</li>
      </ul>

      <h3>Erreurs fréquentes</h3>
      <ul>
        <li>Trader à l'intérieur du nuage : les signaux y sont peu fiables.</li>
        <li>Ignorer l'adaptation des paramètres sur les actifs 24/7 (20/60 au lieu de 9/26/52 pour certains).</li>
        <li>Utiliser l'Ichimoku sans lecture de structure ni gestion du risque.</li>
      </ul>
    `,
  },

  psychology: {
    title: "Psychologie du trading",
    description:
      "Processus mentaux, routines, biais cognitifs et gestion des émotions sur les marchés.",
    content: `
      <h2>Pourquoi la psychologie fait la performance</h2>
      <p>Une stratégie rentable exécutée avec indiscipline devient perdante. La psychologie du trading consiste à construire un <strong>processus</strong> qui réduit la place de l'improvisation, donc celle des émotions, au moment de la décision.</p>

      <h3>Le cycle émotionnel du trader</h3>
      <ol>
        <li><strong>Euphorie</strong> après une série gagnante : on augmente la taille, on allège les critères.</li>
        <li><strong>Refus</strong> après une perte : on ne coupe pas, on « laisse respirer » la position.</li>
        <li><strong>Peur</strong> après plusieurs pertes : on coupe trop vite les gagnants.</li>
        <li><strong>Capitalisation</strong> : reconnaissance du cycle, retour au plan et à la taille de référence.</li>
      </ol>
      <p>Le meilleur indicateur de discipline n'est pas le P&amp;L, mais la <em>conformité au plan</em> (part des trades pris selon les règles).</p>

      <h3>Biais cognitifs les plus coûteux</h3>
      <ul>
        <li><strong>Aversion à la perte :</strong> garder une position perdante pour éviter de « matérialiser » l'échec.</li>
        <li><strong>Biais de confirmation :</strong> ne chercher que les informations qui valident le scénario.</li>
        <li><strong>Ancrage :</strong> s'accrocher à un prix d'entrée devenu obsolète.</li>
        <li><strong>Biais du joueur :</strong> croire qu'une série de pertes « doit » être suivie d'un gain.</li>
        <li><strong>Excès de confiance :</strong> surestimer sa précision, augmenter la taille hors règles.</li>
      </ul>

      <h3>Routine pré-marché (10 minutes)</h3>
      <ul>
        <li>Relire les niveaux clés et le calendrier économique de la journée.</li>
        <li>Écrire les scénarios autorisés (et ceux qu'on ne prendra pas) avec leur invalidation.</li>
        <li>Vérifier l'état émotionnel : fatigue, stress, sommeil — condition d'arrêt si nécessaire.</li>
        <li>Fixer la taille maximale et le nombre de trades autorisés.</li>
      </ul>

      <h3>Règles anti-dérapage</h3>
      <ul>
        <li>Plafond de perte quotidienne (ex. 2–3R) : arrêt automatique de la séance.</li>
        <li>Plafond hebdomadaire (ex. 6R) puis pause obligatoire d'une journée.</li>
        <li>Interdiction d'augmenter la taille sans 20 trades conformes documentés.</li>
        <li>Un seul actif à la fois au début, pour limiter la charge mentale.</li>
      </ul>

      <h3>Journal de trading efficace</h3>
      <ul>
        <li>Contexte (régime, unité de temps, niveau travaillé).</li>
        <li>Déclencheur précis et capture d'écran avant/après.</li>
        <li>État émotionnel au moment de l'entrée et de la sortie (note de 1 à 5).</li>
        <li>Résultat en R, conformité au plan (oui/non) et leçon du jour.</li>
      </ul>
      <p>Après 30 à 50 trades, les statistiques du journal indiquent quels <em>comportements</em> — pas quelles stratégies — coûtent le plus cher.</p>

      <h3>Checklist d'hygiène mentale</h3>
      <ul>
        <li>Pause de 24 h après une perte hors plan.</li>
        <li>Objectif mesurable sur le processus (nombre de trades conformes), pas sur le gain.</li>
        <li>Une seule nouveauté à la fois dans le plan de trading.</li>
        <li>Sommeil et routine physique : la fatigue est le premier facteur de dérapage.</li>
      </ul>
    `,
  },

  backtesting: {
    title: "Stratégies de backtesting",
    description:
      "Méthodologie, métriques clés, pièges statistiques et validation hors échantillon.",
    content: `
      <h2>Objectif du backtest</h2>
      <p>Un backtest ne sert pas à « prouver » qu'une stratégie gagne, mais à <strong>mesurer une distribution de résultats</strong> : espérance, drawdown, sensibilité aux paramètres et robustesse dans différents régimes de marché. Sans protocole, il produit surtout des illusions.</p>

      <h3>Protocole en 7 étapes</h3>
      <ol>
        <li><strong>Hypothèse claire :</strong> quelle inefficacité présumée exploite-t-on ?</li>
        <li><strong>Règles non ambiguës :</strong> conditions d'entrée, de sortie, de taille, filtres de session.</li>
        <li><strong>Données propres :</strong> historique suffisant (≥ 3 ans, plusieurs régimes), coûts inclus (spread, commissions, financement, slippage).</li>
        <li><strong>Période d'apprentissage :</strong> 60–70 % des données pour ajuster.</li>
        <li><strong>Validation hors échantillon :</strong> 30–40 % jamais utilisés pendant la mise au point.</li>
        <li><strong>Tests de robustesse :</strong> variation des paramètres, sous-périodes, actifs différents, inversion de tendance de marché.</li>
        <li><strong>Paper trading :</strong> 20 à 30 trades en conditions réelles avant tout capital significatif.</li>
      </ol>

      <h3>Métriques à suivre</h3>
      <ul>
        <li><strong>Taux de réussite</strong> (win rate) — à interpréter avec le R moyen.</li>
        <li><strong>Espérance</strong> = (taux de réussite × gain moyen) − (taux d'échec × perte moyenne).</li>
        <li><strong>Profit factor</strong> = gains bruts ÷ pertes brutes (viser &gt; 1,4 hors frais).</li>
        <li><strong>Drawdown maximal</strong> et durée du drawdown (le critère le plus souvent sous-estimé).</li>
        <li><strong>Nombre de trades :</strong> en dessous de 100, la significativité statistique reste faible.</li>
        <li><strong>MAR (rendement ÷ drawdown)</strong> ou ratio de Sharpe pour comparer les variantes.</li>
      </ul>

      <h3>Pièges statistiques classiques</h3>
      <ul>
        <li><strong>Sur-optimisation :</strong> trop de paramètres ajustés au passé.</li>
        <li><strong>Biais de sélection :</strong> tester 50 variantes et ne garder que la meilleure.</li>
        <li><strong>Look-ahead bias :</strong> utiliser une information non disponible au moment de la décision.</li>
        <li><strong>Survivorship bias :</strong> ignorer les actifs disparus ou les composantes d'indice révisées.</li>
        <li><strong>Coûts irréalistes :</strong> négliger le spread réel aux heures de faible liquidité.</li>
      </ul>

      <h3>Robustesse : la vraie validation</h3>
      <ul>
        <li>Les résultats doivent rester acceptables si l'on décale un paramètre de ±20 %.</li>
        <li>Le walk-forward (réoptimisation glissante) estime mieux qu'un backtest unique.</li>
        <li>Tester par sous-périodes pour vérifier la survie aux changements de régime (tendance ↔ range).</li>
        <li>Comparer à une référence simple (buy &amp; hold, moyenne mobile) : sans surperformance, la stratégie n'apporte rien.</li>
      </ul>

      <h3>Checklist avant de passer en réel</h3>
      <ul>
        <li>Règles écrites, sans interprétation possible.</li>
        <li>Coûts inclus et testés en version « dégradée » (spread doublé).</li>
        <li>Hors échantillon positif.</li>
        <li>Drawdown maximal compatible avec la tolérance psychologique.</li>
        <li>Paper trading documenté sur 20–30 trades.</li>
        <li>Mise en réel progressive : fraction de la taille cible (ex. 25 %) pendant un mois.</li>
      </ul>
    `,
  },

  timeframes: {
    title: "Comprendre les unités de temps",
    description: "Analyse multi-UT (top-down) : choix des horizons, cohérence et exemple chiffré.",
    content: `
      <h2>Pourquoi combiner plusieurs unités de temps</h2>
      <p>Une même configuration technique n'a pas la même valeur en M5 et en D1. L'analyse multi-UT consiste à <strong>définir le biais sur une unité supérieure</strong> (HTF), puis à chercher la précision sur une unité intermédiaire (MTF) et le déclencheur sur une unité inférieure (LTF). Objectif : améliorer la précision d'entrée sans dégrader la logique directionnelle.</p>

      <h3>Trio d'unités par style</h3>
      <ul>
        <li><strong>Scalping :</strong> HTF H1 → MTF M15 → LTF M1–M5 ; durée moyenne de 5 à 30 minutes.</li>
        <li><strong>Day trading :</strong> HTF H4/D1 → MTF H1 → LTF M5–M15 ; durée de 1 à 6 heures.</li>
        <li><strong>Swing trading :</strong> HTF D1/W1 → MTF H4 → LTF H1 ; durée de 2 à 10 jours.</li>
      </ul>
      <p>Règle simple : chaque unité du trio doit représenter environ 4 à 6 fois l'unité inférieure.</p>

      <h3>Rôle de chaque unité</h3>
      <ol>
        <li><strong>HTF :</strong> tendance, régimes, zones majeures (support/résistance, liquidité).</li>
        <li><strong>MTF :</strong> structure intermédiaire, zones de confluence, repérage des corrections.</li>
        <li><strong>LTF :</strong> déclencheur d'entrée, placement du stop, gestion fine de la sortie.</li>
      </ol>

      <h3>Exemple chiffré (trade multi-UT EUR/USD)</h3>
      <ul>
        <li><strong>Contexte HTF (D1) :</strong> tendance haussière, support 1,0850, résistance 1,0950 → biais acheteur uniquement.</li>
        <li><strong>MTF (H1) :</strong> correction vers 1,0860–1,0870, confluence avec l'EMA 20 et le support D1 ; RSI vers 42.</li>
        <li><strong>LTF (M15) :</strong> bougie englobante haussière à 09:15 GMT → entrée 1,0865, stop 1,0850 (15 pips), objectifs 1,0895 (2R) puis 1,0920 (3,67R).</li>
        <li><strong>Taille :</strong> compte 20 000 $, risque 1 % = 200 $, valeur du pip 10 $/lot → 200 ÷ (15 × 10) = 1,33 lot.</li>
        <li><strong>Gestion :</strong> clôture de 50 % à T1, stop ramené à breakeven + 10 pips, sortie du reste à T2.</li>
      </ul>

      <h3>Cohérence des unités</h3>
      <ul>
        <li>Ne jamais trader contre le biais HTF : première source de trades à faible probabilité.</li>
        <li>Un long en HTF se prépare sur les replis, un short sur les rebonds.</li>
        <li>Si HTF et MTF se contredisent : rester hors marché ou réduire la taille de moitié.</li>
        <li>Adapter l'objectif à l'unité : viser 3R sur une LTF de scalping n'a pas la même probabilité que sur D1.</li>
      </ul>

      <h3>Erreurs fréquentes</h3>
      <ul>
        <li>Analyser trois unités « pour se rassurer » et finir par justifier n'importe quel trade.</li>
        <li>Prendre un déclencheur LTF sans vérifier la structure MTF (stop trop proche, invalidation immédiate).</li>
        <li>Utiliser un stop calibré pour une autre unité que celle de la décision.</li>
        <li>Changer d'unité en cours de trade pour éviter le stop.</li>
      </ul>
    `,
  },

  "money-management": {
    title: "Bases du money management",
    description:
      "Gestion du risque, dimensionnement des positions, exposition et discipline de capital.",
    content: `
      <h2>Principes et objectifs</h2>
      <p>Le money management ne cherche pas à augmenter le gain par trade, mais à <strong>survivre assez longtemps</strong> pour que l'avantage statistique s'exprime. Deux comptes appliquant la même stratégie avec des règles de risque différentes finissent à des années-lumière l'un de l'autre.</p>

      <h3>Risque par trade et dimensionnement</h3>
      <ul>
        <li>Risque cible : <strong>0,5 à 2 %</strong> du capital par position, selon la qualité du setup et la volatilité.</li>
        <li>Formule : <strong>taille = (capital × risque %) ÷ (distance de stop × valeur du point)</strong>.</li>
        <li>Exemple : compte 10 000 €, risque 1 % (100 €), stop de 25 pips, valeur 10 €/pip → 100 ÷ (25 × 10) = 0,4 lot.</li>
      </ul>
      <p>Le stop se place d'abord (structure, ATR), la taille se calcule ensuite : jamais l'inverse.</p>

      <h3>Volatilité et ajustement</h3>
      <ul>
        <li>Mesurer la volatilité avec l'ATR : un stop trop serré sur un actif volatil augmente artificiellement le risque.</li>
        <li>Réduire la taille lors des annonces majeures (NFP, décisions de taux) ou élargir le stop sans changer le risque.</li>
        <li>Viser un risque exprimé en « unités de volatilité » plutôt qu'en montant fixe.</li>
      </ul>

      <h3>Exposition et corrélations</h3>
      <ul>
        <li>Trois positions longues sur le même panier (USD, indices, crypto) constituent un seul risque démultiplié : plafonner le risque « panier » (ex. 3 %).</li>
        <li>Règle des plafonds : perte journalière maximale (2–3R), perte hebdomadaire maximale (6R) puis pause obligatoire.</li>
        <li>Tenir compte du risque directionnel net (somme des expositions corrélées).</li>
      </ul>

      <h3>Gestion de position</h3>
      <ul>
        <li>Clôtures partielles à 1R et 2R, puis suivi du solde sur structure ou ATR.</li>
        <li>Stop jamais élargi : si le stop devient trop proche, on réduit la taille ou on sort.</li>
        <li>Ramener le stop à breakeven uniquement lorsque le prix a validé un niveau clé, pas par confort.</li>
      </ul>

      <h3>Vol targeting et Kelly fractionnaire</h3>
      <p>Un objectif de volatilité (par exemple 10 % annualisée) permet de faire varier progressivement la taille selon la performance et la volatilité du marché. La formule de Kelly donne la mise théorique optimale ; en pratique on n'en utilise qu'une fraction (¼ à ½) pour éviter les drawdowns extrêmes et les erreurs d'estimation de l'espérance.</p>

      <h3>Revue et journal de risque</h3>
      <ul>
        <li>Suivre l'expectancy, le R moyen, le plus long drawdown et la taille moyenne utilisée.</li>
        <li>Augmenter le risque seulement après 50 trades conformes documentés ; le réduire après deux mois de drawdown.</li>
        <li>Noter chaque écart aux règles : c'est là que se trouve l'essentiel du coût réel.</li>
      </ul>
    `,
  },

  "economic-calendar": {
    title: "Guide du calendrier économique",
    description:
      "Impact des annonces macro, hiérarchie des données et plan de gestion du risque autour des publications.",
    content: `
      <h2>À quoi sert le calendrier économique</h2>
      <p>Les publications macro créent des pics de volatilité qui invalident les configurations techniques classiques. Le calendrier sert à <strong>planifier</strong> : savoir quand prendre du risque, quand le réduire et quand rester hors du marché.</p>

      <h3>Hiérarchie des annonces</h3>
      <ul>
        <li><strong>Très fort impact :</strong> décisions de taux et conférences de presse des banques centrales, inflation (CPI/PCE), emploi américain (NFP), PIB.</li>
        <li><strong>Impact moyen :</strong> ventes au détail, ISM/PMI, confiance des consommateurs, inscriptions au chômage.</li>
        <li><strong>Impact faible :</strong> enquêtes secondaires, discours mineurs, publications régionales.</li>
      </ul>
      <p>Deux éléments comptent davantage que le chiffre : <em>l'écart par rapport aux attentes</em> et <em>la révision des données précédentes</em>.</p>

      <h3>Lecture en trois temps</h3>
      <ol>
        <li><strong>Avant :</strong> noter la valeur attendue, la précédente et le positionnement du marché (consensus déjà intégré ?).</li>
        <li><strong>Pendant :</strong> le premier mouvement est souvent un faux signal (liquidité faible, spreads élargis).</li>
        <li><strong>Après :</strong> le vrai mouvement se construit dans les 15 à 60 minutes suivant la publication, quand les institutionnels se repositionnent.</li>
      </ol>

      <h3>Plan de gestion du risque autour des annonces</h3>
      <ul>
        <li>Réduire la taille de moitié 15 minutes avant l'annonce, ou clôturer les positions les plus exposées.</li>
        <li>Élargir le stop uniquement à risque constant (donc en réduisant la taille).</li>
        <li>Ne pas placer d'ordre au marché dans les 2 premières minutes : spread et slippage explosent.</li>
        <li>Attendre la formation d'un range post-annonce puis trader la cassure confirmée.</li>
        <li>Éviter d'initier une position dans les 30 minutes précédant une décision de banque centrale.</li>
      </ul>

      <h3>Cas pratique</h3>
      <p>Publication du CPI américain à 14:30. Le consensus attend +0,3 %, le chiffre sort à +0,5 % : réaction immédiate à la hausse du dollar, puis retracement de 40 % lorsque le marché intègre la révision à la baisse du mois précédent. Le trader discipliné attend la fin du premier pic, repère le plus haut de réaction comme référence et n'entre qu'après une cassure confirmée avec R:R ≥ 1:2.</p>

      <h3>Erreurs fréquentes</h3>
      <ul>
        <li>Trader l'annonce « au chiffre », sans tenir compte des attentes.</li>
        <li>Garder une position à fort levier pendant une publication majeure.</li>
        <li>Ignorer les révisions de données, souvent à l'origine des retournements.</li>
        <li>Oublier les conférences de presse, dont l'impact dépasse celui du communiqué de taux.</li>
      </ul>
    `,
  },

  "dca-vs-swing": {
    title: "DCA vs Swing Trading",
    description:
      "Comparer l'investissement progressif (DCA) et le swing trading : rendement, risque, temps requis et profils.",
    content: `
      <h2>Deux approches opposées</h2>
      <p>Le <strong>DCA</strong> (dollar cost averaging) consiste à investir des montants réguliers quel que soit le niveau des prix, sur un horizon de plusieurs années. Le <strong>swing trading</strong> cherche à capter des mouvements de quelques jours à quelques semaines en s'appuyant sur l'analyse technique. Les deux peuvent être rentables ; ils n'exigent ni le même temps, ni la même psychologie, ni le même capital.</p>

      <h3>DCA : principes et mise en œuvre</h3>
      <ul>
        <li>Investissement programmé (hebdomadaire ou mensuel) sur des actifs larges : actions, ETF indiciels, bitcoin pour la poche crypto.</li>
        <li>Lissage du prix d'entrée : on achète davantage de parts quand les prix baissent.</li>
        <li>Aucune décision discrétionnaire : le plan est automatique, ce qui élimine le biais émotionnel.</li>
        <li>Horizon de référence : 5 à 10 ans minimum pour absorber les cycles.</li>
        <li>Suivi : uniquement la régularité des versements et le coût total (frais, fiscalité).</li>
      </ul>

      <h3>Swing trading : principes et mise en œuvre</h3>
      <ul>
        <li>Horizon de détention : de 2 jours à quelques semaines, sur unités H4 et D1.</li>
        <li>Décisions basées sur la structure de marché, les niveaux et le momentum.</li>
        <li>Gestion du risque indispensable : 0,5–2 % par position, stop systématique, R:R ≥ 1:2.</li>
        <li>Temps requis : 30 à 60 minutes par jour de préparation et de suivi.</li>
        <li>Suivi : expectancy, R moyen, drawdown, taux de conformité au plan.</li>
      </ul>

      <h3>Comparaison directe</h3>
      <ul>
        <li><strong>Temps :</strong> DCA quasi nul ; swing trading quotidien.</li>
        <li><strong>Risque :</strong> DCA dépend du choix d'actif et de l'horizon ; swing trading dépend du dimensionnement des positions.</li>
        <li><strong>Charge émotionnelle :</strong> faible en DCA (aucune décision à chaud) ; élevée en swing trading.</li>
        <li><strong>Rendement attendu :</strong> proche du marché pour le DCA ; dépend de l'edge pour le swing trading.</li>
        <li><strong>Capital utile :</strong> fractions d'unités possibles en DCA ; les frais pèsent vite en dessous de 2 000–5 000 € pour le swing.</li>
        <li><strong>Fiscalité / frais :</strong> faibles en DCA, récurrents en swing (spread, commissions, financement).</li>
      </ul>

      <h3>Choisir selon son profil</h3>
      <ul>
        <li><strong>Premier investissement, capital limité, temps restreint :</strong> DCA sur ETF, éventuellement avec une poche crypto minoritaire.</li>
        <li><strong>Disponibilité quotidienne, tolérance au risque, intérêt pour l'analyse technique :</strong> swing trading, après une phase de paper trading.</li>
        <li><strong>Profil mixte :</strong> DCA comme socle (80 %) et une poche de trading (10–20 %) pour l'apprentissage et la performance.</li>
      </ul>

      <h3>Combiner les deux intelligemment</h3>
      <ol>
        <li>Définir un socle investi régulièrement, sans y toucher.</li>
        <li>Isoler une poche de trading avec un capital que l'on accepte de risquer.</li>
        <li>Ne jamais financer une position de swing avec le plan DCA (ni l'inverse).</li>
        <li>Mesurer les deux stratégies séparément : une performance consolidée masque souvent une poche destructrice de valeur.</li>
      </ol>

      <h3>Erreurs fréquentes</h3>
      <ul>
        <li>Faire du « swing » sur des positions que l'on voulait garder 10 ans, dès la première baisse.</li>
        <li>Arrêter les versements DCA pendant les corrections : c'est précisément là que la méthode crée de la valeur.</li>
        <li>Sous-capitaliser une stratégie de swing trading, ce qui rend les frais et les erreurs disproportionnés.</li>
        <li>Confondre volatilité et risque : le DCA réduit le risque de timing, pas le risque d'actif.</li>
      </ul>
    `,
  },
};
