import React from 'react';
import type { HistoryItem, AnalyticsData } from '../types';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { SearchIcon, HistoryIcon, AnalyticsIcon, MicrobeIcon } from './icons';

interface SidebarProps {
    topic: string;
    setTopic: (topic: string) => void;
    onSearch: () => void;
    isLoading: boolean;
    history: HistoryItem[];
    onHistoryClick: (topic: string) => void;
    analyticsData: AnalyticsData;
}

export const Sidebar: React.FC<SidebarProps> = ({
    topic,
    setTopic,
    onSearch,
    isLoading,
    history,
    onHistoryClick,
    analyticsData
}) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <aside className="w-80 md:w-96 bg-white border-r border-slate-200 flex flex-col h-full shadow-md">
            <div className="p-6 border-b border-slate-200">
                <h1 className="text-2xl font-bold text-teal-600 flex items-center gap-2">
                    <MicrobeIcon className="w-7 h-7" />
                    MicrobeMind Explorer
                </h1>
                <p className="text-sm text-slate-500 mt-1">AI-Powered Microbiology Insights</p>
            </div>

            <div className="p-6 flex-grow overflow-y-auto">
                <div className="relative mb-6">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g., Quorum Sensing"
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        disabled={isLoading}
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
                <button
                    onClick={onSearch}
                    disabled={isLoading || !topic}
                    className="w-full bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {isLoading ? 'Exploring...' : 'Explore Topic'}
                </button>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2 mb-3">
                        <HistoryIcon className="w-5 h-5 text-slate-500" />
                        Search History
                    </h2>
                    <ul className="space-y-2">
                        {history.length > 0 ? (
                            history.map(item => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => onHistoryClick(item.topic)}
                                        className="w-full text-left text-slate-600 hover:text-teal-600 hover:bg-teal-50 p-2 rounded-md transition-colors text-sm truncate"
                                    >
                                        {item.topic}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-slate-400 p-2">No recent searches.</li>
                        )}
                    </ul>
                </div>
                
                 <div className="mt-8">
                    <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2 mb-4">
                        <AnalyticsIcon className="w-5 h-5 text-slate-500" />
                        Site Analytics
                    </h2>
                     <AnalyticsDashboard data={analyticsData} />
                </div>
            </div>
            <footer className="p-4 text-center text-xs text-slate-400 border-t border-slate-200">
                <p>Created by Nilesh Vadnere</p>
                <p className="mt-1">Powered by Gemini API</p>
            </footer>
        </aside>
    );
};