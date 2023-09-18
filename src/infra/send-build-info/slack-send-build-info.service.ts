import axios, { AxiosInstance } from 'axios'
import { SendBuildInfoService } from '../../services/send-build-info.service'
import { BuildInfo } from '../../types/BuildInfo'
import {
  ConversationsListResponse,
  PostMessageRequest,
  PostMessageResponse,
  SlackGenericResponse,
} from './slack.dto'

export class SlackSendBuildInfoService implements SendBuildInfoService {
  constructor(private readonly api: AxiosInstance) {}

  async send(buildInfo: BuildInfo) {
    const channel = await this._getChannel(process.env.SLACK_CHANNEL_NAME!)

    await this._postMessage(
      channel.id,
      'Ocorreu um erro no deploy da metrito-web:',
      [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Ocorreu um erro no deploy da metrito-web:',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '```\n' + JSON.stringify(buildInfo, null, 2) + '\n```',
          },
        },
      ],
    )
  }

  private async _getConversationsList() {
    const { data } = await this.api.get<ConversationsListResponse>(
      '/conversations.list',
    )

    const channels = data.channels

    if (!channels || channels.length === 0) {
      throw new Error('No channels found.')
    }

    return channels
  }

  private async _getChannel(channelName: string) {
    const channels = await this._getConversationsList()

    const channel = channels.find((channel) => channel.name === channelName)

    if (!channel) {
      throw new Error(`Channel #${channelName} not found.`)
    }

    return channel
  }

  private async _postMessage(
    channelId: string,
    text: string,
    blocks: PostMessageRequest['blocks'],
  ) {
    const messagePayload: PostMessageRequest = {
      channel: channelId,
      text,
      blocks,
    }

    const { data } = await this.api.post<PostMessageResponse>(
      '/chat.postMessage',
      messagePayload,
    )

    return data
  }
}

const slackApi = axios.create({
  baseURL: 'https://slack.com/api/',
  headers: {
    Authorization: `Bearer ${process.env.SLACK_OAUTH_USER_TOKEN}`,
  },
})

slackApi.interceptors.response.use((response) => {
  const data = response.data as SlackGenericResponse<unknown>

  if (!data.ok) {
    const firstMessage =
      data.response_metadata?.messages?.[0] || data.error === 'missing_scope'
        ? data.needed
        : 'Unknown error'

    throw new Error(`${data.error}: ${firstMessage}`)
  }

  return response
})

const slackSendBuildInfoService = new SlackSendBuildInfoService(slackApi)

export { slackSendBuildInfoService, slackApi }
