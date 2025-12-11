

import React from 'react';
import { Users, Activity, DollarSign, TrendingUp } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const iconMap: Record<string, React.ElementType> = {
    Users,
    Activity,
    DollarSign,
    TrendingUp
};

export function StatsCards() {
    const { stats } = useDashboard();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
                const Icon = iconMap[stat.icon] || Activity;
                return (
                    <div key={index} className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-6 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </p>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-baseline justify-between pt-2">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                {stat.change}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
