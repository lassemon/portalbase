import { globalError as globalErrorAction } from 'actions/error'
import React from 'react'
import { connect } from 'react-redux'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { IError, IErrorState, IRootState } from 'types'

import ErrorModal from './ErrorModal'

interface IActionProps {
  globalErrorAction: typeof globalErrorAction
}

interface IProps {
  globalError?: IError
}

const ErrorModalContainer: React.FC<IActionProps & IProps> = props => {
  const { globalError, children } = props

  /*public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.globalErrorAction({ title: 'Oh no!', message: errorInfo.componentStack });
  }*/

  return globalError ? (
    <div>
      <ErrorModal error={globalError} />
    </div>
  ) : (
    <>{children}</>
  )
}

const mapStateToProps = (state: IRootState): Partial<IErrorState> => {
  return {
    globalError: state.error.globalError
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>): IActionProps => {
  return bindActionCreators({ globalErrorAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModalContainer)
