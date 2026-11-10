/**
 * Pages whose URL is a secret: the e-mailed review magic link
 * (/review/<token>, also carries ?rating=) and the card payment link printed
 * in contracts (/pay/<key>, its /success?ref= and /failed pages). No
 * analytics, no-store, and the URL never leaves the browser in first-party
 * logs either. public/sw.js keeps its own copy (plain JS, no imports).
 */
export const PRIVATE_LINK_PATH = /^(?:\/[a-z]{2})?\/(?:review|pay)(?:\/|$)/;
