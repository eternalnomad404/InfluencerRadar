// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';
import TrendBriefComponent from '../../Components/TrendBrief/TrendBriefComponent';
import useInfluencerMonitoring from '../../hooks/useInfluencerMonitoring';

interface InfluencerData {
  id: string;
  name: string;
  handle: string;
  profileImage: string;
  niche: string;
  platforms: {
    instagram?: { followers: string; handle: string };
    youtube?: { followers: string; handle: string };
  };
  engagementRate: number;
  totalFollowers: string;
  country?: string;
}

interface VideoComment {
  id: string;
  videoId: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
  replyCount: number;
  parentId?: string;
}

interface InstagramInfluencer {
  id: string;
  username: string;
  fullName: string;
  biography: string;
  followersCount: number;
  followsCount: number;
  postsCount: number;
  profilePicUrl: string;
  profilePicUrlHD: string;
  verified: boolean;
  isBusinessAccount: boolean;
  businessCategoryName?: string | null;
  latestPosts: InstagramPost[];
  latestIgtvVideos: InstagramPost[];
}

interface InstagramPost {
  type: string;
  shortCode: string;
  caption: string;
  commentsCount: number;
  likesCount: number;
  videoViewCount?: number;
  videoDuration?: number;
  displayUrl: string;
  videoUrl?: string;
  timestamp: string;
  hashtags: string[];
  mentions: string[];
  url: string;
}

