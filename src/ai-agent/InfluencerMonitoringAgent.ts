import { Document, VectorStoreIndex, ChatEngine } from 'llamaindex';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ContentAnalysisResult {
  keyThemes: string[];
  trendingTopics: string[];
  contentTypes: { [key: string]: number };
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  engagementInsights: string[];
  competitorAnalysis: string[];
  recommendations: string[];
}

interface TrendBrief {
  summary: string;
  period: string;
  keyFindings: string[];
  platformInsights: { [platform: string]: any };
  contentAnalysis: ContentAnalysisResult;
  actionableRecommendations: string[];
  generatedAt: Date;
}

interface InfluencerContent {
  platform: string;
  influencerName: string;
  content: {
    title?: string;
    caption?: string;
    hashtags?: string[];
    mentions?: string[];
    engagement: {
      likes: number;
      comments: number;
      views?: number;
      shares?: number;
    };
    timestamp: string;
    type: string;
  }[];
}

export class InfluencerMonitoringAgent {
  private gemini: GoogleGenerativeAI;
  private model: any;
  private vectorIndex: VectorStoreIndex | null = null;
  private chatEngine: ChatEngine | null = null;

  constructor() {
    // Initialize Gemini AI - you'll need to set your API key
    this.gemini = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY || 'your-gemini-api-key'
    );
    this.model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Initialize the agent with collected influencer data
   */
  async initialize(influencerData: InfluencerContent[]): Promise<void> {
    try {
      // Convert influencer data to documents for LlamaIndex
      const documents = this.createDocumentsFromData(influencerData);

      // Create vector index from documents
      this.vectorIndex = await VectorStoreIndex.fromDocuments(documents);

      // Create chat engine for querying
      this.chatEngine = this.vectorIndex.asChatEngine();

      console.log('✅ AI Agent initialized with', documents.length, 'content documents');
    } catch (error) {
      console.error('❌ Error initializing AI agent:', error);
      throw error;
    }
  }

  /**
   * Convert influencer data to LlamaIndex documents
   */
  private createDocumentsFromData(influencerData: InfluencerContent[]): Document[] {
    const documents: Document[] = [];

    influencerData.forEach(influencer => {
      influencer.content.forEach((post, index) => {
        const documentText = this.formatContentForAnalysis(influencer, post);

        const document = new Document({
          text: documentText,
          metadata: {
            platform: influencer.platform,
            influencer: influencer.influencerName,
            timestamp: post.timestamp,
            type: post.type,
            engagement: post.engagement,
            hashtags: post.hashtags || [],
            mentions: post.mentions || []
          }
        });

        documents.push(document);
      });
    });

    return documents;
  }

  /**
   * Format content for AI analysis
   */
  private formatContentForAnalysis(influencer: InfluencerContent, post: any): string {
    const parts = [
      `Platform: ${influencer.platform}`,
      `Influencer: ${influencer.influencerName}`,
      `Content Type: ${post.type}`,
      `Timestamp: ${post.timestamp}`
    ];

    if (post.title) parts.push(`Title: ${post.title}`);
    if (post.caption) parts.push(`Caption: ${post.caption}`);
    if (post.hashtags?.length) parts.push(`Hashtags: ${post.hashtags.join(', ')}`);
    if (post.mentions?.length) parts.push(`Mentions: ${post.mentions.join(', ')}`);

    parts.push(`Engagement: ${post.engagement.likes} likes, ${post.engagement.comments} comments${post.engagement.views ? `, ${post.engagement.views} views` : ''}`);

    return parts.join('\n');
  }

