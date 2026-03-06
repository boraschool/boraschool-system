import { Database, Layout, Server, Shield } from 'lucide-react';

export const Architecture = () => {
  return (
    <section className="py-24 bg-kenya-black text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#922529_0%,_transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-kenya-red font-semibold tracking-wide uppercase text-sm mb-3">Architecture</h2>
            <h3 className="text-4xl font-bold mb-6">Built on World-Class Infrastructure</h3>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              ExamSync leverages the latest cloud technologies to ensure your school's data is always available, secure, and lightning-fast.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-kenya-red/20 p-3 rounded-xl">
                  <Layout className="w-6 h-6 text-kenya-red" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Frontend: Next.js on Vercel</h4>
                  <p className="text-gray-400 text-sm">High-performance, SEO-optimized interface with global edge delivery.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-kenya-green/20 p-3 rounded-xl">
                  <Database className="w-6 h-6 text-kenya-green" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Backend: Supabase</h4>
                  <p className="text-gray-400 text-sm">Postgres database, real-time subscriptions, and secure file storage.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-kenya-red/20 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-kenya-red" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Security: Auth & Encryption</h4>
                  <p className="text-gray-400 text-sm">Enterprise-grade authentication and end-to-end data encryption.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-kenya-green/20 p-3 rounded-xl">
                  <Server className="w-6 h-6 text-kenya-green" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Scalability: Cloud Native</h4>
                  <p className="text-gray-400 text-sm">Automatically scales to handle thousands of concurrent exam takers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-kenya-red" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-kenya-green" />
                <span className="ml-2 text-xs text-gray-500 font-mono">system-architecture.config</span>
              </div>
              <pre className="font-mono text-sm text-gray-400 overflow-x-auto">
                {`{
  "stack": {
    "frontend": "Next.js 14",
    "deployment": "Vercel",
    "database": "Supabase (Postgres)",
    "auth": "Supabase Auth",
    "storage": "Supabase Storage"
  },
  "security": {
    "ssl": true,
    "encryption": "AES-256",
    "gdpr": "compliant"
  },
  "performance": {
    "uptime": "99.99%",
    "latency": "< 100ms"
  }
}`}
              </pre>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400 rounded-full blur-[80px] opacity-20" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400 rounded-full blur-[80px] opacity-20" />
          </div>
        </div>
      </div>
    </section>
  );
};
