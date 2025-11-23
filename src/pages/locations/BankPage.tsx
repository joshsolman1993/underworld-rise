import { useState } from 'react'
import { motion } from 'framer-motion'
import { bankApi, BankTransaction, LaunderResult } from '../../api/bank.api'
import { useAuthStore } from '../../store/authStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import AnimatedCard from '../../components/ui/AnimatedCard'
import { DollarSign, Landmark, Briefcase, ArrowDownCircle, ArrowUpCircle, AlertTriangle } from 'lucide-react'

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

export default function BankPage() {
    const user = useAuthStore((state) => state.user)
    const [depositAmount, setDepositAmount] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [launderAmount, setLaunderAmount] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<BankTransaction | LaunderResult | null>(null)

    const handleDeposit = async () => {
        const amount = parseInt(depositAmount)
        if (!amount || amount <= 0) return

        setIsLoading(true)
        try {
            const res = await bankApi.deposit(amount)
            setResult(res)
            setDepositAmount('')
        } catch (error: any) {
            alert(error.response?.data?.message || 'Deposit failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleWithdraw = async () => {
        const amount = parseInt(withdrawAmount)
        if (!amount || amount <= 0) return

        setIsLoading(true)
        try {
            const res = await bankApi.withdraw(amount)
            setResult(res)
            setWithdrawAmount('')
        } catch (error: any) {
            alert(error.response?.data?.message || 'Withdrawal failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLaunder = async () => {
        const amount = parseInt(launderAmount)
        if (!amount || amount <= 0) return

        setIsLoading(true)
        try {
            const res = await bankApi.launderMoney(amount)
            setResult(res)
            setLaunderAmount('')
        } catch (error: any) {
            alert(error.response?.data?.message || 'Money laundering failed')
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) return null

    const isLaunderResult = (res: any): res is LaunderResult => 'laundered' in res

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
                <h1 className="mb-md">The Bank</h1>
                <p className="text-secondary mb-0">
                    Manage your money safely. Deposit cash to protect it, or launder dirty money for a fee.
                </p>
            </motion.div>

            {/* Balance Overview */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid-responsive"
            >
                <motion.div variants={itemVariants}>
                    <AnimatedCard variant="success">
                        <Card variant="glass" className="p-xl h-full">
                            <div className="text-xs text-muted mb-sm flex items-center gap-xs">
                                <DollarSign size={14} /> Cash on Hand
                            </div>
                            <div className="text-3xl font-bold text-success font-mono">
                                ${Number(user.moneyCash).toLocaleString()}
                            </div>
                        </Card>
                    </AnimatedCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <AnimatedCard variant="info">
                        <Card variant="glass" className="p-xl h-full">
                            <div className="text-xs text-muted mb-sm flex items-center gap-xs">
                                <Landmark size={14} /> Bank Balance
                            </div>
                            <div className="text-3xl font-bold text-info font-mono">
                                ${Number(user.moneyBank).toLocaleString()}
                            </div>
                        </Card>
                    </AnimatedCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <AnimatedCard variant="warning">
                        <Card variant="glass" className="p-xl h-full">
                            <div className="text-xs text-muted mb-sm flex items-center gap-xs">
                                <Briefcase size={14} /> Total Worth
                            </div>
                            <div className="text-3xl font-bold text-accent font-mono">
                                ${(Number(user.moneyCash) + Number(user.moneyBank)).toLocaleString()}
                            </div>
                        </Card>
                    </AnimatedCard>
                </motion.div>
            </motion.div>

            {/* Result Modal */}
            {result && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-lg"
                >
                    <AnimatedCard variant="success">
                        <Card variant="elevated" className="p-xl bg-green-900/10 border-green-500/30">
                            <h2 className="mb-md text-success">
                                ✅ Transaction Complete!
                            </h2>

                            {isLaunderResult(result) ? (
                                <div className="flex-col gap-sm">
                                    <p>💰 Original Amount: <strong>${result.original.toLocaleString()}</strong></p>
                                    <p>💸 Fee ({result.feePercent}%): <strong className="text-danger">-${result.fee.toLocaleString()}</strong></p>
                                    <p>🏦 Laundered to Bank: <strong className="text-success">${result.laundered.toLocaleString()}</strong></p>
                                </div>
                            ) : (
                                <div className="flex-col gap-sm">
                                    {result.deposited && <p>💰 Deposited: <strong>${result.deposited.toLocaleString()}</strong></p>}
                                    {result.withdrawn && <p>💵 Withdrawn: <strong>${result.withdrawn.toLocaleString()}</strong></p>}
                                </div>
                            )}

                            <Button
                                variant="outline"
                                onClick={() => setResult(null)}
                                className="mt-lg"
                            >
                                Close
                            </Button>
                        </Card>
                    </AnimatedCard>
                </motion.div>
            )}

            {/* Banking Actions */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid-responsive"
            >
                {/* Deposit */}
                <motion.div variants={itemVariants}>
                    <AnimatedCard variant="success">
                        <Card variant="glass" className="p-xl h-full">
                            <h3 className="mb-md flex items-center gap-sm">
                                <ArrowDownCircle className="text-success" /> Deposit Cash
                            </h3>
                            <p className="text-sm text-muted mb-lg">
                                Store your cash safely in the bank.
                            </p>

                            <Input
                                type="number"
                                placeholder="Amount to deposit"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                className="mb-md"
                            />

                            <Button
                                variant="primary"
                                onClick={handleDeposit}
                                disabled={isLoading || !depositAmount || parseInt(depositAmount) <= 0}
                                isLoading={isLoading}
                                className="w-full"
                            >
                                Deposit
                            </Button>
                        </Card>
                    </AnimatedCard>
                </motion.div>

                {/* Withdraw */}
                <motion.div variants={itemVariants}>
                    <AnimatedCard variant="info">
                        <Card variant="glass" className="p-xl h-full">
                            <h3 className="mb-md flex items-center gap-sm">
                                <ArrowUpCircle className="text-info" /> Withdraw Cash
                            </h3>
                            <p className="text-sm text-muted mb-lg">
                                Take money out of your bank account.
                            </p>

                            <Input
                                type="number"
                                placeholder="Amount to withdraw"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                className="mb-md"
                            />

                            <Button
                                variant="primary"
                                onClick={handleWithdraw}
                                disabled={isLoading || !withdrawAmount || parseInt(withdrawAmount) <= 0}
                                isLoading={isLoading}
                                className="w-full"
                            >
                                Withdraw
                            </Button>
                        </Card>
                    </AnimatedCard>
                </motion.div>

                {/* Money Laundering */}
                <motion.div variants={itemVariants}>
                    <AnimatedCard variant="danger">
                        <Card variant="glass" className="p-xl h-full">
                            <h3 className="mb-md flex items-center gap-sm">
                                <AlertTriangle className="text-danger" /> Launder Money
                            </h3>
                            <p className="text-sm text-muted mb-lg">
                                Clean dirty cash for a 20-40% fee.
                            </p>

                            <Input
                                type="number"
                                placeholder="Amount to launder"
                                value={launderAmount}
                                onChange={(e) => setLaunderAmount(e.target.value)}
                                className="mb-md"
                            />

                            <Button
                                variant="danger"
                                onClick={handleLaunder}
                                disabled={isLoading || !launderAmount || parseInt(launderAmount) <= 0}
                                isLoading={isLoading}
                                className="w-full"
                            >
                                Launder
                            </Button>
                        </Card>
                    </AnimatedCard>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
