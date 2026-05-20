// Simple test script to verify the unified API endpoints
const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:5000';

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}

// Test functions
async function testEndpoints() {
    console.log('🧪 Testing Unified Product API Endpoints...\n');

    const tests = [
        {
            name: 'Get all products (unified endpoint)',
            path: '/api/products?limit=5'
        },
        {
            name: 'Get products by category - Gemstones',
            path: '/api/products?category=gemstones&limit=3'
        },
        {
            name: 'Get products by category - Bracelets', 
            path: '/api/products?category=bracelets&limit=3'
        },
        {
            name: 'Get products by category - Trees',
            path: '/api/products?category=trees&limit=3'
        },
        {
            name: 'Sort by price (low to high)',
            path: '/api/products?sort=price&order=asc&limit=3'
        },
        {
            name: 'Sort by price (high to low)',
            path: '/api/products?sort=price&order=desc&limit=3'
        },
        {
            name: 'Sort by newest',
            path: '/api/products?sort=newest&limit=3'
        },
        {
            name: 'Sort by popularity',
            path: '/api/products?sort=popular&limit=3'
        },
        {
            name: 'Search products',
            path: '/api/products/search?query=crystal&limit=3'
        },
        {
            name: 'Get featured products',
            path: '/api/products/featured?limit=3'
        },
        {
            name: 'Backward compatibility - Gemstones endpoint',
            path: '/api/products/gemstones?limit=3'
        },
        {
            name: 'Backward compatibility - Bracelets endpoint',
            path: '/api/products/bracelets?limit=3'
        },
        {
            name: 'Backward compatibility - Trees endpoint',
            path: '/api/products/trees?limit=3'
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            console.log(`🔍 Testing: ${test.name}`);
            const result = await makeRequest(test.path);
            
            if (result.status === 200) {
                const data = result.data;
                if (Array.isArray(data)) {
                    console.log(`   ✅ Success: Returned ${data.length} products`);
                } else if (data.products && Array.isArray(data.products)) {
                    console.log(`   ✅ Success: Returned ${data.products.length} products (paginated)`);
                    console.log(`   📊 Total: ${data.total}, Page: ${data.page}/${data.pages}`);
                } else {
                    console.log(`   ✅ Success: ${JSON.stringify(data).substring(0, 100)}...`);
                }
                passed++;
            } else {
                console.log(`   ❌ Failed: Status ${result.status}`);
                console.log(`   Error: ${JSON.stringify(result.data).substring(0, 200)}`);
                failed++;
            }
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
            failed++;
        }
        console.log('');
    }

    console.log('📋 Test Summary:');
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📊 Total: ${tests.length}`);

    if (failed === 0) {
        console.log('\n🎉 All tests passed! Your unified API is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the server logs for more details.');
    }
}

// Run tests
testEndpoints().catch(console.error);