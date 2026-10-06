# Motion Design System

You are operating a reusable motion-design system for premium business videos.

Motion is part of communication.

Never animate something simply because animation is available.
Every visual, layout decision, and motion event must support the narration.

The system is reusable across videos.
Never create one-off visual rules for a single video when the rule can become a reusable component, primitive, archetype, layout rule, or registry entry.

---

## Core Visual Language

The visual language follows:

Shape
→ Line
→ Node
→ System
→ Data
→ Interface
→ Outcome

Prefer visuals that explain:

- systems
- relationships
- workflows
- data
- decisions
- interfaces
- business outcomes

Avoid visuals that exist only to decorate the frame.

Do not default to:
- robots
- generic AI brains
- cyberpunk
- stock technology imagery
- random particles
- excessive gradients
- rainbow colors
- template-like social media layouts

---

## Composition

Default social-video canvas:

- width: 1080
- height: 1920
- aspect ratio: 9:16

Treat the frame as a composition, not an empty canvas.

### Safe Area

Keep primary content inside:

- top: 120px minimum
- left: 72px minimum
- right: 72px minimum
- bottom: 150px minimum

Do not place important text or UI near the physical frame edges.

### Vertical Hierarchy

Use three primary zones:

1. Title zone
2. Visual zone
3. Supporting / CTA zone

Default visual structure:

- title: approximately 120–400px
- visual: approximately 500–1550px
- footer / CTA: approximately 1650–1800px

These are defaults, not hardcoded requirements.

A scene may intentionally deviate when the narrative requires it.

---

## Visual Scale

Primary visual elements must be immediately readable at 1080x1920.

Avoid:

- tiny diagrams
- oversized elements touching edges
- empty center with tiny content
- visual groups occupying less than approximately 45% of the available visual area without narrative reason

Prefer:

- one dominant visual
- one supporting visual group
- strong hierarchy
- deliberate negative space

When a scene contains multiple elements, establish:

1. primary element
2. secondary elements
3. supporting details

Never give every element equal visual weight.

---

## Layout Rules

Use reusable layout primitives.

Prefer:

- centered composition
- controlled horizontal grouping
- controlled vertical stacking
- balanced asymmetric composition
- grid-based positioning
- safe-area aware positioning

Avoid arbitrary pixel coordinates scattered throughout scene files.

Reusable layout values belong in the design system.

Scene-specific layout should reference the reusable layout system rather than inventing unrelated coordinates.

---

## Text

Text should:

1. enter once
2. settle
3. remain stable
4. emphasize only important information

Do not continuously animate paragraphs.

### Text hierarchy

Prefer:

- one primary statement
- optional highlighted phrase
- minimal supporting text

Never turn narration into a transcript on screen.

The viewer should understand the visual without reading every spoken word.

### Arabic

Arabic is RTL-native.

Do not treat Arabic as an afterthought.

Prefer:

- RTL-aware alignment
- correct Arabic typography
- appropriate line height
- sufficient width for Arabic words
- visually balanced Arabic blocks

Do not squeeze Arabic text into narrow containers.

---

## Motion Hierarchy

Motion priority:

1. Narrative transition
2. Information reveal
3. Relationship / connection
4. Emphasis
5. Resolution

If two animations compete, remove the lower-priority animation.

---

## Motion Intensity

Default:

- opacity: subtle
- translation: 8–40px
- entrance scale: 0.92–1.0
- emphasis scale: maximum 1.04
- no repeated zoom loops
- no uncontrolled bouncing
- no constant movement

Motion should feel:

- precise
- smooth
- intentional
- controlled

Motion should never feel:

- random
- noisy
- game-like
- template-like

---

## Element Motion

Motion belongs primarily to individual elements.

### Text

Use:

- fade
- short directional slide
- emphasis

### Metric

Use:

- count
- settle
- highlight

### Node

Use:

- appear
- connect
- pulse

### Path

Use:

- draw
- flow

### Data Packet

Use:

- travel along an existing path

### Phone

Use:

- enter
- settle
- focus
- state change

Do not repeatedly scale the phone.

### Dashboard

Use:

- build
- populate
- highlight
- state transition

Do not animate the entire dashboard container unnecessarily.

### System

Use:

- node reveal
- connection draw
- packet flow
- active-path highlight

---

## Scene Motion Rule

A scene must NOT receive arbitrary global transforms merely because it is entering the timeline.

