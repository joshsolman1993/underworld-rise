import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import {
    Home,
    Building2,
    Swords,
    Users,
    Menu,
    X,
    Skull,
    Dumbbell,
    ShoppingCart,
    Backpack,
    TrendingUp,
    Target
} from 'lucide-react'

export default function BottomNavigation() {
    const [showCityMenu, setShowCityMenu] = useState(false)
    const [showMainMenu, setShowMainMenu] = useState(false)
    const location = useLocation()

    const cityLocations = [
        { to: '/slum', icon: Skull, label: 'Slum' },
        { to: '/gym', icon: Dumbbell, label: 'Gym' },
        { to: '/bank', icon: Building2, label: 'Bank' },
        { to: '/shop', icon: ShoppingCart, label: 'Shop' },
        { to: '/inventory', icon: Backpack, label: 'Inventory' },
    ]

    const menuItems = [
        { to: '/missions', icon: Target, label: 'Missions' },
        { to: '/marketplace', icon: TrendingUp, label: 'Marketplace' },
        { to: '/black-market', icon: '💊', label: 'Black Market' },
    ]

    const isCityActive = cityLocations.some(loc => location.pathname === loc.to)
    const isMenuActive = menuItems.some(item => location.pathname === item.to)

    return (
        <>
            {/* City Modal */}
            <AnimatePresence>
                {showCityMenu && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCityMenu(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1040] md:hidden"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-[1050] md:hidden"
                            style={{
                                background: 'rgba(8, 8, 10, 0.95)',
                                backdropFilter: 'blur(12px)',
                                borderTop: '1px solid rgba(139, 92, 246, 0.3)',
                                borderRadius: '24px 24px 0 0',
                                padding: '24px',
                                maxHeight: '70vh',
                                overflowY: 'auto'
                            }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                                    City Locations
                                </h3>
                                <button
                                    onClick={() => setShowCityMenu(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {cityLocations.map(({ to, icon: Icon, label }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        onClick={() => setShowCityMenu(false)}
                                        className={({ isActive }) => `
                                            flex flex-col items-center gap-2 p-4 rounded-xl
                                            transition-all duration-200
                                            ${isActive
                                                ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        <Icon size={28} />
                                        <span className="text-sm font-medium">{label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Menu Modal */}
            <AnimatePresence>
                {showMainMenu && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMainMenu(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1040] md:hidden"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-[1050] md:hidden"
                            style={{
                                background: 'rgba(8, 8, 10, 0.95)',
                                backdropFilter: 'blur(12px)',
                                borderTop: '1px solid rgba(139, 92, 246, 0.3)',
                                borderRadius: '24px 24px 0 0',
                                padding: '24px',
                                maxHeight: '70vh',
                                overflowY: 'auto'
                            }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                                    Menu
                                </h3>
                                <button
                                    onClick={() => setShowMainMenu(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                {menuItems.map(({ to, icon, label }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        onClick={() => setShowMainMenu(false)}
                                        className={({ isActive }) => `
                                            flex items-center gap-3 p-4 rounded-xl
                                            transition-all duration-200
                                            ${isActive
                                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-purple-500'
                                                : 'bg-white/5 border-l-4 border-transparent hover:bg-white/10 hover:border-purple-500/30'
                                            }
                                        `}
                                    >
                                        {typeof icon === 'string' ? (
                                            <span className="text-2xl">{icon}</span>
                                        ) : (
                                            React.createElement(icon, { size: 24 })
                                        )}
                                        <span className="font-medium">{label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Bottom Navigation Bar */}
            <motion.nav
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[1030] md:hidden"
                style={{
                    background: 'rgba(3, 3, 4, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '12px 16px',
                    paddingBottom: 'max(12px, env(safe-area-inset-bottom))'
                }}
            >
                <div className="flex justify-around items-center max-w-lg mx-auto">
                    {/* Home */}
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => `
                            flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                            ${isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'}
                        `}
                    >
                        <Home size={24} />
                        <span className="text-xs font-medium">Home</span>
                    </NavLink>

                    {/* City */}
                    <button
                        onClick={() => setShowCityMenu(true)}
                        className={`
                            flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                            ${isCityActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'}
                        `}
                    >
                        <Building2 size={24} />
                        <span className="text-xs font-medium">City</span>
                    </button>

                    {/* Combat */}
                    <NavLink
                        to="/combat"
                        className={({ isActive }) => `
                            flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                            ${isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'}
                        `}
                    >
                        <Swords size={24} />
                        <span className="text-xs font-medium">Combat</span>
                    </NavLink>

                    {/* Gang */}
                    <NavLink
                        to="/gang"
                        className={({ isActive }) => `
                            flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                            ${isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'}
                        `}
                    >
                        <Users size={24} />
                        <span className="text-xs font-medium">Gang</span>
                    </NavLink>

                    {/* Menu */}
                    <button
                        onClick={() => setShowMainMenu(true)}
                        className={`
                            flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                            ${isMenuActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'}
                        `}
                    >
                        <Menu size={24} />
                        <span className="text-xs font-medium">Menu</span>
                    </button>
                </div>
            </motion.nav>
        </>
    )
}
