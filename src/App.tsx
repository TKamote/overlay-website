import React, { Suspense } from "react";
import HomeScreen from "./pages/HomeScreen";
import { DataProvider } from "./contexts/DataContext";
import "./global.css";

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
    }}
  >
    <div style={{ fontSize: "24px", marginBottom: "20px" }}>Loading...</div>
    <div style={{ fontSize: "14px", color: "#666" }}>tkamot.com overlay</div>
  </div>
);

function App() {
  console.log("App component rendering");

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <DataProvider>
          <div className="app">
            <HomeScreen />
          </div>
        </DataProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
