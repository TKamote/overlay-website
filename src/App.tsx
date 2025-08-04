import HomeScreen from "./pages/HomeScreen";
import { DataProvider } from "./contexts/DataContext";
import "./global.css";
import "./App.css";

function App() {
  return (
    <DataProvider>
      <div className="app">
        <HomeScreen />
      </div>
    </DataProvider>
  );
}

export default App;
