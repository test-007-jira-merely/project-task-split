import { Injectable } from '@nestjs/common';

interface EndpointMetrics {
  count: number;
  responseTimes: number[];
  errors: number;
  lastAccessed: Date;
}

interface AggregatedMetrics {
  endpoint: string;
  requestCount: number;
  avgResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  errorRate: number;
  lastAccessed: Date;
}

@Injectable()
export class MetricsService {
  private metrics: Map<string, EndpointMetrics> = new Map();
  private readonly maxStoredTimes = 1000; // Store last 1000 response times per endpoint

  /**
   * Record a successful request
   */
  recordRequest(endpoint: string, duration: number): void {
    const key = this.normalizeEndpoint(endpoint);
    const existing = this.metrics.get(key) || {
      count: 0,
      responseTimes: [],
      errors: 0,
      lastAccessed: new Date(),
    };

    existing.count++;
    existing.responseTimes.push(duration);
    existing.lastAccessed = new Date();

    // Keep only the last N response times to prevent memory growth
    if (existing.responseTimes.length > this.maxStoredTimes) {
      existing.responseTimes.shift();
    }

    this.metrics.set(key, existing);
  }

  /**
   * Record an error for an endpoint
   */
  recordError(endpoint: string): void {
    const key = this.normalizeEndpoint(endpoint);
    const existing = this.metrics.get(key) || {
      count: 0,
      responseTimes: [],
      errors: 0,
      lastAccessed: new Date(),
    };

    existing.errors++;
    existing.lastAccessed = new Date();

    this.metrics.set(key, existing);
  }

  /**
   * Get aggregated metrics for all endpoints
   */
  getMetrics(): Record<string, AggregatedMetrics> {
    const result: Record<string, AggregatedMetrics> = {};

    for (const [endpoint, data] of this.metrics.entries()) {
      const times = data.responseTimes;
      const avg = times.length > 0
        ? times.reduce((sum, t) => sum + t, 0) / times.length
        : 0;
      const max = times.length > 0 ? Math.max(...times) : 0;
      const min = times.length > 0 ? Math.min(...times) : 0;
      const errorRate = data.count > 0 ? (data.errors / data.count) * 100 : 0;

      result[endpoint] = {
        endpoint,
        requestCount: data.count,
        avgResponseTime: Math.round(avg * 100) / 100,
        maxResponseTime: Math.round(max * 100) / 100,
        minResponseTime: Math.round(min * 100) / 100,
        errorRate: Math.round(errorRate * 100) / 100,
        lastAccessed: data.lastAccessed,
      };
    }

    return result;
  }

  /**
   * Get metrics for a specific endpoint
   */
  getEndpointMetrics(endpoint: string): AggregatedMetrics | null {
    const key = this.normalizeEndpoint(endpoint);
    const data = this.metrics.get(key);

    if (!data) {
      return null;
    }

    const times = data.responseTimes;
    const avg = times.length > 0
      ? times.reduce((sum, t) => sum + t, 0) / times.length
      : 0;
    const max = times.length > 0 ? Math.max(...times) : 0;
    const min = times.length > 0 ? Math.min(...times) : 0;
    const errorRate = data.count > 0 ? (data.errors / data.count) * 100 : 0;

    return {
      endpoint: key,
      requestCount: data.count,
      avgResponseTime: Math.round(avg * 100) / 100,
      maxResponseTime: Math.round(max * 100) / 100,
      minResponseTime: Math.round(min * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      lastAccessed: data.lastAccessed,
    };
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics.clear();
  }

  /**
   * Get summary statistics
   */
  getSummary(): {
    totalRequests: number;
    totalErrors: number;
    avgResponseTime: number;
    endpointCount: number;
  } {
    let totalRequests = 0;
    let totalErrors = 0;
    let allResponseTimes: number[] = [];

    for (const data of this.metrics.values()) {
      totalRequests += data.count;
      totalErrors += data.errors;
      allResponseTimes = allResponseTimes.concat(data.responseTimes);
    }

    const avgResponseTime = allResponseTimes.length > 0
      ? allResponseTimes.reduce((sum, t) => sum + t, 0) / allResponseTimes.length
      : 0;

    return {
      totalRequests,
      totalErrors,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      endpointCount: this.metrics.size,
    };
  }

  /**
   * Normalize endpoint path to remove IDs and query params
   */
  private normalizeEndpoint(endpoint: string): string {
    // Remove query parameters
    let normalized = endpoint.split('?')[0];

    // Replace UUIDs and numeric IDs with placeholders
    normalized = normalized.replace(
      /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      '/:id'
    );
    normalized = normalized.replace(/\/\d+/g, '/:id');

    return normalized;
  }
}
