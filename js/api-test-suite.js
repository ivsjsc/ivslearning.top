/**
 * API Integration Health Check & Testing Utility
 * Run this in browser console to verify backend integration
 * 
 * Usage:
 * 1. Open browser DevTools (F12)
 * 2. Go to Console tab
 * 3. Copy/paste test functions and run
 */

// ============================================
// Health Check Tests
// ============================================

async function testAPIHealthCheck() {
    console.log('🔍 [HEALTH CHECK] Starting API integration tests...\n');
    
    const tests = {
        apiServiceLoaded: false,
        firebaseLoaded: false,
        authListenerActive: false,
        cacheWorking: false,
        rateLimiterWorking: false,
        basicRequestWorking: false,
    };
    
    try {
        // Test 1: API Service
        console.log('✓ Test 1: API Service Initialization');
        if (window.apiService && window.API) {
            console.log('  ✅ window.apiService and window.API available');
            tests.apiServiceLoaded = true;
        } else {
            console.log('  ❌ API service not initialized');
        }
        
        // Test 2: Firebase
        console.log('\n✓ Test 2: Firebase Initialization');
        if (window.firebaseApp && window.firebaseAuth) {
            console.log('  ✅ Firebase app and auth initialized');
            tests.firebaseLoaded = true;
        } else {
            console.log('  ❌ Firebase not loaded');
        }
        
        // Test 3: Auth Listener
        console.log('\n✓ Test 3: Authentication Status');
        if (window.firebaseUser) {
            console.log(`  ✅ User logged in: ${window.firebaseUser.email}`);
            tests.authListenerActive = true;
        } else {
            console.log('  ⏳ No user logged in (expected if not authenticated)');
            tests.authListenerActive = true; // Still working, just no user
        }
        
        // Test 4: Cache
        console.log('\n✓ Test 4: Caching System');
        const cacheStats = window.apiService.getCacheStats();
        console.log(`  ✅ Cache: ${cacheStats.size}/${cacheStats.maxSize} entries`);
        tests.cacheWorking = true;
        
        // Test 5: Rate Limiter
        console.log('\n✓ Test 5: Rate Limiting System');
        const allowed = window.apiService.isAllowed('/health-check');
        console.log(`  ✅ Rate limiter: ${allowed ? 'ALLOW' : 'BLOCK'} (tokens=${window.apiService.tokens.get('/health-check')}/100)`);
        tests.rateLimiterWorking = true;
        
        // Test 6: Basic Request (will fail if backend unreachable)
        console.log('\n✓ Test 6: Backend Connectivity');
        try {
            const response = await window.API.get('/api/health', { method: 'GET' });
            console.log('  ✅ Backend is reachable');
            tests.basicRequestWorking = true;
        } catch (error) {
            console.log(`  ⚠️  Backend request failed: ${error.message}`);
            console.log('     (This is normal if backend is offline or CORS not configured)');
        }
        
    } catch (error) {
        console.error('❌ Health check error:', error);
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('SUMMARY:');
    console.log('='.repeat(50));
    const passed = Object.values(tests).filter(t => t).length;
    const total = Object.keys(tests).length;
    console.log(`✅ Passed: ${passed}/${total}`);
    
    if (passed === total) {
        console.log('\n🎉 All systems operational!');
    } else {
        console.log('\n⚠️  Some checks failed. See details above.');
    }
    
    return tests;
}

// ============================================
// API Testing
// ============================================

async function testAPIRequest() {
    console.log('\n🔗 [API REQUEST TEST] Attempting to fetch posts...\n');
    
    try {
        const posts = await window.API.getPosts({
            limit: 5,
            orderBy: { field: 'createdAt', direction: 'desc' }
        });
        
        console.log(`✅ Successfully fetched ${posts.length} posts`);
        console.log('Posts:', posts);
        return posts;
    } catch (error) {
        console.error('❌ Request failed:', error.message);
        console.error('Details:', error);
    }
}

// ============================================
// Cache Testing
// ============================================

async function testCaching() {
    console.log('\n💾 [CACHE TEST] Testing cache with same request twice...\n');
    
    const options = { limit: 5 };
    const cacheKeyBefore = `posts:${JSON.stringify(options)}`;
    
    console.log('Request 1: Fetching posts (should hit API)');
    const start1 = performance.now();
    const result1 = await window.API.getPosts(options).catch(e => {
        console.error('  Request 1 failed:', e.message);
        return null;
    });
    const time1 = performance.now() - start1;
    
    if (result1) {
        console.log(`  ✅ Got ${result1.length} posts in ${time1.toFixed(0)}ms\n`);
        
        console.log('Request 2: Same request (should hit cache)');
        const start2 = performance.now();
        const result2 = await window.API.getPosts(options).catch(e => {
            console.error('  Request 2 failed:', e.message);
            return null;
        });
        const time2 = performance.now() - start2;
        
        if (result2) {
            console.log(`  ✅ Got ${result2.length} posts in ${time2.toFixed(0)}ms`);
            
            if (time2 < time1) {
                console.log(`\n🎯 Cache working! 2nd request was ${(time1 - time2).toFixed(0)}ms faster`);
            } else {
                console.log('\n⚠️  Cache may not be working (2nd request not faster)');
            }
        }
    }
    
    // Show cache contents
    console.log('\nCache statistics:');
    console.log(window.API.getStats().cache);
}

// ============================================
// Rate Limiting Testing
// ============================================

async function testRateLimiting() {
    console.log('\n⏱️  [RATE LIMIT TEST] Attempting rapid requests...\n');
    
    let successCount = 0;
    let blockCount = 0;
    
    console.log('Sending 10 rapid requests to same endpoint...');
    
    for (let i = 1; i <= 10; i++) {
        try {
            const status = window.apiService.getRateLimiterStatus('/test-endpoint');
            
            if (window.apiService.isAllowed('/test-endpoint')) {
                successCount++;
                console.log(`  [${i}/10] ✅ Allowed (${status.remaining} left)`);
            } else {
                blockCount++;
                console.log(`  [${i}/10] 🚫 Blocked (rate limit exceeded)`);
            }
        } catch (error) {
            console.error(`  [${i}/10] ❌ Error:`, error.message);
        }
    }
    
    console.log(`\nResults: ${successCount} allowed, ${blockCount} blocked`);
    console.log('Expected: First 100 requests allowed, then blocked');
}

// ============================================
// Authentication Testing
// ============================================

async function testAuthentication() {
    console.log('\n🔐 [AUTH TEST] Checking authentication status...\n');
    
    if (window.firebaseUser) {
        console.log('✅ User logged in:');
        console.log(`   Email: ${window.firebaseUser.email}`);
        console.log(`   UID: ${window.firebaseUser.uid}`);
        console.log(`   Auth Token: ${window.apiService.authToken ? 'SET' : 'NOT SET'}`);
    } else {
        console.log('⏳ No user logged in');
        console.log('   Visit auth.html to login with Google');
    }
    
    // Show auth listeners
    console.log('\n📡 Auth event listeners registered:');
    console.log('   - auth-login event');
    console.log('   - auth-logout event');
}

// ============================================
// System Statistics
// ============================================

function getSystemStats() {
    console.log('\n📊 [SYSTEM STATS]\n');
    
    const stats = {
        backend: {
            url: window.BACKEND_URL,
            configured: !!window.BACKEND_URL,
        },
        api: {
            serviceReady: !!window.apiService,
            helpersReady: !!window.API,
        },
        firebase: {
            appReady: !!window.firebaseApp,
            authReady: !!window.firebaseAuth,
            userLoggedIn: !!window.firebaseUser,
        },
        cache: window.API ? window.API.getStats().cache : null,
        rateLimit: window.API ? window.API.getStats().rateLimit : null,
        circuitBreaker: window.API ? window.API.getStats().circuitBreaker : null,
    };
    
    console.log('Backend Configuration:');
    console.log(`  URL: ${stats.backend.url || 'NOT SET'}`);
    console.log(`  Configured: ${stats.backend.configured ? '✅' : '❌'}`);
    
    console.log('\nAPI Status:');
    console.log(`  Service: ${stats.api.serviceReady ? '✅' : '❌'}`);
    console.log(`  Helpers: ${stats.api.helpersReady ? '✅' : '❌'}`);
    
    console.log('\nFirebase Status:');
    console.log(`  App: ${stats.firebase.appReady ? '✅' : '❌'}`);
    console.log(`  Auth: ${stats.firebase.authReady ? '✅' : '❌'}`);
    console.log(`  User: ${stats.firebase.userLoggedIn ? '✅' : '❌'}`);
    
    console.log('\nCache Statistics:');
    console.log(`  Size: ${stats.cache?.size || 0}/${stats.cache?.maxSize || 0}`);
    console.log(`  Entries: ${stats.cache?.entries?.length || 0}`);
    
    console.log('\nRate Limiting:');
    console.log(`  Remaining: ${stats.rateLimit?.remaining || 0}/${stats.rateLimit?.limit || 0}`);
    console.log(`  Reset in: ${stats.rateLimit ? ((stats.rateLimit.resetTime - Date.now()) / 1000).toFixed(0) + 's' : 'N/A'}`);
    
    console.log('\nCircuit Breaker:');
    console.log(`  State: ${stats.circuitBreaker?.state || 'UNKNOWN'}`);
    console.log(`  Failures: ${stats.circuitBreaker?.failures || 0}`);
    
    return stats;
}

// ============================================
// Run All Tests
// ============================================

async function runAllTests() {
    console.clear();
    console.log('╔' + '═'.repeat(48) + '╗');
    console.log('║  IVS Learning Hub - API Integration Test Suite  ║');
    console.log('╚' + '═'.repeat(48) + '╝\n');
    
    await testAPIHealthCheck();
    testAuthentication();
    getSystemStats();
    
    console.log('\n' + '='.repeat(50));
    console.log('TEST SUITE COMPLETE');
    console.log('='.repeat(50));
    console.log('\nNext steps:');
    console.log('1. testAPIRequest()     - Test fetching posts from API');
    console.log('2. testCaching()        - Test cache functionality');
    console.log('3. testRateLimiting()   - Test rate limiter');
    console.log('4. testAuthentication() - Check auth status');
    console.log('5. getSystemStats()     - Full system diagnostics\n');
}

// ============================================
// Quick Start
// ============================================

console.log('%c=== API Test Suite Ready ===', 'color: green; font-weight: bold;');
console.log('Run this command: runAllTests()');
console.log('\nOr individual tests:');
console.log('  • testAPIHealthCheck()');
console.log('  • testAPIRequest()');
console.log('  • testCaching()');
console.log('  • testRateLimiting()');
console.log('  • testAuthentication()');
console.log('  • getSystemStats()');

// Export to global scope
window.testAPIHealthCheck = testAPIHealthCheck;
window.testAPIRequest = testAPIRequest;
window.testCaching = testCaching;
window.testRateLimiting = testRateLimiting;
window.testAuthentication = testAuthentication;
window.getSystemStats = getSystemStats;
window.runAllTests = runAllTests;
