import "./Sidebar.css";

import {
  FaHome,
  FaWallet,
  FaMoneyBillWave,
  FaBullseye,
  FaChartBar,
  FaRobot,
  FaCog,
} from "react-icons/fa";
function Sidebar() {
  return (
    <div className="sidebar">
      <h2>💰 Smart Wallet</h2>
<ul>
  <li><FaHome /> Dashboard</li>
  <li><FaWallet /> Expenses</li>
  <li><FaMoneyBillWave /> Income</li>
  <li><FaBullseye /> Budget</li>
  <li><FaChartBar /> Analytics</li>
  <li><FaRobot /> AI Assistant</li>
  <li><FaCog /> Settings</li>
</ul>
    </div>
  );
}

export default Sidebar;