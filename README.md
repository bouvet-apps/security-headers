# Security Headers for Enonic XP
Easy to set up and use security headers for Enonic XP.

## How to use
The application is available through [Enonic Market](https://market.enonic.com/vendors/bouvet/no.bouvet.exp.securityheaders).
TODO: Make sure link is ok once submitted to market.

### Install application
Open the Applications section of your Enonic XP installation. Click 'Install', 
and locate the 'Security Headers' app in the 'Enonic Market' tab. Now click the 'Install'
button.

### Apply the application to your site
Edit your site settings by clicking 'edit' on the site node in Content Manager. Select 'Security Headers'
in the 'Applications' search box, and click to select it. It is now added to your site.

## Set up the security headers for your site

All security header options are available through site configuration of this app, or specified through a
configuration file.

#### Configuration file
If you check the 'Use configuration from file [...]' radio button, Security Headers will load its
configuration from a configuration file located in '$XP_HOME/config/no.bouvet.app.security-headers.cfg'
instead of using the options specified in the application's site configuration.

The values for each header will be used exactly as specified in the configuration file. Because of this,
configuration files may require a bit more technical expertise than site configuration does.

You can omit any of the header name-value pairs if you don't want the header in question added to your
site.

Example configuration file:
```
header_strict_transport_security = max-age=31536000; includeSubDomains
header_content_security_policy = default-src 'self' *.trusted.com
header_x_frame_options = DENY
header_x_xss_protection = 1; mode=block
header_x_content_type_options = nosniff
header_referrer_policy = no-referrer
```

#### Site configuration

You can add all the available security headers by pressing the corresponding 'Add &lt;header name&gt;'
button.

##### Strict-Transport-Security
The HTTP Strict-Transport-Security response header (often abbreviated as HSTS)  lets a web site tell browsers that it should only be accessed using HTTPS, instead of using HTTP.

[MDN Documentation for HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)

##### Content-Security-Policy
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware.

[MDN Documentation for CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

##### X-Frame-Options
The X-Frame-Options HTTP response header can be used to indicate whether or not a browser should be allowed to render a page in a &lt;frame&gt;, &lt;iframe&gt; or &lt;object&gt; . Sites can use this to avoid clickjacking attacks, by ensuring that their content is not embedded into other sites.

[MDN Documentation for X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)

##### X-XSS-Protection
The HTTP X-XSS-Protection response header is a feature of Internet Explorer, Chrome and Safari that stops pages from loading when they detect reflected cross-site scripting (XSS) attacks. Although these protections are largely unnecessary in modern browsers when sites implement a strong Content-Security-Policy that disables the use of inline JavaScript ('unsafe-inline'), they can still provide protections for users of older web browsers that don't yet support CSP.

[MDN Documentation for X-XSS-Protection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)

##### X-Content-Type-Options
The X-Content-Type-Options response HTTP header is a marker used by the server to indicate that the MIME types advertised in the Content-Type headers should not be changed and be followed. This allows to opt-out of MIME type sniffing, or, in other words, it is a way to say that the webmasters knew what they were doing.

This header was introduced by Microsoft in IE 8 as a way for webmasters to block content sniffing that was happening and could transform non-executable MIME types into executable MIME types. Since then, other browsers have introduced it, even if their MIME sniffing algorithms were less aggressive.

Site security testers usually expect this header to be set.

[MDN Documentation for X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options)

##### Referrer-Policy
The Referrer-Policy HTTP header governs which referrer information, sent in the Referer header, should be included with requests made.

[MDN Documentation for Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)
        
### Links
[Test your site at securityheaders.io](https://securityheaders.io/)








