import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import { FloatingTextProvider } from './contexts/FloatingTextContext'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import HomePage from './pages/dashboard/HomePage'
import SlumPage from './pages/locations/SlumPage'
import GymPage from './pages/locations/GymPage'
import BankPage from './pages/locations/BankPage'
import ShopPage from './pages/locations/ShopPage'
import InventoryPage from './pages/locations/InventoryPage'
import CombatPage from './pages/locations/CombatPage'
import GangPage from './pages/locations/GangPage'
import MissionPage from './pages/dashboard/MissionPage'
import BlackMarketPage from './pages/dashboard/BlackMarketPage'
import AdminPage from './pages/admin/AdminPage'

function App() {
    return (
        <ToastProvider>
            <FloatingTextProvider>
                {/* Global Noise Overlay */}
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        pointerEvents: 'none',
                        zIndex: 1,
                        opacity: 0.03,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat'
                    }}
                />
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/admin" element={<AdminPage />} />

                        <Route path="/" element={<DashboardLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="slum" element={<SlumPage />} />
                            <Route path="gym" element={<GymPage />} />
                            <Route path="bank" element={<BankPage />} />
                            <Route path="shop" element={<ShopPage />} />
                            <Route path="inventory" element={<InventoryPage />} />
                            <Route path="combat" element={<CombatPage />} />
                            <Route path="gang" element={<GangPage />} />
                            <Route path="missions" element={<MissionPage />} />
                            <Route path="black-market" element={<BlackMarketPage />} />
                        </Route>
                    </Routes>
                </Router>
            </FloatingTextProvider>
        </ToastProvider>
    )
}

export default App
