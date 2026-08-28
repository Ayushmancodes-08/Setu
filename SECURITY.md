# SETU --- SECURITY.md

> **Purpose:** Security and privacy instructions for the Antigravity AI
> coding agent.
>
> **Project:** Setu --- Rural Healthcare Access & Coordination Platform\
> **Problem Statement:** PS:26133 --- Govt of Maharashtra
>
> **CRITICAL:** Setu handles healthcare and identity-related
> information. Security is a core product requirement, not a later
> hardening phase.

------------------------------------------------------------------------

# 1. READ FIRST

Before changing authentication, authorization, APIs, database models,
storage, patient data, file uploads, offline sync, notifications, or
privileged dashboards:

1.  Read `MEMORY.md`.
2.  Read `DESIGN.md`.
3.  Inspect the existing security/auth architecture.
4.  Preserve the existing security model.
5.  Never weaken authorization merely to make a UI work.
6.  Never put secrets, credentials, tokens, private keys, or sensitive
    patient information into source code.
7.  Never trust the browser to enforce permissions.
8.  Never expose more data than the current role and scope require.

Security decisions must be implemented **server-side**, even when the UI
also hides unauthorized actions.

------------------------------------------------------------------------

# 2. SECURITY NORTH STAR

Setu must follow:

> **Least privilege + Zero trust between client and server + Defense in
> depth + Auditability + Privacy by design**

Every request should conceptually answer:

``` text
WHO is making the request?
        ↓
Is the identity authenticated?
        ↓
WHAT role(s) does the user have?
        ↓
WHAT scope do they have?
        ↓
WHAT resource are they accessing?
        ↓
WHAT action are they attempting?
        ↓
Is that action permitted?
        ↓
Is the operation auditable?
```

Do not use role alone as the authorization decision.

Correct:

``` text
User
+
Role
+
Scope
+
Resource ownership/relationship
+
Action
```

------------------------------------------------------------------------

# 3. THREAT MODEL

Assume attackers may attempt:

-   stolen credentials,
-   OTP abuse,
-   session theft,
-   IDOR/BOLA,
-   privilege escalation,
-   forged role claims,
-   unauthorized API calls,
-   manipulated request bodies,
-   malicious file uploads,
-   XSS,
-   CSRF where applicable,
-   SQL injection,
-   brute force,
-   account enumeration,
-   replay attacks,
-   duplicate offline mutations,
-   malicious local-device access,
-   notification abuse,
-   unauthorized data exports,
-   excessive API scraping,
-   compromised staff accounts,
-   tampered client-side JavaScript.

Never assume:

> "Users will only use our UI."

Attackers can call APIs directly.

------------------------------------------------------------------------

# 4. AUTHENTICATION

## 4.1 Patient

Preferred flow:

``` text
Mobile Number
      ↓
OTP Request
      ↓
Rate Limit
      ↓
OTP Verification
      ↓
Authenticated Session
```

Signup should collect only necessary information.

Do not expose whether arbitrary phone numbers belong to a patient
account unless the product explicitly requires a safe recovery flow.

------------------------------------------------------------------------

## 4.2 Professional Users

Professional roles include:

-   ASHA
-   CHO/MO
-   Doctor
-   Specialist
-   Pharmacist/Chemist
-   Lab Technician
-   Facility Owner/Coordinator
-   DHO
-   other authorized roles

Professional authentication should require identity plus appropriate
verification.

Conceptually:

``` text
Mobile / Identity
       +
Professional / Employee Identifier
       ↓
OTP / Authentication
       ↓
Credential Verification
       ↓
Role Assignment
       ↓
Scope Assignment
       ↓
Access
```

Do not allow users to type:

``` text
role = "DHO"
```

and receive DHO privileges.

------------------------------------------------------------------------

# 5. PROFESSIONAL VERIFICATION

Professional accounts must have an explicit verification lifecycle.

``` text
UNVERIFIED
    ↓
APPLICATION / REVIEW
    ↓
UNDER_REVIEW
    ↓
APPROVED
    ↓
ACTIVE
```

Possible terminal states:

``` text
REJECTED
SUSPENDED
REVOKED
```

A professional must not gain privileged access merely because
registration succeeded.

Verification must be performed by an authorized process.

Do not assume a specific external government/professional registry or
API until officially confirmed.

------------------------------------------------------------------------

# 6. RBAC + SCOPE AUTHORIZATION

Setu uses:

> **Role-Based Access Control + Scope-Based Authorization**

Examples:

### DHO

