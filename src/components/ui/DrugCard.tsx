import { useState } from 'react';
import { Drug, UserDrug } from '../../api/drug.api';
import Button from './Button';
import '../../styles/components.css';

interface DrugCardProps {
    drug: Drug;
    userDrug?: UserDrug;
    onBuy: (drugId: number, quantity: number) => void;
    onSell: (drugId: number, quantity: number) => void;
    isProcessing: boolean;
}

export default function DrugCard({ drug, userDrug, onBuy, onSell, isProcessing }: DrugCardProps) {
    const [amount, setAmount] = useState<number>(1);
    const ownedQuantity = userDrug?.quantity || 0;

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'UP': return <span style={{ color: 'var(--color-success)' }}>▲</span>;
            case 'DOWN': return <span style={{ color: 'var(--color-danger)' }}>▼</span>;
            default: return <span style={{ color: 'var(--color-text-muted)' }}>-</span>;
        }
    };

    const trendColor = drug.trend === 'UP' ? 'var(--color-success)' : drug.trend === 'DOWN' ? 'var(--color-danger)' : 'var(--color-text-muted)';

    return (
        <div className="card-elevated" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                    <h3 style={{
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        color: 'var(--color-text-primary)',
                        margin: 0
                    }}>
                        {drug.name}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        {drug.description}
                    </p>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: trendColor
                }}>
                    {getTrendIcon(drug.trend)}
                    <span>${drug.currentPrice}</span>
                </div>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                marginBottom: '1rem',
                flex: 1
            }}>
                <span>Owned: <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{ownedQuantity}</span></span>
                <span>Range: ${drug.minPrice} - ${drug.maxPrice}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="input-field"
                    style={{ width: '5rem', textAlign: 'center', padding: '0.25rem 0.5rem' }}
                />

                <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
                    <Button
                        variant="primary"
                        size="sm"
                        style={{ flex: 1 }}
                        onClick={() => onBuy(drug.id, amount)}
                        disabled={isProcessing}
                    >
                        Buy
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        style={{ flex: 1 }}
                        onClick={() => onSell(drug.id, amount)}
                        disabled={isProcessing || ownedQuantity < amount}
                    >
                        Sell
                    </Button>
                </div>
            </div>
        </div>
    );
}
