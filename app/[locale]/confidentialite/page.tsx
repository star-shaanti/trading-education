import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { getDict, getLang, localizedAlternates } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = getLang();
  const t = getDict(lang);

  return {
    title: t.footer.privacy,
    description: t.consent.text,
    alternates: localizedAlternates(lang, "/confidentialite"),
  };
}

/** Politique de confidentialité (RGPD) — aucune donnée bancaire collectée. */
export default function ConfidentialitePage() {
  return (
    <Section
      title="Politique de confidentialité"
      subtitle="Dernière mise à jour : septembre 2026"
    >
      <div className="prose-custom mx-auto max-w-3xl">
        <h2>1. Responsable du traitement</h2>
        <p>
          Trading Education (tradingeducationpro.com) est responsable du traitement des données
          personnelles collectées sur ce site. Contact : support@tradingeducationpro.com.
        </p>

        <h2>2. Données collectées</h2>
        <ul>
          <li>
            <strong>Compte membre (facultatif)</strong> : adresse email, prénom/pseudo (optionnel),
            mot de passe stocké sous forme de hachage bcrypt (jamais en clair), date d&apos;inscription
            et date de dernière connexion.
          </li>
          <li>
            <strong>Newsletter</strong> : adresse email, prénom (optionnel), source d&apos;inscription,
            date de consentement et de confirmation (double opt-in).
          </li>
          <li>
            <strong>Webinaires</strong> : email, prénom (optionnel), statut d&apos;inscription.
          </li>
          <li>
            <strong>Commentaires</strong> : contenu du commentaire (modéré avant publication).
          </li>
          <li>
            <strong>Mesure d&apos;audience</strong> : pages consultées, type d&apos;événement
            (vue, téléchargement, inscription), identifiant de session anonyme, adresse IP{" "}
            <em>hachée avec un sel</em> (jamais conservée en clair), agent utilisateur et référent.
          </li>
        </ul>
        <p>
          <strong>Aucune donnée bancaire n&apos;est collectée</strong> : le site ne propose ni
          paiement, ni abonnement, ni niveau premium.
        </p>

        <h2>3. Finalités et bases légales</h2>
        <ul>
          <li>Fourniture du service (compte, webinaires, commentaires) : exécution du contrat.</li>
          <li>Envoi de la newsletter et des alertes : consentement (opt-in) révocable à tout moment.</li>
          <li>Mesure d&apos;audience interne : consentement (bannière cookies) ou intérêt légitime.</li>
          <li>Sécurité (limitation de débit, prévention des abus) : intérêt légitime.</li>
        </ul>

        <h2>4. Durées de conservation</h2>
        <ul>
          <li>Compte membre : jusqu&apos;à suppression par l&apos;utilisateur (disponible dans l&apos;espace membre).</li>
          <li>Abonnement email : jusqu&apos;à désinscription, puis suppression ou anonymisation sous 30 jours.</li>
          <li>Statistiques agrégées : 25 mois maximum.</li>
          <li>Journaux d&apos;envoi d&apos;emails : 13 mois.</li>
        </ul>

        <h2>5. Destinataires</h2>
        <p>
          Les données ne sont jamais vendues. Elles sont traitées par nos sous-traitants :
          hébergeur (Coolify / serveur dédié), base de données PostgreSQL, fournisseur
          d&apos;envoi d&apos;emails (Resend) et régie publicitaire (Google AdSense) pour les
          emplacements publicitaires lorsque ceux-ci sont activés.
        </p>

        <h2>6. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
          d&apos;effacement, de limitation, d&apos;opposition et de portabilité.
        </p>
        <ul>
          <li>
            <strong>Export de vos données</strong> : dans l&apos;espace membre → « Exporter mes
            données (JSON) ».
          </li>
          <li>
            <strong>Suppression du compte</strong> : dans l&apos;espace membre → « Supprimer mon
            compte » (effective immédiatement).
          </li>
          <li>
            <strong>Désinscription email</strong> : lien présent dans chaque email ou page
            « Désinscription ».
          </li>
          <li>
            <strong>Réclamation</strong> : vous pouvez saisir la CNIL (cnil.fr).
          </li>
        </ul>

        <h2>7. Cookies</h2>
        <ul>
          <li>
            <strong>Essentiels</strong> : session d&apos;authentification (NextAuth) et
            mémorisation du choix de consentement.
          </li>
          <li>
            <strong>Mesure d&apos;audience</strong> (activée uniquement après consentement) :
            identifiant de session anonyme de 24 h.
          </li>
          <li>
            <strong>Publicité</strong> : lorsque AdSense est actif, Google peut déposer ses propres
            cookies selon sa politique (policies.google.com/technologies/ads).
          </li>
        </ul>

        <h2>8. Sécurité</h2>
        <ul>
          <li>Mots de passe hachés (bcrypt), sessions signées, HTTPS obligatoire.</li>
          <li>Contrôle d&apos;accès par rôle (visiteur, membre, administrateur).</li>
          <li>Limitation de débit sur les formulaires sensibles ; IP hachées dans les statistiques.</li>
          <li>Sauvegardes chiffrées de la base de données.</li>
        </ul>

        <h2>9. Modifications</h2>
        <p>
          Cette politique peut être mise à jour ; la date de révision figure en haut de page. En cas
          de changement substantiel, une information est envoyée par email aux membres inscrits.
        </p>
      </div>
    </Section>
  );
}
