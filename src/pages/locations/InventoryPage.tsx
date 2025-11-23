import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { shopApi, InventoryItem } from '../../api/shop.api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import AnimatedCard from '../../components/ui/AnimatedCard'
import { Crosshair, Shield, Car, Pill, Package, BarChart2 } from 'lucide-react'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3 }
    }
}

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
            <div className="flex justify-center p-2xl">
                <div className="spinner" />
            </div>
        )
    }

    const getItemIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'weapon': return <Crosshair size={32} />
            case 'armor': return <Shield size={32} />
            case 'vehicle': return <Car size={32} />
            case 'consumable': return <Pill size={32} />
            default: return <Package size={32} />
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

    const getItemVariant = (type: string): 'success' | 'danger' | 'warning' | 'info' | 'default' => {
        switch (type.toLowerCase()) {
            case 'weapon': return 'danger'
            case 'armor': return 'info'
            case 'vehicle': return 'warning'
            case 'consumable': return 'success'
            default: return 'default'
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-col gap-xl"
        >
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="glass-panel"
            >
                <h1 className="mb-md">Inventory</h1>
                <p className="text-secondary mb-0">
                    Manage your items and equipment. Equipped items boost your stats.
                </p>
            </motion.div>

            {/* Stats Overview */}
            {Object.keys(equippedStats).length > 0 && (
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card variant="glass" className="p-xl">
                        <h3 className="mb-md flex items-center gap-sm">
                            <BarChart2 className="text-accent" /> Equipped Bonuses
                        </h3>
                        <div className="flex gap-xl flex-wrap">
                            {Object.entries(equippedStats).map(([stat, value]) => (
                                <div key={stat}>
                                    <div className="text-xs text-muted mb-xs capitalize">
                                        {stat}
                                    </div>
                                    <div className="text-2xl font-bold text-success font-mono">
                                        +{value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Empty State */}
            {inventory.length === 0 && (
                <Card variant="glass" className="p-2xl text-center">
                    <div className="text-4xl mb-md">📦</div>
                    <h3 className="mb-sm">Your inventory is empty</h3>
                    <p className="text-secondary">
                        Visit the shop to buy weapons, armor, and other items!
                    </p>
                </Card>
            )}

            {/* Inventory by Type */}
            {Object.entries(groupedInventory).map(([type, items], index) => (
                <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                >
                    <h2 className="mb-lg capitalize flex items-center gap-sm">
                        {getItemIcon(type)} {type}s
                    </h2>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid-responsive"
                    >
                        {items.map((invItem) => (
                            <motion.div key={invItem.id} variants={itemVariants}>
                                <AnimatedCard variant={invItem.equipped ? 'success' : getItemVariant(invItem.item.type)}>
                                    <Card
                                        variant="glass"
                                        className={`p-lg h-full ${invItem.equipped ? 'border-success bg-green-900/10' : ''}`}
                                    >
                                        <div className="flex items-start gap-md mb-md">
                                            <div style={{ color: getItemColor(invItem.item.type), opacity: 0.7 }}>
                                                {getItemIcon(invItem.item.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-xs">
                                                    <h3 className="text-xl">{invItem.item.name}</h3>
                                                    {invItem.equipped && (
                                                        <Badge variant="success">Equipped</Badge>
                                                    )}
                                                </div>
                                                <Badge variant="info" className="text-xs">
                                                    Qty: {invItem.quantity}
                                                </Badge>
                                            </div>
                                        </div>

                                        <p className="text-secondary text-sm mb-lg">
                                            {invItem.item.description}
                                        </p>

                                        <div className="flex justify-between text-sm mb-lg">
                                            <span className="text-muted">Effect:</span>
                                            <span className="font-bold font-mono" style={{ color: getItemColor(invItem.item.type) }}>
                                                +{invItem.item.effectValue} {invItem.item.effectStat}
                                            </span>
                                        </div>

                                        {invItem.item.type.toLowerCase() !== 'consumable' && (
                                            <Button
                                                variant={invItem.equipped ? 'outline' : 'primary'}
                                                onClick={() => handleEquip(invItem.id)}
                                                disabled={equipping !== null}
                                                isLoading={equipping === invItem.id}
                                                className="w-full"
                                            >
                                                {invItem.equipped ? 'Unequip' : 'Equip'}
                                            </Button>
                                        )}
                                    </Card>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            ))}
        </motion.div>
    )
}
