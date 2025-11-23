import { useState, useEffect } from 'react';
import { adminApi, Gang } from '../../api/admin.api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const GangManagement = () => {
    const [gangs, setGangs] = useState<Gang[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGang, setSelectedGang] = useState<Gang | null>(null);
    const [isTreasuryModalOpen, setIsTreasuryModalOpen] = useState(false);
    const [treasuryAmount, setTreasuryAmount] = useState('');

    useEffect(() => {
        loadGangs();
    }, []);

    const loadGangs = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllGangs();
            setGangs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDisband = async (gangId: string) => {
        if (!confirm('Are you sure you want to DISBAND this gang? This cannot be undone!')) return;
        try {
            await adminApi.disbandGang(gangId);
            loadGangs();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateTreasury = async () => {
        if (!selectedGang) return;
        try {
            await adminApi.updateGangTreasury(selectedGang.id, parseInt(treasuryAmount));
            setIsTreasuryModalOpen(false);
            setTreasuryAmount('');
            loadGangs();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto bg-dark-lighter rounded-lg border border-white/10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/40 text-gray-400 border-b border-white/10">
                            <th className="p-3">Gang</th>
                            <th className="p-3">Leader</th>
                            <th className="p-3">Reputation</th>
                            <th className="p-3">Treasury</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                        ) : gangs.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-500">No gangs found</td></tr>
                        ) : (
                            gangs.map((gang) => (
                                <tr key={gang.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-3">
                                        <div className="font-bold text-white">{gang.name}</div>
                                        <div className="text-xs text-neon-blue">[{gang.tag}]</div>
                                    </td>
                                    <td className="p-3 text-white">{gang.leader?.username || 'Unknown'}</td>
                                    <td className="p-3 text-white">{gang.reputation}</td>
                                    <td className="p-3 text-green-400">${gang.treasury.toLocaleString()}</td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => {
                                                setSelectedGang(gang);
                                                setIsTreasuryModalOpen(true);
                                            }}>Treasury</Button>
                                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDisband(gang.id)}>Disband</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isTreasuryModalOpen}
                onClose={() => setIsTreasuryModalOpen(false)}
                title={`Manage Treasury: ${selectedGang?.name}`}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsTreasuryModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleUpdateTreasury}>Update</Button>
                    </>
                }
            >
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Amount to Add (use negative to subtract)</label>
                    <Input
                        type="number"
                        value={treasuryAmount}
                        onChange={(e) => setTreasuryAmount(e.target.value)}
                        placeholder="e.g. 1000 or -500"
                    />
                </div>
            </Modal>
        </div>
    );
};

export default GangManagement;
