/*
  cacheService.js
  In-Memory Caching Service with Node-Cache
  Author: Parth Patoliya | Practical 9: In-Memory Caching & Query Optimization
  
  Provides centralized in-memory caching using node-cache with configurable TTL,
  automatic key expiration, cache invalidation helpers, and performance metrics tracking.
*/

const NodeCache = require('node-cache');

// Initialize NodeCache with standard TTL of 60 seconds and check period of 120 seconds
const cache = new NodeCache({
  stdTTL: 60,         // Default Time-To-Live in seconds
  checkperiod: 120,   // Automatic background expired key cleanup interval (seconds)
  useClones: false    // Return direct references for maximum read throughput
});

// Cache performance and diagnostic statistics tracker
const metrics = {
  hits: 0,
  misses: 0,
  writes: 0,
  invalidations: 0,
  startTime: new Date().toISOString()
};

/**
 * Retrieve an item from the cache and track hit/miss metrics.
 * @param {string} key - Cache identifier key
 * @returns {*} - Cached value or undefined
 */
const get = (key) => {
  const value = cache.get(key);
  if (value !== undefined) {
    metrics.hits++;
    return value;
  }
  metrics.misses++;
  return undefined;
};

/**
 * Store an item in the cache with optional custom TTL.
 * @param {string} key - Cache identifier key
 * @param {*} value - Value to cache
 * @param {number} [ttl] - Optional custom TTL in seconds
 * @returns {boolean} - Success status
 */
const set = (key, value, ttl) => {
  metrics.writes++;
  if (ttl !== undefined) {
    return cache.set(key, value, ttl);
  }
  return cache.set(key, value);
};

/**
 * Invalidate/delete a specific key from the cache.
 * @param {string} key - Cache identifier key to delete
 * @returns {number} - Number of deleted keys
 */
const del = (key) => {
  const deletedCount = cache.del(key);
  if (deletedCount > 0) {
    metrics.invalidations += deletedCount;
  }
  return deletedCount;
};

/**
 * Invalidate all cache keys starting with a given prefix.
 * Useful for clearing all caches related to a specific user.
 * @param {string} prefix - Key prefix (e.g. 'tasks_user_')
 * @returns {number} - Number of keys invalidated
 */
const delByPrefix = (prefix) => {
  const keys = cache.keys();
  const matchedKeys = keys.filter(k => k.startsWith(prefix));
  if (matchedKeys.length > 0) {
    const count = cache.del(matchedKeys);
    metrics.invalidations += count;
    return count;
  }
  return 0;
};

/**
 * Flush all stored keys in the cache.
 */
const flush = () => {
  cache.flushAll();
  metrics.invalidations++;
};

/**
 * Get comprehensive cache analytics and diagnostic stats.
 * @returns {object} - Hit/miss counts, hit ratio %, key count, and internal node-cache stats
 */
const getStats = () => {
  const totalRequests = metrics.hits + metrics.misses;
  const hitRatio = totalRequests > 0 
    ? ((metrics.hits / totalRequests) * 100).toFixed(2) + '%' 
    : '0.00%';

  return {
    customMetrics: {
      totalRequests,
      hits: metrics.hits,
      misses: metrics.misses,
      hitRatio,
      writes: metrics.writes,
      invalidations: metrics.invalidations,
      trackingStartedAt: metrics.startTime
    },
    nodeCacheStats: cache.getStats(),
    activeKeysCount: cache.keys().length,
    activeKeys: cache.keys(),
    defaultTTL: 60
  };
};

/**
 * Reset metric counters for fresh benchmark measurement.
 */
const resetStats = () => {
  metrics.hits = 0;
  metrics.misses = 0;
  metrics.writes = 0;
  metrics.invalidations = 0;
  metrics.startTime = new Date().toISOString();
};

module.exports = {
  rawCache: cache,
  get,
  set,
  del,
  delByPrefix,
  flush,
  getStats,
  resetStats
};