May have:

``` text
VIEW district facilities
VIEW district analytics
VIEW aggregate health indicators
MANAGE authorized district resources
ISSUE authorized instructions
ESCALATE issues
```

But this does NOT automatically mean:

``` text
VIEW every patient's complete medical history
```

------------------------------------------------------------------------

### Facility Owner

Scope:

``` text
Assigned facility
```

Can manage authorized:

-   facility information,
-   capacity,
-   staff,
-   services,
-   operational resources.

Cannot automatically modify government-wide records.

------------------------------------------------------------------------

### ASHA

Scope:

``` text
Assigned villages / households / patients
```

Do not expose unrelated patient populations.

------------------------------------------------------------------------

### Patient

Scope:

``` text
Own authorized data
```

A patient must never be able to change another user's record by
modifying an ID in the request.

------------------------------------------------------------------------

# 7. SERVER-SIDE AUTHORIZATION

Every protected server operation must verify:

``` text
authentication
+
authorization
+
resource scope
```

Bad:

``` ts
if (session.user.role === "DOCTOR") {
  return patient;
}
```

Better conceptually:

``` ts
const authorized = await canAccess({
  user,
  action: "VIEW",
  resource: "PATIENT",
  resourceId,
});

if (!authorized) {
  throw new ForbiddenError();
}
```

Never rely on:

-   hidden buttons,
-   disabled buttons,
-   route guards alone,
-   localStorage roles,
-   client state,
-   URL obscurity.

------------------------------------------------------------------------

# 8. IDOR / BOLA PREVENTION

This is a high-priority risk.

Never assume that:

``` text
/patients/123
```

means the current user is allowed to access patient `123`.

Always perform a server-side relationship/scope check.

Example:

``` text
ASHA A
 ↓
GET /patient/123
 ↓
Is patient 123 assigned/authorized to ASHA A?
 ↓
YES → return minimum required data
NO  → deny
```

Never simply:

``` sql
SELECT * FROM patients WHERE id = ?
```

for protected resources without an authorization predicate/check.

------------------------------------------------------------------------

# 9. PRIVACY BY DEFAULT

Use:

> **Minimum necessary data**

Each endpoint should return only the fields needed by the requesting
workflow.

Avoid:

``` json
{
  "patient": {
    "everything": "..."
  }
}
```

Prefer workflow-specific projections.

For example:

``` text
ASHA Visit View
→ only information needed for the visit

DHO Facility View
→ aggregate facility metrics

Doctor Referral View
→ clinical information necessary for the referral
```

------------------------------------------------------------------------

# 10. DHO PRIVACY BOUNDARY

The DHO dashboard should default to:

``` text
Aggregate
+
Facility-level
+
District-level
```

Do not show individual patient names or identifiable medical records on
the standard DHO monitoring dashboard.

If a future authorized workflow requires patient-level access:

-   define the exact use case,
-   require explicit authorization,
-   audit the access,
-   minimize exposed fields.

------------------------------------------------------------------------

# 11. SESSION SECURITY

Use secure server-managed sessions where appropriate.

Cookies should use appropriate:

``` text
HttpOnly
Secure
SameSite
```

settings.

Do not store long-lived authentication secrets in ordinary localStorage.

Implement:

-   session expiry,
-   secure logout,
-   session invalidation,
-   appropriate reauthentication for sensitive operations.

Do not log authentication tokens.

------------------------------------------------------------------------

# 12. OTP SECURITY

OTP systems must have:

-   expiration,
-   rate limiting,
-   attempt limits,
-   abuse detection,
-   replay prevention,
-   secure random generation,
-   server-side verification.

Never log OTP values.

Never return the OTP from an API response.

Do not reveal unnecessary account-existence information.

------------------------------------------------------------------------

# 13. RATE LIMITING

Rate-limit sensitive endpoints such as:

-   OTP request,
-   OTP verification,
-   login,
-   password/recovery flows if used,
-   professional verification,
-   search,
-   bulk export,
-   file upload,
-   public APIs,
-   notification-triggering actions.

Rate limits should exist server-side.

Do not rely on frontend throttling.

------------------------------------------------------------------------

# 14. INPUT VALIDATION

All external input is untrusted.

Validate:

-   query parameters,
-   path parameters,
-   JSON bodies,
-   forms,
-   uploaded metadata,
-   headers where relevant.

Use:

> **Zod**

at application boundaries where appropriate.

Reject invalid input.

Do not rely only on TypeScript types.

TypeScript does not validate runtime data.

