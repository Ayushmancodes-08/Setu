# SETU --- DESIGN.md

> **Purpose:** Persistent design instructions for the Antigravity AI
> coding agent.
>
> **IMPORTANT:** The Stitch-generated screens/files are the **primary
> visual reference** for implementing the Setu UI. They are reference
> material and design direction---not a source to blindly copy or
> duplicate.

------------------------------------------------------------------------

# 1. READ THIS FIRST

Before designing or modifying any Setu screen:

1.  Read `MEMORY.md`.
2.  Locate and inspect the available **Stitch design files/screens** in
    the project.
3.  Study the Stitch screens carefully before writing new UI.
4.  Treat the Stitch files as the **visual source of truth for the
    intended product direction**, unless an explicit newer
    product/design decision overrides them.
5.  Reuse their:
    -   visual language,
    -   layout principles,
    -   spacing rhythm,
    -   typography,
    -   colors,
    -   component appearance,
    -   borders,
    -   radius,
    -   icon treatment,
    -   navigation patterns,
    -   card treatment,
    -   form patterns,
    -   dashboard hierarchy.
6.  Do NOT blindly copy Stitch-generated code.
7.  Do NOT redesign an existing screen simply because you personally
    prefer another style.
8.  If the Stitch reference contains a pattern that can be made into a
    reusable component, implement it as a reusable Setu component.
9.  Keep the final implementation consistent with the rest of the Setu
    product family.

------------------------------------------------------------------------

# 2. WHAT THE STITCH FILES ARE

The Stitch files are:

> **DESIGN REFERENCES / VISUAL SPECIFICATION**

They are NOT automatically:

-   production-ready code,
-   the backend architecture,
-   the database model,
-   the authorization model,
-   the final responsive implementation,
-   permission logic,
-   accessibility implementation,
-   offline implementation.

The Antigravity agent must convert the visual intent into proper
production-quality Next.js code.

Think:

``` text
STITCH
  ↓
Study visual intent
  ↓
Extract design patterns
  ↓
Map to Setu components
  ↓
Implement real application logic
  ↓
Responsive + accessible + secure UI
```

NOT:

``` text
STITCH
  ↓
Copy everything blindly
```

------------------------------------------------------------------------

# 3. DESIGN HIERARCHY

When deciding how a new screen should look, use this priority order:

``` text
1. Explicit current product requirement
2. MEMORY.md architecture/product rules
3. Existing Setu design tokens
4. Existing implemented Setu screens
5. Stitch reference screens
6. General UI conventions
```

If a Stitch screen conflicts with an explicit newer requirement, follow
the newer requirement.

Do not silently change product behavior to match an old Stitch
prototype.

------------------------------------------------------------------------

# 4. SETU VISUAL LANGUAGE

The entire application should feel like one product.

Core visual direction:

> **Minimalist + Professional + Healthcare + Government-grade + Calm +
> Trustworthy**

Avoid:

-   excessive decoration,
-   flashy gradients,
-   excessive glassmorphism,
-   huge marketing-style typography inside operational dashboards,
-   unnecessary animations,
-   excessive shadows,
-   random colors,
-   generic SaaS dashboard styling.

The product should feel polished without looking ornamental.

------------------------------------------------------------------------

# 5. COLOR SYSTEM

Reuse the existing Setu tokens.

Primary:

-   Teal
-   Emerald

Neutrals:

-   Zinc
-   Slate

Semantic:

-   Teal/green → healthy / success / normal
-   Amber → warning / due / attention
-   Muted red → critical / urgent

Avoid making the interface blue-heavy.

Do NOT introduce arbitrary colors for individual roles.

All roles belong to the same Setu visual family.

------------------------------------------------------------------------

# 6. TYPOGRAPHY

Use:

-   Inter
-   Geist

Typography should prioritize readability.

General minimum:

-   Operational mobile body text: approximately 16px
-   Desktop dashboard body text: readable at normal viewing distance
-   Labels must not become tiny merely to fit more data.

Use hierarchy through:

-   font size,
-   weight,
-   spacing,
-   contrast,

rather than decorative styling.

------------------------------------------------------------------------

# 7. BORDERS / ELEVATION

Preferred Setu treatment:

``` text
1px subtle border
+
light surface separation
+
very restrained shadow where necessary
```

Cards generally use approximately:

``` text
12px–16px radius
```

Avoid:

