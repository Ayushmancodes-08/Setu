/**
 * Shared Dashboard Widgets for all Setu Role Portals
 * Provides: KPI cards, activity feeds, alert banners, quick-action grids
 */
import React, { useEffect, useState } from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ─── Animated Counter ────────────────────────────────────────────────────────

export const AnimatedCounter: React.FC<{ to: number; duration?: number; prefix?: string; suffix?: string }> = ({
  to, duration = 800, prefix = '', suffix = ''
}) => {
  const [count, setCount] = useState(to);
  useEffect(() => {
    let animId: number;
    const start = performance.now();
    const startVal = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(startVal + eased * (to - startVal)));
      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      }
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [to, duration]);
  return <>{prefix}{count}{suffix}</>;
};

// ─── KPI Card ────────────────────────────────────────────────────────────────

export interface KpiCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: 'up' | 'down' | 'flat';
  trendLabel?: string;
  urgency?: 'normal' | 'warning' | 'critical';
  onClick?: () => void;
  animate?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label, value, suffix = '', prefix = '', icon: Icon, iconColor, iconBg,
  trend, trendLabel, urgency = 'normal', onClick, animate = true
}) => {
  const urgencyBorder = urgency === 'critical' ? 'border-red-300 bg-red-50/60' :
    urgency === 'warning' ? 'border-amber-300 bg-amber-50/40' :
    'border-slate-200 bg-white';

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-400';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl border p-4 shadow-xs transition-all duration-300 ${urgencyBorder} ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''} animate-in fade-in slide-in-from-bottom-2 duration-500`}
    >
      {urgency === 'critical' && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />
      )}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && trendLabel && (
          <div className={`flex items-center gap-1 text-[10px] font-bold ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            <span>{trendLabel}</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-black text-slate-900 leading-tight">
        {animate ? <AnimatedCounter to={value} prefix={prefix} suffix={suffix} /> : `${prefix}${value}${suffix}`}
      </div>
      <div className="text-xs text-slate-500 font-medium mt-1 leading-snug">{label}</div>
    </div>
  );
};

// ─── Activity Feed Item ───────────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  sub: string;
  time: string;
  badge?: string;
  badgeColor?: 'red' | 'amber' | 'emerald' | 'blue' | 'purple';
}

export const ActivityFeed: React.FC<{ items: ActivityItem[]; maxItems?: number }> = ({ items, maxItems = 5 }) => {
  const colorMap: Record<string, string> = {
    red:     'bg-red-100 text-red-800',
    amber:   'bg-amber-100 text-amber-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    blue:    'bg-blue-100 text-blue-800',
    purple:  'bg-purple-100 text-purple-800',
  };

  return (
    <div className="divide-y divide-slate-100">
      {items.slice(0, maxItems).map((item, i) => (
        <div
          key={item.id}
          className="flex items-start gap-3 py-3 animate-in fade-in slide-in-from-left-2 duration-300"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-base shrink-0">{item.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900 truncate">{item.title}</span>
              {item.badge && (
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${colorMap[item.badgeColor || 'blue']}`}>
                  {item.badge}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 truncate">{item.sub}</div>
          </div>
          <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">{item.time}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Quick Action Button ──────────────────────────────────────────────────────

export const QuickAction: React.FC<{
  icon: LucideIcon;
  label: string;
  sub?: string;
  color: string;
  onClick: () => void;
  pulse?: boolean;
}> = ({ icon: Icon, label, sub, color, onClick, pulse }) => (
  <button
    onClick={onClick}
    className={`group flex flex-col items-center text-center gap-2 p-4 rounded-2xl border-2 border-transparent hover:border-current transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 ${color} w-full`}
  >
    <div className="relative">
      <div className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      {pulse && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping" />}
    </div>
    <div>
      <div className="text-xs font-black leading-tight">{label}</div>
      {sub && <div className="text-[10px] opacity-75 mt-0.5">{sub}</div>}
    </div>
  </button>
);

// ─── Alert Banner ─────────────────────────────────────────────────────────────

export const AlertBanner: React.FC<{
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}> = ({ type, title, message, action }) => {
  const styles = {
    critical: 'bg-red-50 border-red-400 text-red-900',
    warning:  'bg-amber-50 border-amber-400 text-amber-900',
    info:     'bg-blue-50 border-blue-400 text-blue-900',
    success:  'bg-emerald-50 border-emerald-400 text-emerald-900',
  };
  const dots = {
    critical: 'bg-red-500',
    warning:  'bg-amber-500',
    info:     'bg-blue-500',
    success:  'bg-emerald-500',
  };
  return (
    <div className={`border-l-4 rounded-r-2xl px-4 py-3 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 ${styles[type]}`}>
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dots[type]} ${type === 'critical' ? 'animate-ping' : ''}`} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-black">{title}</div>
        <div className="text-[11px] opacity-80 mt-0.5">{message}</div>
      </div>
      {action && (
        <button onClick={action.onClick} className="text-[10px] font-black underline shrink-0 hover:opacity-70">
          {action.label}
        </button>
      )}
    </div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────

export const SectionHeader: React.FC<{ title: string; sub?: string; action?: React.ReactNode }> = ({ title, sub, action }) => (
  <div className="flex items-center justify-between mb-3">
    <div>
      <h3 className="font-black text-sm text-slate-900">{title}</h3>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
    {action}
  </div>
);

// ─── Live Pulse Dot ───────────────────────────────────────────────────────────

export const LiveDot: React.FC<{ color?: string }> = ({ color = 'bg-emerald-500' }) => (
  <span className={`inline-block w-2 h-2 rounded-full ${color} animate-ping`} />
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────

export const ProgressBar: React.FC<{ value: number; max: number; color?: string; label?: string }> = ({
  value, max, color = 'bg-emerald-500', label
}) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1 text-[10px] text-slate-500 font-semibold">
          <span>{label}</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
