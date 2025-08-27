import "./assets/css/style.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home";
import Gmi from "./pages/Gmi";
import Leaderboard from "./pages/Leaderboard";
import Liquidate from "./pages/Liquidate";
import Borrow from "./pages/Borrow";
import Lend from "./pages/Lend";
import Staking from "./pages/Staking";
import {routes} from "./consts/routes";

import Toast from "./components/Toaster";
import {ProtectedRoute} from "./ProtectedRoute";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toast />
      <Header />
      <Routes>
        <Route exact path={routes.Home.path} element={<Home />} />
        <Route
          path={routes.Borrow.path}
          element={
            <ProtectedRoute route={routes.Borrow}>
              <Borrow selectedTab={"market"} />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.Lend.path}
          element={
            <ProtectedRoute route={routes.Lend}>
              <Lend />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.Gmi.path}
          element={
            <ProtectedRoute route={routes.Gmi}>
              <Gmi />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.Leaderboard.path}
          element={
            <ProtectedRoute route={routes.Leaderboard}>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.Liquidate.path}
          element={
            <ProtectedRoute route={routes.Liquidate}>
              <Liquidate />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.Staking.path}
          element={
            <ProtectedRoute route={routes.Staking}>
              <Staking />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
