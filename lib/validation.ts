import { z } from "zod";

/** Validation partagée entre les formulaires (client) et les routes API. */

const email = z.string().trim().toLowerCase().email("Email invalide").max(200);

export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .max(100)
  .regex(/[A-Za-z]/, "Le mot de passe doit contenir au moins une lettre")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre");

export const registerSchema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal("")),
  email,
  password: passwordSchema,
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions d'utilisation" }),
  }),
  newsletterOptIn: z.boolean().optional().default(true),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Mot de passe requis").max(100),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({
  token: z.string().min(10).max(200),
  password: passwordSchema,
});

export const subscriberSchema = z.object({
  email,
  name: z.string().trim().max(80).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consentement requis (RGPD)" }),
  }),
  source: z.string().trim().max(40).optional().default("site"),
});

export const unsubscribeSchema = z.object({
  token: z.string().min(6).max(200).optional(),
  email: email.optional(),
});

export const commentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(5, "Commentaire trop court")
    .max(2000, "Commentaire trop long (2000 caractères max)"),
});

export const webinarRegistrationSchema = z.object({
  email: email.optional(),
  name: z.string().trim().max(80).optional().or(z.literal("")),
});

export const memberPreferencesSchema = z.object({
  newsletterOptIn: z.boolean(),
  reportsOptIn: z.boolean(),
  webinarsOptIn: z.boolean(),
});

export const downloadReportSchema = z.object({
  email: email.optional(),
  subscribe: z.boolean().optional().default(false),
});

export const analyticsEventSchema = z.object({
  type: z.enum(["PAGE_VIEW", "ARTICLE_VIEW", "REPORT_VIEW", "WEBINAR_VIEW"]),
  path: z.string().max(300).optional(),
  entityType: z.enum(["article", "report", "webinar"]).optional(),
  entitySlug: z.string().max(200).optional(),
  referrer: z.string().max(300).optional(),
});

// --------------------------- Administration --------------------------------

const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (minuscules et tirets)")
  .max(120);

const tags = z.array(z.string().trim().min(2).max(40)).max(10).optional().default([]);
const optionalText = (max = 500) => z.string().trim().max(max).optional().or(z.literal(""));

export const articleInputSchema = z.object({
  id: z.string().optional(),
  slug,
  title: z.string().trim().min(3).max(200),
  titleFr: optionalText(200),
  excerpt: z.string().trim().min(10).max(500),
  excerptFr: optionalText(500),
  contentHtml: z.string().trim().min(10),
  contentHtmlFr: z.string().trim().optional().or(z.literal("")),
  coverImage: optionalText(500),
  seoTitle: optionalText(200),
  seoDescription: optionalText(300),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.coerce.boolean().optional().default(false),
  readingMinutes: z.coerce.number().int().min(1).max(120).optional().default(6),
  categoryId: optionalText(60),
  tags,
});

export const reportInputSchema = z.object({
  id: z.string().optional(),
  slug,
  title: z.string().trim().min(3).max(200),
  titleFr: optionalText(200),
  summary: z.string().trim().min(10).max(1000),
  summaryFr: optionalText(1000),
  fileUrl: z.string().trim().min(3).max(500),
  fileName: optionalText(200),
  fileSizeBytes: z.coerce.number().int().nonnegative().optional(),
  periodLabel: optionalText(80),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.coerce.boolean().optional().default(false),
  categoryId: optionalText(60),
  tags,
});

export const webinarInputSchema = z.object({
  id: z.string().optional(),
  slug,
  title: z.string().trim().min(3).max(200),
  titleFr: optionalText(200),
  description: z.string().trim().min(10),
  descriptionFr: z.string().trim().optional().or(z.literal("")),
  platform: z.enum(["zoom", "meet", "youtube", "other"]).default("zoom"),
  startsAt: z.string().min(10, "Date de début requise"),
  endsAt: optionalText(40),
  joinUrl: optionalText(500),
  replayUrl: optionalText(500),
  coverImage: optionalText(500),
  capacity: z.coerce.number().int().positive().optional(),
  status: z.enum(["SCHEDULED", "LIVE", "ENDED", "CANCELED"]),
  publish: z.coerce.boolean().optional().default(true),
  categoryId: optionalText(60),
  tags,
});

export const campaignInputSchema = z.object({
  subject: z.string().trim().min(3).max(200),
  bodyHtml: z.string().trim().min(10),
  audience: z
    .string()
    .trim()
    .regex(/^(subscribers|members|downloaders|webinar:[a-z0-9-]+)$/, "Audience invalide"),
});

export const testEmailSchema = z.object({
  subject: z.string().trim().min(3).max(200),
  bodyHtml: z.string().trim().min(10),
  testEmail: email,
});

export const moderationSchema = z.object({
  commentId: z.string().min(5),
  status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
export type ReportInput = z.infer<typeof reportInputSchema>;
export type WebinarInput = z.infer<typeof webinarInputSchema>;
