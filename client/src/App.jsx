import React from "react";
import { Route, Routes } from "react-router-dom";
import OpenRoute from "./components/auth/OpenRoute";
import Login from "./pages/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import Home from "./pages/Home";
import PropertyInformation from "./pages/PropertyInformation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PropertyCommiti from "./pages/PropertyCommiti";
import Units from "./pages/Units";
import Owner from "./pages/Owner";
import RegularBudget from "./pages/RegularBudget";
import Income from "./pages/Income";
import OutCome from "./pages/OutCome";
import Balance from "./pages/Balance";
import Budget from "./pages/Budget";
import BudgetIncome from "./pages/BudgetIncome";
import BudgetOutCome from "./pages/BudgetOutCome";
import Print from "./pages/Print";
import PrintInformation from "./pages/PrintInformation";
import PrintCommiti from "./pages/PrintCommiti";
import PrintOwner from "./pages/PrintOwner";
import PrintRegularBudget from "./pages/PrintRegularBudget";
import PrintIncome from "./pages/PrintIncome";
import PrintOutcomes from "./pages/PrintOutcomes";
import PrintBalance from "./pages/PrintBalance";
import ExpectesnalBudget from "./pages/ExpectesnalBudget";
import PrintBudgetIncome from "./pages/PrintBudgetIncome";
import PrintBudgetOutcome from "./pages/PrintBudgetOutcome";

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen">
        <Routes>
          <Route
            path="/login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/propertyinformation/:id"
            element={
              <PrivateRoute>
                <PropertyInformation />
              </PrivateRoute>
            }
          />
          <Route
            path="/propertycomitee/:id"
            element={
              <PrivateRoute>
                <PropertyCommiti />
              </PrivateRoute>
            }
          />
          <Route
            path="/propertyunits/:id"
            element={
              <PrivateRoute>
                <Units />
              </PrivateRoute>
            }
          />
          <Route
            path="/propertyowners/:id"
            element={
              <PrivateRoute>
                <Owner />
              </PrivateRoute>
            }
          />
          <Route
            path="/regularbudget/:id"
            element={
              <PrivateRoute>
                <RegularBudget />
              </PrivateRoute>
            }
          />
          <Route
            path="/regularbudget/income/:id"
            element={
              <PrivateRoute>
                <Income />
              </PrivateRoute>
            }
          />
          <Route
            path="/regularbudget/outcome/:id"
            element={
              <PrivateRoute>
                <OutCome />
              </PrivateRoute>
            }
          />
          <Route
            path="/regularbudget/balance/:id"
            element={
              <PrivateRoute>
                <Balance />
              </PrivateRoute>
            }
          />
          <Route
            path="/exceptionalbudget/:id"
            element={
              <PrivateRoute>
                <Budget />
              </PrivateRoute>
            }
          />
          <Route
            path="/exceptionalbudget/income/:id"
            element={
              <PrivateRoute>
                <BudgetIncome />
              </PrivateRoute>
            }
          />
          <Route
            path="/exceptionalbudget/outcome/:id"
            element={
              <PrivateRoute>
                <BudgetOutCome />
              </PrivateRoute>
            }
          />
          <Route
            path="/print"
            element={
              <PrivateRoute>
                <Print />
              </PrivateRoute>
            }
          />
          <Route
            path="/print/property-information"
            element={
              <PrivateRoute>
                <PrintInformation />
              </PrivateRoute>
            }
          />
          <Route
            path="/print/property-comitee"
            element={
              <PrivateRoute>
                <PrintCommiti />
              </PrivateRoute>
            }
          />
          <Route
            path="/print/owner"
            element={
              <PrivateRoute>
                <PrintOwner />
              </PrivateRoute>
            }
          />
          <Route
            path="/print/regular-budget"
            element={
              <PrivateRoute>
                <PrintRegularBudget />
              </PrivateRoute>
            }
          />
          <Route
            path="/print/regular-budget/income"
            element={
              <PrivateRoute>
                <PrintIncome />
              </PrivateRoute>
            }
          />
          <Route
            path="/print/regular-budget/outcome"
            element={
              <PrivateRoute>
                <PrintOutcomes />
              </PrivateRoute>
            }
          />
          <Route
            path="/print/regular-budget/balance"
            element={
              <PrivateRoute>
                <PrintBalance />
              </PrivateRoute>
            }
          />
          <Route
            path="/print/exceptional"
            element={
              <PrivateRoute>
                <ExpectesnalBudget />
              </PrivateRoute>
            }
          />
          <Route
            path="/print/exceptional/income"
            element={
              <PrivateRoute>
                <PrintBudgetIncome />
              </PrivateRoute>
            }
          />
          <Route
            path="/print/exceptional/outcome"
            element={
              <PrivateRoute>
                <PrintBudgetOutcome />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