------------------------------------------------------------------------

# 15. DATABASE SECURITY

Use:

-   Prisma,
-   parameterized queries,
-   transactions for critical operations,
-   constrained schemas.

Avoid raw SQL unless necessary.

If raw SQL is required:

-   parameterize it,
-   never concatenate user input.

Example of what NOT to do:

``` ts
`SELECT * FROM users WHERE id = '${id}'`
```

------------------------------------------------------------------------

# 16. MASS ASSIGNMENT PROTECTION

Never blindly pass client objects into database updates.

Bad concept:

``` ts
update({
  data: req.body
})
```

A malicious user may attempt:

``` json
{
  "role": "DHO",
  "isVerified": true,
  "scope": "DISTRICT"
}
```

Use explicit allowlists:

``` text
Allowed fields:
name
phone
language
...
```

Privileged fields must be controlled by dedicated authorization logic.

------------------------------------------------------------------------

# 17. ROLE / PERMISSION MUTATIONS

Changes to:

-   role,
-   facility,
-   scope,
-   verification status,
-   permissions,

must be privileged operations.

They must not be user-controlled profile fields.

Every such change should be auditable.

------------------------------------------------------------------------

# 18. FACILITY OWNERSHIP SECURITY

Facility Owners can manage facility information only for facilities they
are authorized to manage.

When adding a professional:

``` text
Facility Owner
 ↓
Invite / Request
 ↓
Professional identity
 ↓
Verification
 ↓
Authorized assignment
```

Do not allow a facility owner to self-approve professional credentials.

------------------------------------------------------------------------

# 19. INVENTORY SECURITY

Inventory is operationally sensitive.

Stock changes must be auditable.

Do not allow:

``` text
PUT /stock/123
{
  "quantity": 1000
}
```

without validating authority and preserving the previous state.

Prefer stock movement records:

``` text
RECEIPT
DISPENSE
TRANSFER
ADJUSTMENT
RETURN
```

Each material change should record:

-   actor,
-   timestamp,
-   item,
-   quantity,
-   reason/type,
-   facility,
-   resulting state.

------------------------------------------------------------------------

# 20. REFERRAL SECURITY

Referrals may contain sensitive clinical information.

Authorization must apply to:

-   creation,
-   viewing,
-   updating,
-   accepting,
-   rejecting,
-   completing,
-   escalation.

Only participants/authorized roles in the referral pathway should
receive the necessary information.

------------------------------------------------------------------------

# 21. CLINICAL DATA

Clinical information must receive stronger protection than generic
application data.

Examples:

-   diagnosis,
-   symptoms,
-   prescriptions,
-   laboratory results,
-   maternal/child health information,
-   chronic-condition information,
-   clinical notes.

Do not expose clinical information in:

-   browser logs,
-   analytics payloads,
-   error tracking metadata,
-   generic notification text,
-   URLs where avoidable.

------------------------------------------------------------------------

# 22. NOTIFICATIONS

Notifications must not leak sensitive medical information unnecessarily.

Bad:

> "Patient X has HIV and abnormal lab results."

Better:

> "A clinical update requires your attention."

Open the authorized application view for details.

------------------------------------------------------------------------

# 23. LOGGING

Logs are not a dumping ground for application data.

Never log:

-   OTPs,
-   passwords,
-   access tokens,
-   refresh tokens,
-   private keys,
-   full medical records,
-   unnecessary personal data.

Use structured logging.

Example:

``` text
request_id
user_id
role
action
resource_type
resource_id
result
timestamp
```

Redact sensitive values.

------------------------------------------------------------------------

# 24. AUDIT LOGGING

Security-sensitive actions must produce audit events.

Audit examples:

-   login/security events,
-   professional verification,
-   role assignment,
-   scope change,
-   facility creation,
-   staff addition,
-   patient record access where required,
-   clinical record changes,
-   referral state changes,
-   inventory changes,
-   escalation,
-   instruction issuance,
-   approvals,
-   exports.

Audit events should be append-oriented and protected from ordinary user
modification.

------------------------------------------------------------------------

# 25. AUDIT EVENT FORMAT

Conceptual:

``` json
{
  "actorId": "...",
  "action": "UPDATE",
  "resourceType": "FACILITY",
  "resourceId": "...",
  "scopeId": "...",
  "timestamp": "...",
  "result": "SUCCESS",
  "requestId": "..."
}
```

Do not store unnecessary sensitive payloads inside audit logs.

------------------------------------------------------------------------

