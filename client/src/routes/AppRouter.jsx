import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Playground from "@/routes/Playground/index";
import AppRoutes from "@/routes/routes";

const AppRouter = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      {/* playground route */}
      <Route
        path={AppRoutes.MAIN}
        element={
            <Playground />
        }
      />

    </Routes>
  );
};

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return <div>Something went wrong.</div>;
  }

  return children;
};

export default () => (
  <Router>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </Router>
);