const InfluencerDetailPage: React.FC = () => {
  const { channelId, category } = useParams<{ channelId: string; category: string }>();
  const [activeTab, setActiveTab] = useState('content');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [influencerData, setInfluencerData] = useState<InfluencerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [channelStats, setChannelStats] = useState<any>(null);
  const [videoComments, setVideoComments] = useState<{ [videoId: string]: VideoComment[] }>({});
  const [commentsLoading, setCommentsLoading] = useState<{ [videoId: string]: boolean }>({});
  const [instagramData, setInstagramData] = useState<InstagramInfluencer | null>(null);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [instagramLoading, setInstagramLoading] = useState(false);

  // Add the hook to access AI-generated trend brief data
  const { trendBrief } = useInfluencerMonitoring();

  const YOUTUBE_API_KEY = 'AIzaSyCe_0VVgxUN_rJoKExbv5OJ3as_TN-pVrg';

  // Helper function to convert follower count strings to numbers for calculation
  const parseFollowerCount = (followerString: string): number => {
    if (!followerString) return 0;
    const cleanString = followerString.replace(/[^\d.MKmk]/g, '');
    const num = parseFloat(cleanString);

    if (cleanString.toLowerCase().includes('m')) {
      return num * 1000000;
    } else if (cleanString.toLowerCase().includes('k')) {
      return num * 1000;
    }
    return num;
  };

  // Helper function to format numbers back to readable format
  const formatFollowerCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  // Function to calculate and update total followers from all platforms
  const calculateTotalFollowers = () => {
    let totalCount = 0;

    // Add YouTube followers
    if (influencerData?.platforms?.youtube?.followers) {
      totalCount += parseFollowerCount(influencerData.platforms.youtube.followers);
    }

    // Add Instagram followers if available
    if (instagramData?.followersCount) {
      totalCount += instagramData.followersCount;
    }

    return formatFollowerCount(totalCount);
  };

  // Helper function to convert country codes to full country names
  const getCountryName = (countryCode: string): string => {
    const countryMap: { [key: string]: string } = {
      'US': 'United States',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'UK': 'United Kingdom',
      'IN': 'India',
      'AU': 'Australia',
      'DE': 'Germany',
      'FR': 'France',
      'JP': 'Japan',
      'KR': 'South Korea',
      'SG': 'Singapore',
      'NL': 'Netherlands',
      'SE': 'Sweden',
      'NO': 'Norway',
      'DK': 'Denmark',
      'FI': 'Finland',
      'CH': 'Switzerland',
      'AT': 'Austria',
      'BE': 'Belgium',
      'IE': 'Ireland',
      'NZ': 'New Zealand',
      'BR': 'Brazil',
      'MX': 'Mexico',
      'ES': 'Spain',
      'IT': 'Italy',
      'PT': 'Portugal',
      'RU': 'Russia',
      'CN': 'China',
      'TW': 'Taiwan',
      'HK': 'Hong Kong',
      'MY': 'Malaysia',
      'TH': 'Thailand',
      'PH': 'Philippines',
      'ID': 'Indonesia',
      'VN': 'Vietnam'
    };

    return countryMap[countryCode] || countryCode || 'Not known';
  };

  const formatSubscriberCount = (count: string): string => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  // Fetch recent videos for the channel
  const fetchRecentVideos = async (channelId: string) => {
    try {
      setVideosLoading(true);

      // First, get the uploads playlist ID and channel statistics
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`
      );

      if (channelResponse.ok) {
        const channelData = await channelResponse.json();
        if (channelData.items && channelData.items.length > 0) {
          const channel = channelData.items[0];

          // Store detailed channel statistics
          setChannelStats({
            viewCount: parseInt(channel.statistics.viewCount || '0'),
            subscriberCount: parseInt(channel.statistics.subscriberCount || '0'),
            videoCount: parseInt(channel.statistics.videoCount || '0'),
            creationDate: new Date(channel.snippet.publishedAt),
            description: channel.snippet.description,
            customUrl: channel.snippet.customUrl,
            country: getCountryName(channel.snippet.country) // Convert country code to full name
          });

          const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

          // Get recent videos from uploads playlist
          const videosResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${YOUTUBE_API_KEY}`
          );

          if (videosResponse.ok) {
            const videosData = await videosResponse.json();
            if (videosData.items) {
              // Get video statistics for each video
              const videoIds = videosData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
              const statsResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
              );

              let videoStats: any = {};
              if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                statsData.items?.forEach((video: any) => {
                  videoStats[video.id] = {
                    ...video.statistics,
                    duration: video.contentDetails.duration
                  };
                });
              }

              const formattedVideos = videosData.items.map((item: any) => {
                const videoId = item.snippet.resourceId.videoId;
                const stats = videoStats[videoId] || {};
                const publishedDate = new Date(item.snippet.publishedAt);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - publishedDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                let timeAgo = '';
                if (diffDays === 1) timeAgo = '1 day ago';
                else if (diffDays < 7) timeAgo = `${diffDays} days ago`;
                else if (diffDays < 30) timeAgo = `${Math.ceil(diffDays / 7)} weeks ago`;
                else timeAgo = `${Math.ceil(diffDays / 30)} months ago`;

                return {
                  id: videoId,
                  platform: 'youtube',
                  thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
                  title: item.snippet.title,
                  caption: item.snippet.description?.substring(0, 150) + '...' || '',
                  type: 'Video',
                  date: timeAgo,
                  publishedAt: publishedDate,
                  views: parseInt(stats.viewCount || '0'),
                  likes: parseInt(stats.likeCount || '0'),
                  comments: parseInt(stats.commentCount || '0'),
                  duration: stats.duration
                };
              });

              setRecentVideos(formattedVideos);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching recent videos:', error);
    } finally {
      setVideosLoading(false);
    }
  };

  // Fetch comments for a specific video
  const fetchVideoComments = async (videoId: string) => {
    try {
      setCommentsLoading(prev => ({ ...prev, [videoId]: true }));

      // Check if comments are already cached
      const cacheKey = `youtube_comments_${videoId}`;
      const cacheTimeKey = `youtube_comments_timestamp_${videoId}`;
      const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      const cachedComments = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(cacheTimeKey);

      if (cachedComments && cachedTime) {
        const timeDiff = Date.now() - parseInt(cachedTime);
        if (timeDiff < cacheExpiry) {
          console.log(`Using cached comments for video ${videoId}`);
          const comments: VideoComment[] = JSON.parse(cachedComments);
          setVideoComments(prev => ({ ...prev, [videoId]: comments }));
          setCommentsLoading(prev => ({ ...prev, [videoId]: false }));
          return;
        }
      }

      console.log(`Fetching fresh comments for video ${videoId}`);

      // Fetch comments from YouTube API
      const commentsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&order=relevance&key=${YOUTUBE_API_KEY}`
      );

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();

        if (commentsData.items) {
          const formattedComments: VideoComment[] = commentsData.items.map((item: any) => ({
            id: item.id,
            videoId: videoId,
            authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
            authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
            textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
            likeCount: item.snippet.topLevelComment.snippet.likeCount || 0,
            publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
            replyCount: item.snippet.totalReplyCount || 0
          }));

          // Store comments in state
          setVideoComments(prev => ({ ...prev, [videoId]: formattedComments }));

          // Cache the comments
          localStorage.setItem(cacheKey, JSON.stringify(formattedComments));
          localStorage.setItem(cacheTimeKey, Date.now().toString());

          console.log(`Cached ${formattedComments.length} comments for video ${videoId}`);
        }
      } else {
        console.log(`Comments may be disabled for video ${videoId}`);
        // Store empty array to indicate comments were checked but not available
        setVideoComments(prev => ({ ...prev, [videoId]: [] }));
      }
    } catch (error) {
      console.error(`Error fetching comments for video ${videoId}:`, error);
      setVideoComments(prev => ({ ...prev, [videoId]: [] }));
    } finally {
      setCommentsLoading(prev => ({ ...prev, [videoId]: false }));
    }
  };

  // Fetch comments for all recent videos
  const fetchAllVideoComments = async () => {
    if (recentVideos.length === 0) return;

    console.log(`Starting to fetch comments for ${recentVideos.length} videos`);

    // Fetch comments for each video with a small delay to avoid rate limiting
    for (let i = 0; i < recentVideos.length; i++) {
      const video = recentVideos[i];
      await fetchVideoComments(video.id);

      // Add a small delay between requests to be respectful to the API
      if (i < recentVideos.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.log('Finished fetching comments for all videos');
  };

  // Load Instagram data from JSON file
  const loadInstagramData = async () => {
    try {
      setInstagramLoading(true);

      // Import the Instagram data
      const instagramData = await import('../../instaJSON/15Influencers.json');
      const influencers = instagramData.default;

      // Create a comprehensive mapping between YouTube channel names/IDs and Instagram usernames
      const usernameMapping: { [key: string]: string } = {
        // Direct channel ID mappings (for featured influencers)
        'UCsTcErHg8oDvUnTzoqsYeNw': 'unboxtherapy', // Unbox Therapy
        'UCBJycsmduvYEL83R_U4JriQ': 'mkbhd', // Marques Brownlee
        'UCXuqSBlHAE6Xw-yeJA0Tunw': 'linustech', // Linus Tech Tips
        'UC6QYFutt9cluQ3uSM8XzKcQ': 'mrwhosetheboss', // MrWhosetheBoss

        // Additional channel name mappings for comprehensive coverage
        'unbox therapy': 'unboxtherapy',
        'marques brownlee': 'mkbhd',
        'mkbhd': 'mkbhd',
        'mrwhosetheboss': 'mrwhosetheboss',
        'linus tech tips': 'linustech',
        'technical guruji': 'technicalguruji',
        'trakin tech': 'trakintech',
        'tech burner': 'techburner',
        'geeky ranjit': 'geekyranjitofficial',
        'techbar': 'techbar_official',
        'uravgconsumer': 'uravgconsumer',
        'austin evans': 'austinnotduncan',
        'jerryrigeverything': 'zacksjerryrig',
        'tech boss': 'techbossindia',
        'gogi tech': 'gogitechreal',
        'manoj saru': 'manojsaru',

        // Case variations and common searches
        'technical_guruji': 'technicalguruji',
        'tech_burner': 'techburner',
        'geeky_ranjit': 'geekyranjitofficial',
        'ur_avg_consumer': 'uravgconsumer',
        'jerry_rig_everything': 'zacksjerryrig',
        'tech_boss': 'techbossindia',
        'gogi_tech': 'gogitechreal'
      };

      // Try to find matching Instagram profile
      let instagramUsername = '';

      // First try direct channel ID mapping
      if (channelId && usernameMapping[channelId]) {
        instagramUsername = usernameMapping[channelId];
      }
      // Then try channel name if we have influencer data
      else if (influencerData?.name) {
        const normalizedName = influencerData.name.toLowerCase().replace(/\s+/g, ' ').trim();
        instagramUsername = usernameMapping[normalizedName] || '';
      }

      // If still no match, try partial matching with channel name
      if (!instagramUsername && influencerData?.name) {
        const searchName = influencerData.name.toLowerCase();

        // Look for partial matches in our mapping
        for (const [key, value] of Object.entries(usernameMapping)) {
          if (searchName.includes(key.toLowerCase()) || key.toLowerCase().includes(searchName)) {
            instagramUsername = value;
            break;
          }
        }

        // If still no match, try searching through Instagram data directly
        if (!instagramUsername) {
          const directMatch = influencers.find((influencer: any) => {
            const instagramName = influencer.fullName.toLowerCase();
            const instagramUsername = influencer.username.toLowerCase();
            return instagramName.includes(searchName) ||
                   searchName.includes(instagramName) ||
                   instagramUsername.includes(searchName.replace(/\s+/g, '')) ||
                   searchName.replace(/\s+/g, '').includes(instagramUsername);
          });

          if (directMatch) {
            instagramUsername = directMatch.username;
            console.log(`🔍 Found direct match for "${influencerData.name}" → @${instagramUsername}`);
          }
        }
      }

      // Final fallback: if we still have no match, try to use any available Instagram data for demo purposes
      if (!instagramUsername && influencers.length > 0) {
        // Use a random Instagram influencer for demo purposes, preferring verified accounts
        const verifiedInfluencers = influencers.filter((inf: any) => inf.verified);
        const fallbackInfluencer = verifiedInfluencers.length > 0 ? verifiedInfluencers[0] : influencers[0];
        instagramUsername = fallbackInfluencer.username;
        console.log(`🎯 Using fallback Instagram data: @${instagramUsername} for demo purposes`);
      }

      console.log(`Searching for Instagram data with username: ${instagramUsername}`);

      if (instagramUsername) {
        const matchingInfluencer = influencers.find((influencer: any) =>
          influencer.username === instagramUsername
        );

        if (matchingInfluencer) {
          setInstagramData(matchingInfluencer);

          // Update influencer data to include Instagram platform info
          let totalCount = 0;
          if (influencerData) {
            const updatedInfluencerData = {
              ...influencerData,
              platforms: {
                ...influencerData.platforms,
                instagram: {
                  followers: formatFollowerCount(matchingInfluencer.followersCount),
                  handle: matchingInfluencer.username
                }
              }
            };

            // Calculate total followers from both platforms
            if (updatedInfluencerData.platforms.youtube?.followers) {
              totalCount += parseFollowerCount(updatedInfluencerData.platforms.youtube.followers);
            }
            totalCount += matchingInfluencer.followersCount;

            updatedInfluencerData.totalFollowers = formatFollowerCount(totalCount);

            setInfluencerData(updatedInfluencerData);
          } else {
            totalCount = matchingInfluencer.followersCount;
          }

          // Combine IGTV videos and regular posts
          const allPosts = [
            ...(matchingInfluencer.latestIgtvVideos || []),
            ...(matchingInfluencer.latestPosts || [])
          ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          setInstagramPosts(allPosts.slice(0, 12)); // Limit to 12 most recent posts

          console.log(`✅ Loaded Instagram data for ${matchingInfluencer.fullName} (@${matchingInfluencer.username})`);
          console.log(`📊 Found ${allPosts.length} total posts, showing ${Math.min(allPosts.length, 12)} recent posts`);
          console.log(`👥 ${matchingInfluencer.followersCount.toLocaleString()} followers`);
          console.log(`🔢 Updated total followers: ${formatFollowerCount(totalCount)}`);
        } else {
          console.log(`❌ No Instagram data found for username: ${instagramUsername}`);
          console.log(`Available usernames:`, influencers.map((inf: any) => inf.username));
        }
      } else {
        console.log(`❌ No Instagram username mapping found for channel: ${channelId} (${influencerData?.name || 'Unknown'})`);
        console.log(`Available mappings:`, Object.keys(usernameMapping));
      }
    } catch (error) {
      console.error('Error loading Instagram data:', error);
    } finally {
      setInstagramLoading(false);
    }
  };

  // Fetch influencer data based on channelId
  useEffect(() => {
    const fetchInfluencerData = async () => {
      if (!channelId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Try to get data from cache first
        const cachedInfluencers = localStorage.getItem('youtube_tech_influencers');
        if (cachedInfluencers) {
          const influencers = JSON.parse(cachedInfluencers);
          const foundInfluencer = influencers.find((inf: any) => inf.id === channelId);

          if (foundInfluencer) {
            setInfluencerData({
              id: foundInfluencer.id,
              name: foundInfluencer.name,
              handle: foundInfluencer.handle || `@${foundInfluencer.name.replace(/\s+/g, '').toLowerCase()}`,
              profileImage: foundInfluencer.profileImage,
              niche: foundInfluencer.category || 'Technology',
              platforms: {
                youtube: {
                  followers: foundInfluencer.followers,
                  handle: foundInfluencer.name.replace(/\s+/g, '')
                }
              },
              engagementRate: parseFloat(foundInfluencer.engagement?.replace('%', '')) || 5.1,
              totalFollowers: foundInfluencer.followers,
              country: foundInfluencer.country || 'Not known'
            });
            setLoading(false);
            // Fetch recent videos for this channel
            fetchRecentVideos(foundInfluencer.id);
            return;
          }
        }

        // If not in cache, fetch from YouTube API
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const channel = data.items[0];
            const formattedData: InfluencerData = {
              id: channel.id,
              name: channel.snippet.title,
              handle: `@${channel.snippet.title.replace(/\s+/g, '').toLowerCase()}`,
              profileImage: channel.snippet.thumbnails?.medium?.url || channel.snippet.thumbnails?.default?.url || '',
              niche: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Technology',
              platforms: {
                youtube: {
                  followers: formatSubscriberCount(channel.statistics.subscriberCount || '0'),
                  handle: channel.snippet.title.replace(/\s+/g, '')
                }
              },
              engagementRate: 5.1, // Default value
              totalFollowers: formatSubscriberCount(channel.statistics.subscriberCount || '0'),
              country: getCountryName(channel.snippet.country) // Convert country code to full name
            };
            setInfluencerData(formattedData);
            // Fetch recent videos for this channel
            fetchRecentVideos(channel.id);
          }
        }
      } catch (error) {
        console.error('Error fetching influencer data:', error);
        // Fallback to default data
        setInfluencerData({
          id: channelId || 'unknown',
          name: 'Tech Influencer',
          handle: '@techinfluencer',
          profileImage: 'https://readdy.ai/api/search-image?query=professional%20tech%20influencer%20portrait%20with%20smartphone%20modern%20office%20background&width=120&height=120',
          niche: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Technology',
          platforms: {
            youtube: { followers: '1.2M', handle: 'TechInfluencer' }
          },
          engagementRate: 5.1,
          totalFollowers: '1.2M',
          country: 'Not known'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencerData();
  }, [channelId, category]);

  // Update engagement rate when recent videos are loaded
  useEffect(() => {
    if (recentVideos.length > 0 && influencerData) {
      const dynamicEngagementRate = calculateEngagementRate();
      setInfluencerData(prev => prev ? {
        ...prev,
        engagementRate: dynamicEngagementRate
      } : null);
    }
  }, [recentVideos]);

  // Fetch comments when videos are loaded
  useEffect(() => {
    if (recentVideos.length > 0) {
      fetchAllVideoComments();
    }
  }, [recentVideos]);

  // Load Instagram data when component mounts or influencer data changes
  useEffect(() => {
    if (channelId) {
      loadInstagramData();
    }
  }, [channelId, influencerData]); // Add influencerData as dependency

  // Fallback content for non-YouTube platforms or when no videos are loaded
  const fallbackPosts = [
    {
      id: 1,
      platform: 'youtube',
      thumbnail: 'https://readdy.ai/api/search-image?query=smartphone%20review%20tech%20video%20thumbnail&width=300&height=200',
      title: 'iPhone 15 Pro Max - Complete Review!',
      caption: 'Deep dive into the latest iPhone 15 Pro Max with comprehensive testing and real-world usage scenarios.',
      type: 'Video',
      date: '2 days ago',
      views: 1200000,
      likes: 45000,
      comments: 2100
    },
    {
      id: 2,
      platform: 'instagram',
      thumbnail: 'https://readdy.ai/api/search-image?query=android%20phone%20comparison%20tech%20setup&width=300&height=200',
      title: 'Android vs iPhone - Which one wins?',
      caption: 'The ultimate comparison between Android and iPhone ecosystems. Which one should you choose in 2025?',
      type: 'Reel',
      date: '5 days ago',
      views: 850000,
      likes: 32000,
      comments: 1500
    },
    {
      id: 3,
      platform: 'youtube',
      thumbnail: 'https://readdy.ai/api/search-image?query=tech%20gadgets%20accessories%20review%20setup&width=300&height=200',
      title: 'Top 10 Must-Have Tech Accessories',
      caption: 'Essential tech accessories that will upgrade your smartphone experience in 2025.',
      type: 'Video',
      date: '1 week ago',
      views: 900000,
      likes: 28000,
      comments: 890
    },
    {
      id: 4,
      platform: 'instagram',
      thumbnail: 'https://readdy.ai/api/search-image?query=smartphone%20camera%20photography%20tips&width=300&height=200',
      title: 'Pro Camera Tips for Your Phone',
      caption: 'Transform your smartphone photography with these professional tips and tricks.',
      type: 'Post',
      date: '1 week ago',
      views: 420000,
      likes: 18500,
      comments: 645
    },
    {
      id: 5,
      platform: 'youtube',
      thumbnail: 'https://readdy.ai/api/search-image?query=smartphone%20unboxing%20first%20impressions&width=300&height=200',
      title: 'Galaxy S24 Ultra First Impressions',
      caption: 'Unboxing and first impressions of the Samsung Galaxy S24 Ultra with S Pen testing.',
      type: 'Video',
      date: '2 weeks ago',
      views: 750000,
      likes: 22000,
      comments: 980
    }
  ];

  // Get AI-generated brand collaborations from trend brief, or use fallback
  const brandCollaborations = trendBrief?.brandCollaborations || [];

  // Helper function to get appropriate icon for brand
  const getBrandIcon = (brandName: string) => {
    const name = brandName.toLowerCase();
    if (name.includes('apple')) return 'fab fa-apple';
    if (name.includes('google')) return 'fab fa-google';
    if (name.includes('microsoft')) return 'fab fa-microsoft';
    if (name.includes('samsung')) return 'fas fa-mobile-alt';
    if (name.includes('sony')) return 'fas fa-headphones';
    if (name.includes('nike')) return 'fas fa-running';
    if (name.includes('adidas')) return 'fas fa-shoe-prints';
    return 'fas fa-building'; // Default icon
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'fab fa-instagram';
      case 'youtube': return 'fab fa-youtube';
      default: return 'fas fa-share-alt';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Helper function to get total comments count across all videos
  const getTotalCommentsCount = () => {
    return Object.values(videoComments).reduce((total, comments) => total + comments.length, 0);
  };

  // Helper function to get average comment sentiment (placeholder for future AI analysis)
  const getCommentSentiment = (videoId: string) => {
    const comments = videoComments[videoId];
    if (!comments || comments.length === 0) return 'neutral';

    // Placeholder logic - in the future, you can implement AI sentiment analysis here
    const totalLikes = comments.reduce((sum, comment) => sum + comment.likeCount, 0);
    const avgLikes = totalLikes / comments.length;

    if (avgLikes > 5) return 'positive';
    if (avgLikes < 2) return 'negative';
    return 'neutral';
  };

  // Instagram Analytics Helper Functions
  const calculateInstagramEngagementRate = () => {
    if (!instagramData || instagramPosts.length === 0) return 0;

    const totalEngagement = instagramPosts.reduce((sum, post) =>
      sum + post.likesCount + post.commentsCount, 0
    );
    const totalViews = instagramPosts.reduce((sum, post) =>
      sum + (post.videoViewCount || post.likesCount * 10), 0 // Estimate views for photos
    );

    return totalViews > 0 ? ((totalEngagement / totalViews) * 100) : 0;
  };

  const getInstagramPostTypeDistribution = () => {
    if (instagramPosts.length === 0) return { photos: 0, videos: 0, reels: 0 };

    const distribution = instagramPosts.reduce((acc, post) => {
      if (post.type === 'Video' || post.videoUrl) {
        acc.videos++;
      } else if (post.type === 'Reel') {
        acc.reels++;
      } else {
        acc.photos++;
      }
      return acc;
    }, { photos: 0, videos: 0, reels: 0 });

    return distribution;
  };

  const getAverageInstagramLikes = () => {
    if (instagramPosts.length === 0) return 0;
    return Math.round(instagramPosts.reduce((sum, post) => sum + post.likesCount, 0) / instagramPosts.length);
  };

  const getAverageInstagramComments = () => {
    if (instagramPosts.length === 0) return 0;
    return Math.round(instagramPosts.reduce((sum, post) => sum + post.commentsCount, 0) / instagramPosts.length);
  };

  const getMostPopularInstagramPost = () => {
    if (instagramPosts.length === 0) return null;
    return instagramPosts.reduce((best, current) =>
      current.likesCount > best.likesCount ? current : best
    );
  };  // Helper functions for YouTube analytics
  const calculateAverageViews = () => {
    if (!recentVideos.length) return 0;
    const totalViews = recentVideos.reduce((sum, video) => sum + video.views, 0);
    return Math.round(totalViews / recentVideos.length);
  };

  const calculateEngagementRate = () => {
    if (!recentVideos.length) return 0;
    const totalEngagement = recentVideos.reduce((sum, video) => sum + video.likes + video.comments, 0);
    const totalViews = recentVideos.reduce((sum, video) => sum + video.views, 0);
    return totalViews > 0 ? ((totalEngagement / totalViews) * 100) : 0;
  };

  const calculateUploadFrequency = () => {
    if (!recentVideos.length) return 'Unknown';
    const sortedVideos = recentVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    if (sortedVideos.length < 2) return 'Insufficient data';

    const daysBetween = (new Date(sortedVideos[0].publishedAt).getTime() - new Date(sortedVideos[sortedVideos.length - 1].publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    const avgDaysBetween = daysBetween / (sortedVideos.length - 1);

    if (avgDaysBetween <= 1) return 'Daily';
    else if (avgDaysBetween <= 3) return '2-3 times/week';
    else if (avgDaysBetween <= 7) return 'Weekly';
    else if (avgDaysBetween <= 14) return 'Bi-weekly';
    else return 'Monthly';
  };

  const getBestPerformingVideo = () => {
    if (!recentVideos.length) return null;
    return recentVideos.reduce((best, current) =>
      current.views > best.views ? current : best
    );
  };

  const getChannelAge = () => {
    if (!channelStats?.creationDate) return 'Unknown';
    const now = new Date();
    const created = new Date(channelStats.creationDate);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));

    if (diffYears > 0) {
      return diffMonths > 0 ? `${diffYears}y ${diffMonths}m` : `${diffYears} year${diffYears > 1 ? 's' : ''}`;
    }
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navigation/>

      {loading ? (
        /* Loading State */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="mb-4">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Influencer Profile...</h3>
            <p className="text-gray-500">Fetching the latest data for this influencer</p>
          </div>
        </div>
      ) : !influencerData ? (
        /* Error State */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="mb-4">
              <i className="fas fa-exclamation-triangle text-4xl text-red-600"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Influencer Not Found</h3>
            <p className="text-gray-500 mb-6">We couldn't find the influencer data for this profile.</p>
            <a
              href="/influencerPage"
              className="bg-blue-600 text-white px-6 py-2 rounded-button text-sm font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap"
            >
              Back to Influencers
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Influencer Profile Section */}
          <div className="bg-gradient-to-br from-white to-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:space-x-8">
                {/* Left Side - Centered Influencer Details */}
                <div className="flex-1 flex items-center justify-center lg:justify-start">
                  <div className="flex items-center space-x-6 max-w-2xl">
                    <div className="relative">
                      <img
                        src={influencerData.profileImage}
                        alt={influencerData.name}
                        className="w-28 h-28 rounded-2xl object-cover shadow-lg border-4 border-white"
                      />
                      <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                        <i className="fas fa-check text-white text-xs"></i>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-1">{influencerData.name}</h1>
                      <p className="text-lg text-gray-600 mb-3 font-medium">{influencerData.handle}</p>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-tag text-blue-600 text-xs"></i>
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{influencerData.niche}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-map-marker-alt text-green-600 text-xs"></i>
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{influencerData.country || 'Global'}</span>
                        </div>
                      </div>

                      {/* Enhanced Platform Badges */}
                      <div className="flex items-center space-x-3 mt-4">
                        {influencerData.platforms.instagram && (
                          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 transform hover:scale-105">
                            <i className="fab fa-instagram text-white"></i>
                            <div className="text-white">
                              <div className="text-sm font-bold">{influencerData.platforms.instagram.followers}</div>
                              <div className="text-xs opacity-90">Instagram</div>
                            </div>
                          </div>
                        )}
                        {influencerData.platforms.youtube && (
                          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 transform hover:scale-105">
                            <i className="fab fa-youtube text-white"></i>
                            <div className="text-white">
                              <div className="text-sm font-bold">{influencerData.platforms.youtube.followers}</div>
                              <div className="text-xs opacity-90">YouTube</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Expanded Metrics */}
                <div className="mt-6 lg:mt-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 min-w-[450px] shadow-md border border-gray-200">
                  {/* Top Row - Total Followers and Cross-Platform Score */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Total Combined Metrics */}
                    <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {instagramData ? calculateTotalFollowers() : influencerData.totalFollowers}
                      </div>
                      <div className="text-lg text-gray-700 font-semibold">Total Followers</div>
                      <div className="text-sm text-gray-500 mt-1">Across all platforms</div>
                    </div>

                    {/* Cross-Platform Performance Indicator */}
                    {instagramData && (
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-md">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                              <i className="fas fa-chart-line text-white text-xs"></i>
                            </div>
                            <span className="text-lg font-bold">Cross-Platform Score</span>
                          </div>
                          <div className="text-3xl font-bold mb-2">
                            {Math.round((calculateEngagementRate() + calculateInstagramEngagementRate()) / 2 * 10) / 10}%
                          </div>
                          <div className="text-sm opacity-90">Combined Engagement</div>
                          <div className="text-xs opacity-75 mt-1">YouTube + Instagram</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Row - Platform Metrics Side by Side */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* YouTube Metrics */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                            <i className="fab fa-youtube text-white text-lg"></i>
                          </div>
                          <div>
                            <span className="text-lg font-bold text-gray-800">YouTube</span>
                            <div className="text-sm text-gray-500">Content Platform</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-red-600">
                          {influencerData.platforms?.youtube?.followers || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Subscribers</div>
                      </div>
                      <div className="space-y-3">
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-lg font-bold text-red-600">
                            {recentVideos.length > 0 ? calculateEngagementRate().toFixed(1) : influencerData.engagementRate || '5.1'}%
                          </div>
                          <div className="text-sm text-gray-600">Engagement Rate</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-red-600">
                            {recentVideos.length > 0 ? formatNumber(calculateAverageViews()) : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">Avg Views</div>
                        </div>
                      </div>
                    </div>

                    {/* Instagram Metrics */}
                    {instagramData ? (
                      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <i className="fab fa-instagram text-white text-lg"></i>
                            </div>
                            <div>
                              <span className="text-lg font-bold text-gray-800">Instagram</span>
                              <div className="text-sm text-gray-500">Social Platform</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-pink-600">
                            {formatNumber(instagramData.followersCount)}
                          </div>
                          <div className="text-sm text-gray-600">Followers</div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-center p-3 bg-pink-50 rounded-lg">
                            <div className="text-lg font-bold text-pink-600">
                              {calculateInstagramEngagementRate().toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Engagement Rate</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-pink-600">
                              {formatNumber(getAverageInstagramLikes())}
                            </div>
                            <div className="text-sm text-gray-600">Avg Likes</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-6 border border-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fab fa-instagram text-gray-400 text-xl"></i>
                          </div>
                          <div className="text-sm text-gray-500 font-medium">Instagram Loading...</div>
                          <div className="text-xs text-gray-400">Fetching data...</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'content', label: 'Recent Content', icon: 'fas fa-images' },
              { id: 'ai-trends', label: 'AI Trend Brief', icon: 'fas fa-brain' },
              { id: 'analytics', label: 'Analytics', icon: 'fas fa-analytics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'content' && (
          <div>
            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Platform:</span>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-1 cursor-pointer"
                  >
                    <option value="all">All Platforms</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {(videosLoading || instagramLoading) ? 'Loading content...' :
                 `Showing ${(selectedPlatform === 'all' || selectedPlatform === 'youtube' ? recentVideos.length : 0) +
                           (selectedPlatform === 'all' || selectedPlatform === 'instagram' ? instagramPosts.length : 0)} posts`}
              </div>
            </div>

            {/* Content Grid */}
            {(videosLoading || instagramLoading) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded mb-3"></div>
                      <div className="flex space-x-4">
                        <div className="h-3 bg-gray-300 rounded w-12"></div>
                        <div className="h-3 bg-gray-300 rounded w-12"></div>
                        <div className="h-3 bg-gray-300 rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* YouTube Videos */}
                {(selectedPlatform === 'all' || selectedPlatform === 'youtube') && recentVideos.map((video) => (
                  <div key={`youtube-${video.id}`} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-48 object-cover object-center"
                      />
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <i className="fab fa-youtube"></i>
                          <span className="capitalize">{video.type}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <a
                          href={`https://www.youtube.com/watch?v=${video.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs hover:bg-opacity-90"
                        >
                          <i className="fas fa-play mr-1"></i>
                          Watch
                        </a>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.caption}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-heart text-red-500"></i>
                            <span>{formatNumber(video.likes)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-comment text-blue-500"></i>
                            <span>{formatNumber(video.comments)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-eye text-green-500"></i>
                            <span>{formatNumber(video.views)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{video.date}</div>

                      {/* Comments Section */}
                      <div className="mt-3 border-t pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <button
                            onClick={() => {
                              const commentsSection = document.getElementById(`comments-${video.id}`);
                              if (commentsSection) {
                                commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
                              }
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <i className="fas fa-comments mr-1"></i>
                            View Comments ({videoComments[video.id]?.length || 0})
                          </button>
                          {commentsLoading[video.id] && (
                            <i className="fas fa-spinner fa-spin text-xs text-gray-400"></i>
                          )}
                        </div>

                        <div id={`comments-${video.id}`} style={{ display: 'none' }} className="max-h-60 overflow-y-auto">
                          {videoComments[video.id] && videoComments[video.id].length > 0 ? (
                            <div className="space-y-2">
                              {videoComments[video.id].slice(0, 5).map((comment) => (
                                <div key={comment.id} className="flex space-x-2 p-2 bg-gray-50 rounded text-xs">
                                  <img
                                    src={comment.authorProfileImageUrl}
                                    alt={comment.authorDisplayName}
                                    className="w-6 h-6 rounded-full flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900">{comment.authorDisplayName}</div>
                                    <div className="text-gray-600 line-clamp-2">{comment.textDisplay}</div>
                                    <div className="flex items-center space-x-2 mt-1 text-gray-400">
                                      <span>{comment.likeCount} likes</span>
                                      <span>•</span>
                                      <span>{new Date(comment.publishedAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {videoComments[video.id].length > 5 && (
                                <div className="text-xs text-center text-gray-500 py-1">
                                  Showing 5 of {videoComments[video.id].length} comments
                                </div>
                              )}
                            </div>
                          ) : videoComments[video.id] && videoComments[video.id].length === 0 ? (
                            <div className="text-xs text-gray-500 text-center py-2">
                              No comments available for this video
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500 text-center py-2">
                              Comments not loaded yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Instagram Posts */}
                {(selectedPlatform === 'all' || selectedPlatform === 'instagram') && instagramPosts.map((post) => (
                  <div
                    key={`instagram-${post.shortCode}`}
                    className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => window.open(post.url, '_blank', 'noopener,noreferrer')}
                  >
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white">
                        <div className="text-center">
                          <i className="fab fa-instagram text-4xl mb-2"></i>
                          <div className="text-sm font-medium">{post.type}</div>
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
                          <i className="fab fa-instagram"></i>
                          <span className="capitalize">{post.type}</span>
                        </div>
                      </div>
                      {post.videoUrl && (
                        <div className="absolute bottom-3 right-3">
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs hover:bg-opacity-90"
                          >
                            <i className="fas fa-play mr-1"></i>
                            View
                          </a>
                        </div>
                      )}
                      {post.videoDuration && (
                        <div className="absolute bottom-3 left-3">
                          <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                            {Math.floor(post.videoDuration)}s
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-900 mb-3 line-clamp-3">{post.caption}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-heart text-red-500"></i>
                            <span>{formatNumber(post.likesCount)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-comment text-blue-500"></i>
                            <span>{formatNumber(post.commentsCount)}</span>
                          </div>
                          {post.videoViewCount && (
                            <div className="flex items-center space-x-1">
                              <i className="fas fa-eye text-green-500"></i>
                              <span>{formatNumber(post.videoViewCount)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                        {post.hashtags.length > 0 && (
                          <span className="text-blue-500">#{post.hashtags[0]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {((selectedPlatform === 'youtube' && recentVideos.length === 0) ||
                  (selectedPlatform === 'instagram' && instagramPosts.length === 0) ||
                  (selectedPlatform === 'all' && recentVideos.length === 0 && instagramPosts.length === 0)) && (
                  <div className="col-span-full bg-white rounded-lg shadow-sm border p-12 text-center">
                    <div className="mb-4">
                      <i className="fas fa-image text-4xl text-gray-300"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No content available</h3>
                    <p className="text-gray-500">
                      {selectedPlatform === 'youtube' ? 'No YouTube videos found for this influencer.' :
                       selectedPlatform === 'instagram' ? 'No Instagram posts found for this influencer.' :
                       'No content available for any platform.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai-trends' && (
          <div>
            <TrendBriefComponent
              influencerData={[{
                name: influencerData?.name || 'Influencer',
                platform: 'youtube',
                content: recentVideos || [],
                recentVideos: recentVideos || []
              }, ...(instagramData ? [{
                name: influencerData?.name || 'Influencer',
                platform: 'instagram',
                content: instagramPosts || [],
                posts: instagramPosts || []
              }] : [])]}
              autoRefresh={true}
              refreshInterval={24}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-16">
            {/* YouTube Channel Overview */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  <i className="fab fa-youtube text-red-600 mr-3"></i>
                  YouTube Channel Overview
                </h2>
                <div className="text-sm text-gray-500">
                  Real-time data from YouTube API
                </div>
              </div>

              {/* YouTube Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">{calculateEngagementRate().toFixed(2)}%</div>
                  <div className="text-sm text-gray-600">Avg. Engagement Rate</div>
                  <div className="text-xs text-green-600 mt-1">Based on recent videos</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">{channelStats ? formatNumber(channelStats.viewCount) : 'N/A'}</div>
                  <div className="text-sm text-gray-600">Total Channel Views</div>
                  <div className="text-xs text-gray-500 mt-1">All-time views</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600">{formatNumber(calculateAverageViews())}</div>
                  <div className="text-sm text-gray-600">Avg. Video Views</div>
                  <div className="text-xs text-gray-500 mt-1">Recent videos average</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600">{channelStats ? formatNumber(channelStats.videoCount) : 'N/A'}</div>
                  <div className="text-sm text-gray-600">Total Videos</div>
                  <div className="text-xs text-gray-500 mt-1">Channel lifetime</div>
                </div>
              </div>

              {/* Channel Performance Metrics */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="fab fa-youtube text-red-600 mr-2"></i>
                  Channel Performance Metrics
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Channel Age</div>
                      <div className="text-xs text-gray-600">{getChannelAge()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">{channelStats ? new Date(channelStats.creationDate).getFullYear() : 'N/A'}</div>
                      <div className="text-xs text-gray-600">Created</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Upload Frequency</div>
                      <div className="text-xs text-gray-600">Based on recent uploads</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-blue-600">{calculateUploadFrequency()}</div>
                      <div className="text-xs text-gray-600">Consistency</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Views per Subscriber</div>
                      <div className="text-xs text-gray-600">Channel efficiency metric</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        {channelStats && channelStats.subscriberCount > 0
                          ? (channelStats.viewCount / channelStats.subscriberCount).toFixed(1)
                          : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-600">Ratio</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Content Performance */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  <i className="fas fa-play-circle text-red-600 mr-3"></i>
                  YouTube Content Performance
                </h2>
                <div className="text-sm text-gray-500">
                  Video-specific analytics and insights
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Video Performance */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Video Analytics</h3>
                  <div className="space-y-4">
                    {recentVideos.length > 0 ? (
                      <>
                        <div className="text-sm text-gray-600 mb-3">Performance metrics from last {recentVideos.length} videos</div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <div className="text-lg font-semibold text-yellow-600">
                              {formatNumber(Math.max(...recentVideos.map(v => v.views)))}
                            </div>
                            <div className="text-xs text-gray-600">Highest Views</div>
                          </div>
                          <div className="p-3 bg-red-50 rounded-lg">
                            <div className="text-lg font-semibold text-red-600">
                              {formatNumber(Math.max(...recentVideos.map(v => v.likes)))}
                            </div>
                            <div className="text-xs text-gray-600">Most Likes</div>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-semibold text-blue-600">
                              {formatNumber(Math.max(...recentVideos.map(v => v.comments)))}
                            </div>
                            <div className="text-xs text-gray-600">Most Comments</div>
                          </div>
                        </div>

                        {getBestPerformingVideo() && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border">
                            <div className="text-sm font-medium text-gray-900 mb-1">🏆 Best Performing Recent Video</div>
                            <div className="text-sm text-gray-700 font-medium">{getBestPerformingVideo()?.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatNumber(getBestPerformingVideo()?.views || 0)} views •
                              {formatNumber(getBestPerformingVideo()?.likes || 0)} likes •
                              {getBestPerformingVideo()?.date}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <i className="fas fa-video text-3xl mb-2"></i>
                        <div className="text-sm">No recent video data available</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Channel Growth Metrics */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-indigo-50 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600">
                          {channelStats ? (channelStats.videoCount > 0 ? Math.round(channelStats.viewCount / channelStats.videoCount / 1000) + 'K' : 'N/A') : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Avg Views/Video</div>
                      </div>
                      <div className="text-center p-4 bg-pink-50 rounded-lg">
                        <div className="text-2xl font-bold text-pink-600">
                          {channelStats ? (channelStats.videoCount > 0 ? Math.round(channelStats.subscriberCount / channelStats.videoCount) : 'N/A') : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Subs per Video</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Content Strategy Insights</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Upload Consistency</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            calculateUploadFrequency() === 'Daily' || calculateUploadFrequency() === '2-3 times/week'
                              ? 'bg-green-100 text-green-700'
                              : calculateUploadFrequency() === 'Weekly'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {calculateUploadFrequency()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Engagement Quality</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            calculateEngagementRate() > 3
                              ? 'bg-green-100 text-green-700'
                              : calculateEngagementRate() > 1
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {calculateEngagementRate() > 3 ? 'Excellent' :
                             calculateEngagementRate() > 1 ? 'Good' : 'Needs Improvement'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Engagement Analytics */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  <i className="fas fa-heart text-red-600 mr-3"></i>
                  YouTube Engagement Analytics
                </h2>
                <div className="text-sm text-gray-500">
                  Detailed interaction and comment analytics
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Engagement Breakdown */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Breakdown</h3>
                  {recentVideos.length > 0 ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Average Engagement per Video</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Likes</span>
                            <span className="text-sm font-medium">
                              {formatNumber(Math.round(recentVideos.reduce((sum, v) => sum + v.likes, 0) / recentVideos.length))}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Comments</span>
                            <span className="text-sm font-medium">
                              {formatNumber(Math.round(recentVideos.reduce((sum, v) => sum + v.comments, 0) / recentVideos.length))}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Like-to-View Ratio</span>
                            <span className="text-sm font-medium">
                              {(recentVideos.reduce((sum, v) => sum + (v.views > 0 ? v.likes / v.views : 0), 0) / recentVideos.length * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Comment-to-View Ratio</span>
                            <span className="text-sm font-medium">
                              {(recentVideos.reduce((sum, v) => sum + (v.views > 0 ? v.comments / v.views : 0), 0) / recentVideos.length * 100).toFixed(3)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <div className="text-sm">No engagement data available</div>
                    </div>
                  )}
                </div>

                {/* Comment Analytics */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <i className="fas fa-comments text-blue-600 mr-2"></i>
                    Comment Analytics
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {getTotalCommentsCount()}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Total Comments Stored</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {recentVideos.length > 0 ? Math.round(getTotalCommentsCount() / recentVideos.length) : 0}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Avg Comments/Video</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Comment Analysis Ready</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Videos with Comments</span>
                          <span className="text-green-600 font-medium">
                            {Object.keys(videoComments).filter(videoId => videoComments[videoId].length > 0).length} / {recentVideos.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">AI Analysis Status</span>
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                            Ready for Processing
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Data Collection</span>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            {getTotalCommentsCount() > 0 ? 'Complete' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {getTotalCommentsCount() > 0 && (
                      <div className="pt-4 border-t">
                        <div className="text-xs text-gray-500 text-center">
                          💡 Comment data is stored and ready for AI sentiment analysis, engagement pattern detection, and audience insight generation.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram Analytics Section */}
            {instagramData && (
              <div className="space-y-8 mt-8">
                <div className="border-t pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      <i className="fab fa-instagram text-pink-600 mr-3"></i>
                      Instagram Analytics
                    </h2>
                    {instagramData.username !== 'unboxtherapy' &&
                     instagramData.username !== 'mkbhd' &&
                     instagramData.username !== 'linustech' &&
                     instagramData.username !== 'mrwhosetheboss' && (
                      <div className="text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                        📊 Showing similar influencer data: @{instagramData.username}
                      </div>
                    )}
                  </div>

                  {/* Instagram Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                      <div className="text-3xl font-bold text-pink-600">{formatNumber(instagramData.followersCount)}</div>
                      <div className="text-sm text-gray-600">Instagram Followers</div>
                      <div className="text-xs text-gray-500 mt-1">Total followers</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600">{formatNumber(instagramData.postsCount)}</div>
                      <div className="text-sm text-gray-600">Total Posts</div>
                      <div className="text-xs text-gray-500 mt-1">All-time posts</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600">{calculateInstagramEngagementRate().toFixed(2)}%</div>
                      <div className="text-sm text-gray-600">Avg. Engagement Rate</div>
                      <div className="text-xs text-gray-500 mt-1">Based on recent posts</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                      <div className="text-3xl font-bold text-green-600">{formatNumber(getAverageInstagramLikes())}</div>
                      <div className="text-sm text-gray-600">Avg. Likes per Post</div>
                      <div className="text-xs text-gray-500 mt-1">Recent posts average</div>
                    </div>
                  </div>

                  {/* Instagram Detailed Analytics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Performance */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        <i className="fab fa-instagram text-pink-600 mr-2"></i>
                        Profile Performance
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Account Type</div>
                            <div className="text-xs text-gray-600">
                              {instagramData.verified ? 'Verified' : 'Unverified'} •
                              {instagramData.isBusinessAccount ? ' Business' : ' Personal'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              {instagramData.verified && <i className="fas fa-check-circle text-blue-500"></i>}
                              {instagramData.isBusinessAccount && <i className="fas fa-briefcase text-gray-500"></i>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Follower-to-Following Ratio</div>
                            <div className="text-xs text-gray-600">Account influence metric</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-purple-600">
                              {(instagramData.followersCount / instagramData.followsCount).toFixed(0)}:1
                            </div>
                            <div className="text-xs text-gray-600">Ratio</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Posts per Follower</div>
                            <div className="text-xs text-gray-600">Content density</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-blue-600">
                              {(instagramData.postsCount / instagramData.followersCount * 1000).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-600">per 1K followers</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Analytics */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Analytics</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Content Type Distribution</h4>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            {(() => {
                              const distribution = getInstagramPostTypeDistribution();
                              return (
                                <>
                                  <div className="p-3 bg-yellow-50 rounded-lg">
                                    <div className="text-lg font-semibold text-yellow-600">{distribution.photos}</div>
                                    <div className="text-xs text-gray-600">Photos</div>
                                  </div>
                                  <div className="p-3 bg-red-50 rounded-lg">
                                    <div className="text-lg font-semibold text-red-600">{distribution.videos}</div>
                                    <div className="text-xs text-gray-600">Videos</div>
                                  </div>
                                  <div className="p-3 bg-purple-50 rounded-lg">
                                    <div className="text-lg font-semibold text-purple-600">{distribution.reels}</div>
                                    <div className="text-xs text-gray-600">Reels</div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Average Performance Metrics</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Likes per Post</span>
                              <span className="text-sm font-medium">{formatNumber(getAverageInstagramLikes())}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Comments per Post</span>
                              <span className="text-sm font-medium">{formatNumber(getAverageInstagramComments())}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Engagement Rate</span>
                              <span className="text-sm font-medium">{calculateInstagramEngagementRate().toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instagram Strategy Insights */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategy Insights</h3>
                      <div className="space-y-4">
                        <div className="pt-4 border-t">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Content Strategy Analysis</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Account Authority</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                instagramData.verified && instagramData.followersCount > 1000000
                                  ? 'bg-green-100 text-green-700'
                                  : instagramData.verified || instagramData.followersCount > 500000
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {instagramData.verified && instagramData.followersCount > 1000000 ? 'High Authority' :
                                 instagramData.verified || instagramData.followersCount > 500000 ? 'Medium Authority' : 'Growing'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Engagement Quality</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                calculateInstagramEngagementRate() > 3
                                  ? 'bg-green-100 text-green-700'
                                  : calculateInstagramEngagementRate() > 1
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {calculateInstagramEngagementRate() > 3 ? 'Excellent' :
                                 calculateInstagramEngagementRate() > 1 ? 'Good' : 'Needs Improvement'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Content Variety</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                Object.values(getInstagramPostTypeDistribution()).filter(v => v > 0).length >= 2
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {Object.values(getInstagramPostTypeDistribution()).filter(v => v > 0).length >= 2 ? 'Diverse' : 'Limited'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <div className="text-xs text-gray-500 text-center">
                            📊 Instagram data includes {instagramPosts.length} recent posts with comprehensive engagement metrics and content analysis.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'collaborations' && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                <i className="fas fa-brain text-blue-600 mr-2"></i>
                AI-Enhanced Brand Collaboration Analysis
              </h3>
              <p className="text-gray-600">AI-powered insights on partnership performance and audience alignment</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {brandCollaborations.length > 0 ? brandCollaborations.map((brand, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i className={`${getBrandIcon(brand.name)} text-xl text-gray-600`}></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{brand.name}</h4>
                        <p className="text-sm text-gray-600">{brand.campaign}</p>
                        <p className="text-xs text-gray-500">{brand.platform} • {brand.contentCount} posts</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      brand.type === 'Sponsorship' ? 'bg-green-100 text-green-700' :
                      brand.type === 'Product Review' ? 'bg-blue-100 text-blue-700' :
                      brand.type === 'UGC Campaign' ? 'bg-purple-100 text-purple-700' :
                      brand.type === 'Content Opportunity' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {brand.type}
                    </span>
                  </div>

                  {/* AI Insights Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100">
                    <div className="flex items-start space-x-2">
                      <i className="fas fa-robot text-blue-600 mt-0.5 flex-shrink-0"></i>
                      <div>
                        <h5 className="text-sm font-medium text-blue-900 mb-1">AI Insights</h5>
                        <p className="text-xs text-blue-800">{brand.aiInsights}</p>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="text-sm font-bold text-green-600">{brand.engagement}</div>
                      <div className="text-xs text-gray-600">Engagement</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="text-sm font-bold text-blue-600">{brand.reach}</div>
                      <div className="text-xs text-gray-600">Reach</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-center">
                        <i className={`fas fa-${brand.sentiment === 'positive' ? 'smile text-green-600' :
                          brand.sentiment === 'negative' ? 'frown text-red-600' : 'meh text-yellow-600'} text-sm`}></i>
                      </div>
                      <div className="text-xs text-gray-600 capitalize">{brand.sentiment}</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center space-x-1">
                      <i className="fas fa-chart-line"></i>
                      <span>View Detailed Analytics</span>
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-12">
                  <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Content for Brand Collaborations</h3>
                  <p className="text-gray-600 mb-4">AI is scanning influencer content for brand mentions and partnership opportunities</p>
                  <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-blue-800">
                      <i className="fas fa-robot mr-2"></i>
                      Generate an AI Trend Brief to see detected brand collaborations and partnership insights
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Collaboration Performance Dashboard */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-chart-bar text-purple-600 mr-2"></i>
                AI Performance Dashboard
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{brandCollaborations.length}</div>
                  <div className="text-sm text-gray-600">Active Partnerships</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {brandCollaborations.length > 0
                      ? (brandCollaborations.reduce((sum, brand) =>
                          sum + parseFloat(brand.reach.replace(/[^\d.]/g, '')), 0) / 1000).toFixed(1)
                      : '0'}M
                  </div>
                  <div className="text-sm text-gray-600">Combined Reach</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {brandCollaborations.length > 0
                      ? (brandCollaborations.reduce((sum, brand) =>
                          sum + parseFloat(brand.engagement.replace('%', '')), 0) / brandCollaborations.length).toFixed(1)
                      : '0'}%
                  </div>
                  <div className="text-sm text-gray-600">Avg. Engagement</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {brandCollaborations.length > 0
                      ? Math.round((brandCollaborations.filter(brand => brand.sentiment === 'positive').length / brandCollaborations.length) * 100)
                      : '0'}%
                  </div>
                  <div className="text-sm text-gray-600">Positive Sentiment</div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                AI Partnership Recommendations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">
                    <i className="fas fa-arrow-up text-green-500 mr-1"></i>
                    High-Potential Sectors
                  </h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Tech & Electronics (15.3% avg engagement)</li>
                    <li>• Beauty & Skincare (12.5% avg engagement)</li>
                    <li>• Fitness & Wellness (8.2% avg engagement)</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">
                    <i className="fas fa-target text-blue-500 mr-1"></i>
                    Optimization Tips
                  </h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Focus on product reviews for higher engagement</li>
                    <li>• Beauty content resonates well with audience</li>
                    <li>• Tech integration boosts credibility metrics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
        </>
      )}
    </div>

  );

};

export default InfluencerDetailPage;