-   heavy drop shadows,
-   floating everything,
-   excessive borders,
-   overly rounded "toy-like" cards.

------------------------------------------------------------------------

# 8. ICONOGRAPHY

Use:

-   Lucide
-   Phosphor

Icons must communicate meaning.

For primary workflows:

``` text
ICON + TEXT
```

Do not use unexplained icon-only actions in important workflows.

Icons should be:

-   consistent in stroke weight,
-   appropriately sized,
-   aligned with text,
-   accessible.

Do not randomly mix icon libraries within the same component.

------------------------------------------------------------------------

# 9. STITCH → PRODUCTION COMPONENT MAPPING

When a Stitch design contains repeated patterns, identify them as
reusable components.

Examples:

``` text
Stitch Button
      ↓
Setu Button component

Stitch Card
      ↓
Setu Card component

Stitch Navigation
      ↓
Shared navigation primitives

Stitch Metric Card
      ↓
MetricCard

Stitch Alert
      ↓
AlertCard / AlertRow

Stitch Table
      ↓
DataTable

Stitch Status
      ↓
StatusIndicator
```

Do not create five slightly different components for five roles when the
underlying pattern is the same.

Prefer:

``` text
Shared component
+
role-specific data
```

instead of:

``` text
Role-specific duplicated component
```

------------------------------------------------------------------------

# 10. DO NOT COPY STITCH PIXEL-FOR-PIXEL WHEN IT HURTS UX

Stitch is a reference.

Production implementation must improve where required for:

-   accessibility,
-   responsiveness,
-   keyboard navigation,
-   touch interaction,
-   loading states,
-   error states,
-   offline behavior,
-   localization,
-   authorization,
-   real data.

Example:

If Stitch has a desktop-only hover interaction:

``` text
Do NOT preserve hover-only behavior.
```

Convert it into an accessible click/tap interaction.

If Stitch has text that becomes too small on mobile:

``` text
Increase it.
```

If Stitch shows mock data:

``` text
Replace with real domain data.
```

------------------------------------------------------------------------

# 11. ROLE-SPECIFIC DESIGN

Do not make all dashboards look identical.

They share the same design system but have different information
architecture.

## Patient

Mental model:

> "Help me access care."

Simple and browse-oriented.

------------------------------------------------------------------------

## ASHA

Mental model:

> "Tell me who I need to see and what I need to do."

Use:

-   task queue,
-   large touch targets,
-   offline visibility,
-   voice,
-   multilingual controls,
-   minimal choices.

This is NOT a miniature desktop dashboard.

------------------------------------------------------------------------

## CHO / Medical Officer

Mental model:

> "Help me coordinate clinical work at my facility."

Use focused operational information.

------------------------------------------------------------------------

## Doctor / Specialist

Mental model:

> "Help me review and act on clinical cases."

Use clinical workbench patterns.

------------------------------------------------------------------------

## Pharmacist

Mental model:

> "Help me know what stock I have and what needs attention."

Minimal operational inventory interface.

------------------------------------------------------------------------

## Lab Technician

Mental model:

> "Help me process today's diagnostic workload."

Queue-first diagnostic interface.

------------------------------------------------------------------------

## Facility Owner

Mental model:

> "Help me operate and coordinate my facility."

Facility command-center approach.

------------------------------------------------------------------------

## DHO

Mental model:

> "Show me where the district is underperforming."

Dense desktop analytics are appropriate.

------------------------------------------------------------------------

# 12. RESPONSIVE DESIGN

Responsive behavior must be intentional.

Do not simply shrink desktop layouts.

## Desktop-first roles

-   DHO
-   Facility Owner

Can use:

-   multi-column layouts,
-   tables,
-   analytical grids,
-   side panels,
-   dense monitoring.

## Mobile-first roles

-   Patient
-   ASHA
-   field workflows

Use:

-   one-column layouts,
-   large targets,
-   bottom navigation where appropriate,
-   thumb-friendly controls.

## Clinical roles

Responsive desktop/tablet with appropriate mobile support.

------------------------------------------------------------------------

# 13. MOBILE-FIRST ASHA RULE

The ASHA dashboard is fundamentally different from the DHO dashboard.

ASHA:

``` text
Queue
 ↓
Task
 ↓
Action
 ↓
Completion
```

DHO:

``` text
Metrics
 ↓
Pattern
 ↓
Comparison
 ↓
Drill-down
 ↓
Escalation
```

Do not apply the DHO information model to ASHA.

