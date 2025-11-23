import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { shopApi, ShopItem, PurchaseResult } from '../../api/shop.api'
import { useAuthStore } from '../../store/authStore'
import { useToast } from '../../contexts/ToastContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import AnimatedCard from '../../components/ui/AnimatedCard'
import { Crosshair, Shield, Car, Pill, Package, DollarSign, TrendingUp } from 'lucide-react'

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

export default function ShopPage() {
    const user = useAuthStore((state) => state.user)
    const { toast } = useToast()
    const [items, setItems] = useState<ShopItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [purchasing, setPurchasing] = useState<number | null>(null)
    const [filter, setFilter] = useState<string>('all')

    useEffect(() => {
        loadItems()
    }, [])

    const loadItems = async () => {
        try {
            const data = await shopApi.getAllItems()
            setItems(data)
        } catch (error) {
            console.error('Failed to load items:', error)
            toast.error('Failed to load shop items')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePurchase = async (item: ShopItem) => {
        if (!user) return

        setPurchasing(item.id)

        try {
            const result = await shopApi.purchaseItem(item.id)
            toast.success(`Purchased ${result.item} for $${result.price.toLocaleString()}!`)

            // Refresh user data would go here
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Purchase failed')
        } finally {
            setPurchasing(null)
        }
    }

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
                <div className="spinner" />
            </div>
        )
    }

    const filteredItems = filter === 'all' ? items : items.filter(item => item.type.toLowerCase() === filter)

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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}
        >
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <h1 style={{ marginBottom: 'var(--space-md)' }}>Black Market Shop</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Buy weapons, armor, vehicles, and consumables to boost your criminal empire.
                </p>
            </motion.div>

            {/* Filter Buttons */}
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}
            >
                {['all', 'weapon', 'armor', 'vehicle', 'consumable'].map((type) => (
                    <Button
                        key={type}
                        variant={filter === type ? 'primary' : 'outline'}
                        onClick={() => setFilter(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                ))}
            </motion.div>

            {/* Items Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}
            >
                {filteredItems.map((item) => {
                    const canBuy = user && user.level >= item.requiredLevel && Number(user.moneyCash) >= Number(item.price)

                    return (
                        <motion.div key={item.id} variants={itemVariants}>
                            <AnimatedCard variant={getItemVariant(item.type)}>
                                <Card variant="glass" style={{ padding: 'var(--space-lg)', height: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                                        <div style={{ color: getItemColor(item.type), opacity: 0.7 }}>
                                            {getItemIcon(item.type)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xs)' }}>
                                                <h3 style={{ fontSize: 'var(--font-size-xl)' }}>{item.name}</h3>
                                                <Badge variant={canBuy ? 'success' : 'danger'}>
                                                    Lvl {item.requiredLevel}
                                                </Badge>
                                            </div>
                                            <Badge variant="info" style={{ fontSize: 'var(--font-size-xs)' }}>
                                                {item.type}
                                            </Badge>
                                        </div>
                                    </div>

                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-lg)' }}>
                                        {item.description}
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                                            <span style={{ color: 'var(--color-text-muted)' }}>Effect:</span>
                                            <span style={{ color: getItemColor(item.type), fontFamily: 'var(--font-mono)' }}>
                                                +{item.effectValue} {item.effectStat}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                                            <span style={{ color: 'var(--color-text-muted)' }}>Price:</span>
                                            <span style={{ color: 'var(--color-success)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-mono)' }}>
                                                ${Number(item.price).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        onClick={() => handlePurchase(item)}
                                        disabled={!canBuy || purchasing !== null}
                                        isLoading={purchasing === item.id}
                                        style={{ width: '100%' }}
                                    >
                                        {canBuy ? 'Buy Now' : user && user.level < item.requiredLevel ? 'Level Too Low' : 'Not Enough Cash'}
                                    </Button>
                                </Card>
                            </AnimatedCard>
                        </motion.div>
                    )
                })}
            </motion.div>
        </motion.div>
    )
}
