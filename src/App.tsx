import { DataProvider } from "./contexts/DataContext.tsx";
import { useData } from "./hooks/useData.ts";
import "./global.css";
import HomeScreen from "./pages/HomeScreen";

function AppContent() {
  const { data } = useData();

  if (data.isLoading) {
    return <div>Loading...</div>;
  }

  if (data.error) {
    return <div>Error: {data.error}</div>;
  }

  return <HomeScreen />;
}

function App() {
  return (
    <DataProvider>
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial",
          margin: "0 auto",
        }}
      >
        <AppContent />
      </div>
    </DataProvider>
  );
}

export default App;
