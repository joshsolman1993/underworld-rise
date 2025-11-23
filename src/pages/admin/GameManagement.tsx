import { useState, useEffect } from 'react';
import { adminApi, Crime, Item } from '../../api/admin.api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const GameManagement = () => {
    const [view, setView] = useState<'crimes' | 'items'>('crimes');
    const [crimes, setCrimes] = useState<Crime[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null); // Crime or Item
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        loadData();
    }, [view]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (view === 'crimes') {
                const data = await adminApi.getAllCrimes();
                setCrimes(data);
            } else {
                const data = await adminApi.getAllItems();
                setItems(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({ ...item });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({});
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            if (view === 'crimes') {
                await adminApi.deleteCrime(id);
            } else {
                await adminApi.deleteItem(id);
            }
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        try {
            if (view === 'crimes') {
                if (editingItem) {
                    await adminApi.updateCrime(editingItem.id, formData);
                } else {
                    await adminApi.createCrime(formData);
                }
            } else {
                if (editingItem) {
                    await adminApi.updateItem(editingItem.id, formData);
                } else {
                    await adminApi.createItem(formData);
                }
            }
            setIsModalOpen(false);
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                    <Button
                        variant={view === 'crimes' ? 'primary' : 'outline'}
                        onClick={() => setView('crimes')}
                    >
                        Crimes
                    </Button>
                    <Button
                        variant={view === 'items' ? 'primary' : 'outline'}
                        onClick={() => setView('items')}
                    >
                        Items
                    </Button>
                </div>
                <Button onClick={handleCreate}>
                    + Add {view === 'crimes' ? 'Crime' : 'Item'}
                </Button>
            </div>

            <div className="overflow-x-auto bg-dark-lighter rounded-lg border border-white/10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/40 text-gray-400 border-b border-white/10">
                            <th className="p-3">ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Details</th>
                            <th className="p-3">Requirements</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                        ) : view === 'crimes' ? (
                            crimes.map((crime) => (
                                <tr key={crime.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-3 text-gray-500">#{crime.id}</td>
                                    <td className="p-3 font-bold text-white">{crime.name}</td>
                                    <td className="p-3 text-sm">
                                        <div>Energy: {crime.energyCost}</div>
                                        <div>Money: ${crime.minMoney}-${crime.maxMoney}</div>
                                        <div>XP: {crime.xpReward}</div>
                                    </td>
                                    <td className="p-3 text-sm">
                                        <div>Level: {crime.requiredLevel}</div>
                                        <div>Diff: {crime.difficulty}</div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEdit(crime)}>Edit</Button>
                                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(crime.id)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-3 text-gray-500">#{item.id}</td>
                                    <td className="p-3 font-bold text-white">{item.name}</td>
                                    <td className="p-3 text-sm">
                                        <div>Type: {item.type}</div>
                                        <div>Effect: {item.effectStat} +{item.effectValue}</div>
                                        <div>Price: ${item.price}</div>
                                    </td>
                                    <td className="p-3 text-sm">
                                        <div>Level: {item.requiredLevel}</div>
                                        <div>Tradable: {item.isTradable ? 'Yes' : 'No'}</div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>Edit</Button>
                                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(item.id)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${editingItem ? 'Edit' : 'Create'} ${view === 'crimes' ? 'Crime' : 'Item'}`}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit}>Save</Button>
                    </>
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                        <Input value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <Input value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
                    </div>

                    {view === 'crimes' ? (
                        <>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Energy Cost</label>
                                <Input type="number" value={formData.energyCost || ''} onChange={(e) => handleChange('energyCost', parseInt(e.target.value))} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">XP Reward</label>
                                <Input type="number" value={formData.xpReward || ''} onChange={(e) => handleChange('xpReward', parseInt(e.target.value))} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Min Money</label>
                                <Input type="number" value={formData.minMoney || ''} onChange={(e) => handleChange('minMoney', parseInt(e.target.value))} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Max Money</label>
                                <Input type="number" value={formData.maxMoney || ''} onChange={(e) => handleChange('maxMoney', parseInt(e.target.value))} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
                                <Input type="number" value={formData.difficulty || ''} onChange={(e) => handleChange('difficulty', parseInt(e.target.value))} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Required Level</label>
                                <Input type="number" value={formData.requiredLevel || ''} onChange={(e) => handleChange('requiredLevel', parseInt(e.target.value))} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Jail Chance (0-1)</label>
                                <Input type="number" step="0.01" value={formData.jailChance || ''} onChange={(e) => handleChange('jailChance', parseFloat(e.target.value))} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Jail Time (min)</label>
                                <Input type="number" value={formData.jailTimeMinutes || ''} onChange={(e) => handleChange('jailTimeMinutes', parseInt(e.target.value))} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Type</label>
                                <select
                                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-neon-blue outline-none"
                                    value={formData.type || 'weapon'}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                >
                                    <option value="weapon">Weapon</option>
                                    <option value="armor">Armor</option>
                                    <option value="vehicle">Vehicle</option>
                                    <option value="consumable">Consumable</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Price</label>
                                <Input type="number" value={formData.price || ''} onChange={(e) => handleChange('price', parseInt(e.target.value))} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Effect Stat</label>
                                <select
                                    className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white focus:border-neon-blue outline-none"
                                    value={formData.effectStat || 'strength'}
                                    onChange={(e) => handleChange('effectStat', e.target.value)}
                                >
                                    <option value="strength">Strength</option>
                                    <option value="defense">Defense</option>
                                    <option value="agility">Agility</option>
                                    <option value="intelligence">Intelligence</option>
                                    <option value="health">Health</option>
                                    <option value="energy">Energy</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Effect Value</label>
                                <Input type="number" value={formData.effectValue || ''} onChange={(e) => handleChange('effectValue', parseInt(e.target.value))} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Required Level</label>
                                <Input type="number" value={formData.requiredLevel || ''} onChange={(e) => handleChange('requiredLevel', parseInt(e.target.value))} />
                            </div>
                            <div className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    checked={formData.isTradable || false}
                                    onChange={(e) => handleChange('isTradable', e.target.checked)}
                                    className="mr-2"
                                />
                                <label className="text-white">Tradable</label>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default GameManagement;
