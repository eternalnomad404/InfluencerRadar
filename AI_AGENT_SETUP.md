# AI Agent Configuration - Gemini Powered

## Environment Variables
Create a `.env` file in your project root with the following variables:

```env
# Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Alternative AI Configuration (if needed)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_TEMPERATURE=0.7

# Influencer Monitoring Settings
TREND_BRIEF_INTERVAL_HOURS=48
ALERT_THRESHOLDS_ENGAGEMENT_SPIKE=2.0
ALERT_THRESHOLDS_VIRAL_CONTENT=100000
ALERT_THRESHOLDS_SENTIMENT_DROP=-0.3

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@influencerradar.com
EMAIL_TO=team@yourbrand.com

# Platform API Configuration
YOUTUBE_API_KEY=your_youtube_api_key
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
LINKEDIN_ACCESS_TOKEN=your_linkedin_token

# Data Storage
DATABASE_URL=mongodb://localhost:27017/influencer_radar
REDIS_URL=redis://localhost:6379
```

## Installation Steps

### 1. Install Required Dependencies

```bash
# Core AI dependencies (Gemini-based)
npm install @google/generative-ai
npm install dotenv

# Optional: LlamaIndex (for advanced features)
npm install llamaindex

# Additional utilities
npm install nodemailer
npm install node-cron
npm install mongodb
npm install redis

# Development dependencies
npm install --save-dev @types/node
npm install --save-dev @types/nodemailer
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

### 3. System Requirements

- Node.js >= 16.0.0
- Internet connection for Gemini API calls
- At least 2GB RAM for data processing
- 500MB disk space for cache

### 3. Optional: Python Environment Setup

Some LlamaIndex features work better with Python backend:

```bash
pip install llama-index
pip install openai
pip install sentence-transformers
pip install faiss-cpu
```

## Usage Examples

### Basic Trend Brief Generation

```typescript
import GeminiInfluencerAgent from './ai-agent/GeminiInfluencerAgent';

const agent = new GeminiInfluencerAgent(process.env.GEMINI_API_KEY);

// Initialize with influencer data
await agent.initialize(influencerData);

// Generate trend brief
const trendBrief = await agent.generateTrendBrief('48 hours');
console.log(trendBrief);
```

### Real-time Monitoring with React

```typescript
import { useInfluencerMonitoring } from './hooks/useInfluencerMonitoring';

function MonitoringDashboard() {
  const { trendBrief, alerts, generateTrendBrief } = useInfluencerMonitoring();
  
  useEffect(() => {
    // Auto-generate every 48 hours
    const interval = setInterval(() => {
      generateTrendBrief(influencerData);
    }, 48 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <TrendBriefComponent autoRefresh={true} refreshInterval={48} />;
}
```

### Custom Queries with Gemini

```typescript
// Ask the AI agent custom questions using Gemini
const response = await agent.query("What content themes are trending this week?");
const sentiment = await agent.query("How has sentiment changed for competitor X?");
const recommendations = await agent.query("What content should we create next?");
```

### Environment Setup

```typescript
// .env file configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

// In your application
import { useInfluencerMonitoring } from './hooks/useInfluencerMonitoring';

function App() {
  const { trendBrief, alerts, generateTrendBrief, queryAgent } = useInfluencerMonitoring();
  
  // The service automatically uses Gemini if API key is available
  // Falls back to mock data if Gemini is unavailable
  
  return (
    <TrendBriefComponent 
      influencerData={yourInfluencerData}
      autoRefresh={true}
      refreshInterval={48}
    />
  );
}
```

## Performance Optimization

### 1. Vector Index Caching
The AI agent caches vector indices to improve performance:

```typescript
// Indices are automatically cached in ./cache directory
// Clear cache periodically to refresh with new data
agent.clearCache();
```

### 2. Batch Processing
Process multiple influencers efficiently:

```typescript
const batchResults = await agent.processBatch(influencerDataArray, {
  batchSize: 10,
  parallel: true
});
```

### 3. Memory Management
For large datasets, use streaming processing:

```typescript
const stream = agent.processStream(influencerDataStream);
stream.on('data', (result) => {
  // Process each result as it comes
});
```

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment-specific Configuration

#### Development
- Use mock data service
- Lower alert thresholds for testing
- Enable debug logging

#### Production
- Use real API connections
- Set up automated email alerts
- Configure monitoring and logging
- Set up backup and recovery

## Monitoring and Alerts

### Set Up Automated Trend Briefs
```typescript
import cron from 'node-cron';

// Send trend brief every 48 hours
cron.schedule('0 9 */2 * *', async () => {
  const trendBrief = await agent.generateTrendBrief(influencerData);
  await emailService.sendTrendBrief(trendBrief);
});
```

### Real-time Alert System
```typescript
// Monitor for engagement spikes
agent.onAlert('engagement_spike', (alert) => {
  notificationService.send(alert);
});

// Monitor for viral content
agent.onAlert('viral_content', (alert) => {
  urgentNotificationService.send(alert);
});
```

## Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   - Check API key validity
   - Verify rate limits
   - Monitor usage quotas

2. **Vector Index Issues**
   - Clear cache: `rm -rf ./cache`
   - Reduce chunk size for large documents
   - Increase memory allocation

3. **Performance Issues**
   - Enable batch processing
   - Use vector index caching
   - Optimize chunk sizes

4. **Data Quality Issues**
   - Validate input data format
   - Handle missing or corrupted content
   - Implement data cleaning pipeline

### Debug Mode
Enable detailed logging:

```typescript
const agent = new InfluencerMonitoringAgent({
  debug: true,
  logLevel: 'verbose'
});
```

## API Reference

### InfluencerMonitoringAgent

**Methods:**
- `initialize()` - Set up vector indices
- `generateTrendBrief(data)` - Generate comprehensive analysis
- `query(question)` - Ask natural language questions
- `getAlerts(data, thresholds)` - Check for alert conditions
- `processBatch(dataArray)` - Process multiple influencers

**Events:**
- `ready` - Agent initialization complete
- `alert` - New alert generated
- `error` - Error occurred
- `progress` - Processing progress update

### TrendBrief Interface

```typescript
interface TrendBrief {
  generatedAt: Date;
  period: string;
  summary: string;
  keyFindings: string[];
  platformInsights: PlatformInsights;
  contentAnalysis: ContentAnalysis;
  actionableRecommendations: string[];
}
```

For detailed API documentation, see the TypeScript interfaces in the source code.
