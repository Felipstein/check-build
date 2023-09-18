import { BuildInfo } from '../../types/BuildInfo'
import { VercelBuildPayload } from './vercel-build-payload'

export default class VercelBuildPayloadMapper {
  mapToBuildInfo(payload: VercelBuildPayload): BuildInfo {
    return {
      id: payload.id,
      deployId: payload.payload.deployment.id,
      projectName: payload.payload.deployment.name,
      commitAuthor: {
        authorName: payload.payload.deployment.meta.githubCommitAuthorName,
        message: payload.payload.deployment.meta.githubCommitMessage,
        org: payload.payload.deployment.meta.githubCommitOrg,
        ref: payload.payload.deployment.meta.githubCommitRef,
        repo: payload.payload.deployment.meta.githubCommitRepo,
        sha: payload.payload.deployment.meta.githubCommitSha,
      },
      links: {
        deploy: payload.payload.links.deployment,
        project: payload.payload.links.project,
      },
      createdAt: new Date(payload.createdAt),
      type: this._mapPayloadType(payload.type),
    }
  }

  private _mapPayloadType(type: VercelBuildPayload['type']): BuildInfo['type'] {
    switch (type) {
      case 'deployment.error':
      default:
        return 'error'
    }
  }
}

export const vercelBuildPayloadMapper = new VercelBuildPayloadMapper()
