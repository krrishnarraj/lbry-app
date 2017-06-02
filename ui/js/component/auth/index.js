import React from 'react'
import {
  connect
} from 'react-redux'
import {
  doUserEmailDecline
} from 'actions/user'
import {
  selectAuthenticationIsPending,
  selectEmailNewDeclined,
  selectEmailNewExistingEmail,
  selectUser,
} from 'selectors/user'
import Auth from './view'

const select = (state) => ({
  isPending: selectAuthenticationIsPending(state),
  existingEmail: selectEmailNewExistingEmail(state),
  user: selectUser(state),
})

export default connect(select, null)(Auth)
