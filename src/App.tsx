import { DataProvider } from "./contexts/DataContext.tsx";
import "./global.css";
import HomeScreen from "./pages/HomeScreen";

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
        <HomeScreen />
      </div>
    </DataProvider>
  );
}

export default App;