Do not apply the ASHA task-queue model to DHO.

------------------------------------------------------------------------

# 14. DHO VISUAL REFERENCE RULE

The DHO dashboard may use:

-   data tables,
-   heatmaps,
-   bar charts,
-   line trends,
-   funnels,
-   facility comparisons.

But it must remain:

> **healthcare monitoring UI, not a generic BI dashboard.**

Every visualization should answer a real Setu question:

-   wait time,
-   referral completion,
-   stock-out,
-   facility performance,
-   disease/issue concentration,
-   capacity,
-   high-risk cohort backlog.

------------------------------------------------------------------------

# 15. DATA VISUALIZATION STYLE

Use:

-   Recharts
-   lightweight mapping solution

Prefer:

-   horizontal bars,
-   simple lines,
-   heatmaps,
-   funnels,
-   sortable tables.

Avoid:

-   3D charts,
-   gauge dashboards,
-   decorative pie charts,
-   excessive gradients,
-   chartjunk.

Semantic palette:

``` text
Normal → teal/green
Warning → amber
Critical → muted red
```

Do not use five different semantic colors in one chart.

------------------------------------------------------------------------

# 16. DASHBOARD DENSITY

Density depends on the role.

### Patient

Low density.

### ASHA

Low-to-medium density, task-focused.

### Clinical

Medium density.

### Pharmacy/Lab

Medium operational density.

### Facility

Medium-high density.

### DHO

High information density, but organized.

High density does NOT mean:

> "Put everything on screen."

It means:

> "Allow more useful information to be scanned efficiently."

------------------------------------------------------------------------

# 17. NAVIGATION

Navigation should be visible and predictable.

Patient:

-   Sidebar/appropriate navigation according to existing design.

ASHA mobile:

``` text
Queue
Patients
Reports
Profile
```

DHO desktop:

Use clear desktop navigation appropriate to the existing Setu design.

Do not introduce hamburger-only navigation for critical desktop
workflows.

Do not create unnecessary navigation categories.

------------------------------------------------------------------------

# 18. VOICE UI

Voice is a first-class interaction in relevant workflows.

Especially ASHA.

When active:

``` text
Voice Input
    ↓
Bottom Sheet on Mobile
Side Panel on Desktop
```

Show:

-   live transcription,
-   selected language,
-   spoken confirmation,
-   large Confirm,
-   large Cancel.

Example:

> "Logging visit for Sunita Devi --- confirm?"

Do not make the worker decipher a tiny confirmation dialog.

------------------------------------------------------------------------

# 19. OFFLINE VISUAL STATES

Offline is a product state, not an error.

For offline-capable workflows show:

``` text
✓ Synced
⟳ Syncing...
⚠ Offline — 4 records queued
```

Individual actions should show:

``` text
Queued for sync
```

Do not use:

``` text
Network Error
```

as the only user feedback.

The worker should understand:

> "My action was saved and will sync later."

------------------------------------------------------------------------

# 20. LOADING STATES

Use skeletons for major dashboard content.

Avoid blocking spinners for entire pages when partial content can remain
usable.

Good:

``` text
Metric skeleton
Table skeleton
Chart skeleton
```

Bad:

``` text
Full-screen spinner
"Loading..."
```

Especially avoid blocking the ASHA workflow due to network latency.

------------------------------------------------------------------------

# 21. EMPTY STATES

Never leave an unexplained blank area.

Good:

> "All caught up for today."

or:

> "Data will populate as facilities report."

or:

> "No pending referrals."

An empty state should explain:

1.  What is empty?
2.  Whether this is normal.
3.  What the user can do next, if anything.

------------------------------------------------------------------------

# 22. ERROR STATES

Errors must be:

-   human-readable,
-   actionable,
-   non-technical.

Prefer:

> "We couldn't sync this visit. It is still saved on this device and
> will retry."

Instead of:

> "HTTP 500 / mutation failed."

Technical details can exist in logs, not as the primary UX.

------------------------------------------------------------------------

# 23. ACCESSIBILITY

Every Stitch-derived component must be evaluated for:

-   keyboard navigation,
-   focus states,
-   screen-reader labels,
-   sufficient contrast,
-   semantic HTML,
-   touch target size,
-   form labels,
-   error announcements.

Never rely only on:

-   color,
-   icon,
-   hover,
-   animation.

Example:

A critical facility should not be identified only by red.

Use:

