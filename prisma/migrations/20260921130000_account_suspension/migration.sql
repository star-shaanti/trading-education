-- Suspension de compte : mise en pause réversible (aucune donnée supprimée).
-- Le compte est réactivé automatiquement lors de la prochaine connexion.
ALTER TABLE "User" ADD COLUMN "suspendedAt" TIMESTAMP(3);
