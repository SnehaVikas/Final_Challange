/**
 * YouTube Service for SkillPath AI
 * Fetches relevant educational videos using YouTube Data API v3.
 */
import { getEnv } from '../utils/env';

const API_KEY = getEnv('VITE_YOUTUBE_API_KEY');
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

/**
 * Searches YouTube for educational resources based on learning gaps or next topics
 */
export const getYouTubeResources = async ({ concept, weakAreas = [], nextTopics = [] }) => {
  // Gracefully handle missing API key
  if (!API_KEY || API_KEY === 'your_youtube_api_key_here') {
    console.warn("YouTube API Key missing. Returning mock resources.");
    return [];
  }

  try {
    // Determine the best search query
    // Priority: First weak area > First next topic > General concept
    const searchTerm = weakAreas[0] || nextTopics[0] || concept;
    const query = encodeURIComponent(`learn ${searchTerm} educational`);
    
    const response = await fetch(
      `${BASE_URL}?part=snippet&maxResults=3&q=${query}&type=video&videoEmbeddable=true&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Map and filter results to ensure valid video IDs
    const resources = data.items
      .filter(item => item.id?.videoId) // Skip if videoId is missing
      .map(item => {
        const videoId = item.id.videoId;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        return {
          id: videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          url: url,
          thumbnail: item.snippet.thumbnails.medium.url,
          description: item.snippet.description
        };
      });

    return resources;
  } catch (error) {
    console.error("Failed to fetch YouTube resources:", error);
    return []; // Return empty to prevent UI breakage
  }
};

/**
 * Static mock data for demo fallback
 */
export const getMockResources = (concept) => [
  {
    id: "1",
    title: `Understanding ${concept} in 5 Minutes`,
    channel: "CrashCourse Education",
    url: "https://www.youtube.com",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400",
    description: "A quick dive into the basics."
  },
  {
    id: "2",
    title: `${concept} Mastery: Advanced Techniques`,
    channel: "The Coding Shifu",
    url: "https://www.youtube.com",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400",
    description: "Taking your skills to the next level."
  }
];
