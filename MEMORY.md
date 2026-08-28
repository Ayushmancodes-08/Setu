# SETU --- ANTIGRAVITY AI AGENT MEMORY

> **Project:** Setu --- Rural Healthcare Access & Coordination Platform
> **Problem Statement ID:** PS:6133
> **Problem Statement Title:** Accessibility and quality of public healthcare services, particularly in rural and underserved areas
> **Target Authority:** Government of Maharashtra --- Maharashtra State Innovation Society (MSIS), Department of Skills, Employment, Entrepreneurship and Innovation
> **Category / Theme:** Software | MedTech / BioTech / HealthTech
> **AI & Voice Engines:** ArogyaSakhi AI Companion + Digital India Bhashini (भाषिणी) ASR / NMT / TTS Multilingual Voice Pipeline (Marathi, Hindi, English)
> **Purpose of this file:** Persistent engineering/product context for the Antigravity AI coding agent.

------------------------------------------------------------------------

## 0. AGENT INSTRUCTION --- READ FIRST

You are the primary engineering agent for the **Setu** platform.

Before changing code:

1.  Read this entire `MEMORY.md`.
2.  Inspect the existing repository before introducing new architecture.
3.  Preserve the existing Setu design system and product decisions.
4.  Do not invent new roles, workflows, permissions, APIs, or visual
    patterns without checking this document first.
5.  Prefer reusable shared components and domain logic over duplicated
    role-specific implementations.
6.  Treat security, authorization, privacy, offline behavior,
    multilingual support, and accessibility as product
    requirements---not optional polish.
7.  When requirements are ambiguous, preserve the existing product
    philosophy: **simple for low-digital-literacy/frontline users,
    information-dense only where the role requires monitoring.**
8.  Never solve a UI problem by weakening authorization or exposing data
    outside the user's scope.
9.  Do not replace working architecture with a more complicated
    architecture merely because a newer technology exists.

------------------------------------------------------------------------

# 1. PRODUCT DEFINITION

Setu is a connected rural healthcare platform.

It is **NOT** eight independent dashboard applications.

The correct mental model is:

``` text
                    SETU
                     |
          ONE SHARED HEALTHCARE NETWORK
                     |
       +-------------+-------------+
       |             |             |
    Patient      Field/Clinical   Operations
                   Teams
                     |
             Facility / District
                     |
                    DHO
```

All roles operate on shared healthcare entities and workflows.

The dashboards are role-specific **views over one shared system**.

Core loop:

``` text
OBSERVE
   ↓
REPORT
   ↓
VERIFY
   ↓
ASSIGN
   ↓
ACT
   ↓
UPDATE
   ↓
MONITOR
   ↓
ESCALATE
   ↓
RESOLVE
```

If a feature does not improve:

-   healthcare access,
-   coordination,
-   clinical continuity,
-   operational visibility,
-   resource availability,
-   accountability,
-   or district decision-making,

do not add it merely to make the product look feature-rich.

------------------------------------------------------------------------

# 2. CURRENT ROLE ARCHITECTURE

Setu currently targets these operational roles:

1.  **Patient**
2.  **ASHA Worker**
3.  **CHO / Medical Officer**
4.  **Doctor**
5.  **Specialist Doctor**
6.  **Pharmacist / Chemist**
7.  **Lab Technician**
8.  **Facility Owner / Coordinator**
9.  **DHO / District Health Officer**
10. **System Administrator** --- restricted technical/platform role

Important:

-   The exact government hierarchy and official titles must be validated
    before production.
-   Role names are not security boundaries.
-   A user's actual permissions come from verified identity + role +
    scope + resource permissions.

------------------------------------------------------------------------

# 3. AUTHORIZATION MODEL --- CRITICAL

Use:

``` text
RBAC + SCOPE + RESOURCE + ACTION
```

Never use only:

``` text
if (user.role === "DHO")
```

Authorization concept:

``` text
Can this USER
perform this ACTION
on this RESOURCE
within this SCOPE?
```

### Typical scopes

