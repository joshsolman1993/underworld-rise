import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/authStore'

export default function RegisterPage() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setErrors({})

        // Validation
        const newErrors: Record<string, string> = {}
        if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters'
        }
        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true)

        try {
            const response = await authApi.register({ username, email, password })
            setAuth(response.user, response.token)
            navigate('/')
        } catch (err: any) {
            setErrors({
                general: err.response?.data?.message || 'Registration failed. Please try again.'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `
          radial-gradient(circle at top left, rgba(0, 217, 255, 0.1), transparent 50%),
          radial-gradient(circle at bottom right, rgba(255, 51, 102, 0.1), transparent 50%),
          var(--color-bg-primary)
        `,
                padding: 'var(--space-lg)',
            }}
        >
            <Card variant="glass" style={{ maxWidth: '500px', width: '100%', padding: 'var(--space-2xl)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
                    <h1
                        style={{
                            fontSize: 'var(--font-size-3xl)',
                            color: 'var(--color-accent-secondary)',
                            marginBottom: 'var(--space-sm)',
                            textShadow: 'var(--shadow-neon-cyan)',
                        }}
                    >
                        JOIN THE UNDERWORLD
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        Create your criminal empire
                    </p>
                </div>

                {errors.general && (
                    <div style={{
                        padding: 'var(--space-md)',
                        marginBottom: 'var(--space-lg)',
                        background: 'rgba(255, 51, 102, 0.1)',
                        border: '1px solid var(--color-danger)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-danger)',
                        fontSize: 'var(--font-size-sm)'
                    }}>
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <Input
                        type="text"
                        label="Username"
                        placeholder="Choose a street name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={errors.username}
                        required
                    />

                    <Input
                        type="email"
                        label="Email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                        required
                    />

                    <Input
                        type="password"
                        label="Confirm Password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                        required
                    />

                    <Button type="submit" variant="secondary" isLoading={isLoading} style={{ width: '100%' }}>
                        Create Account
                    </Button>

                    <div style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        Already have an account?{' '}
                        <a
                            href="/login"
                            style={{ color: 'var(--color-accent-secondary)', fontWeight: 'var(--font-weight-semibold)' }}
                        >
                            Login here
                        </a>
                    </div>
                </form>
            </Card>
        </div>
    )
}
