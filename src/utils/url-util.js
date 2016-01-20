/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-10-14
 */

import {isString} from './object-util';
/**
 * url parser
 * @see https://github.com/angular/angular.js/blob/master/src%2Fng%2FurlUtils.js
 */
let msie = document.documentMode;
let urlParsingNode = document.createElement('a');
let originUrl = urlResolve(window.location.href);

export function urlResolve(url) {

	let href = url;

	if (msie) {
		// Normalize before parse.  Refer Implementation Notes on why this is
		// done in two steps on IE.
		urlParsingNode.setAttribute('href', href);
		href = urlParsingNode.href;
	}

	urlParsingNode.setAttribute('href', href);

	// urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	return {
		href: urlParsingNode.href,
		protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
		host: urlParsingNode.host,
		search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
		hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
		hostname: urlParsingNode.hostname,
		port: urlParsingNode.port,
		pathname: (urlParsingNode.pathname.charAt(0) === '/')
			? urlParsingNode.pathname
			: '/' + urlParsingNode.pathname
	};
}

export function urlIsSameOrigin(requestUrl) {
	let parsed = (isString(requestUrl)) ? urlResolve(requestUrl) : requestUrl;
	return (parsed.protocol === originUrl.protocol &&
	parsed.host === originUrl.host);
}

/**
 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set
 * (pchar) allowed in path segments:
 *    segment       = *pchar
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
export function encodeUriSegment(val) {
	return encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
}

/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 * encoded per http://tools.ietf.org/html/rfc3986:
 *    query       = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
export function encodeUriQuery(val, pctEncodeSpaces) {
	return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}
