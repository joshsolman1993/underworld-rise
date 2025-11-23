import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/authStore'
import '../../styles/components.css'

export default function LoginPage() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const response = await authApi.login({ email, password })
            setAuth(response.user, response.token)
            navigate('/')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
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
          radial-gradient(circle at top right, rgba(255, 51, 102, 0.1), transparent 50%),
          radial-gradient(circle at bottom left, rgba(0, 217, 255, 0.1), transparent 50%),
          var(--color-bg-primary)
        `,
                padding: 'var(--space-lg)',
            }}
        >
            <Card variant="glass" style={{ maxWidth: '450px', width: '100%', padding: 'var(--space-2xl)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
                    <h1
                        style={{
                            fontSize: 'var(--font-size-4xl)',
                            color: 'var(--color-accent-primary)',
                            marginBottom: 'var(--space-sm)',
                            textShadow: 'var(--shadow-neon-red)',
                        }}
                    >
                        UNDERWORLD RISE
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        Enter the criminal underworld
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
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
                        required
                        error={error}
                    />

                    <Button type="submit" variant="primary" isLoading={isLoading} style={{ width: '100%' }}>
                        Login
                    </Button>

                    <div style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        Don't have an account?{' '}
                        <a
                            href="/register"
                            style={{ color: 'var(--color-accent-primary)', fontWeight: 'var(--font-weight-semibold)' }}
                        >
                            Register here
                        </a>
                    </div>
                </form>

                <div className="divider" style={{ margin: 'var(--space-xl) 0' }} />

                <div style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    <p>Rise from a nobody to the city's Godfather</p>
                </div>
            </Card>
        </div>
    )
}
