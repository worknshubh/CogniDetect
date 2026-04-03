import { Outlet } from "react-router-dom";
import "./App.css";
import SideBar from "./components/SideBar";

function App() {
  return (
    <>
      <div>
        <div className="w-[16%]  fixed shadow-xl">
          <SideBar />
        </div>
        <div className="pl-80 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
