/**
 * Contact Center handoff from a sister site (P3b, 30.10.2026).
 *
 * With Analytics consent on a sister site, its "Book on Boat4You" links carry a one-time token `cch` that links the two
 * visits. It must not reach Google Analytics / Ads (page_location), so this head script takes it out of the address
 * bar before the Google tag runs (other parameters, the hash and history.state stay). The token is kept only in page
 * memory (`window.__b4yCcCch`); the Contact Center widget picks it up and stores or sends it only with boat4you's own
 * Analytics consent. A malformed value is dropped.
 */
export const CCH_STRIP_SNIPPET =
  '(function(){try{var u=new URL(location.href),t=u.searchParams.get("cch");if(t===null)return;' +
  'u.searchParams.delete("cch");var q=u.searchParams.toString();' +
  'history.replaceState(history.state,"",u.pathname+(q?"?"+q:"")+u.hash);' +
  'if(/^[A-Za-z0-9_-]{8,100}$/.test(t))window.__b4yCcCch=t}catch(e){}})();';
