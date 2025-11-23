import { UserMission } from '../../api/mission.api';
import Button from './Button';
import ProgressBar from './ProgressBar';
import Badge from './Badge';
import { CheckCircle, Lock, Trophy } from 'lucide-react';
import '../../styles/components.css';

interface MissionCardProps {
    userMission: UserMission;
    onClaim: (id: string) => void;
    isClaiming: boolean;
}

export default function MissionCard({ userMission, onClaim, isClaiming }: MissionCardProps) {
    const { mission, progress, isCompleted, isClaimed } = userMission;
    const isDaily = mission.type === 'DAILY';

    return (
        <div className={`glass-panel ${isCompleted && !isClaimed ? 'completed-glow' : ''}`} style={{
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            borderColor: isCompleted && !isClaimed ? 'var(--color-success)' : undefined
        }}>
            {/* Background Glow for completed */}
            {isCompleted && !isClaimed && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(16, 185, 129, 0.05)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    pointerEvents: 'none'
                }} />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative', zIndex: 10 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h3 style={{
                            fontWeight: 700,
                            fontSize: '1.125rem',
                            color: 'var(--color-text-primary)',
                            margin: 0
                        }}>
                            {mission.title}
                        </h3>
                        {isDaily ? (
                            <Badge variant="info">DAILY</Badge>
                        ) : (
                            <Badge variant="warning">STORY</Badge>
                        )}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        {mission.description}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    {isClaimed ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                            <CheckCircle size={18} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>CLAIMED</span>
                        </div>
                    ) : isCompleted ? (
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => onClaim(userMission.id)}
                            isLoading={isClaiming}
                            className="animate-bounce-subtle"
                        >
                            <Trophy size={16} />
                            CLAIM
                        </Button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                            <Lock size={18} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>LOCKED</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginTop: '1.5rem', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    <span>Progress</span>
                    <span>{progress} / {mission.requirementValue}</span>
                </div>
                <ProgressBar
                    value={progress}
                    max={mission.requirementValue}
                    color={isCompleted ? 'success' : 'primary'}
                    showLabel={false}
                    height="8px"
                />
            </div>

            {/* Rewards */}
            <div style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                gap: '1.5rem',
                fontSize: '0.875rem',
                position: 'relative',
                zIndex: 10
            }}>
                {mission.rewardMoney > 0 && (
                    <div style={{ color: 'var(--color-warning)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        +${mission.rewardMoney.toLocaleString()}
                    </div>
                )}
                {mission.rewardXp > 0 && (
                    <div style={{ color: 'var(--color-info)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        +{mission.rewardXp} XP
                    </div>
                )}
                {mission.rewardCredits > 0 && (
                    <div style={{ color: 'var(--color-accent-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        +{mission.rewardCredits} Credits
                    </div>
                )}
            </div>
        </div>
    );
}
