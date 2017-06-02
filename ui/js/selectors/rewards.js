import { createSelector } from 'reselect'
import {
  selectUser
} from 'selectors/user'

const _selectState = state => state.rewards || {}

export const selectRewardsByType = createSelector(
  _selectState,
  (state) => state.byRewardType || {}
)

export const selectRewards = createSelector(
  selectRewardsByType,
  (byType) => Object.values(byType) || []
)

export const selectIsRewardEligible = createSelector(
  selectUser,
  (user) => user.can_claim_rewards
)

export const selectClaimedRewards = createSelector(
  selectRewards,
  (rewards) => rewards.filter(reward => reward.transaction_id !== "")
)

export const selectClaimedRewardsByType = createSelector(
  selectClaimedRewards,
  (claimedRewards) => {
    const byType = {}
    claimedRewards.forEach(reward => byType[reward.reward_type] = reward)
    return byType
  }
)

export const selectFetchingRewards = createSelector(
  _selectState,
  (state) => !!state.fetching
)

export const selectHasClaimedReward = (state, props) => {
  return !!selectClaimedRewardsByType[props.reward.reward_type]
}

export const makeSelectHasClaimedReward = () => {
  return createSelector(
    selectHasClaimedReward,
    (claimed) => claimed
  )
}

export const selectClaimsPendingByType = createSelector(
  _selectState,
  (state) => state.claimPendingByType
)

const selectIsClaimRewardPending = (state, props) => {
  return selectClaimsPendingByType(state, props)[props.reward.reward_type]
}

export const makeSelectIsRewardClaimPending = () => {
  return createSelector(
    selectIsClaimRewardPending,
    (isClaiming) => isClaiming
  )
}

export const selectClaimErrorsByType = createSelector(
  _selectState,
  (state) => state.claimErrorsByType
)

const selectClaimRewardError = (state, props) => {
  return selectClaimErrorsByType(state, props)[props.reward.reward_type]
}

export const makeSelectClaimRewardError = () => {
  return createSelector(
    selectClaimRewardError,
    (errorMessage) => errorMessage
  )
}

const selectRewardByType = (state, props) => {
  return selectRewardsByType(state)[props.reward_type]
}

export const makeSelectRewardByType = () => {
  return createSelector(
    selectRewardByType,
    (reward) => reward
  )
}