``` text
DHO
└── District
    ├── Facility A
    ├── Facility B
    └── Facility C

Facility Owner
└── Assigned Facility
    ├── Staff
    ├── Beds
    ├── Pharmacy
    └── Laboratory

ASHA
└── Assigned Villages / Households

Specialist
└── Authorized Specialty + Assigned/Referred Cases

Pharmacist
└── Assigned Pharmacy

Lab Technician
└── Assigned Laboratory

Patient
└── Own permitted records
```

### Permission primitives

Use explicit permissions where appropriate:

-   VIEW
-   CREATE
-   EDIT
-   APPROVE
-   MANAGE
-   INSTRUCT
-   ESCALATE
-   PUBLISH
-   ACKNOWLEDGE
-   EXPORT

**Client-side hiding is not security.**

Every protected read/mutation must be checked server-side.

------------------------------------------------------------------------

# 4. USER EXPERIENCE PRINCIPLES

## Patient

Browse-first, care-access oriented.

Prioritize:

-   finding care,
-   appointments,
-   symptom/triage,
-   referrals,
-   prescriptions,
-   diagnostic reports,
-   personal records,
-   emergency help,
-   relevant health information.

------------------------------------------------------------------------

## ASHA Worker

This is a **field task queue**, NOT a generic dashboard.

Primary principles:

-   mobile-first,
-   one-column primary workflow,
-   large touch targets,
-   16px minimum body text,
-   primary actions \>= 56x56px,
-   persistent sync status,
-   persistent voice entry,
-   multilingual,
-   offline-first,
-   fewer options,
-   fewer taps,
-   no hover dependency.

Queue order:

``` text
OVERDUE
   ↓
TODAY
   ↓
UPCOMING
```

Task cards should answer:

> WHO do I see?\
> WHY am I seeing them?\
> WHAT should I do?

Primary action examples:

-   Start Visit
-   Log Follow-up
-   Call for Guidance

Secondary:

-   Mark Done

Offline action:

``` text
Action
 ↓
Immediate optimistic UI
 ↓
"Queued for sync"
 ↓
Sync when connection returns
```

Never block the ASHA workflow with a network spinner.

Bottom mobile navigation:

``` text
Queue | Patients | Reports | Profile
```

------------------------------------------------------------------------

## CHO / Medical Officer

Facility-level clinical coordination.

Prioritize:

-   referrals,
-   clinical tasks,
-   high-risk cohorts,
-   ASHA submissions,
-   facility capacity,
-   medicine availability,
-   diagnostic availability,
-   alerts,
-   escalation.

------------------------------------------------------------------------

## Doctor / Specialist

Clinical workbench.

Prioritize:

-   referrals,
-   assigned cases,
-   consultations,
-   clinical notes,
-   diagnosis,
-   prescriptions,
-   specialist guidance,
-   follow-up plans.

Only expose the minimum clinical information necessary for the workflow.

------------------------------------------------------------------------

## Pharmacist / Chemist

Keep the interface minimal and operational.

Prioritize:

-   current inventory,
-   low-stock items,
-   stock-outs,
-   expiry,
-   dispensing,
-   stock receipts,
-   inventory movement,
-   reorder/resource requests.

**Do not model inventory as one freely editable number.**

Use auditable stock movements.

------------------------------------------------------------------------

## Lab Technician

Prioritize:

-   diagnostic orders,
-   sample queue,
-   sample status,
-   tests,
-   results,
-   report finalization,
-   reagent/consumable stock,
-   equipment/outages.

------------------------------------------------------------------------

## Facility Owner / Coordinator

Facility command center.

Can manage authorized facility information such as:

-   facility profile,
-   services,
-   beds/capacity,
-   staff,
-   schedules,
-   pharmacy,
-   laboratory,
-   referrals,
-   operational requests,
-   alerts/issues.

Can:

-   invite/add staff,
-   request professional verification,
-   assign facility duties within authority,
-   request role/facility changes.

Cannot self-certify professional credentials.

------------------------------------------------------------------------

## DHO

Desktop-first monitoring and accountability.

The DHO needs to answer:

-   Where are patients waiting too long?
-   Where are referrals failing?
-   Which facilities have stock problems?
-   Where are diagnostic services unavailable?
-   Where are capacity/workforce problems?
-   Are there emerging disease/issue clusters?
-   Which issues require escalation?

