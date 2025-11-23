import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth.api'
import ProgressBar from '../../components/ui/ProgressBar'
import Badge from '../../components/ui/Badge'
import CountUp from '../../components/ui/CountUp'
import {
    Home,
    Skull,
    Dumbbell,
    Building2,
    ShoppingCart,
    Backpack,
    Swords,
    Users,
    TrendingUp,
    ShieldAlert,
    Target
} from 'lucide-react'

export default function DashboardLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, setAuth, logout, isAuthenticated } = useAuthStore()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }

        // Load user data
        const loadUserData = async () => {
            try {
                const userData = await authApi.getProfile()
                const token = localStorage.getItem('token')
                if (token) {
                    setAuth(userData, token)
                }
            } catch (error) {
                console.error('Failed to load user data:', error)
                logout()
                navigate('/login')
            }
        }

        loadUserData()
    }, [isAuthenticated, navigate, setAuth, logout])

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="spinner" />
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
            {/* Top Status Bar */}
            <header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    background: 'rgba(3, 3, 4, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '12px 24px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h2
                            style={{
                                fontSize: '1.25rem',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 'bold',
                                color: 'var(--color-accent-primary)',
                                textShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                                margin: 0,
                                letterSpacing: '0.05em'
                            }}
                        >
                            UNDERWORLD
                        </h2>
                        <Badge variant="success">Lvl {user.level}</Badge>
                    </div>

                    {/* Stats */}
                    <div style={{ flex: 1, display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div style={{ minWidth: '140px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 500, textTransform: 'uppercase' }}>Health</div>
                            <ProgressBar value={user.health} max={100} color="danger" showLabel={false} height="6px" />
                            <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '4px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{user.health}/100</div>
                        </div>

                        <div style={{ minWidth: '140px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 500, textTransform: 'uppercase' }}>Energy</div>
                            <ProgressBar value={user.energy} max={100} color="warning" showLabel={false} height="6px" />
                            <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '4px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{user.energy}/100</div>
                        </div>

                        <div style={{ minWidth: '140px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 500, textTransform: 'uppercase' }}>Nerve</div>
                            <ProgressBar value={user.nerve} max={100} color="primary" showLabel={false} height="6px" />
                            <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '4px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{user.nerve}/100</div>
                        </div>

                        <div style={{ minWidth: '140px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 500, textTransform: 'uppercase' }}>Willpower</div>
                            <ProgressBar value={user.willpower} max={100} color="success" showLabel={false} height="6px" />
                            <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '4px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{user.willpower}/100</div>
                        </div>
                    </div>

                    {/* Money */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Cash</div>
                            <div style={{ fontSize: '1.125rem', color: 'var(--color-accent-gold)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', textShadow: '0 0 5px rgba(251, 191, 36, 0.3)' }}>
                                $<CountUp value={Number(user.moneyCash || 0)} format={(val) => val.toLocaleString()} />
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Bank</div>
                            <div style={{ fontSize: '1.125rem', color: 'var(--color-accent-primary)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', textShadow: '0 0 5px rgba(139, 92, 246, 0.3)' }}>
                                $<CountUp value={isNaN(Number(user.moneyBank)) ? 0 : Number(user.moneyBank)} format={(val) => val.toLocaleString()} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Sidebar */}
                <motion.aside
                    initial={{ x: -250, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        width: '250px',
                        background: 'rgba(8, 8, 10, 0.5)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                        padding: '16px',
                        overflowY: 'auto',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div className="nav-section-label">GENERAL</div>
                        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Home size={18} />
                            <span>Home</span>
                        </NavLink>
                        <NavLink to="/missions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Target size={18} />
                            <span>Missions</span>
                        </NavLink>

                        <div className="nav-section-label">CITY</div>
                        <NavLink to="/slum" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Skull size={18} />
                            <span>Slum</span>
                        </NavLink>
                        <NavLink to="/gym" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Dumbbell size={18} />
                            <span>Gym</span>
                        </NavLink>
                        <NavLink to="/bank" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Building2 size={18} />
                            <span>Bank</span>
                        </NavLink>
                        <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <ShoppingCart size={18} />
                            <span>Shop</span>
                        </NavLink>
                        <NavLink to="/inventory" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Backpack size={18} />
                            <span>Inventory</span>
                        </NavLink>

                        <div className="nav-section-label">COMBAT</div>
                        <NavLink to="/combat" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Swords size={18} />
                            <span>Combat</span>
                        </NavLink>
                        <NavLink to="/gang" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Users size={18} />
                            <span>Gang</span>
                        </NavLink>

                        <div className="nav-section-label">ECONOMY</div>
                        <NavLink to="/marketplace" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <TrendingUp size={18} />
                            <span>Marketplace</span>
                        </NavLink>
                        <NavLink to="/black-market" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">💊</span>
                            <span>Black Market</span>
                        </NavLink>

                        {user.isAdmin && (
                            <>
                                <div className="nav-section-label">ADMINISTRATION</div>
                                <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <ShieldAlert size={18} />
                                    <span>Admin Panel</span>
                                </NavLink>
                            </>
                        )}
                    </nav>
                </motion.aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: '32px', overflowY: 'auto', position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%' }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}
