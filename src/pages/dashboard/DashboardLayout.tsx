import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth.api'
import { socketClient } from '../../api/socket'
import { useToast } from '../../contexts/ToastContext'
import Badge from '../../components/ui/Badge'
import CountUp from '../../components/ui/CountUp'
import ResourceHexagon from '../../components/ui/ResourceHexagon'
import BottomNavigation from '../../components/layout/BottomNavigation'
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
    Target,
    Heart,
    Zap,
    Brain,
    Shield
} from 'lucide-react'

export default function DashboardLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, setAuth, logout, isAuthenticated } = useAuthStore()
    const { toast } = useToast()

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

    // Socket connection effect
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token || !isAuthenticated) {
            return
        }

        // Connect to socket
        socketClient.connect(token)

        // Listen for notifications
        const handleNotification = (data: any) => {
            console.log('Received notification:', data)

            if (data.type === 'combat_attack') {
                toast.error(
                    `${data.message} ${data.attacker.username} (Lvl ${data.attacker.level}) támadott meg!`,
                    6000
                )
            }
        }

        socketClient.onNotification(handleNotification)

        // Cleanup on unmount
        return () => {
            socketClient.offNotification(handleNotification)
            socketClient.disconnect()
        }
    }, [isAuthenticated, toast])

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

                    {/* Stats - Resource Hexagons */}
                    <div style={{ flex: 1, display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <ResourceHexagon
                            value={user.health}
                            max={100}
                            label="Health"
                            icon={Heart}
                            color="var(--color-danger)"
                        />
                        <ResourceHexagon
                            value={user.energy}
                            max={100}
                            label="Energy"
                            icon={Zap}
                            color="var(--color-warning)"
                        />
                        <ResourceHexagon
                            value={user.nerve}
                            max={100}
                            label="Nerve"
                            icon={Brain}
                            color="var(--color-accent-primary)"
                        />
                        <ResourceHexagon
                            value={user.willpower}
                            max={100}
                            label="Willpower"
                            icon={Shield}
                            color="var(--color-success)"
                        />
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
                {/* Sidebar - Hidden on mobile */}
                <motion.aside
                    initial={{ x: -250, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden md:flex"
                    style={{
                        width: '250px',
                        background: 'rgba(8, 8, 10, 0.5)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                        padding: '16px',
                        overflowY: 'auto',
                        backdropFilter: 'blur(4px)',
                        flexDirection: 'column'
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
                <main style={{ flex: 1, padding: '32px', paddingBottom: '80px', overflowY: 'auto', position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{
                                opacity: 0,
                                x: -20,
                                filter: 'blur(4px) hue-rotate(90deg)'
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                filter: 'blur(0px) hue-rotate(0deg)'
                            }}
                            exit={{
                                opacity: 0,
                                x: 20,
                                filter: 'blur(4px) hue-rotate(-90deg)'
                            }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%' }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNavigation />
        </div>
    )
}
