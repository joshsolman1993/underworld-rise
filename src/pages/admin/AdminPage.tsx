import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import SystemDashboard from './SystemDashboard';
import UserManagement from './UserManagement';
import GameManagement from './GameManagement';
import GangManagement from './GangManagement';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'game' | 'gangs'>('dashboard');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-orbitron text-neon-red">Admin Panel</h1>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 bg-dark-lighter p-2 rounded-lg border border-white/10 overflow-x-auto">
                <Button
                    onClick={() => setActiveTab('dashboard')}
                    variant={activeTab === 'dashboard' ? 'primary' : 'ghost'}
                    className="whitespace-nowrap"
                >
                    Dashboard
                </Button>
                <Button
                    onClick={() => setActiveTab('users')}
                    variant={activeTab === 'users' ? 'primary' : 'ghost'}
                    className="whitespace-nowrap"
                >
                    User Management
                </Button>
                <Button
                    onClick={() => setActiveTab('game')}
                    variant={activeTab === 'game' ? 'primary' : 'ghost'}
                    className="whitespace-nowrap"
                >
                    Game Content
                </Button>
                <Button
                    onClick={() => setActiveTab('gangs')}
                    variant={activeTab === 'gangs' ? 'primary' : 'ghost'}
                    className="whitespace-nowrap"
                >
                    Gang Management
                </Button>
            </div>

            {/* Content Area */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'dashboard' && <SystemDashboard />}
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'game' && <GameManagement />}
                {activeTab === 'gangs' && <GangManagement />}
            </motion.div>
        </div>
    );
};

export default AdminPage;