``` text
red indicator
+
status text
+
meaningful icon where appropriate
```

------------------------------------------------------------------------

# 24. LOCALIZATION

Support:

``` text
English
मराठी
हिंदी
```

Design must survive longer translated strings.

Do not assume English text lengths.

Avoid:

``` text
width: fixed-small
overflow: hidden
```

for important translated UI.

Do not hardcode strings throughout components.

------------------------------------------------------------------------

# 25. PRIVACY-AWARE UI

The visual design must respect role boundaries.

DHO:

-   aggregate information by default.

Facility:

-   facility-scoped information.

ASHA:

-   assigned household/patient information only.

Patient:

-   own information.

Clinical roles:

-   only information necessary for authorized clinical workflows.

Never show sensitive data simply because there is available space in a
UI.

------------------------------------------------------------------------

# 26. TABLE DESIGN

Desktop tables may be dense, but:

-   maintain row height,
-   preserve readable typography,
-   clearly distinguish headers,
-   support sorting only where useful,
-   make clickable rows visually obvious,
-   avoid excessive columns.

For mobile:

Do not force a 10-column desktop table into a tiny screen.

Use:

-   condensed rows,
-   cards,
-   horizontal scrolling only when genuinely appropriate,
-   progressive detail.

------------------------------------------------------------------------

# 27. FORMS

Forms should be:

-   short,
-   grouped logically,
-   clearly labelled,
-   validated,
-   localized.

Do not create a huge form when the user only needs three pieces of
information.

For field workflows:

> voice/manual entry should be considered wherever appropriate.

------------------------------------------------------------------------

# 28. BUTTON HIERARCHY

Each screen should have a clear primary action.

Recommended:

``` text
Primary
Secondary
Tertiary
```

Do not give five buttons equal visual weight.

For ASHA:

Primary action should be obvious immediately.

For DHO:

The primary interaction may be selecting/filtering/inspecting rather
than "Submit."

------------------------------------------------------------------------

# 29. ALERT VISUAL HIERARCHY

Use restrained severity.

``` text
Normal
↓
Attention
↓
Warning
↓
Critical
```

Amber should communicate attention without causing panic.

Muted red should be reserved for genuinely critical states.

Do not turn every overdue item bright red.

------------------------------------------------------------------------

# 30. MOTION

Use Framer Motion only where it communicates state.

Good:

-   task completion,
-   sync completion,
-   count-up metrics,
-   filter transitions,
-   expanding detail.

Bad:

-   elaborate entrance animations,
-   bouncing cards,
-   constant movement,
-   decorative floating elements.

------------------------------------------------------------------------

# 31. STITCH FILE REVIEW CHECKLIST

Before implementing a screen from Stitch, inspect:

### Layout

-   What is the main content hierarchy?
-   What is above the fold?
-   What is primary?
-   What is secondary?

### Spacing

-   page padding,
-   card padding,
-   section spacing,
-   row spacing.

### Typography

-   heading scale,
-   body size,
-   label size,
-   weight hierarchy.

### Components

-   buttons,
-   cards,
-   tabs,
-   navigation,
-   inputs,
-   tables,
-   alerts,
-   dialogs.

### Color

-   background,
-   surface,
-   border,
-   primary,
-   semantic states.

### Responsive behavior

-   what collapses?
-   what stacks?
-   what disappears?
-   what becomes scrollable?

### Interaction

-   what is clickable?
-   what expands?
-   what navigates?
-   what confirms?

Extract these patterns before implementing.

------------------------------------------------------------------------

# 32. STITCH AS A DESIGN REFERENCE, NOT A LIMIT

If the Stitch design does not cover a required state, create it using
the same design language.

Examples:

Stitch has:

``` text
Healthy dashboard
```

but production needs:

``` text
Offline
Empty
Error
Loading
Permission denied
Critical alert
```

Build those states consistently with Stitch.

Do not wait for a new Stitch screen for every edge case.

------------------------------------------------------------------------

# 33. DO NOT INVENT RANDOM NEW STYLES

If you need a new component:

First ask:

> "Does Setu already have a visual pattern for this?"

If yes:

> Reuse it.

If no:

> Create the smallest component consistent with the existing token
> system.

Do not introduce:

-   new font,
-   new radius system,
-   new shadow system,
-   new primary color,
-   unrelated icon library,
-   unrelated UI framework.

------------------------------------------------------------------------

# 34. CODE QUALITY FOR DESIGN

