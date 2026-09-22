/**
 * Type du dictionnaire d'interface (8 langues).
 * Toute clé ajoutée ici doit être renseignée dans chaque langue :
 * le typage TypeScript garantit qu'aucune traduction n'est oubliée.
 */

export type HomeCardText = { title: string; description: string };

export type Dict = {
  nav: {
    analyses: string;
    reports: string;
    webinars: string;
    member: string;
    admin: string;
    login: string;
    register: string;
    logout: string;
  };
  /** Libellés du menu principal (Header / Nav). */
  navLinks: {
    home: string;
    analyses: string;
    reports: string;
    webinars: string;
    guides: string;
    tools: string;
    recap: string;
    resources: string;
    about: string;
  };
  /** Bandeau d'accueil + pied de page du site. */
  hero: {
    title1: string;
    title2: string;
    subtitle: string;
  };
  footer: {
    description: string;
    navigation: string;
    resourcesTitle: string;
    legal: string;
    home: string;
    analyses: string;
    reports: string;
    webinars: string;
    guides: string;
    tools: string;
    signalsRecap: string;
    resources: string;
    aboutUs: string;
    memberArea: string;
    support: string;
    legalNotice: string;
    privacy: string;
    privacyCookies: string;
    disclaimer: string;
    rights: string;
  };
  /** Bannière de consentement cookies. */
  consent: {
    text: string;
    accept: string;
    essential: string;
    more: string;
  };
  /** Page d'accueil (sections et cartes). */
  home: {
    statsTagline: string;
    statsAnalyses: string;
    statsGuides: string;
    statsReports: string;
    statsWebinars: string;
    statsTools: string;
    statsAccountCta: string;
    platformEyebrow: string;
    platformTitle: string;
    platformSubtitle: string;
    liveEyebrow: string;
    liveTitle: string;
    liveSubtitle: string;
    liveCardTitle: string;
    liveCardText1: string;
    liveCardText2: string;
    chartCard: string;
    screenerCard: string;
    heatmapCard: string;
    toolsEyebrow: string;
    toolsTitle: string;
    toolsSubtitle: string;
    toolsAll: string;
    guidesEyebrow: string;
    guidesTitle: string;
    guidesSubtitle: string;
    guidesAll: string;
    partnersEyebrow: string;
    partnersTitle: string;
    partnersSubtitle: string;
    partnersAll: string;
    partnerBadge: string;
    partnerDisclaimer: string;
    trustEyebrow: string;
    trustTitle: string;
    trustSubtitle: string;
    ctaTitle: string;
    ctaText: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaNewsletter: string;
    publicationsEyebrow: string;
    publicationsTitle: string;
    publicationsSubtitle: string;
    guideListTitle: string;
    guideListAll: string;
    featureCta: string;
    openTool: string;
    readGuide: string;
    learnMore: string;
    /** Cartes : rubriques, outils, guides, transparence (titres + descriptions). */
    features: HomeCardText[];
    tools: HomeCardText[];
    guides: HomeCardText[];
    trust: HomeCardText[];
  };
  common: {
    readMore: string;
    back: string;
    close: string;
    download: string;
    allCategories: string;
    search: string;
    searchPlaceholder: string;
    noResults: string;
    publishedOn: string;
    by: string;
    tags: string;
    relatedContent: string;
    backToList: string;
    previous: string;
    next: string;
    page: string;
    results: string;
    free: string;
    category: string;
    filter: string;
  };
  report: {
    latest: string;
    downloadPdf: string;
    downloads: string;
    period: string;
    fileSize: string;
    hint: string;
    thankYou: string;
  };
  webinar: {
    upcoming: string;
    past: string;
    replay: string;
    register: string;
    registered: string;
    startsAt: string;
    timezone: string;
    capacity: string;
    confirmationSent: string;
    noUpcoming: string;
    noPast: string;
    freeAccess: string;
  };
  article: {
    readingTime: string;
    comments: string;
    commentPlaceholder: string;
    submitComment: string;
    commentPending: string;
    commentLogin: string;
    noComments: string;
  };
  newsletter: {
    title: string;
    subtitle: string;
    emailLabel: string;
    nameLabel: string;
    consent: string;
    submit: string;
    success: string;
    already: string;
    unsubscribe: string;
    unsubscribeSuccess: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    forgotTitle: string;
    resetTitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    signIn: string;
    signUp: string;
    sendLink: string;
    newPassword: string;
    noAccount: string;
    hasAccount: string;
    forgotLink: string;
    invalidCredentials: string;
    registerSuccess: string;
    welcome: string;
    termsConsent: string;
    newsletterOptIn: string;
    forgotSent: string;
    showPassword: string;
    hidePassword: string;
    /** Message affiché quand le serveur répond une erreur non métier ({status} = code HTTP). */
    serverError: string;
  };
  member: {
    title: string;
    dashboard: string;
    downloads: string;
    webinars: string;
    preferences: string;
    upcomingWebinars: string;
    downloadHistory: string;
    noDownloads: string;
    noWebinars: string;
    emailPrefs: string;
    newsletterOptIn: string;
    reportsOptIn: string;
    webinarsOptIn: string;
    save: string;
    saved: string;
    exportData: string;
    deleteAccount: string;
    deleteWarning: string;
    dangerZone: string;
    memberSince: string;
    settings: string;
    suspendAccount: string;
    suspendWarning: string;
  };
  /** Confirmations des actions sensibles (déconnexion, suspension, suppression). */
  confirm: {
    accept: string;
    cancel: string;
    logoutTitle: string;
    logoutText: string;
    suspendTitle: string;
    deleteTitle: string;
  };
  errors: {
    generic: string;
    unauthorized: string;
    notFound: string;
    rateLimited: string;
    invalidInput: string;
  };
  /** Titres et accroches des pages listes et de la newsletter. */
  pages: {
    analysesTitle: string;
    analysesSubtitle: string;
    reportsTitle: string;
    reportsSubtitle: string;
    webinarsTitle: string;
    webinarsSubtitle: string;
    confirmationTitle: string;
    confirmationOk: string;
    confirmationInvalid: string;
    unsubscribeSubtitle: string;
    unsubscribeHint: string;
    backHome: string;
  };
  /** Sélecteur de thème (clair / sombre / système). */
  theme: {
    label: string;
    light: string;
    dark: string;
    system: string;
  };
};
