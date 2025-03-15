'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\admin\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'
import { presentationTool } from "sanity/presentation";

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
 
  schema,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
  ],
  beta: {
    create: {
      startInCreateEnabled: true,
      fallbackStudioOrigin: "venture-media.sanity.studio",
    },
  },
})