UI implementation should be:

-   reusable,
-   semantic,
-   responsive,
-   accessible,
-   typed,
-   maintainable.

Prefer:

``` tsx
<MetricCard
  label="Referral Completion"
  value="86%"
  trend="+4.2%"
/>
```

over repeatedly writing the same markup for every dashboard.

------------------------------------------------------------------------

# 35. MOCK DATA RULE

Stitch often contains demonstration/mock data.

Treat it as:

> **visual placeholder data only**

Do not assume mock values are real business requirements.

For production:

``` text
Mock UI
 ↓
Domain model
 ↓
API
 ↓
Authorization
 ↓
Database
```

Do not hardcode fake production records into the final dashboard.

------------------------------------------------------------------------

# 36. DESIGN TOKEN RULE

If the repository already contains CSS variables/tokens:

**USE THEM.**

Do not recreate:

``` css
--primary
--background
--radius
```

with different values inside individual pages.

Extend the system only when necessary.

Role-specific density can be layered through semantic variants such as:

``` text
field mode
clinical mode
operations mode
analytics mode
```

but they must remain within the same Setu design family.

------------------------------------------------------------------------

# 37. SCREEN IMPLEMENTATION PROCESS

For every new screen:

``` text
STEP 1
Read MEMORY.md

STEP 2
Find relevant Stitch screen(s)

STEP 3
Study the Stitch design

STEP 4
Identify reusable Setu components

STEP 5
Identify role + permissions

STEP 6
Define information hierarchy

STEP 7
Implement desktop/mobile behavior

STEP 8
Implement loading / empty / error / offline states

STEP 9
Implement localization

STEP 10
Implement accessibility

STEP 11
Connect real data

STEP 12
Test

STEP 13
Compare final UI against Stitch reference

STEP 14
Fix visual drift
```

------------------------------------------------------------------------

# 38. VISUAL QA

After implementation, compare the production screen against the Stitch
reference.

Check:

-   overall hierarchy,
-   spacing,
-   typography,
-   card sizes,
-   alignment,
-   colors,
-   borders,
-   iconography,
-   navigation,
-   responsive behavior.

Do not chase pixel-perfect similarity at the expense of:

-   accessibility,
-   real content,
-   responsive behavior,
-   actual workflow correctness.

The goal is:

> **faithful design intent + production-quality UX**

------------------------------------------------------------------------

# 39. IF MULTIPLE STITCH SCREENS EXIST

When several Stitch screens exist:

1.  Identify common patterns.
2.  Establish shared components.
3.  Identify role-specific variations.
4.  Avoid duplicating identical patterns.
5.  Preserve consistency across screens.

Example:

``` text
Patient Dashboard
ASHA Dashboard
DHO Dashboard
       ↓
Shared Setu Design Tokens
       ↓
Shared primitives
       ↓
Role-specific composition
```

------------------------------------------------------------------------

# 40. FINAL RULE

Whenever you are asked:

> "Build a new Setu screen"

the default assumption is:

**There should already be a Stitch reference to study if one exists.**

Before creating the design from scratch:

``` text
SEARCH PROJECT
      ↓
FIND STITCH FILE
      ↓
STUDY IT
      ↓
REUSE DESIGN LANGUAGE
      ↓
IMPLEMENT PROPERLY
```

If no relevant Stitch reference exists:

``` text
Use existing Setu design tokens
+
existing components
+
MEMORY.md
+
role requirements
```

and create a new screen that looks like it belongs to the same product.

------------------------------------------------------------------------

# 41. ANTIGRAVITY FINAL DIRECTIVE

**Do not treat Stitch as disposable inspiration.**

Treat it as the project's **approved visual reference layer**.

Use it to understand exactly how Setu is intended to look and feel.

However:

> **Stitch defines visual direction. Product requirements define
> behavior. Backend/domain architecture defines data and authorization.
> Accessibility, responsiveness and offline requirements define
> production constraints.**

The final result must combine all four.

``` text
             STITCH
        Visual Reference
              +
        SETU DESIGN TOKENS
              +
       PRODUCT REQUIREMENTS
              +
       REAL DOMAIN LOGIC
              +
      SECURITY / RBAC / SCOPE
              +
      RESPONSIVE / ACCESSIBLE
              +
          OFFLINE UX
              ↓
       PRODUCTION SETU UI
```

**Never blindly copy. Never ignore. Study → extract → reuse → implement
→ validate.**
