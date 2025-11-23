import { useState, useEffect } from 'react';
import { adminApi, AdminUser } from '../../api/admin.api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const UserManagement = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [banReason, setBanReason] = useState('');
    const [banDuration, setBanDuration] = useState('');

    useEffect(() => {
        loadUsers();
    }, [page, search]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllUsers(page, 10, search);
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error('Failed to load users', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async () => {
        if (!selectedUser) return;
        try {
            await adminApi.banUser(selectedUser.id, {
                reason: banReason,
                durationMinutes: banDuration ? parseInt(banDuration) : undefined,
            });
            setIsBanModalOpen(false);
            loadUsers();
            setBanReason('');
            setBanDuration('');
        } catch (err) {
            console.error('Failed to ban user', err);
        }
    };

    const handleUnban = async (userId: string) => {
        if (!confirm('Are you sure you want to unban this user?')) return;
        try {
            await adminApi.unbanUser(userId);
            loadUsers();
        } catch (err) {
            console.error('Failed to unban user', err);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to DELETE this user? This action cannot be undone!')) return;
        try {
            await adminApi.deleteUser(userId);
            loadUsers();
        } catch (err) {
            console.error('Failed to delete user', err);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-xs"
                />
            </div>

            <div className="overflow-x-auto bg-dark-lighter rounded-lg border border-white/10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/40 text-gray-400 border-b border-white/10">
                            <th className="p-3">User</th>
                            <th className="p-3">Level</th>
                            <th className="p-3">Money</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-500">Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-500">No users found</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-3">
                                        <div className="font-bold text-white">{user.username}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="p-3 text-white">{user.level}</td>
                                    <td className="p-3">
                                        <div className="text-green-400">${user.moneyCash.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">Bank: ${user.moneyBank.toLocaleString()}</div>
                                    </td>
                                    <td className="p-3">
                                        {user.isAdmin && <Badge variant="warning" className="mr-1">Admin</Badge>}
                                        {user.isBanned && <Badge variant="danger">Banned</Badge>}
                                        {!user.isBanned && !user.isAdmin && <Badge variant="success">Active</Badge>}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            {user.isBanned ? (
                                                <Button size="sm" variant="outline" onClick={() => handleUnban(user.id)}>Unban</Button>
                                            ) : (
                                                <Button size="sm" variant="danger" onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsBanModalOpen(true);
                                                }}>Ban</Button>
                                            )}
                                            {!user.isAdmin && (
                                                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400" onClick={() => handleDelete(user.id)}>Delete</Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <Button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    variant="outline"
                >
                    Previous
                </Button>
                <span className="text-gray-400">Page {page} of {totalPages}</span>
                <Button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    variant="outline"
                >
                    Next
                </Button>
            </div>

            <Modal
                isOpen={isBanModalOpen}
                onClose={() => setIsBanModalOpen(false)}
                title={`Ban User: ${selectedUser?.username}`}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsBanModalOpen(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleBan}>Ban User</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Reason</label>
                        <Input
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            placeholder="Violation of rules..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Duration (minutes)</label>
                        <Input
                            type="number"
                            value={banDuration}
                            onChange={(e) => setBanDuration(e.target.value)}
                            placeholder="Leave empty for permanent ban"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserManagement;