  /**
   * Generate comprehensive trend brief
   */
  async generateTrendBrief(timeframe: string = '48 hours'): Promise<TrendBrief> {
    if (!this.chatEngine) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    try {
      console.log('🔄 Generating trend brief...');

      // Analyze key themes and trends
      const keyThemesResponse = await this.chatEngine.chat({
        message: `Analyze all the content from the past ${timeframe} and identify the top 5 key themes or topics that influencers are discussing. Focus on trending subjects, product mentions, and industry discussions. Provide a brief explanation for each theme.`
      });

      // Analyze content performance
      const performanceResponse = await this.chatEngine.chat({
        message: `Analyze the engagement patterns and content performance across all platforms. Identify which types of content (videos, posts, stories, etc.) are performing best and provide insights on engagement trends.`
      });

      // Competitive analysis
      const competitorResponse = await this.chatEngine.chat({
        message: `Identify any mentions of competitor brands, products, or services. Analyze the sentiment and context of these mentions. Also identify emerging competitors or new players being discussed.`
      });

      // Platform-specific insights
      const platformInsights = await this.getPlatformSpecificInsights();

      // Generate actionable recommendations
      const recommendationsResponse = await this.chatEngine.chat({
        message: `Based on all the analyzed content and trends, provide 5-7 actionable recommendations for brand teams. Focus on content strategy, engagement opportunities, partnership possibilities, and competitive positioning.`
      });

      // Extract structured data from responses
      const contentAnalysis = await this.extractContentAnalysis();

      const trendBrief: TrendBrief = {
        summary: await this.generateExecutiveSummary(keyThemesResponse.response, performanceResponse.response),
        period: timeframe,
        keyFindings: this.parseKeyFindings(keyThemesResponse.response),
        platformInsights,
        contentAnalysis,
        actionableRecommendations: this.parseRecommendations(recommendationsResponse.response),
        generatedAt: new Date()
      };

      console.log('✅ Trend brief generated successfully');
      return trendBrief;

    } catch (error) {
      console.error('❌ Error generating trend brief:', error);
      throw error;
    }
  }

  /**
   * Get platform-specific insights
   */
  private async getPlatformSpecificInsights(): Promise<{ [platform: string]: any }> {
    const platforms = ['youtube', 'instagram', 'linkedin'];
    const insights: { [platform: string]: any } = {};

    for (const platform of platforms) {
      try {
        const response = await this.chatEngine!.chat({
          message: `Focus only on ${platform} content. Analyze the top performing content types, trending hashtags, engagement patterns, and unique insights specific to this platform. Provide specific metrics and observations.`
        });

        insights[platform] = {
          summary: response.response,
          topContentTypes: await this.extractTopContentTypes(platform),
          trendingHashtags: await this.extractTrendingHashtags(platform),
          engagementTrends: await this.extractEngagementTrends(platform)
        };
      } catch (error) {
        console.error(`Error analyzing ${platform}:`, error);
        insights[platform] = { error: 'Analysis failed' };
      }
    }

    return insights;
  }

  /**
   * Extract content analysis data
   */
  private async extractContentAnalysis(): Promise<ContentAnalysisResult> {
    try {
      // Analyze sentiment
      const sentimentResponse = await this.chatEngine!.chat({
        message: `Analyze the overall sentiment of all content. Provide percentages for positive, neutral, and negative sentiment. Also identify the main drivers of positive and negative sentiment.`
      });

      // Analyze content types
      const contentTypesResponse = await this.chatEngine!.chat({
        message: `Count and categorize all content types (videos, photos, stories, reels, etc.) and provide the distribution. Show which content types are most popular.`
      });

      // Extract trending topics
      const trendingTopicsResponse = await this.chatEngine!.chat({
        message: `Identify the top 10 trending topics, themes, or subjects being discussed. Focus on emerging trends and viral topics.`
      });

      return {
        keyThemes: this.parseKeyFindings(trendingTopicsResponse.response),
        trendingTopics: this.parseTrendingTopics(trendingTopicsResponse.response),
        contentTypes: this.parseContentTypes(contentTypesResponse.response),
        sentimentAnalysis: this.parseSentimentAnalysis(sentimentResponse.response),
        engagementInsights: await this.getEngagementInsights(),
        competitorAnalysis: await this.getCompetitorAnalysis(),
        recommendations: []
      };
    } catch (error) {
      console.error('Error in content analysis:', error);
      return {
        keyThemes: [],
        trendingTopics: [],
        contentTypes: {},
        sentimentAnalysis: { positive: 0, neutral: 0, negative: 0 },
        engagementInsights: [],
        competitorAnalysis: [],
        recommendations: []
      };
    }
  }

  /**
   * Generate executive summary
   */
  private async generateExecutiveSummary(themes: string, performance: string): Promise<string> {
    try {
      const response = await this.chatEngine!.chat({
        message: `Create a concise executive summary (2-3 paragraphs) that highlights the most important insights from this analysis: Key Themes: ${themes}. Performance Analysis: ${performance}. Focus on actionable insights for brand teams.`
      });
      return response.response;
    } catch (error) {
      return 'Executive summary generation failed. Please review individual sections for insights.';
    }
  }