DHO dashboard should contain:

1.  District/facility selector
2.  Date range
3.  Headline metrics
4.  District heatmap
5.  Referral drop-off funnel
6.  Facility performance table
7.  Aggregate high-risk cohorts
8.  Alerts/flags

Default DHO screens should NOT show individual patient names.

------------------------------------------------------------------------

# 5. UNIFIED AUTHENTICATION

## Patient authentication

Preferred:

``` text
Mobile Number
     ↓
OTP
     ↓
Existing user?
  /       \
Yes       No
 |         |
Login    Minimal Signup
```

Patient signup should collect only necessary information.

Do not create a complicated role-selection flow for patients.

------------------------------------------------------------------------

## Professional authentication

Professional flow:

``` text
Mobile Number
+
Professional / Employee ID
        ↓
       OTP
        ↓
Credential Verification
        ↓
Role + Facility + Scope
        ↓
Authorized Dashboard
```

If no verified professional account exists:

``` text
Application for Review
        ↓
Authorized Reviewer
        ↓
Approve / Reject
        ↓
Account Activation
```

**Role selection by the user must never itself grant privileged
access.**

------------------------------------------------------------------------

# 6. PROFESSIONAL VERIFICATION

The platform must support controlled verification for:

-   doctors,
-   specialists,
-   pharmacists/chemists,
-   lab technicians,
-   CHO/MO,
-   other authorized professionals.

Verification may use an approved government/professional registry or an
internal authority review process.

Until official verification is confirmed:

``` text
UNVERIFIED
    ↓
REVIEW REQUEST
    ↓
AUTHORIZED REVIEW
    ↓
APPROVED / REJECTED
```

Do not assume a specific government registry/API until the implementing
authority confirms it.

------------------------------------------------------------------------

# 7. FACILITY HIERARCHY

A facility can contain:

``` text
Facility
├── Profile
├── Services
├── Beds / Capacity
├── Staff
├── Pharmacy
├── Laboratory
├── Referrals
├── Requirements
├── Incidents
└── Performance
```

Facility Owner manages facility-level information.

DHO can see authorized district-wide facility information and can
manage/add facilities where permitted by official authority.

------------------------------------------------------------------------

# 8. CROSS-ROLE COORDINATION

The defining feature of Setu is coordination.

### Referral chain

``` text
Patient / ASHA / Clinical Staff
          ↓
       Referral
          ↓
   Receiving Facility
          ↓
        Doctor
          ↓
     Diagnostics
          ↓
      Treatment
          ↓
      Follow-up
          ↓
       ASHA/Team
          ↓
      Completion
```

### Stock-out

``` text
Pharmacist
   ↓
Stock-out Report
   ↓
Facility Owner
   ↓
DHO
   ↓
Requirement / Supply Action
   ↓
Resolution
```

### Laboratory outage

``` text
Lab Technician
   ↓
Diagnostic Outage
   ↓
Facility Owner
   ↓
DHO visibility if relevant
   ↓
Resolution
```

### District instruction

``` text
DHO
 ↓
Instruction
 ↓
Facility
 ↓
CHO / Staff
 ↓
Acknowledgement
 ↓
Completion
 ↓
DHO Monitoring
```

### Staff onboarding

``` text
Facility Owner
 ↓
Add / Invite Professional
 ↓
Existing verified professional?
   /             \
Yes              No
 |                |
Invite          Review
 |                |
Activation      Authority
```

------------------------------------------------------------------------

# 9. TASKS, INSTRUCTIONS, REQUIREMENTS

These are different concepts.

### Task

Accountable work assigned to someone.

``` text
Created
 ↓
Assigned
 ↓
Acknowledged
 ↓
In Progress
 ↓
Completed
 ↓
Closed
```

### Instruction

Authority-issued direction.

``` text
Issued
 ↓
Acknowledged
 ↓
Completed
 ↓
Monitored
```

### Requirement / Resource Request

Operational need.

Examples:

-   medicine,
-   equipment,
-   staff,
-   diagnostics,
-   infrastructure,
-   transport,
-   supplies,
-   training,
-   maintenance,
-   emergency resources.

Lifecycle:

