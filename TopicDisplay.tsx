
import React, { useEffect } from 'react';
import type { TopicResponse } from '../types';
import { Loader } from './Loader';
import { MicrobeIcon, ChevronRightIcon, LightbulbIcon, FlaskIcon, BranchIcon } from './icons';

interface TopicDisplayProps {
    topicData: TopicResponse | null;
    isLoading: boolean;
    error: string | null;
    initialTopic: string;
    onInitialSearch: () => void;
}

const WelcomeScreen: React.FC<{ initialTopic: string; onSearch: () => void; }> = ({ initialTopic, onSearch }) => (
    <div className="text-center max-w-2xl mx-auto mt-16">
        <MicrobeIcon className="w-24 h-24 text-teal-400 mx-auto mb-6" />
        <h2 className="text-4xl font-bold text-slate-800">Welcome to MicrobeMind Explorer</h2>
        <p className="mt-4 text-lg text-slate-600">
            Your AI-powered guide into the fascinating world of microbiology. Enter a topic in the sidebar to begin, or explore our suggestion.
        </p>
        <div className="mt-8">
             <button
                onClick={onSearch}
                className="bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mx-auto"
            >
                Explore: "{initialTopic}" <ChevronRightIcon className="w-5 h-5" />
            </button>
        </div>
    </div>
);

const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => (
    <div className="text-center max-w-xl mx-auto mt-20 bg-red-50 border border-red-200 p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-red-700">An Error Occurred</h3>
        <p className="mt-3 text-red-600">{error}</p>
    </div>
);

export const TopicDisplay: React.FC<TopicDisplayProps> = ({ topicData, isLoading, error, initialTopic, onInitialSearch }) => {
    
    useEffect(() => {
        // Automatically trigger search for the initial topic on first load
        if (!topicData && !isLoading && !error) {
            const hasSearched = sessionStorage.getItem('mm_initial_search_done');
            if (!hasSearched) {
                onInitialSearch();
                sessionStorage.setItem('mm_initial_search_done', 'true');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader /></div>;
    }
    if (error) {
        return <ErrorDisplay error={error} />;
    }
    if (!topicData) {
        return <WelcomeScreen initialTopic={initialTopic} onSearch={onInitialSearch} />;
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-bold text-slate-800 mb-2">{topicData.topic}</h2>
            <p className="text-lg bg-teal-50 border-l-4 border-teal-400 text-teal-800 p-4 rounded-r-lg mb-8 shadow-sm">
                {topicData.summary}
            </p>

            <div className="space-y-8">
                <section>
                    <h3 className="text-2xl font-semibold text-slate-700 mb-4 pb-2 border-b-2 border-teal-200 flex items-center gap-3">
                       <LightbulbIcon className="w-6 h-6 text-teal-500" /> Key Concepts
                    </h3>
                    <div className="space-y-4">
                        {topicData.keyConcepts.map((concept, index) => (
                            <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                                <h4 className="font-bold text-lg text-teal-700">{concept.name}</h4>
                                <p className="mt-1 text-slate-600">{concept.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section>
                     <h3 className="text-2xl font-semibold text-slate-700 mb-4 pb-2 border-b-2 border-teal-200 flex items-center gap-3">
                       <FlaskIcon className="w-6 h-6 text-teal-500" /> Potential Research Questions
                    </h3>
                    <ul className="list-none space-y-3">
                        {topicData.researchQuestions.map((question, index) => (
                           <li key={index} className="flex items-start gap-3">
                                <ChevronRightIcon className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                                <span className="text-slate-600">{question}</span>
                            </li>
                        ))}
                    </ul>
                </section>
                
                <section>
                    <h3 className="text-2xl font-semibold text-slate-700 mb-4 pb-2 border-b-2 border-teal-200 flex items-center gap-3">
                       <BranchIcon className="w-6 h-6 text-teal-500" /> Related Topics
                    </h3>
                    <div className="flex flex-wrap gap-3">
                         {topicData.relatedTopics.map((topic, index) => (
                           <span key={index} className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                               {topic}
                           </span>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
