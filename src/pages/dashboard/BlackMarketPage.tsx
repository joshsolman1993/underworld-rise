import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { drugApi, Drug, UserDrug } from '../../api/drug.api';
import { useToast } from '../../contexts/ToastContext';
import DrugCard from '../../components/ui/DrugCard';
import '../../styles/components.css';

export default function BlackMarketPage() {
    const { user, setAuth } = useAuthStore();
    const { toast } = useToast();
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [userDrugs, setUserDrugs] = useState<UserDrug[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        loadMarketData();
    }, []);

    const loadMarketData = async () => {
        try {
            setIsLoading(true);
            const [drugsData, userDrugsData] = await Promise.all([
                drugApi.getAllDrugs(),
                drugApi.getUserDrugs(),
            ]);
            setDrugs(drugsData);
            setUserDrugs(userDrugsData);
        } catch (error) {
            console.error('Failed to load market data:', error);
            toast.error('Failed to connect to the Black Market');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuy = async (drugId: number, quantity: number) => {
        try {
            setIsProcessing(true);
            const response = await drugApi.buyDrug(drugId, quantity);

            if (response.success) {
                toast.success(`Bought ${quantity}x drugs`);

                // Update local state
                updateLocalInventory(drugId, response.drug.quantity);

                // Update user money
                if (user) {
                    const token = localStorage.getItem('token');
                    if (token) {
                        setAuth({ ...user, moneyCash: response.user.moneyCash }, token);
                    }
                }
            }
        } catch (error: any) {
            console.error('Buy failed:', error);
            toast.error(error.response?.data?.message || 'Failed to buy drugs');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSell = async (drugId: number, quantity: number) => {
        try {
            setIsProcessing(true);
            const response = await drugApi.sellDrug(drugId, quantity);

            if (response.success) {
                toast.success(`Sold ${quantity}x drugs`);

                // Update local state
                updateLocalInventory(drugId, response.drug.quantity);

                // Update user money
                if (user) {
                    const token = localStorage.getItem('token');
                    if (token) {
                        setAuth({ ...user, moneyCash: response.user.moneyCash }, token);
                    }
                }
            }
        } catch (error: any) {
            console.error('Sell failed:', error);
            toast.error(error.response?.data?.message || 'Failed to sell drugs');
        } finally {
            setIsProcessing(false);
        }
    };

    const updateLocalInventory = (drugId: number, newQuantity: number) => {
        setUserDrugs(prev => {
            const exists = prev.find(ud => ud.drugId === drugId);
            if (exists) {
                return prev.map(ud => ud.drugId === drugId ? { ...ud, quantity: newQuantity } : ud);
            } else {
                // If it's a new drug we need to add it, but we need the drug object.
                // For simplicity, we can just reload user drugs or mock it if we had the drug object.
                // Let's just reload for correctness or try to find it in 'drugs' array.
                const drug = drugs.find(d => d.id === drugId);
                if (drug && user) {
                    return [...prev, { id: 'temp', userId: user.id, drugId, drug, quantity: newQuantity }];
                }
                return prev;
            }
        });
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '64rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="text-3xl font-bold font-orbitron text-neon-purple" style={{
                        fontSize: '1.875rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-accent-secondary)',
                        textShadow: '0 0 10px rgba(217, 70, 239, 0.5)'
                    }}>
                        Black Market
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Buy low, sell high. Prices update every 4 hours.
                    </p>
                </div>
                <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', textAlign: 'right', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Your Cash</p>
                    <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', color: 'var(--color-success)', fontWeight: 700 }}>
                        ${user?.moneyCash.toLocaleString()}
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {drugs.map((drug) => (
                    <motion.div
                        key={drug.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <DrugCard
                            drug={drug}
                            userDrug={userDrugs.find(ud => ud.drugId === drug.id)}
                            onBuy={handleBuy}
                            onSell={handleSell}
                            isProcessing={isProcessing}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