``` text
Created
 ↓
Submitted
 ↓
Reviewed
 ↓
Approved / Rejected
 ↓
Assigned
 ↓
In Progress
 ↓
Resolved
 ↓
Verified
 ↓
Closed
```

------------------------------------------------------------------------

# 10. ALERTS, INCIDENTS, ESCALATIONS

Keep these separate.

### Alert

Information requiring awareness/action.

### Incident

Operational/service disruption.

### Escalation

Movement of an issue to a higher authority.

### Emergency

Time-critical event requiring immediate response.

### Task

Accountable work.

Suggested severity:

``` text
Normal
Warning
Urgent
Critical
```

Critical alerts must not disappear into a normal notification list.

------------------------------------------------------------------------

# 11. HEALTH CONTENT / BLOGS

Health content is a governed publishing workflow, not an unrestricted
social feed.

Suggested lifecycle:

``` text
Draft
 ↓
Review
 ↓
Approve
 ↓
Publish
 ↓
Update / Archive
```

Possible contributors:

-   Doctor
-   Specialist
-   Authorized clinical staff
-   Authorized health communication roles

ASHA can suggest community topics/observations.

District-wide official publishing must require appropriate authority.

Support:

-   English
-   Marathi
-   Hindi

Store author, reviewer, version and publication metadata.

------------------------------------------------------------------------

# 12. NOTIFICATIONS

Notifications are:

-   role-aware,
-   scope-aware,
-   priority-aware.

A notification should take the user directly to the relevant object
whenever possible.

Examples:

``` text
New referral
Stock-out
Task assigned
Instruction issued
Requirement approved
Professional verification result
Critical incident
Lab result available
```

Do not notify every user about everything.

------------------------------------------------------------------------

# 13. CORE DATA ENTITIES

Core domain entities:

``` text
User / Identity
Professional Credential
Role Assignment
Permission / Scope
Facility
Department / Service
Staff Assignment
Patient
Household
Visit
Appointment
Referral
Clinical Record
Prescription
Diagnostic Order
Diagnostic Result
Medicine
Inventory Item
Stock Movement
Alert
Incident
Requirement / Resource Request
Task
Instruction
Notification
Health Content
Approval Request
Escalation
Audit Event
Offline Sync Mutation
```

All important objects should have stable IDs, timestamps, status and
scope/ownership metadata.

------------------------------------------------------------------------

# 14. TECH STACK --- LOCKED DEFAULT

## Frontend

-   Next.js 14/15+ with App Router
-   TypeScript
-   React
-   Tailwind CSS
-   shadcn/ui
-   Lucide React
-   Framer Motion

## Forms / Validation

-   React Hook Form
-   Zod

## Server State

-   TanStack Query

## Small Client State

-   Zustand

## Database

-   PostgreSQL

## ORM

-   Prisma

## Authentication

-   OTP authentication
-   Professional credential verification
-   Auth.js/custom authentication layer as appropriate

## Authorization

-   Custom RBAC + scope-based authorization

## Offline

-   IndexedDB
-   Dexie

## PWA

-   Serwist / Workbox-based approach

## Queue / Cache

-   Redis

## Background Jobs

-   BullMQ

## Charts

-   Recharts

## Maps

-   react-simple-maps

## File Storage

-   S3-compatible object storage

## Testing

-   Vitest
-   Playwright

## Monitoring

-   Sentry
-   Structured logs

## Deployment

-   Docker
-   Managed PostgreSQL
-   Managed Redis
-   S3-compatible storage

------------------------------------------------------------------------

# 15. ARCHITECTURE STYLE

Use a:

> **Modular Monolith**

for the MVP.

Do NOT prematurely split Setu into microservices.

Correct:

``` text
                 Next.js
                    |
       +------------+-------------+
       |            |             |
     Auth        Domains       UI/Routes
                    |
          +---------+---------+
          |         |         |
       Patient   Referral   Facility
          |         |         |
       Pharmacy   Lab      Alerts
                    |
                PostgreSQL
                    |
                  Prisma

Redis
  |
BullMQ Workers
```

Microservices can be introduced later only when scale/team boundaries
justify them.

------------------------------------------------------------------------

