import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Dashboard />
      </div>

    </div>
  );
}

export default App;