# 26. FILE UPLOAD SECURITY

Healthcare documents may include:

-   prescriptions,
-   lab reports,
-   certificates,
-   identification documents.

Uploads must be treated as untrusted.

Implement:

-   file-size limits,
-   MIME/type validation,
-   extension validation,
-   malware scanning where available,
-   safe storage,
-   randomized object names,
-   authorization before download,
-   signed/time-limited access URLs where appropriate.

Never trust a filename or MIME type supplied by the browser.

Do not execute uploaded files.

------------------------------------------------------------------------

# 27. OBJECT STORAGE

Sensitive files should not be publicly accessible.

Avoid public buckets.

Use:

``` text
Private object storage
        ↓
Authorized server request
        ↓
Short-lived signed URL / controlled stream
```

Never place permanent sensitive storage URLs directly into public UI.

------------------------------------------------------------------------

# 28. XSS PREVENTION

React provides useful escaping by default, but dangerous escape hatches
remain.

Avoid unnecessary:

``` tsx
dangerouslySetInnerHTML
```

If HTML rendering is genuinely required:

-   sanitize it,
-   allowlist safe tags/attributes,
-   never trust user-generated HTML.

Health blog content must be sanitized before rendering.

------------------------------------------------------------------------

# 29. CSRF

For cookie-authenticated state-changing requests, implement appropriate
CSRF protections where required by the chosen authentication
architecture.

Use:

-   SameSite cookies where appropriate,
-   CSRF tokens where necessary,
-   origin checks where appropriate.

Do not assume a framework automatically solves every CSRF scenario.

------------------------------------------------------------------------

# 30. CORS

Use a strict allowlist.

Do not deploy with:

``` text
Access-Control-Allow-Origin: *
```

for authenticated sensitive APIs unless there is a deliberate, reviewed
reason.

Only trusted application origins should be permitted.

------------------------------------------------------------------------

# 31. SECURITY HEADERS

Use appropriate security headers, including where applicable:

``` text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
```

Configure CSP carefully so it does not break legitimate application
functionality.

------------------------------------------------------------------------

# 32. HTTPS

Production healthcare traffic must use HTTPS.

Do not transmit:

-   OTPs,
-   sessions,
-   patient data,
-   clinical data,
-   credentials,

over plaintext HTTP.

Redirect HTTP to HTTPS where appropriate.

------------------------------------------------------------------------

# 33. SECRETS MANAGEMENT

Never commit:

-   API keys,
-   database passwords,
-   JWT secrets,
-   OTP provider secrets,
-   cloud credentials,
-   private keys,
-   encryption keys.

Use environment variables or a proper secrets manager.

Never put secrets into:

-   React components,
-   client bundles,
-   `NEXT_PUBLIC_*`,
-   Git,
-   screenshots,
-   mock JSON shipped to the browser.

Remember:

> `NEXT_PUBLIC_*` values are public.

------------------------------------------------------------------------

# 34. ENVIRONMENT SEPARATION

Maintain separate:

``` text
development
staging
production
```

credentials and infrastructure.

Never use production secrets in development.

Do not point local development at production databases unless explicitly
authorized and safely controlled.

------------------------------------------------------------------------

# 35. ENCRYPTION

Use encryption:

### In transit

HTTPS/TLS.

### At rest

Use managed/database/storage encryption where available.

Highly sensitive secrets should have additional protection where
required.

Do not invent custom cryptography.

Use established libraries and platform primitives.

------------------------------------------------------------------------

# 36. PASSWORDS

If passwords are introduced anywhere:

-   never store plaintext passwords,
-   use a strong password hashing algorithm,
-   enforce sensible policies,
-   rate-limit authentication attempts.

Prefer OTP/passwordless flows where product requirements call for them.

------------------------------------------------------------------------

# 37. OFFLINE SECURITY

Offline functionality creates a special security boundary.

Do not cache the entire healthcare database on a worker's phone.

Cache only the minimum authorized data needed for offline work.

Offline storage must:

-   be scoped to the authenticated user/device,
-   minimize sensitive information,
-   support expiry,
-   clear data appropriately on logout/account removal,
-   prevent cross-user leakage on shared devices.

------------------------------------------------------------------------

# 38. OFFLINE MUTATION SECURITY

Every offline mutation must include an idempotency mechanism.

Concept:

``` text
clientMutationId
+
authenticated user
+
operation
```

Server:

``` text
Already processed?
   |
 YES → return previous result
   |
 NO  → process exactly once
```

This prevents duplicate:

-   visits,
-   referrals,
-   stock movements,
-   tasks,
-   updates.

Never blindly replay mutations.

------------------------------------------------------------------------

# 39. OFFLINE CONFLICTS

If two users change the same resource:

Do not silently overwrite important healthcare information.

Define explicit conflict handling.

For high-risk clinical data:

``` text
Conflict
 ↓
Preserve both relevant states
 ↓
Flag for authorized resolution
```

Do not use last-write-wins blindly for clinically important records.

------------------------------------------------------------------------

# 40. DEVICE LOSS

Design assuming a field worker's phone may be:

-   lost,
-   stolen,
-   shared,
-   offline for long periods.

Therefore:

-   minimize offline data,
-   use device/session controls,
-   provide secure logout,
-   expire local sensitive data appropriately,
-   avoid storing credentials in plaintext,
-   protect cached data as much as the chosen platform architecture
    permits.

------------------------------------------------------------------------

# 41. API SECURITY

APIs must implement:

``` text
Authentication
Authorization
Validation
Rate limiting
Minimal response
Audit where required
```

Never expose internal database objects directly.

Prefer explicit DTOs / response schemas.

------------------------------------------------------------------------

# 42. API RESPONSE MINIMIZATION

Avoid:

``` json
{
  "user": {
    "passwordHash": "...",
    "permissions": "...",
    "internalNotes": "...",
    "everything": "..."
  }
}
```

Return only fields required by the client.

------------------------------------------------------------------------

# 43. SEARCH SECURITY

Search endpoints can become data-exfiltration tools.

Apply:

-   role/scope filters,
-   rate limits,
-   pagination,
-   maximum result counts.

Do not allow:

``` text
GET /patients?search=
```

to expose every patient record to unauthorized users.

------------------------------------------------------------------------

# 44. EXPORT SECURITY

Exports should be treated as privileged operations.

Before allowing export:

``` text
Is export allowed for this role?
        ↓
Is this scope allowed?
        ↓
What fields can be exported?
        ↓
Is the export auditable?
```

Do not allow arbitrary CSV/JSON dumps.

------------------------------------------------------------------------

# 45. ADMIN SECURITY

System Administrator is a highly privileged technical role.

Admin access should not automatically mean unrestricted clinical access.

Separate:

``` text
Technical administration
```

from:

``` text
Clinical/business access
```

where feasible.

Use stronger authentication for highly privileged operations.

------------------------------------------------------------------------

# 46. PRIVILEGE ESCALATION

Never allow users to modify:

``` text
role
permissions
facilityId
districtId
verificationStatus
isAdmin
scope
```

through normal profile update APIs.

Any such mutation must have a dedicated privileged workflow.

------------------------------------------------------------------------

# 47. ACCOUNT STATUS

Accounts should support states such as:

``` text
PENDING
ACTIVE
SUSPENDED
REVOKED
```

A suspended/revoked professional must not continue accessing protected
APIs simply because an old browser session exists.

Authorization should consider account status.

------------------------------------------------------------------------

# 48. ACCOUNT ENUMERATION

Avoid responses that unnecessarily reveal:

-   whether a phone number is registered,
-   whether a professional ID exists,
-   whether a patient exists.

Use generic responses where appropriate.

Example:

> "If the account is eligible, a verification code has been sent."

Use product-appropriate UX without creating an enumeration
vulnerability.

------------------------------------------------------------------------

# 49. SECURITY FOR HEALTH CONTENT

Health blogs/content may be public or role-restricted.

Before publication:

``` text
Draft
 ↓
Review
 ↓
Approval
 ↓
Publish
```

Prevent unauthorized users from impersonating official health
communication.

Record:

-   author,
-   reviewer,
-   approver where required,
-   version,
-   publication date.

------------------------------------------------------------------------

# 50. EMERGENCY ACTIONS

Emergency workflows are security-sensitive but must also be fast.

Do not add unnecessary authentication friction to an already
authenticated emergency workflow.

However:

-   verify authorization,
-   confirm critical actions where appropriate,
-   log the event,
-   avoid exposing unnecessary patient data.

The design should balance:

``` text
Speed
+
Safety
+
Auditability
```

------------------------------------------------------------------------

# 51. SECURITY ERROR MESSAGES

Do not reveal internals.

Bad:

``` text
PrismaClientKnownRequestError P2002
Database table users...
```

Good:

> "We couldn't complete that request. Please try again."

Log technical details securely on the server.

------------------------------------------------------------------------