# 16. SUGGESTED REPOSITORY STRUCTURE

``` text
setu/
├── app/
│   ├── (public)/
│   ├── login/
│   ├── patient/
│   ├── asha/
│   ├── cho/
│   ├── doctor/
│   ├── specialist/
│   ├── pharmacist/
│   ├── lab/
│   ├── facility/
│   └── dho/
│
├── components/
│   ├── ui/
│   ├── navigation/
│   ├── charts/
│   └── shared/
│
├── features/
│   ├── auth/
│   ├── patients/
│   ├── referrals/
│   ├── facilities/
│   ├── pharmacy/
│   ├── laboratory/
│   ├── alerts/
│   ├── tasks/
│   ├── requirements/
│   ├── content/
│   └── notifications/
│
├── lib/
│   ├── auth/
│   ├── permissions/
│   ├── db/
│   ├── sync/
│   ├── storage/
│   └── integrations/
│
├── prisma/
├── workers/
└── tests/
```

Organize business logic by **domain**, not by dashboard.

For example, there should be one shared Referral domain used by:

-   ASHA,
-   CHO/MO,
-   Doctor,
-   Specialist,
-   Facility,
-   DHO.

------------------------------------------------------------------------

# 17. DESIGN SYSTEM --- DO NOT DRIFT

Setu uses one visual family.

### Colors

Primary:

-   Teal
-   Emerald

Neutrals:

-   Zinc
-   Slate
-   Warm/neutral surfaces

Semantic:

-   Amber = warning/risk
-   Muted red = critical
-   Teal/green = normal/positive

Avoid making the application blue-heavy.

### Typography

-   Inter or Geist

### Icons

-   Lucide or Phosphor

### Elevation

-   1px borders
-   very subtle shadows
-   no excessive glassmorphism

### Radius

-   approximately 12--16px for cards

### General philosophy

Professional, minimal, credible, calm.

Government-healthcare product should feel trustworthy rather than
flashy.

------------------------------------------------------------------------

# 18. ROLE-SPECIFIC DENSITY

Do NOT simply make one dashboard responsive for every role.

Use role-specific interaction models.

``` text
Patient
↓
Simple / browse / care access

ASHA
↓
Large / task-first / offline / voice

Clinical
↓
Focused clinical workbench

Pharmacy
↓
Operational inventory

Lab
↓
Diagnostic queue

Facility
↓
Operational command center

DHO
↓
Dense monitoring / analytics
```

------------------------------------------------------------------------

# 19. DHO DASHBOARD DESIGN

Desktop-first.

Top bar:

-   District selector
-   Date range
-   Language
-   Notifications
-   Profile

Headline metrics:

-   Active Patients Under Care
-   Average Wait Time
-   Referral Completion Rate
-   Facilities Reporting Stock-Out

Primary visual:

-   District heatmap

Heatmap modes:

-   Case Load
-   Wait Times
-   Referral Drop-off

Analytics:

``` text
Referral Drop-off Funnel
Referred
 ↓
Reached Facility
 ↓
Consultation Completed
 ↓
Follow-up Completed
```

Facility performance table:

-   Facility Name
-   Type
-   Average Wait Time
-   Referral Completion %
-   Stock Status
-   Quality Flag

High-risk cohorts must be aggregate.

Alerts:

-   wait-time increase,
-   medicine stock-out,
-   diagnostic outage,
-   facility performance issue,
-   other authorized system signals.

Charts:

-   bar,
-   line,
-   funnel,
-   heatmap.

Avoid:

-   3D,
-   gauge dials,
-   excessive gradients,
-   generic BI widgets,
-   decorative charts.

------------------------------------------------------------------------

# 20. OFFLINE-FIRST RULES

Especially for ASHA.

When offline:

``` text
User Action
   ↓
Validate locally
   ↓
Write local mutation
   ↓
Optimistic UI
   ↓
"Queued for sync"
```

When online:

``` text
Sync Queue
   ↓
Server
   ↓
Idempotency check
   ↓
Persist
   ↓
Acknowledgement
   ↓
Local status = Synced
```

Requirements:

