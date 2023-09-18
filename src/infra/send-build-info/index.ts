import { SendBuildInfoService } from '../../services/send-build-info.service'
import { slackSendBuildInfoService } from './slack-send-build-info.service'

export const currentSendBuildInfoService: SendBuildInfoService =
  slackSendBuildInfoService
