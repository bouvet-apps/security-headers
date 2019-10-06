var portalLib = require('/lib/xp/portal');

exports.responseProcessor = function (req, res) {
    // Do not apply security headers when in live edit.
    if (req.mode == 'edit' || req.mode == 'preview') return res;

    var headers = res.headers;
    var siteConfig = portalLib.getSiteConfig();

    if (siteConfig && siteConfig.useConfigFile == true) {
        if (app.config.header_strict_transport_security)    headers["Strict-Transport-Security"]    = app.config.header_strict_transport_security;
        if (app.config.header_content_security_policy)      headers["Content-Security-Policy"]      = app.config.header_content_security_policy;
        if (app.config.header_x_frame_options)              headers["X-Frame-Options"]              = app.config.header_x_frame_options;
        if (app.config.header_x_xss_protection)             headers["X-XSS-Protection"]             = app.config.header_x_xss_protection;
        if (app.config.header_x_content_type_options)       headers["X-Content-Type-Options"]       = app.config.header_x_content_type_options;
        if (app.config.header_referrer_policy)              headers["Referrer-Policy"]              = app.config.header_referrer_policy;
    } else {
        if (siteConfig.strictTransportSecurity) {
            var h = "max-age=" + siteConfig.strictTransportSecurity.maxAge;

            if (siteConfig.strictTransportSecurity.includeSubdomains) h += '; includeSubDomains';
            if (siteConfig.strictTransportSecurity.preload) h += '; preload';

            headers["Strict-Transport-Security"] = h;
        }

        if (siteConfig.contentSecurityPolicy) {
            headers["Content-Security-Policy"] = siteConfig.contentSecurityPolicy.policy;
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

        if (siteConfig.xContentTypeOptions) {
            headers["X-Content-Type-Options"] = siteConfig.xContentTypeOptions.value;
        }

        if (siteConfig.referrerPolicy) {
            headers["Referrer-Policy"] = siteConfig.referrerPolicy.referrerPolicy;
        }
    }

    res.headers = headers;

    return res;
};
