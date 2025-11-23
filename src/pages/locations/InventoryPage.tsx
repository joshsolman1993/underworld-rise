import { useState, useEffect } from 'react'
import { shopApi, InventoryItem } from '../../api/shop.api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [equipping, setEquipping] = useState<string | null>(null)

    useEffect(() => {
        loadInventory()
    }, [])

    const loadInventory = async () => {
        try {
            const data = await shopApi.getInventory()
            setInventory(data)
        } catch (error) {
            console.error('Failed to load inventory:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEquip = async (inventoryId: string) => {
        setEquipping(inventoryId)
        try {
            await shopApi.equipItem(inventoryId)
            await loadInventory() // Reload to update equipped status
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to equip item')
        } finally {
            setEquipping(null)
        }
    }

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
                <div className="spinner" />
            </div>
        )
    }

    const getItemIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'weapon': return '🔫'
            case 'armor': return '🛡️'
            case 'vehicle': return '🏎️'
            case 'consumable': return '💊'
            default: return '📦'
        }
    }

    const getItemColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'weapon': return 'var(--color-danger)'
            case 'armor': return 'var(--color-info)'
            case 'vehicle': return 'var(--color-warning)'
            case 'consumable': return 'var(--color-success)'
            default: return 'var(--color-text-primary)'
        }
    }

    // Group items by type
    const groupedInventory = inventory.reduce((acc, item) => {
        const type = item.item.type
        if (!acc[type]) acc[type] = []
        acc[type].push(item)
        return acc
    }, {} as Record<string, InventoryItem[]>)

    // Calculate total stats from equipped items
    const equippedStats = inventory
        .filter(item => item.equipped)
        .reduce((acc, item) => {
            const stat = item.item.effectStat
            if (!acc[stat]) acc[stat] = 0
            acc[stat] += item.item.effectValue
            return acc
        }, {} as Record<string, number>)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            {/* Header */}
            <div>
                <h1 style={{ marginBottom: 'var(--space-md)' }}>Inventory</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Manage your items and equipment. Equipped items boost your stats.
                </p>
            </div>

            {/* Stats Overview */}
            {Object.keys(equippedStats).length > 0 && (
                <Card variant="glass" style={{ padding: 'var(--space-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>📊 Equipped Bonuses</h3>
                    <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
                        {Object.entries(equippedStats).map(([stat, value]) => (
                            <div key={stat}>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>
                                    {stat.charAt(0).toUpperCase() + stat.slice(1)}
                                </div>
                                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
                                    +{value}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Empty State */}
            {inventory.length === 0 && (
                <Card variant="glass" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--space-md)' }}>📦</div>
                    <h3 style={{ marginBottom: 'var(--space-sm)' }}>Your inventory is empty</h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Visit the shop to buy weapons, armor, and other items!
                    </p>
                </Card>
            )}

            {/* Inventory by Type */}
            {Object.entries(groupedInventory).map(([type, items]) => (
                <div key={type}>
                    <h2 style={{ marginBottom: 'var(--space-lg)', textTransform: 'capitalize' }}>
                        {getItemIcon(type)} {type}s
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
                        {items.map((invItem) => (
                            <Card
                                key={invItem.id}
                                variant="glass"
                                style={{
                                    padding: 'var(--space-lg)',
                                    border: invItem.equipped ? '2px solid var(--color-accent-primary)' : undefined,
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                                    <div style={{ fontSize: 'var(--font-size-3xl)' }}>{getItemIcon(invItem.item.type)}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xs)' }}>
                                            <h3 style={{ fontSize: 'var(--font-size-xl)' }}>{invItem.item.name}</h3>
                                            {invItem.equipped && (
                                                <Badge variant="success">Equipped</Badge>
                                            )}
                                        </div>
                                        <Badge variant="info">
                                            Qty: {invItem.quantity}
                                        </Badge>
                                    </div>
                                </div>

                                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-lg)' }}>
                                    {invItem.item.description}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-lg)' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Effect:</span>
                                    <span style={{ color: getItemColor(invItem.item.type), fontWeight: 'var(--font-weight-bold)' }}>
                                        +{invItem.item.effectValue} {invItem.item.effectStat}
                                    </span>
                                </div>

                                {invItem.item.type.toLowerCase() !== 'consumable' && (
                                    <Button
                                        variant={invItem.equipped ? 'outline' : 'primary'}
                                        onClick={() => handleEquip(invItem.id)}
                                        disabled={equipping !== null}
                                        isLoading={equipping === invItem.id}
                                        style={{ width: '100%' }}
                                    >
                                        {invItem.equipped ? 'Unequip' : 'Equip'}
                                    </Button>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
