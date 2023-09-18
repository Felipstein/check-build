import { BuildInfo } from '../types/BuildInfo'

export interface SendBuildInfoService {
  send(buildInfo: BuildInfo): Promise<void>
}