  /**
   * Helper methods for parsing AI responses
   */
  private parseKeyFindings(response: string): string[] {
    // Extract key findings from AI response
    const findings = response.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 10);

    return findings.slice(0, 5);
  }

  private parseRecommendations(response: string): string[] {
    return this.parseKeyFindings(response);
  }

  private parseTrendingTopics(response: string): string[] {
    return response.split('\n')
      .filter(line => line.includes('#') || line.toLowerCase().includes('trend'))
      .map(line => line.trim())
      .slice(0, 10);
  }

  private parseContentTypes(response: string): { [key: string]: number } {
    const contentTypes: { [key: string]: number } = {};
    const lines = response.split('\n');

    lines.forEach(line => {
      const match = line.match(/(\w+).*?(\d+)/);
      if (match) {
        contentTypes[match[1]] = parseInt(match[2]);
      }
    });

    return contentTypes;
  }

  private parseSentimentAnalysis(response: string): { positive: number; neutral: number; negative: number } {
    const sentiment = { positive: 0, neutral: 0, negative: 0 };

    const positiveMatch = response.match(/positive.*?(\d+\.?\d*)%/i);
    const neutralMatch = response.match(/neutral.*?(\d+\.?\d*)%/i);
    const negativeMatch = response.match(/negative.*?(\d+\.?\d*)%/i);

    if (positiveMatch) sentiment.positive = parseFloat(positiveMatch[1]);
    if (neutralMatch) sentiment.neutral = parseFloat(neutralMatch[1]);
    if (negativeMatch) sentiment.negative = parseFloat(negativeMatch[1]);

    return sentiment;
  }

  private async getEngagementInsights(): Promise<string[]> {
    try {
      const response = await this.chatEngine!.chat({
        message: `Provide 3-5 key insights about engagement patterns, timing, and audience behavior based on the content analysis.`
      });
      return this.parseKeyFindings(response.response);
    } catch (error) {
      return ['Engagement analysis unavailable'];
    }
  }

  private async getCompetitorAnalysis(): Promise<string[]> {
    try {
      const response = await this.chatEngine!.chat({
        message: `Identify and analyze competitor mentions, brand comparisons, and competitive positioning insights from the content.`
      });
      return this.parseKeyFindings(response.response);
    } catch (error) {
      return ['Competitor analysis unavailable'];
    }
  }

  private async extractTopContentTypes(platform: string): Promise<string[]> {
    try {
      const response = await this.chatEngine!.chat({
        message: `For ${platform} specifically, list the top 3 performing content types.`
      });
      return this.parseKeyFindings(response.response);
    } catch (error) {
      return [];
    }
  }

  private async extractTrendingHashtags(platform: string): Promise<string[]> {
    try {
      const response = await this.chatEngine!.chat({
        message: `For ${platform} specifically, list the top 5 trending hashtags being used.`
      });
      return response.response.match(/#\w+/g) || [];
    } catch (error) {
      return [];
    }
  }

  private async extractEngagementTrends(platform: string): Promise<string> {
    try {
      const response = await this.chatEngine!.chat({
        message: `For ${platform} specifically, describe the key engagement trends and patterns.`
      });
      return response.response;
    } catch (error) {
      return 'Engagement trends analysis unavailable';
    }
  }

  /**
   * Query the agent with custom questions
   */
  async query(question: string): Promise<string> {
    if (!this.chatEngine) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    try {
      const response = await this.chatEngine.chat({ message: question });
      return response.response;
    } catch (error) {
      console.error('Error querying agent:', error);
      throw error;
    }
  }

  /**
   * Get real-time alerts for significant changes
   */
  async getAlerts(thresholds: { engagementSpike: number; viralContent: number }): Promise<string[]> {
    const alerts: string[] = [];

    try {
      const alertResponse = await this.chatEngine!.chat({
        message: `Identify any content that has unusually high engagement (above ${thresholds.engagementSpike}x normal) or has gone viral (above ${thresholds.viralContent} interactions). Also flag any crisis situations or negative sentiment spikes.`
      });

      alerts.push(...this.parseKeyFindings(alertResponse.response));
    } catch (error) {
      console.error('Error generating alerts:', error);
      alerts.push('Alert generation failed');
    }

    return alerts;
  }
}

export default InfluencerMonitoringAgent;
