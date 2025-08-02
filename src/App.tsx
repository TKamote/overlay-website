import HomeScreen from "./pages/HomeScreen";
import "./global.css";
import "./App.css";

function App() {
  console.log("App component rendering");
  
  return (
    <div className="app">
      <HomeScreen />
    </div>
  );
}

export default App;
