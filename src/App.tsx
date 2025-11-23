import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
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
import AdminRoute from './components/AdminRoute'

function App() {
    return (
        <ToastProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminPage />
                        </AdminRoute>
                    } />

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
        </ToastProvider>
    )
}

export default App
