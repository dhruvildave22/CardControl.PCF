/* eslint-disable camelcase */
/* eslint-disable react/sort-comp */
// ErrorBoundary
import * as React from 'react';

interface ErrorBoundaryState {
    hasError: boolean | null,
    errorCount: Number,
}

interface ErrorBoundaryProps {
    isLoading: boolean,
    searchData: any,
    children: React.ReactNode,
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Object) {
    // Update state so the next render will show the fallback UI.
    if (error) {
      return { hasError: true };
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    this.setState((state: any) => ({ errorCount: state.errorCount + 1 }));
  }

  resetErrorBoundary() {
    this.setState({ hasError: null });
  }

  UNSAFE_componentWillReceiveProps(nextState: any) {
    const { searchData } = this.props;
    if (nextState.isLoading && nextState.searchData.length !== 0) {
      this.resetErrorBoundary();
    }
  }

  render() {
    const { hasError, errorCount }: any = this.state;
    const { children } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container">
          <h1>Unsupported search syntax. Please try again.</h1>
        </div>
      );
    }

    return (
      <React.Fragment key={errorCount}>
        {children}
      </React.Fragment>
    );
  }
}

export default ErrorBoundary;
