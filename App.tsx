
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopicDisplay } from './components/TopicDisplay';
import { exploreTopic } from './services/geminiService';
import type { TopicResponse, HistoryItem, AnalyticsData } from './types';

const App: React.FC = () => {
    const [topic, setTopic] = useState<string>('Bacteriophage therapy');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [topicData, setTopicData] = useState<TopicResponse | null>(null);
    const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([]);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
        totalVisits: 0,
        totalSearches: 0,
        searchesByDay: []
    });

    useEffect(() => {
        // --- Simulate traffic analytics ---
        const todayStr = new Date().toISOString().split('T')[0];

        // Load persisted analytics data from localStorage
        const savedVisits = parseInt(localStorage.getItem('mm_totalVisits') || '0', 10);
        const savedSearches = parseInt(localStorage.getItem('mm_totalSearches') || '0', 10);
        const savedSearchesByDay = JSON.parse(localStorage.getItem('mm_searchesByDay') || '[]');

        const newVisits = savedVisits + 1;
        localStorage.setItem('mm_totalVisits', newVisits.toString());
        
        // Ensure today is in the search data, even if count is 0
        if (!savedSearchesByDay.some((d: {day: string}) => d.day === todayStr)) {
            savedSearchesByDay.push({ day: todayStr, searches: 0 });
        }
        
        setAnalyticsData({
            totalVisits: newVisits,
            totalSearches: savedSearches,
            searchesByDay: savedSearchesByDay.slice(-7) // Keep last 7 days
        });

        // Load search history from localStorage
        const savedHistory = JSON.parse(localStorage.getItem('mm_searchHistory') || '[]');
        setSearchHistory(savedHistory);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const updateAnalyticsOnSearch = useCallback(() => {
        setAnalyticsData(prev => {
            const todayStr = new Date().toISOString().split('T')[0];
            const newTotalSearches = prev.totalSearches + 1;
            
            const todayData = prev.searchesByDay.find(d => d.day === todayStr);
            let newSearchesByDay;

            if (todayData) {
                // Today's data exists, map over the array to create a new one with the updated item.
                newSearchesByDay = prev.searchesByDay.map(item =>
                    item.day === todayStr
                        ? { ...item, searches: item.searches + 1 } // Create a new object for today
                        : item // Return existing objects for other days
                );
            } else {
                // Today's data doesn't exist, create a new array with the new entry.
                newSearchesByDay = [...prev.searchesByDay, { day: todayStr, searches: 1 }];
            }

            const finalSearchesByDay = newSearchesByDay.slice(-7);

            // Persist to localStorage
            localStorage.setItem('mm_totalSearches', newTotalSearches.toString());
            localStorage.setItem('mm_searchesByDay', JSON.stringify(finalSearchesByDay));

            return {
                ...prev,
                totalSearches: newTotalSearches,
                searchesByDay: finalSearchesByDay
            };
        });
    }, []);

    const handleSearch = useCallback(async (searchTopic: string) => {
        if (!searchTopic || isLoading) return;

        setIsLoading(true);
        setError(null);
        setTopicData(null);

        try {
            const data = await exploreTopic(searchTopic);
            setTopicData(data);

            // Update history
            setSearchHistory(prev => {
                const newHistoryItem = { id: Date.now(), topic: searchTopic };
                const updatedHistory = [newHistoryItem, ...prev.filter(item => item.topic !== searchTopic)].slice(0, 10); // Keep latest 10
                localStorage.setItem('mm_searchHistory', JSON.stringify(updatedHistory));
                return updatedHistory;
            });
            
            // Update analytics
            updateAnalyticsOnSearch();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setTopicData(null);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, updateAnalyticsOnSearch]);

    const handleHistoryClick = (historicTopic: string) => {
        setTopic(historicTopic);
        handleSearch(historicTopic);
    };

    return (
        <div className="flex h-screen bg-slate-100">
            <Sidebar
                topic={topic}
                setTopic={setTopic}
                onSearch={() => handleSearch(topic)}
                isLoading={isLoading}
                history={searchHistory}
                onHistoryClick={handleHistoryClick}
                analyticsData={analyticsData}
            />
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <TopicDisplay
                    topicData={topicData}
                    isLoading={isLoading}
                    error={error}
                    initialTopic={topic}
                    onInitialSearch={() => handleSearch(topic)}
                />
            </main>
        </div>
    );
};

export default App;
