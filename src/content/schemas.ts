import { z } from 'zod'

/**
 * Content schemas, shared by the app (at load) and scripts/validate-content.ts
 * (before every build). See the README for how to edit each file.
 */

/** A visitor-facing text: English is required; Gujarati and Hindi are expected. */
export const localizedText = z.strictObject({
  en: z.string().trim().min(1, 'English text is required'),
  gu: z.string().optional(),
  hi: z.string().optional(),
})
export type LocalizedTextData = z.infer<typeof localizedText>

export const audience = z.enum(['bhulkao', 'yuvako'])
export type Audience = z.infer<typeof audience>

/** Ids appear in URLs: lowercase letters, digits and hyphens. */
export const contentId = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'use lowercase letters, digits and hyphens only')

/** A file name inside content/images/. */
export const imageFile = z
  .string()
  .regex(/^[\w.-]+\.(svg|png|jpe?g|webp|gif|avif)$/i, 'must be a file name in content/images/')

const sourceNote = z.string().trim().min(1, 'record where the picture comes from (source)')

export const storyImage = z.strictObject({
  src: imageFile,
  alt: localizedText,
  source: sourceNote,
})

export const storyVideo = z.strictObject({
  src: z.string().min(1),
  poster: imageFile.optional(),
  alt: localizedText,
  captions: z.string().optional(),
  source: sourceNote,
})

export const storyChoice = z.strictObject({
  label: localizedText,
  next: z.string().min(1),
})

export const storyEnding = z.strictObject({
  outcome: localizedText,
  lesson: localizedText,
})

export const storyNode = z.strictObject({
  id: z.string().min(1),
  text: localizedText,
  image: storyImage.optional(),
  video: storyVideo.optional(),
  choices: z.array(storyChoice).optional(),
  ending: storyEnding.optional(),
})

export const story = z.strictObject({
  id: contentId,
  audience,
  title: localizedText,
  startNode: z.string().min(1),
  nodes: z.array(storyNode).min(1),
  placeholder: z.boolean().default(false),
})
export type Story = z.infer<typeof story>
export type StoryNode = z.infer<typeof storyNode>

/** Front matter of a prasang file (one file per language). */
export const prasangFrontMatter = z.strictObject({
  id: contentId,
  audience,
  title: z.string().trim().min(1),
  moral: z.string().trim().min(1),
  images: z
    .array(
      z.strictObject({
        src: imageFile,
        source: sourceNote,
        /** Alt text for the cover (the first image), which is not placed in the body. */
        alt: z.string().optional(),
      }),
    )
    .default([]),
  placeholder: z.boolean().default(false),
})
export type PrasangFrontMatter = z.infer<typeof prasangFrontMatter>

export const pillSource = z.strictObject({
  text: localizedText,
  url: z.url().optional(),
})

export const pillCard = z.strictObject({
  path: z.enum(['red', 'blue']),
  text: localizedText,
  source: pillSource.nullable(),
  placeholder: z.boolean().default(false),
})

export const pills = z.strictObject({
  /** Where the green pill leads. null until the owner supplies it (shows an on-site placeholder screen). */
  greenPillUrl: z.url().nullable(),
  cards: z.array(pillCard),
})
export type Pills = z.infer<typeof pills>
export type PillCard = z.infer<typeof pillCard>

export const wordEntry = z.strictObject({
  word: z.string().regex(/^[a-z]{3,10}$/, 'lowercase a-z only, 3 to 10 letters'),
  native: z.strictObject({ gu: z.string().optional(), hi: z.string().optional() }).optional(),
  meaning: localizedText,
  reflection: localizedText,
  placeholder: z.boolean().default(false),
})

export const words = z.strictObject({
  words: z.array(wordEntry).min(1),
})
export type WordEntry = z.infer<typeof wordEntry>

export const doodleItem = z
  .strictObject({
    label: localizedText,
    kind: z.enum(['positive', 'negative']),
    icon: z.string().min(1),
    explanation: localizedText.optional(),
    placeholder: z.boolean().default(false),
  })
  .refine((item) => item.kind === 'positive' || item.explanation !== undefined, {
    message: 'a negative item needs an explanation',
    path: ['explanation'],
  })

export const doodleConfig = z.strictObject({
  /** Falling speed at the start, in play-area pixels per second (the play area is 360 wide). */
  startSpeed: z.number().positive(),
  /** How much the falling speed rises each second. */
  speedRamp: z.number().min(0),
  /** The falling speed never goes above this. */
  maxSpeed: z.number().positive(),
  /** Seconds between new items. */
  spawnInterval: z.number().positive(),
  /** Share of items that are negative, from 0 to 1. */
  negativeShare: z.number().min(0).max(1),
})

export const doodle = z.strictObject({
  config: doodleConfig,
  items: z.array(doodleItem).min(2),
})
export type DoodleContent = z.infer<typeof doodle>
export type DoodleItemData = z.infer<typeof doodleItem>
