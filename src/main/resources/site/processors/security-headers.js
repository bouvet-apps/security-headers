var portalLib = require('/lib/xp/portal');
var utilLib = require('/lib/project-util');

exports.responseProcessor = function (req, res) {
    // Do not apply security headers when in live edit.
    if (req.mode === 'edit') return res;

    var headers = res.headers;
    var siteConfig = portalLib.getSiteConfig();

    if (siteConfig && siteConfig.useConfigFile === true) {
        if (app.config.header_strict_transport_security)    headers["Strict-Transport-Security"]    = app.config.header_strict_transport_security;
        if (app.config.header_content_security_policy)      headers["Content-Security-Policy"]      = app.config.header_content_security_policy;
        if (app.config.header_x_frame_options)              headers["X-Frame-Options"]              = app.config.header_x_frame_options;
        if (app.config.header_x_xss_protection)             headers["X-XSS-Protection"]             = app.config.header_x_xss_protection;
        if (app.config.header_x_content_type_options)       headers["X-Content-Type-Options"]       = app.config.header_x_content_type_options;
        if (app.config.header_referrer_policy)              headers["Referrer-Policy"]              = app.config.header_referrer_policy;
        if (app.config.header_permission_policy)            headers["Permission-Policy"]            = app.config.header_permission_policy;
    } else {
        if (siteConfig.strictTransportSecurity) {
            var h = "max-age=" + siteConfig.strictTransportSecurity.maxAge;

            if (siteConfig.strictTransportSecurity.includeSubdomains) h += '; includeSubDomains';
            if (siteConfig.strictTransportSecurity.preload) h += '; preload';

            headers["Strict-Transport-Security"] = h;
        }

        if (siteConfig.contentSecurityPolicy
          && ((siteConfig.contentSecurityPolicy.commonDirectives && siteConfig.contentSecurityPolicy.commonDirectives._selected)
          || (siteConfig.contentSecurityPolicy.extraDirectives))
        ) {
            var h = '';
            var selectedCommonDirectives = utilLib.forceArray(siteConfig.contentSecurityPolicy.commonDirectives._selected);
            if (selectedCommonDirectives.length > 0) {
                selectedCommonDirectives.forEach(function (selectedCommonDirective) {
                    if (siteConfig.contentSecurityPolicy.commonDirectives[selectedCommonDirective] && siteConfig.contentSecurityPolicy.commonDirectives[selectedCommonDirective].directiveValues) {
                        h += `${selectedCommonDirective} ${siteConfig.contentSecurityPolicy.commonDirectives[selectedCommonDirective].directiveValues};`;
                    }
                });
            }

            var extraDirectives = utilLib.forceArray(siteConfig.contentSecurityPolicy.extraDirectives);
            if (extraDirectives.length > 0) {
                extraDirectives.forEach(function (extraDirective) {
                    if (extraDirective.directiveName && extraDirective.directiveValues){
                        h += `${extraDirective.directiveName} ${extraDirective.directiveValues};`;
                    }
                })
            }

            if (h.length > 0) {
                headers["Content-Security-Policy"] = h;
            }
        }

        if (siteConfig.xFrameOptions) {
            var h;
            switch (siteConfig.xFrameOptions._selected) {
                case 'deny':
                    h = 'DENY';
                    break;
                case 'sameorigin':
                    h = 'SAMEORIGIN';
                    break;
                case 'allowFrom':
                    h = "ALLOW-FROM " + siteConfig.xFrameOptions.allowFrom.uri;
                    break;
            }
            headers["X-Frame-Options"] = h;
        }

        if (siteConfig.xXssProtection) {
            var h;
            switch (siteConfig.xXssProtection._selected) {
                case 'xss_0':
                    h = '0';
                    break;
                case 'xss_1':
                    h = '1';
                    break;
                case 'xss_1_block':
                    h = '1; mode=block';
                    break;
                case 'xss_1_report':
                    h = '1; report=' + siteConfig.xXssProtection.xss_1_report.url;
                    break;
            }
            headers["X-XSS-Protection"] = h;
        }

        if (siteConfig.xContentTypeOptions.value) {
            headers["X-Content-Type-Options"] = siteConfig.xContentTypeOptions.value;
        }

        if (siteConfig.referrerPolicy) {
            headers["Referrer-Policy"] = siteConfig.referrerPolicy.referrerPolicy;
        }

        if (siteConfig.permissionsPolicy.policy) {
            headers["Permissions-Policy"] = siteConfig.permissionsPolicy.policy;
        }
    }

    res.headers = headers;

    return res;
};
