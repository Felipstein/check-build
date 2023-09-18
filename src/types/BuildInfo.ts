export type BuildInfoType = 'error'

export interface BuildInfo {
  id: string
  deployId: string
  projectName: string
  commitAuthor: {
    authorName: string
    message: string
    org: string
    ref: string
    repo: string
    sha: string
  }
  links: {
    deploy: string
    project: string
  }
  createdAt: Date
  type: BuildInfoType
}