-   never block the UI because of network loss,
-   never rely on a global banner alone,
-   show queued status on the individual record,
-   retry safely,
-   prevent duplicate mutations,
-   define explicit conflict resolution,
-   cache only minimum authorized data.

------------------------------------------------------------------------

# 21. PWA / LOW-BANDWIDTH RULES

The field experience may run on low-end Android devices.

Therefore:

-   minimize JavaScript bundle size,
-   lazy-load heavy modules,
-   avoid unnecessary dependencies,
-   cache the app shell,
-   use IndexedDB for required offline data,
-   paginate large data,
-   avoid large images,
-   avoid blocking loaders,
-   avoid hover-only interactions,
-   keep critical flows usable with unstable connections.

------------------------------------------------------------------------

# 22. MULTILINGUAL REQUIREMENTS

Supported product languages:

``` text
English
मराठी
हिंदी
```

Languages are first-class.

Do NOT treat translation as:

> "Add language later."

Core authentication and dashboards must support localization from the
beginning.

Avoid hardcoding UI text throughout components.

Use a proper translation structure.

------------------------------------------------------------------------

# 23. PRIVACY RULES

Patient information is sensitive.

Principles:

-   least privilege,
-   minimum necessary data,
-   role/scope filtering,
-   aggregate DHO views,
-   server-side authorization,
-   audited access to sensitive records,
-   secure offline storage,
-   secure document access.

DHO default:

> aggregate/facility-level information, not individual patient names.

Do not expose patient identifiers merely because an admin role can
technically access the database.

------------------------------------------------------------------------

# 24. AUDIT LOGGING

Privileged changes should generate audit events.

Example:

``` text
Actor:
DHO User

Action:
UPDATE

Resource:
Facility

Resource ID:
XXXXXXXX

Before:
80 beds

After:
100 beds

Timestamp:
...

Result:
Success
```

Audit important events such as:

-   staff verification,
-   role changes,
-   facility changes,
-   permissions,
-   inventory changes,
-   referral state changes,
-   alerts,
-   instructions,
-   approvals,
-   resource requests,
-   privileged data changes.

------------------------------------------------------------------------

# 25. INVENTORY RULE

Pharmacy inventory must be transactional.

Do not implement:

``` text
stock = 25
```

with arbitrary overwrites.

Prefer:

``` text
Opening Balance
+
Receipts
-
Dispensing
-
Adjustments
+
/-
Transfers
=
Current Stock
```

Every material adjustment should have an actor, timestamp and reason.

------------------------------------------------------------------------

# 26. REFERRAL STATE MODEL

Referral should have explicit lifecycle states.

Minimum conceptual lifecycle:

``` text
CREATED
  ↓
SENT
  ↓
RECEIVED / REACHED
  ↓
CONSULTATION
  ↓
TREATMENT
  ↓
FOLLOW-UP
  ↓
COMPLETED
```

Additional states may include:

-   cancelled,
-   rejected,
-   unable to reach,
-   overdue,
-   escalated.

Do not create uncontrolled free-text status values.

------------------------------------------------------------------------

# 27. ERROR / EMPTY / LOADING STATES

Every major data component should handle:

### Loading

Use skeletons where appropriate.

### Empty

Explain what happens next.

Example:

> "Data will populate as facilities report."

### Error

Give a useful retry/recovery action.

### Offline

Tell the user what is still possible.

### Permission denied

Explain access limitation without leaking sensitive information.

------------------------------------------------------------------------

# 28. ANIMATION RULES

Framer Motion is allowed, but restrained.

Use motion for:

-   task completion,
-   sync state,
-   status changes,
-   count-up metrics where useful,
-   smooth panel transitions.

Do NOT use:

-   excessive page entrance animations,
-   decorative floating elements,
-   attention-grabbing motion,
-   unnecessary bouncing,
-   animation that slows operational work.

ASHA needs stability.

DHO needs analytical calm.

------------------------------------------------------------------------

# 29. TESTING PRIORITIES

Do not test only visual rendering.

Prioritize workflows.

### Authentication

``` text
Patient → OTP → Dashboard
Professional → Verification → Dashboard
Unverified Professional → Review
```

### ASHA

``` text
Offline
 ↓
Visit
 ↓
Queued
 ↓
Reconnect
 ↓
Sync
```

