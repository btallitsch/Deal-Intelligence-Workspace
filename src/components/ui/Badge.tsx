import styles from './Badge.module.css';

interface BadgeProps {
  variant: 'gold' | 'teal' | 'red' | 'blue' | 'muted' | 'orange';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Badge({ variant, size = 'md', children }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {children}
    </span>
  );
}
