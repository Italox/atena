import config from 'config-yml'
import messages from '../messages'
import dal from './githubDAL'

const normalizeCommon = data => {
  return {
    origin: data.origin,
    type: data.type,
    user: data.user,
    thread: false,
    action: config.actions.github.type,
    category: config.categories.network.type
  }
}

const normalizeIssue = data => {
  return {
    description: 'new github issue',
    channel: data.repository.id,
    score: config.xprules.github.issue
  }
}

const normalizeReview = data => {
  return {
    description: 'review',
    channel: data.review.id,
    score: config.xprules.github.review
  }
}

const normalizePullRequest = data => {
  return {
    description: 'review',
    channel: data.pull_request.id,
    score: config.xprules.github.pull_request
  }
}

const normalizeMergedPullRequest = data => {
  return {
    description: 'merged pull request',
    channel: data.pull_request.id,
    score: config.xprules.github.merged_pull_request
  }
}

const normalize = data => {
  const normalizeTypes = {
    issue: normalizeIssue(data),
    review: normalizeReview(data),
    pull_request: normalizePullRequest(data),
    merged_pull_request: normalizeMergedPullRequest(data)
  }

  return {
    ...normalizeCommon(data),
    ...normalizeTypes[data.type]
  }
}

const sendMessage = async user => {
  const response = {
    msg: `Olá @${user.username} acabou de ganhar pontos ao contribuir nos nossos projetos open source`
  }

  messages.sendToRoom(response, 'open-source')
}

const isValidRepository = async repositoryId => {
  const repositories = await dal.findAllRepositories()
  return repositories.includes(repositoryId)
}

const isExcludedUser = async (repositoryId, userId) => {
  return dal.findExcludedUser(repositoryId, userId)
}

export default {
  isExcludedUser,
  normalize,
  sendMessage,
  isValidRepository
}