# 52. DEPENDENCY SECURITY

Before adding a package:

-   verify it is necessary,
-   prefer maintained packages,
-   inspect security reputation,
-   keep versions updated,
-   avoid unnecessary dependencies.

Run dependency audits regularly.

Do not add a huge library for a tiny UI feature.

------------------------------------------------------------------------

# 53. SUPPLY CHAIN SECURITY

Protect:

-   package dependencies,
-   CI/CD,
-   build environment,
-   deployment credentials.

Lock dependency versions where appropriate.

Do not execute untrusted scripts during builds.

Review unexpected dependency changes.

------------------------------------------------------------------------

# 54. DATABASE BACKUPS

Production data requires:

-   automated backups,
-   retention policy,
-   restoration testing,
-   restricted backup access.

A backup is sensitive healthcare data.

Do not expose backups publicly.

------------------------------------------------------------------------

# 55. DISASTER RECOVERY

Critical services should have a recovery plan.

At minimum define:

``` text
Backup
 ↓
Restore
 ↓
Verify
 ↓
Resume service
```

Do not assume a database backup is useful until restoration has been
tested.

------------------------------------------------------------------------

# 56. INCIDENT RESPONSE

Security incidents should have an operational process:

``` text
Detect
 ↓
Contain
 ↓
Investigate
 ↓
Recover
 ↓
Document
 ↓
Improve
```

Examples:

-   compromised account,
-   leaked credential,
-   unauthorized data access,
-   malicious upload,
-   suspicious bulk export,
-   abnormal OTP traffic.

Do not hide security incidents in ordinary application logs.

------------------------------------------------------------------------

# 57. SECURITY MONITORING

Monitor for:

-   repeated failed OTP attempts,
-   abnormal login patterns,
-   privilege changes,
-   unusual exports,
-   suspicious API volume,
-   repeated authorization failures,
-   unexpected stock manipulation,
-   mass record access.

Do not collect excessive personal information merely for monitoring.

------------------------------------------------------------------------

# 58. TESTING SECURITY

Every important authorization rule should have automated tests.

Test:

``` text
Allowed role + correct scope → ALLOW

Allowed role + wrong scope → DENY

Wrong role → DENY

Unauthenticated → DENY

Suspended account → DENY

Modified resource ID → DENY

Forged client role → DENY
```

------------------------------------------------------------------------

# 59. SECURITY TEST CASES

Minimum high-value tests:

### Patient

``` text
Patient A cannot access Patient B.
```

### ASHA

``` text
ASHA A cannot access ASHA B's assigned patients.
```

### Facility

``` text
Facility Owner A cannot modify Facility B.
```

### DHO

``` text
DHO can access authorized district data.
DHO dashboard does not expose patient-level records by default.
```

### Professional

``` text
Unverified professional cannot access privileged workflow.
```

### Inventory

``` text
Unauthorized user cannot alter stock.
```

### Referral

``` text
Unrelated user cannot access referral details.
```

------------------------------------------------------------------------

# 60. FRONTEND SECURITY RULE

The frontend is an untrusted environment.

Anything in:

``` text
React state
localStorage
sessionStorage
URL
DOM
network request body
```

can be manipulated by the user.

Therefore:

> **Never use frontend state as the final security authority.**

Frontend authorization exists for UX.

Backend authorization exists for security.

------------------------------------------------------------------------

# 61. URL SECURITY

Do not put sensitive information in URLs unnecessarily.

Avoid:

``` text
/referral?patientDiagnosis=...
```

Prefer stable identifiers and server-authorized retrieval.

URLs can appear in:

-   browser history,
-   logs,
-   analytics,
-   referrers,
-   screenshots.

------------------------------------------------------------------------

# 62. ANALYTICS / TELEMETRY

Do not send sensitive healthcare information to generic analytics tools.

Avoid tracking:

-   diagnoses,
-   prescriptions,
-   clinical notes,
-   patient names,
-   phone numbers,
-   health identifiers.

Telemetry should use anonymized/aggregated events wherever possible.

------------------------------------------------------------------------

# 63. THIRD-PARTY SERVICES

Before integrating a third-party service that receives Setu data:

1.  Identify exactly what data is sent.
2.  Verify why it is needed.
3.  Minimize the payload.
4.  Check security/privacy requirements.
5.  Avoid sending patient identifiers unless necessary and authorized.
6.  Keep credentials server-side.
7.  Log integration failures without logging sensitive payloads.

------------------------------------------------------------------------

# 64. AI SECURITY

