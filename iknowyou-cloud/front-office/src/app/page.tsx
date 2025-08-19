'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiResponse = await axios.get('/api/health');
        const aiResponse = await axios.get('/ai/health');
        
        setHealthStatus({
          api: apiResponse.data,
          ai: aiResponse.data,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Health check failed:', error);
        setHealthStatus({ error: 'Service unavailable' });
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            iknowyou.cloud
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Knowledge Management Platform
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Welcome to iknowyou.cloud
            </h2>
            <p className="text-gray-600 mb-6">
              Discover intelligent solutions for your knowledge management needs. 
              Our platform combines cutting-edge AI technology with intuitive design 
              to help you organize, search, and utilize information effectively.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
          </section>

          {/* Features Section */}
          <section className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-blue-600 text-2xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                AI-Powered Search
              </h3>
              <p className="text-gray-600">
                Advanced vector search capabilities powered by PineCone and OpenAI.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-blue-600 text-2xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Smart Analytics
              </h3>
              <p className="text-gray-600">
                Comprehensive analytics and insights for your knowledge base.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-blue-600 text-2xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Enterprise-grade security with JWT authentication and role-based access.
              </p>
            </div>
          </section>

          {/* System Status */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              System Status
            </h3>
            {loading ? (
              <div className="text-gray-600">Checking system status...</div>
            ) : healthStatus?.error ? (
              <div className="text-red-600">System unavailable</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800">API Server</h4>
                  <p className="text-green-600 text-sm">
                    Status: {healthStatus?.api?.status || 'Unknown'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800">AI Server</h4>
                  <p className="text-green-600 text-sm">
                    Status: {healthStatus?.ai?.status || 'Unknown'}
                  </p>
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="text-center mt-12 text-gray-600">
          <p>&copy; 2024 iknowyou.cloud. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
} 
