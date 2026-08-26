# Security Hardening Verification

The public capture routes now enforce a per-process rate limit of **12 submissions per client in 10 minutes**. Community image submissions are restricted server-side to JPEG, PNG, or WebP, with matching data-URL MIME type, verified file signatures, decoded dimensions no larger than 4096 pixels per side, a 2 MB binary cap, and a simple filename policy. The server body limit is 3 MB for JSON and 32 KB for URL-encoded payloads.

The public storage redirect now rejects traversal and invalid storage keys, and sends private no-store plus MIME-sniffing protection. Production responses were checked with a temporary production-mode instance and returned Content Security Policy, HSTS under HTTPS, anti-framing, no-sniff, no-referrer, disabled camera/microphone/geolocation/payment/USB permissions, and cross-origin isolation headers.

This reduces practical abuse risk but does not guarantee immunity from every future vulnerability. Managed infrastructure, dependency updates, and platform-level protections remain outside application code and should be reviewed regularly.
