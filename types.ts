
export interface KeyConcept {
    name: string;
    description: string;
}

export interface TopicResponse {
    topic: string;
    summary: string;
    keyConcepts: KeyConcept[];
    researchQuestions: string[];
    relatedTopics: string[];
}

export interface HistoryItem {
    id: number;
    topic: string;
}

export interface DailySearchData {
    day: string;
    searches: number;
}

export interface AnalyticsData {
    totalVisits: number;
    totalSearches: number;
    searchesByDay: DailySearchData[];
}