AI features must follow the same privacy boundaries.

Do not send sensitive patient information to an external AI provider
unless:

-   explicitly required,
-   authorized,
-   appropriately protected,
-   contractually/compliantly permitted,
-   minimized.

AI must not become an accidental data-exfiltration path.

For clinical AI:

> AI output is assistance, not automatically authoritative clinical
> truth.

------------------------------------------------------------------------

# 65. VOICE SECURITY

Voice input may contain sensitive healthcare information.

Do not:

-   permanently store raw audio unless explicitly required,
-   send audio to unnecessary third parties,
-   expose transcripts outside authorized scope.

If transcription is performed by an external service, minimize and
secure the transmitted data.

------------------------------------------------------------------------

# 66. LOCAL DEVELOPMENT DATA

Do not use real patient data for development.

Use synthetic fixtures.

Example:

``` text
Sunita Devi
Village A
Demo Patient
```

must be clearly synthetic.

Never copy production healthcare records into:

-   local machines,
-   Git repositories,
-   screenshots,
-   test fixtures,
-   public issue trackers.

------------------------------------------------------------------------

# 67. SEED DATA

Database seeds must contain:

-   fake names,
-   fake phone numbers,
-   fake IDs,
-   fake clinical data.

Never use real identities.

------------------------------------------------------------------------

# 68. SCREENSHOTS / DESIGN FILES

Stitch and design screenshots may contain mock healthcare information.

Treat all real-looking data as potentially sensitive.

Do not place real patient information in:

-   Stitch prompts,
-   UI prototypes,
-   public GitHub repositories,
-   documentation,
-   screenshots.

------------------------------------------------------------------------

# 69. SOURCE CONTROL

Never commit:

``` text
.env
.env.production
credentials.json
private keys
database dumps
patient exports
production logs
```

Use `.gitignore`.

If a secret is accidentally committed:

> Treat it as compromised.

Rotate it; deleting the Git line alone is not enough.

------------------------------------------------------------------------

# 70. DATABASE ACCESS

Application database credentials should use the least privilege
required.

Do not use a superuser account for normal application traffic if a
restricted application role can be used.

Separate:

``` text
application access
migration access
administrative access
```

where practical.

------------------------------------------------------------------------

# 71. TRANSACTIONS

Use transactions for security/consistency-sensitive operations.

Example:

``` text
Approve professional
+
activate role
+
assign facility
+
write audit event
```

should not leave the system half-updated.

------------------------------------------------------------------------

# 72. CONCURRENCY

Important resources can be changed simultaneously.

Protect against race conditions in:

-   inventory,
-   approvals,
-   role assignment,
-   referral state,
-   facility capacity.

Do not assume two requests cannot happen at the same time.

------------------------------------------------------------------------

# 73. STATE MACHINE SECURITY

Use explicit allowed state transitions.

For example:

``` text
PENDING → APPROVED
PENDING → REJECTED
APPROVED → ACTIVE
ACTIVE → SUSPENDED
```

Do not let clients arbitrarily submit:

``` json
{
  "status": "APPROVED"
}
```

without checking whether the actor is allowed to perform that
transition.

------------------------------------------------------------------------

# 74. DATA RETENTION

Do not retain sensitive data forever by default.

Define retention requirements with the actual project authority and
applicable regulations.

Where deletion is required:

-   follow the approved retention policy,
-   consider audit/legal requirements,
-   remove associated derived copies where appropriate.

Never invent a legal retention period.

------------------------------------------------------------------------

# 75. SECURITY + UX BALANCE

Security must not make the application unusable.

Especially for ASHA:

``` text
Security
+
Offline
+
Low bandwidth
+
Low digital literacy
```

must work together.

Do not create repeated authentication friction for every harmless
action.

Use stronger confirmation/re-authentication only for genuinely sensitive
operations.

------------------------------------------------------------------------

# 76. DHO SECURITY

DHO dashboard security requirements:

-   district/scope authorization,
-   aggregate default views,
-   controlled facility details,
-   audit privileged actions,
-   restricted exports,
-   protected notifications,
-   no arbitrary database querying from the UI.

DHO analytics endpoints must enforce the same district scope as the
dashboard.

------------------------------------------------------------------------

# 77. FACILITY SECURITY

Facility-level APIs must verify:

``` text
User authorized for facility?
```

Do not trust:

``` text
facilityId
```

from the browser.

The server must derive/verify the user's permitted facility scope.

------------------------------------------------------------------------

# 78. CROSS-FACILITY DATA LEAKAGE

