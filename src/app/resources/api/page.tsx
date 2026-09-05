'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import PublicNavbar from '../../public-home-page/components/PublicNavbar';
import PublicFooter from '../../public-home-page/components/PublicFooter';
import ResourceBreadcrumbs from '../components/ResourceBreadcrumbs';
import CopyCodeButton from '../components/CopyCodeButton';
import { API_RESOURCE_ITEMS, ApiEndpointItem } from '@/lib/resourcesData';
import {
  Server,
  Play,
  CheckCircle2,
  Code2,
  Terminal,
  RefreshCw,
  Zap,
} from 'lucide-react';

export default function ApiResourcesPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointItem>(API_RESOURCE_ITEMS[0]);
  const [liveResponse, setLiveResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Section 4 Requirement: Connect documentation examples to real backend APIs!
  const handleTryApi = async () => {
    setLoading(true);
    setLiveResponse(null);
    try {
      if (selectedEndpoint.method === 'GET') {
        const res = await fetch(selectedEndpoint.realBackendUrl);
        const data = await res.json();
        setLiveResponse(`HTTP/1.1 ${res.status} ${res.statusText}\nContent-Type: application/json\n\n` + JSON.stringify(data, null, 2));
      } else {
        // POST real backend call
        const payload = selectedEndpoint.requestBody ? JSON.parse(selectedEndpoint.requestBody) : {};
        const res = await fetch(selectedEndpoint.realBackendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setLiveResponse(`HTTP/1.1 ${res.status} ${res.statusText}\nContent-Type: application/json\n\n` + JSON.stringify(data, null, 2));
      }
    } catch (e: any) {
      setLiveResponse(`Error executing API request: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 pb-20 max-w-screen-2xl mx-auto px-6 lg:px-10 w-full">
        {/* Breadcrumb Navigation */}
        <ResourceBreadcrumbs items={[{ label: 'API Resources' }]} />

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono font-bold mb-4">
              <Server size={14} />
              <span>INTERACTIVE OPENAPI / SWAGGER EXPLORER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              API Resources & Endpoints
            </h1>
            <p className="text-emerald-100 text-base leading-relaxed font-normal">
              Interactive documentation for AppDevHub REST endpoints. Test live backend endpoints, inspect parameters, payloads, and OpenAPI schemas directly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Endpoint Navigation Explorer (4 cols) */}
          <aside className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest px-2">
              API ENDPOINT EXPLORER
            </div>

            <div className="space-y-2">
              {API_RESOURCE_ITEMS.map((item) => {
                const isSelected = item.id === selectedEndpoint.id;
                return (
                  <div
                    key={`ep-nav-${item.id}`}
                    onClick={() => {
                      setSelectedEndpoint(item);
                      setLiveResponse(null);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                        : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.method === 'GET'
                          ? 'bg-blue-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {item.method}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 font-mono">{item.endpoint}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{item.title}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Endpoint Specification & Interactive Try API Panel (8 cols) */}
          <article className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            {/* Header Title & Method */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold text-white ${
                  selectedEndpoint.method === 'GET' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}>
                  {selectedEndpoint.method}
                </span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900">
                  {selectedEndpoint.endpoint}
                </span>
              </div>

              {/* Section 4 Try API Button */}
              <button
                onClick={handleTryApi}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                <span>Try API Live</span>
              </button>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed font-normal">
              {selectedEndpoint.description}
            </p>

            {/* Request Headers */}
            {selectedEndpoint.headers.length > 0 && (
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
                  REQUEST HEADERS
                </h4>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
                  {selectedEndpoint.headers.map((h, idx) => (
                    <div key={`h-${idx}`} className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-slate-800">{h.name}: <span className="text-emerald-600">{h.value}</span></span>
                      <span className="text-[10px] text-slate-400">{h.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parameters */}
            {selectedEndpoint.parameters.length > 0 && (
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
                  QUERY PARAMETERS
                </h4>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
                  {selectedEndpoint.parameters.map((p, idx) => (
                    <div key={`p-${idx}`} className="flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="font-bold text-slate-800">{p.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2">({p.type})</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{p.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body (if POST) */}
            {selectedEndpoint.requestBody && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    REQUEST BODY PAYLOAD
                  </h4>
                  <CopyCodeButton code={selectedEndpoint.requestBody} />
                </div>
                <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto rounded-2xl border border-slate-800">
                  <code>{selectedEndpoint.requestBody}</code>
                </pre>
              </div>
            )}

            {/* Example cURL Request */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  EXAMPLE cURL REQUEST
                </h4>
                <CopyCodeButton code={selectedEndpoint.exampleRequest} />
              </div>
              <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto rounded-2xl border border-slate-800">
                <code>{selectedEndpoint.exampleRequest}</code>
              </pre>
            </div>

            {/* Live Response Panel (Section 4) */}
            {liveResponse ? (
              <div className="animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap size={14} className="animate-pulse" /> LIVE BACKEND RESPONSE
                  </h4>
                  <CopyCodeButton code={liveResponse} />
                </div>
                <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto rounded-2xl border border-emerald-500/30">
                  <code>{liveResponse}</code>
                </pre>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    EXPECTED RESPONSE SCHEMA
                  </h4>
                  <CopyCodeButton code={selectedEndpoint.responseBody} />
                </div>
                <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto rounded-2xl border border-slate-800">
                  <code>{selectedEndpoint.responseBody}</code>
                </pre>
              </div>
            )}
          </article>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
