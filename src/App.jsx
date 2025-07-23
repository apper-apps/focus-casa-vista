import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import ChatBot from "@/components/molecules/ChatBot";
import Home from "@/components/pages/Home";
import Properties from "@/components/pages/Properties";
import MortgageCalculator from "@/components/pages/MortgageCalculator";
import AdminPanel from "@/components/pages/AdminPanel";
import CRM from "@/components/pages/CRM";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/mortgage" element={<MortgageCalculator />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/crm" element={<CRM />} />
          </Routes>
        </main>
        <ChatBot />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;