This is a critical Setu-specific risk.

Always prevent:

``` text
Facility A user
     ↓
changes facilityId=A to facilityId=B
     ↓
Facility B data returned
```

Every facility-scoped operation must enforce the user's actual facility
relationship.

------------------------------------------------------------------------

# 79. DISTRICT DATA LEAKAGE

Similarly:

``` text
DHO District A
     ↓
request District B
```

must be denied unless the account explicitly has multi-district
authorization.

Do not trust district IDs supplied by the frontend.

------------------------------------------------------------------------

# 80. SECURITY REVIEW BEFORE MERGE

Before merging any feature involving protected data, ask:

``` text
[ ] Is authentication required?
[ ] Is server-side authorization implemented?
[ ] Is scope enforced?
[ ] Are inputs validated?
[ ] Is response data minimized?
[ ] Are sensitive fields excluded from logs?
[ ] Is audit logging needed?
[ ] Is rate limiting needed?
[ ] Are file uploads safe?
[ ] Is offline storage safe?
[ ] Are exports restricted?
[ ] Are tests present?
[ ] Are errors non-revealing?
[ ] Are secrets protected?
```

------------------------------------------------------------------------

# 81. NEVER DO THESE

Never:

-   trust a client-side role,
-   trust a client-provided facility ID,
-   trust a client-provided district ID,
-   expose the full patient object unnecessarily,
-   store OTPs in logs,
-   store secrets in source code,
-   commit `.env`,
-   expose private storage buckets,
-   allow arbitrary role updates,
-   allow arbitrary permission updates,
-   use public healthcare data endpoints,
-   use production patient data as test data,
-   return database objects directly,
-   disable authorization because "this is only an MVP",
-   disable security checks for Stitch prototypes,
-   expose sensitive data in notifications,
-   silently overwrite important clinical records.

------------------------------------------------------------------------

# 82. ANTIGRAVITY SECURITY DEVELOPMENT PROCESS

For every protected feature:

``` text
1. Identify data sensitivity
        ↓
2. Identify roles
        ↓
3. Identify scope
        ↓
4. Define allowed actions
        ↓
5. Define state transitions
        ↓
6. Implement server authorization
        ↓
7. Validate inputs
        ↓
8. Minimize responses
        ↓
9. Add audit events
        ↓
10. Add abuse/rate protections
        ↓
11. Add automated security tests
        ↓
12. Implement UI permission states
        ↓
13. Test unauthorized direct API calls
```

------------------------------------------------------------------------

# 83. SECURITY IS NOT COMPLETE WHEN THE UI IS COMPLETE

A screen that visually hides an action is NOT secure.

Example:

``` text
DHO button hidden from ASHA
```

does not mean ASHA is prevented from calling:

``` text
POST /api/dho/facilities
```

The API itself must reject the request.

------------------------------------------------------------------------

# 84. PRODUCTION SECURITY CHECKLIST

Before production:

``` text
Authentication
✓

OTP abuse protection
✓

RBAC
✓

Scope authorization
✓

IDOR/BOLA protection
✓

Input validation
✓

Rate limiting
✓

Secure cookies/session
✓

HTTPS
✓

Security headers
✓

CORS restrictions
✓

Secret management
✓

Database protection
✓

Private file storage
✓

Audit logs
✓

Offline security
✓

Backup/recovery
✓

Dependency audit
✓

Authorization tests
✓

Error handling
✓

Privacy review
✓
```

------------------------------------------------------------------------

# 85. FINAL SECURITY DIRECTIVE

Antigravity must treat Setu as a healthcare system, not a normal CRUD
SaaS application.

The guiding model is:

``` text
                USER
                  ↓
             AUTHENTICATE
                  ↓
              ACCOUNT
               STATUS
                  ↓
                ROLE
                  ↓
                SCOPE
                  ↓
             PERMISSION
                  ↓
              RESOURCE
                  ↓
               ACTION
                  ↓
             VALIDATION
                  ↓
              DOMAIN LOGIC
                  ↓
              DATABASE
                  ↓
              AUDIT EVENT
```

Every layer matters.

The UI may make the application feel simple.

The backend must make the application secure.

The user should see:

> **Simple, calm, minimal healthcare software.**

Underneath, the system must enforce:

> **Least privilege, strict scope boundaries, privacy, auditability,
> secure data handling, and defense in depth.**

**Never sacrifice security for UI convenience.\
Never sacrifice usability by adding unnecessary security friction.\
Design both together.**
