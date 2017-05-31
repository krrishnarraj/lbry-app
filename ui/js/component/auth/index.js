import React from 'react'
import {
  connect,
} from 'react-redux'
import {
  selectFetchingRewards,
  selectClaimedRewardsByType,
} from 'selectors/rewards'
import AuthOverlay from './view'

const select = (state) => ({
  fetching: selectFetchingRewards(state),
  claimedRewardsByType: selectClaimedRewardsByType(state),
})

const perform = (dispatch) => ({
})

export default connect(select, perform)(AuthOverlay)
