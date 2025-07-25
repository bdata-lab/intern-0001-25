import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "@/routes/routes";
import Cars from "@/routes/Cars/index";
import Books from "@/routes/Books/index";
import Home from "@/routes/Home/index";

const AppRouter = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      {/* playground route */}
      <Route
        path={AppRoutes.HOME}
        element={<Home />}
      />

      <Route
        path={AppRoutes.CARS}
        element={<Cars />}
      />

      <Route
        path={AppRoutes.BOOKS}
        element={<Books />}
      />

    </Routes>
  );
};

export default () => (
  <Router>
    <AppRouter />
  </Router>
);
