import { Application } from 'probot' // eslint-disable-line no-unused-vars
import {
  OnCallback
} from 'probot/lib/application'
import Webhooks from '@octokit/webhooks'

import FileBox from 'file-box'

let n = 0

const commentIssue: OnCallback<Webhooks.WebhookPayloadIssueComment> = async (context) => {
  // const issue = context .issue()
  console.info(context.payload.repository)
  const fullName = context.payload.repository.full_name
  const issueNumber = context.payload.issue.number
  const issueTitle = context.payload.issue.title
  const commentBody = context.payload.comment.body
  const htmlUrl = context.payload.comment.html_url
  const avatarUrl = context.payload.comment.user.avatar_url

  const title = [
    fullName,
    `#${issueNumber}`,
    issueTitle.slice(0, Math.max(issueTitle.length, 30)),
  ].join(' ')
  const url = htmlUrl
  const description = commentBody.slice(0, Math.max(commentBody.length, 70))
  const thumbnailUrl = avatarUrl

  const webhook = [
    'https://oss-bot.kaiyuanshe.cn/webhook/',
      [
        `url=${encodeURIComponent(url)}`,
        `description=${encodeURIComponent(description)}`,
        `thumbnailUrl=${encodeURIComponent(thumbnailUrl)}`,
        `title=${encodeURIComponent(title)}`,
      ].join('&'),
    ].join('?')

  const result = (await FileBox.fromUrl(webhook).toBuffer()).toString()
  console.info('url:', webhook)
  console.info('result:', result)

  // const issueComment = context.issue({ body: `Thanks for comment this issue! ${n++}` })
  // await context.github.issues.createComment(issueComment)
  // console.info(context)
}

export = (app: Application) => {
  app.on('issue_comment.created', commentIssue)

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
