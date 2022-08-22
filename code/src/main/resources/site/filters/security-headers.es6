const libs = {
  portal: require("/lib/xp/portal"),
  util: require("/lib/project-util")
};

exports.responseFilter = (req, res) => {
  // Do not apply security headers when in live edit.
  if (req.mode === "edit") return res;

  const headers = res.headers;
  const siteConfig = libs.portal.getSiteConfig();

  if (siteConfig && siteConfig.useConfigFile === true) {
    /* eslint-disable no-multi-spaces */
    if (app.config.header_strict_transport_security)    headers["Strict-Transport-Security"]    = app.config.header_strict_transport_security;
    if (app.config.header_content_security_policy)      headers["Content-Security-Policy"]      = app.config.header_content_security_policy;
    if (app.config.header_x_frame_options)              headers["X-Frame-Options"]              = app.config.header_x_frame_options;
    if (app.config.header_x_xss_protection)             headers["X-XSS-Protection"]             = app.config.header_x_xss_protection;
    if (app.config.header_x_content_type_options)       headers["X-Content-Type-Options"]       = app.config.header_x_content_type_options;
    if (app.config.header_referrer_policy)              headers["Referrer-Policy"]              = app.config.header_referrer_policy;
    /* eslint-enable no-multi-spaces */
  } else {
    if (siteConfig.strictTransportSecurity) {
      let h = `max-age=${siteConfig.strictTransportSecurity.maxAge}`;

      if (siteConfig.strictTransportSecurity.includeSubdomains) h += "; includeSubDomains";
      if (siteConfig.strictTransportSecurity.preload) h += "; preload";

      headers["Strict-Transport-Security"] = h;
    }

    if (siteConfig.contentSecurityPolicy
      && (siteConfig.contentSecurityPolicy.commonDirectives?._selected || (siteConfig.contentSecurityPolicy.extraDirectives))
    ) {
      let h = "";
      const selectedCommonDirectives = libs.util.forceArray(siteConfig.contentSecurityPolicy.commonDirectives._selected);
      if (selectedCommonDirectives.length > 0) {
        selectedCommonDirectives.forEach((selectedCommonDirective) => {
          if (siteConfig.contentSecurityPolicy.commonDirectives[selectedCommonDirective]?.directiveValues) {
            h += `${selectedCommonDirective} ${siteConfig.contentSecurityPolicy.commonDirectives[selectedCommonDirective].directiveValues};`;
          }
        });
      }

      const extraDirectives = libs.util.forceArray(siteConfig.contentSecurityPolicy.extraDirectives);
      if (extraDirectives.length > 0) {
        extraDirectives.forEach((extraDirective) => {
          if (extraDirective.directiveName && extraDirective.directiveValues) {
            h += `${extraDirective.directiveName} ${extraDirective.directiveValues};`;
          }
        });
      }

      if (h.length > 0) {
        headers["Content-Security-Policy"] = h;
      }
    }

    if (siteConfig.xFrameOptions) {
      let h = "";
      switch (siteConfig.xFrameOptions._selected) {
        case "deny":
          h = "DENY";
          break;
        case "sameorigin":
          h = "SAMEORIGIN";
          break;
        case "allowFrom":
          h = `ALLOW-FROM ${siteConfig.xFrameOptions.allowFrom.uri}`;
          break;
        default:
      }
      headers["X-Frame-Options"] = h;
    }

    if (siteConfig.xXssProtection) {
      let h = "";
      switch (siteConfig.xXssProtection._selected) {
        case "xss_0":
          h = "0";
          break;
        case "xss_1":
          h = "1";
          break;
        case "xss_1_block":
          h = "1; mode=block";
          break;
        case "xss_1_report":
          h = `1; report=${siteConfig.xXssProtection.xss_1_report.url}`;
          break;
        default:
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
