/**
 * Rendu d'un bloc JSON-LD (schema.org) dans le HTML serveur.
 * Composant serveur pur : aucune interactivité, aucun JavaScript envoyé au client.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