Do not globally apply:

- opacity reveal
- scale reveal
- translate reveal
- rotation

to an entire scene that already contains its own animated elements.

Global scene motion can cause:

- black flashes
- flicker
- repeated reveals
- visual jumps
- competing motion

If a scene has an opaque background, that background must remain continuously visible throughout the scene.

Scene-level transition should normally be handled by timeline composition and element-level motion.

---

## Sequence / Timeline Safety

Adjacent scenes must never create intentional black gaps.

Every frame must have visual coverage.

When using Remotion `Sequence`:

- understand that child frames are local to the Sequence
- do not restart scene-wide reveal animations unnecessarily
- do not depend on global frame values when local scene timing is intended
- do not create transparent scene states that expose the renderer background

---

## Archetypes

Use archetypes for recurring narrative structures.

Examples:

- hero-question
- usage-counter
- appearance-to-utility
- fragmented-customer-journey
- unified-customer-journey
- business-insights-dashboard
- customer-retention-loop
- competition-pressure
- missed-opportunities
- digital-transformation
- custom-app-solution
- brand-cta

An archetype is reusable.

If a new scene resembles an existing archetype, extend the archetype with a variant instead of creating an unrelated duplicate.

---

## Primitive vs Archetype

Use a primitive when:

- the visual is simple
- one concept is being communicated
- the visual can be reused independently

Use an archetype when:

- several primitives work together
- the composition represents a recurring narrative structure
- layout and motion need coordinated behavior

Never use primitives merely to avoid creating a reusable archetype.

Never create an archetype for a one-off decorative object.

---

## Motion Registry

Reusable motion belongs in the motion registry.

Examples:

- build
- connect
- flow
- transform
- reveal
- compare
- emphasize
- resolve

Do not hardcode arbitrary motion timing repeatedly across scenes.

If a new motion pattern is genuinely reusable, add it to the registry.

---

## Layout Registry

Reusable dimensions belong in the layout system.

Examples:

- safe margins
- title zone
- visual zone
- footer zone
- phone width
- dashboard width
- node size
- journey item size
- metric size
- card width

Do not invent independent values in every scene.

---

## Timing

Default motion timing:

- quick: ~150ms
- standard: ~250ms
- meaningful reveal: ~400ms
- major transformation: ~700ms

In frame-based Remotion work, translate these concepts into frame durations using the active FPS.

Motion timing must respect narration.

Do not finish important visual information long before the narration explains it.

Do not reveal critical information after the narration has already moved on.

---

## Visual-Narration Alignment

For every scene ask:

1. What is being said?
2. What is the key idea?
3. What should the viewer see?
4. What changes visually?
5. What should remain stable?

The visual should communicate the key idea, not simply illustrate keywords.

---

## Density

Default:

- one dominant visual concept per scene
- 1–3 supporting elements
- limited text
- controlled empty space

If the frame feels crowded:

1. remove secondary elements
2. reduce text
3. increase spacing
4. simplify motion

Do not solve crowding by shrinking everything.

---

## Transitions

Prefer:

- crossfade
- directional flow
- shared-element continuity
- transform
- state transition

Avoid:

- hard black cuts
- arbitrary zoom transitions
- repeated scale transitions
- unrelated scene movement
- decorative wipes with no narrative purpose

---

## Visual QA

Before accepting a scene verify:

### Composition

- dominant element is obvious
- content is centered or intentionally offset
- safe areas are respected
- no important element touches the frame edge
- visual scale is readable at 1080x1920

### Typography

- hierarchy is obvious
- Arabic is readable
- no text overflow
- no unnecessary paragraphs
- important words are emphasized intentionally

### Motion

- motion has a purpose
- no repeated zoom
- no excessive bouncing
- no competing animations
- elements settle after entering

### Timeline

- no black frames
- no transparent scene flash
- no accidental animation reset
- no unexplained visual jump

---

## Reusability Rule

The agent must continuously improve the reusable system.

When solving a problem ask:

"Is this a video-specific fix or a reusable system rule?"

If reusable:

- update the design system
- update the archetype
- update the primitive
- update the motion registry
- update the layout system
- or update the relevant skill

Do not permanently solve recurring problems with one-off scene hacks.

---

## Quality Principle

The goal is not maximum animation.

The goal is:

Clear idea
+ strong composition
+ readable hierarchy
+ meaningful motion
+ business relevance
= professional motion graphics
