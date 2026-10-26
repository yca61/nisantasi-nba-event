# Go-Live Security Checklist

## Current state

The HTML files include a restrictive Content Security Policy and a strict referrer policy. These meta policies are a browser-side baseline, not a replacement for HTTP response headers.

The application form is still a client-side preview. It validates values in the browser and displays a success animation, but does not send or save an application. The SQLite database under `database/` contains synthetic test data only.

## Required before collecting real applications

- Connect the form to a server-side API. Validate every field again on the server and use parameterized SQL statements.
- Treat T.C. identity numbers as highly sensitive personal data: collect them only after legal approval, never log them, restrict staff access, encrypt them at rest and in transit, and define a short retention/deletion period.
- Have the organization/legal team review the participation and liability declaration before using it to collect consent.
- Add server-side rate limiting, request-size limits, origin/CSRF protection, secure error handling, and appropriate retention/deletion rules.
- Keep the SQLite database, CSV export, seed data, and SQL tests outside the public web root. Do not deploy the `database/` directory or `database/applications.csv`.
- Obtain and configure the hosting platform's HTTP headers. At minimum, use `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`, and a response-header CSP with `frame-ancestors 'none'`. The CSP meta tag cannot set `frame-ancestors`.
- Serve the site only over HTTPS. Enable HSTS only after HTTPS is working for the production hostname; add `includeSubDomains` only if every subdomain is HTTPS-ready.
- Confirm the KVKK notice, privacy/retention policy, consent behavior, and contact details with the organization before collecting personal data.
- Configure the hosting provider to serve `404.html` for missing routes.

## Deployment-specific setup

The hosting provider is not identified in this workspace, so provider-specific header and private-database rules cannot be safely installed here. Configure them at the selected host and verify that direct requests to `/database/test.db`, `/database/applications.csv`, and `/database/` are denied before launch.
