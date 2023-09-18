import { z } from 'zod'

/**
 * No momento, o webhook do vercel está configurado somente para aceitar deployment.error
 */
export const vercelBuildPayloadTypes = ['deployment.error'] as const

// export const vercelBuildPayloadTypes = [
//   'deployment.created',
//   'deployment.error',
//   'deployment.canceled',
//   'deployment.succeeded',
// ]

export const vercelBuildPayload = z.object({
  id: z.string(),
  payload: z.object({
    user: z.object({
      id: z.string(),
    }),
    team: z.object({
      id: z.string(),
    }),
    deployment: z.object({
      id: z.string(),
      meta: z.object({
        githubCommitAuthorName: z.string(),
        githubCommitMessage: z.string(),
        githubCommitOrg: z.string(),
        githubCommitRef: z.string(),
        githubCommitRepo: z.string(),
        githubCommitSha: z.string(),
        githubDeployment: z.string(),
        githubOrg: z.string(),
        githubRepo: z.string(),
        githubRepoOwnerType: z.string(),
        githubCommitRepoId: z.string(),
        githubRepoId: z.string(),
        githubRepoVisibility: z.string(),
        githubCommitAuthorLogin: z.string(),
        branchAlias: z.string(),
      }),
      name: z.string(),
      url: z.string(),
      inspectorUrl: z.string(),
    }),
    links: z.object({
      deployment: z.string(),
      project: z.string(),
    }),
    name: z.string(),
    plan: z.string(),
    project: z.object({
      id: z.string(),
    }),
    regions: z.array(z.string()),
    target: z.any(),
    type: z.string(),
    url: z.string(),
  }),
  createdAt: z.number(),
  type: z.enum(vercelBuildPayloadTypes),
})

export type VercelBuildPayloadTypes = (typeof vercelBuildPayloadTypes)[number]

export type VercelBuildPayload = z.infer<typeof vercelBuildPayload>
