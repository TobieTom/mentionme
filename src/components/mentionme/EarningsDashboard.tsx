"use client";

export function EarningsDashboard() {
    // Mock Data
    const stats = {
        activeDays: 7,
        progress: 70,
        totalEarned: "127.50",
        mentionsCount: 42,
        averagePrice: "3.04",
        todayEarnings: "15.00"
    };

    const recentMentions = [
        { sender: "0x742d35...", amount: "5.00", timestamp: "2 hours ago" },
        { sender: "0x8F3aB2...", amount: "3.50", timestamp: "5 hours ago" },
        { sender: "0x123abc...", amount: "10.00", timestamp: "1 day ago" },
        { sender: "0x456def...", amount: "1.00", timestamp: "1 day ago" },
        { sender: "0x789ghi...", amount: "5.00", timestamp: "2 days ago" }
    ];

    return (
        <div className="space-y-6 bg-neutral-50 min-h-screen px-4 py-6 pb-24">
            {/* Activity Status */}
            <div className="bg-white border border-neutral-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
                <div className="text-sm font-medium text-neutral-900">
                    Active for {stats.activeDays} days
                </div>
                <div className="bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-xs font-medium">
                    {stats.progress}% to next tier
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm">
                    <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2 font-medium">Total Earned</div>
                    <div className="text-3xl font-mono font-bold text-emerald-600 tracking-tight">${stats.totalEarned}</div>
                </div>

                <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm">
                    <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2 font-medium">Mentions</div>
                    <div className="text-3xl font-mono font-bold text-neutral-900 tracking-tight">{stats.mentionsCount}</div>
                </div>

                <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm">
                    <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2 font-medium">Avg. Price</div>
                    <div className="text-3xl font-mono font-bold text-emerald-600 tracking-tight">${stats.averagePrice}</div>
                </div>

                <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm">
                    <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2 font-medium">Today</div>
                    <div className="text-3xl font-mono font-bold text-emerald-600 tracking-tight">${stats.todayEarnings}</div>
                </div>
            </div>

            {/* Recent Mentions */}
            <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3 px-1 font-medium">Recent Activity</div>
                <div className="space-y-3">
                    {recentMentions.map((mention, index) => (
                        <div key={index} className="bg-white border border-neutral-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-600">
                                    {mention.sender.substring(2, 4)}
                                </div>
                                <div>
                                    <div className="font-mono text-sm text-neutral-900 font-medium">{mention.sender}</div>
                                    <div className="text-xs text-neutral-500">{mention.timestamp}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono font-semibold text-lg text-emerald-600">+${mention.amount}</div>
                                <div className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium">Paid</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