### Referral

``` text
ASHA
 ↓
Referral
 ↓
Facility
 ↓
Doctor
 ↓
Completion
```

### Pharmacy

``` text
Stock change
 ↓
Stock-out
 ↓
Facility
 ↓
DHO
```

### Facility

``` text
Add professional
 ↓
Verification
 ↓
Approval
 ↓
Assignment
```

### DHO

``` text
Facility issue
 ↓
DHO visibility
 ↓
Escalation
 ↓
Resolution
```

------------------------------------------------------------------------

# 30. TECHNOLOGIES TO AVOID PREMATURELY

Do not introduce these without a concrete requirement:

-   Kubernetes
-   Microservices
-   MongoDB
-   Kafka
-   Elasticsearch/OpenSearch
-   Heavy GIS
-   Complex event sourcing
-   Multiple databases by role
-   Separate backend per role
-   AI features with no validated use case

For MVP:

> Keep architecture boring, modular, secure and reliable.

------------------------------------------------------------------------

# 31. AI USAGE

Setu may contain AI-enabled features, but AI is NOT an excuse to insert
AI into every workflow.

Potential future areas:

-   multilingual voice interaction,
-   symptom/triage assistance,
-   health information assistance,
-   summarization,
-   operational anomaly detection,
-   routing/support.

Clinical AI must have appropriate safety controls and must not silently
replace professional judgement.

Do not make autonomous clinical decisions without explicit validated
requirements, safety review and authority approval.

------------------------------------------------------------------------

# 32. DEVELOPMENT ORDER

Recommended sequence:

``` text
1. Design tokens
2. Shared UI primitives
3. Database/domain model
4. Authentication
5. RBAC + scope authorization
6. Landing page
7. Patient dashboard
8. ASHA dashboard + offline foundation
9. CHO/MO
10. Doctor/Specialist
11. Pharmacist
12. Lab Technician
13. Facility Owner
14. DHO
15. Referral system
16. Tasks / Instructions
17. Alerts / Incidents / Escalations
18. Requirements / Resources
19. Notifications
20. Health Content
21. Audit
22. Security hardening
23. Multilingual QA
24. Offline conflict handling
25. PWA/performance hardening
```

------------------------------------------------------------------------

# 33. CURRENT SCREEN-BUILDING STRATEGY

The UI prototypes are being designed first using **Stitch**, then
integrated into the real application.

Important:

Stitch screens are prototypes/reference implementations.

When converting them to Next.js:

-   preserve the visual hierarchy,
-   preserve Setu tokens,
-   preserve role-specific interaction models,
-   replace static/mock behavior with domain data,
-   implement real authorization,
-   implement loading/error/empty/offline states,
-   make components reusable.

Do not blindly copy generated markup into production if it creates
duplicated logic or inaccessible UI.

------------------------------------------------------------------------

# 34. DESKTOP VS MOBILE

### Desktop-first roles

-   Facility Owner
-   DHO
-   likely administrative/monitoring workflows

### Mobile-first roles

-   Patient
-   ASHA
-   field workflows

### Clinical roles

Responsive desktop/tablet with mobile support where useful:

-   CHO/MO
-   Doctor
-   Specialist
-   Pharmacist
-   Lab Technician

Do not sacrifice mobile clarity to make desktop dashboards richer.

Do not sacrifice DHO analytical visibility to force a mobile-style
interface.

------------------------------------------------------------------------

# 35. DEFINITION OF DONE FOR A FEATURE

A feature is not complete when the happy-path UI works.

It should include, where relevant:

``` text
UI
+
Responsive behavior
+
Validation
+
Loading state
+
Empty state
+
Error state
+
Offline state
+
Authorization
+
Server-side validation
+
Audit event
+
Notifications
+
Accessibility
+
Localization
+
Tests
```

Not every item is required for every trivial component, but every
production workflow must be evaluated against this checklist.

------------------------------------------------------------------------

# 36. IMPORTANT PRODUCT BOUNDARIES

Do not turn Setu into:

-   a generic social network,
-   a generic BI platform,
-   an admin dashboard,
-   a simple appointment booking website,
-   an unrestricted health blog,
-   a collection of disconnected role portals.

