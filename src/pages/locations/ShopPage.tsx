import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { shopApi, ShopItem } from '../../api/shop.api'
import { useAuthStore } from '../../store/authStore'
import { useToast } from '../../contexts/ToastContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import AnimatedCard from '../../components/ui/AnimatedCard'
import { Crosshair, Shield, Car, Pill, Package } from 'lucide-react'

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
            <div className="flex justify-center p-2xl">
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
            className="flex-col gap-xl"
        >
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="glass-panel"
            >
                <h1 className="mb-md">Black Market Shop</h1>
                <p className="text-secondary mb-0">
                    Buy weapons, armor, vehicles, and consumables to boost your criminal empire.
                </p>
            </motion.div>

            {/* Filter Buttons */}
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex gap-md flex-wrap"
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
                className="grid-responsive"
            >
                {filteredItems.map((item) => {
                    const canBuy = user && user.level >= item.requiredLevel && Number(user.moneyCash) >= Number(item.price)

                    return (
                        <motion.div key={item.id} variants={itemVariants}>
                            <AnimatedCard variant={getItemVariant(item.type)}>
                                <Card variant="glass" className="p-lg h-full">
                                    <div className="flex items-start gap-md mb-md">
                                        <div style={{ color: getItemColor(item.type), opacity: 0.7 }}>
                                            {getItemIcon(item.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-xs">
                                                <h3 className="text-xl">{item.name}</h3>
                                                <Badge variant={canBuy ? 'success' : 'danger'}>
                                                    Lvl {item.requiredLevel}
                                                </Badge>
                                            </div>
                                            <Badge variant="info" className="text-xs">
                                                {item.type}
                                            </Badge>
                                        </div>
                                    </div>

                                    <p className="text-secondary text-sm mb-lg">
                                        {item.description}
                                    </p>

                                    <div className="flex-col gap-sm mb-lg">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Effect:</span>
                                            <span className="font-mono" style={{ color: getItemColor(item.type) }}>
                                                +{item.effectValue} {item.effectStat}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Price:</span>
                                            <span className="text-success font-bold font-mono">
                                                ${Number(item.price).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        onClick={() => handlePurchase(item)}
                                        disabled={!canBuy || purchasing !== null}
                                        isLoading={purchasing === item.id}
                                        className="w-full"
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
