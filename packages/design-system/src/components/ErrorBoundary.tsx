/**
 * Error Boundary reusable para capturar errores de React.
 * No depende de páginas específicas de una aplicación consumidora.
 */

import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode | ((error: Error | null, reset: () => void) => ReactNode)
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    if (typeof this.props.fallback === 'function') {
      return this.props.fallback(this.state.error, this.resetError)
    }

    if (this.props.fallback) return this.props.fallback

    return (
      <div role="alert" className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="max-w-lg text-sm text-gray-600 dark:text-gray-400">
          An unexpected error occurred while rendering this component.
        </p>
        <button
          type="button"
          onClick={this.resetError}
          className="rounded-md px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700"
        >
          Try again
        </button>
      </div>
    )
  }
}

export default ErrorBoundary