Setu is:

> **A coordinated rural healthcare operating layer connecting community,
> clinical, facility and district health operations.**

------------------------------------------------------------------------

# 37. ENGINEERING RULES FOR ANTIGRAVITY

When writing code:

1.  Prefer TypeScript strictness.
2.  Avoid `any` unless genuinely unavoidable and documented.
3.  Keep components small and composable.
4.  Keep business logic out of visual components where possible.
5.  Use shared domain types.
6.  Use Zod at external input boundaries.
7.  Never trust client-supplied role/permission claims.
8.  Check authorization server-side.
9.  Use transactions for important multi-step database operations.
10. Use idempotency for retryable offline mutations.
11. Do not duplicate the same entity logic for different dashboards.
12. Keep API responses minimal and scope-aware.
13. Avoid unnecessary dependencies.
14. Avoid unnecessary client components.
15. Prefer server-side data fetching where appropriate.
16. Keep accessibility built into components.
17. Do not hardcode language-specific UI text.
18. Preserve design tokens.
19. Do not introduce random colors outside semantic Setu palette.
20. Do not create icon-only primary actions.
21. Do not add unnecessary settings/customization.
22. Do not introduce hover-dependent behavior.
23. Do not expose patient data to DHO by default.
24. Do not weaken security for UI convenience.
25. Do not change the architecture without checking the whole project
    first.

------------------------------------------------------------------------

# 38. WHEN ADDING A NEW ROLE

Do not immediately create a dashboard.

First answer:

1.  Why does this role exist?
2.  What responsibility does it have?
3.  What data does it need?
4.  What can it create?
5.  What can it edit?
6.  What can it approve?
7.  What can it instruct?
8.  What can it escalate?
9.  What is its geographic/facility scope?
10. Who can supervise it?
11. Who can it communicate with?
12. What shared entities does it interact with?
13. What happens if its account is unverified?
14. What audit events does it generate?

Only then build the UI.

------------------------------------------------------------------------

# 39. WHEN ADDING A NEW FEATURE

Ask:

``` text
Which requirement does this solve?
Which role needs it?
What is the source of truth?
Who can create it?
Who can view it?
Who can edit it?
Who can approve it?
Who receives the notification?
Can it be escalated?
What is its lifecycle?
What happens offline?
What is the privacy boundary?
What is the audit requirement?
```

If these cannot be answered, the feature is not sufficiently specified.

------------------------------------------------------------------------

# 40. FINAL ARCHITECTURAL NORTH STAR

``` text
                       SETU
                        |
                 AUTHENTICATED USER
                        |
                IDENTITY + ROLE
                        |
                    SCOPE
                        |
                 PERMISSION CHECK
                        |
                    RESOURCE
                        |
                     ACTION
                        |
                 DOMAIN SERVICE
                        |
              +---------+---------+
              |                   |
          PostgreSQL            Redis
              |                   |
           Prisma             BullMQ
              |
       Shared Healthcare Data
              |
    +---------+----------+----------+
    |         |          |          |
 Patient    ASHA      Facility     DHO
    |         |          |          |
    +---------+----------+----------+
              |
        Shared workflows
              |
     Referral / Task / Alert
     Inventory / Lab / Staff
     Requirement / Content
              |
           AUDIT
```

------------------------------------------------------------------------

# 41. FINAL AGENT DIRECTIVE

Build Setu as a **single connected, secure, role-aware healthcare
platform**.

The visual system should remain:

> **minimal + professional + teal/emerald + zinc/slate + restrained +
> accessible**

The interaction model should vary by role:

> **Patient = simple access**\
> **ASHA = field task queue**\
> **Clinical = focused workbench**\
> **Pharmacy/Lab = operational queue**\
> **Facility = command center**\
> **DHO = monitoring and accountability**

The technical architecture should remain:

> **Next.js + TypeScript + Tailwind + shadcn/ui + PostgreSQL + Prisma +
> RBAC/Scope + Redis/BullMQ + IndexedDB/Dexie + PWA**

The system should always prioritize:

> **Correctness → Security → Simplicity → Reliability → Accessibility →
> Performance → Visual polish**

Never reverse that order.
