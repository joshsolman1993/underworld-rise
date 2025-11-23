import { useState, useEffect } from 'react';
import { adminApi, SystemStats } from '../../api/admin.api';
import Card from '../../components/ui/Card';

const SystemDashboard = () => {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getSystemStats();
            setStats(data);
        } catch (err) {
            setError('Failed to load system stats');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white">Loading stats...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-neon-blue">
                <h3 className="text-gray-400 text-sm uppercase">Total Users</h3>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                <p className="text-xs text-neon-blue mt-1">
                    {stats.activeUsers} active in last 24h
                </p>
            </Card>

            <Card className="p-4 border-l-4 border-neon-green">
                <h3 className="text-gray-400 text-sm uppercase">Economy Size</h3>
                <p className="text-3xl font-bold text-white">${stats.totalMoney.toLocaleString()}</p>
                <p className="text-xs text-neon-green mt-1">
                    Cash + Bank
                </p>
            </Card>

            <Card className="p-4 border-l-4 border-neon-red">
                <h3 className="text-gray-400 text-sm uppercase">Crime Activity</h3>
                <p className="text-3xl font-bold text-white">{stats.totalCrimes}</p>
                <p className="text-xs text-neon-red mt-1">
                    Total crimes defined
                </p>
            </Card>

            <Card className="p-4 border-l-4 border-yellow-500">
                <h3 className="text-gray-400 text-sm uppercase">Gangs</h3>
                <p className="text-3xl font-bold text-white">{stats.totalGangs}</p>
                <p className="text-xs text-yellow-500 mt-1">
                    Registered gangs
                </p>
            </Card>

            <Card className="p-4 border-l-4 border-purple-500">
                <h3 className="text-gray-400 text-sm uppercase">Marketplace</h3>
                <p className="text-3xl font-bold text-white">{stats.totalMarketListings}</p>
                <p className="text-xs text-purple-500 mt-1">
                    Active listings
                </p>
            </Card>

            <Card className="p-4 border-l-4 border-pink-500">
                <h3 className="text-gray-400 text-sm uppercase">Combat</h3>
                <p className="text-3xl font-bold text-white">{stats.totalCombatLogs}</p>
                <p className="text-xs text-pink-500 mt-1">
                    Total fights recorded
                </p>
            </Card>
        </div>
    );
};

export default SystemDashboard;
