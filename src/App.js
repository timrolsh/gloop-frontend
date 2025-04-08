import "./assets/css/style.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home";
import Gmi from "./pages/Gmi";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Liquidate from "./pages/Liquidate";
import Borrow from "./pages/Borrow";
import Lend from "./pages/Lend";
import {routes} from "./consts/routes";
import Toast from "./components/Toaster";
import {ProtectedRoute} from "./ProtectedRoute";
import ScrollToTop from "./ScrollToTop";
import {WagmiProvider} from "wagmi";
import {QueryClientProvider} from "@tanstack/react-query";
import {RainbowKitProvider} from "@rainbow-me/rainbowkit";
import {config, queryClient} from "./providers/WalletContextProvider";
import {gloopTheme} from "./components/wallet/WalletButtonTheme";

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={gloopTheme}>
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
                path={routes.Dashboard.path}
                element={
                  <ProtectedRoute route={routes.Dashboard}>
                    <Dashboard />
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
            </Routes>
            <Footer />
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
