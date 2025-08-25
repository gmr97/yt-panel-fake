import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, AreaChart, Area } from 'recharts'
import { generateInitialSeries, tickSeries, summarizeKPIs, projectSeries } from './simData'

function Header({ activeTab, setActiveTab }) {
  return (
    <div className="sticky top-0 z-30 backdrop-blur bg-slate-950/70 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" className="h-6 w-6" alt="logo"/>
          <h1 className="text-lg md:text-xl font-semibold tracking-tight">Panel de YouTube — Demo</h1>
          <span className="badge">Datos simulados</span>
        </div>
        <div className="flex items-center gap-2">
          <button className={`tab ${activeTab==='panel' ? 'tab-active' : ''}`} onClick={()=>setActiveTab('panel')}>Panel</button>
          <button className={`tab ${activeTab==='proyecciones' ? 'tab-active' : ''}`} onClick={()=>setActiveTab('proyecciones')}>Proyecciones</button>
          <a className="btn-muted" href="https://vercel.com/new" target="_blank" rel="noreferrer">Deploy en Vercel</a>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ title, value, delta, prefix='', suffix='' }) {
  const up = delta >= 0
  return (
    <div className="card p-4">
      <div className="card-header mb-1">{title}</div>
      <div className="flex items-end justify-between gap-4">
        <div className="kpi-value">{prefix}{value}{suffix}</div>
        <div className={up? 'kpi-delta-up' : 'kpi-delta-down'}>
          {up? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

function LineBlock({ data, dataKey='views', title='Vistas (últimos 30 días)' }) {
  return (
    <div className="card p-4 h-[320px]">
      <div className="card-header mb-2">{title}</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="day" stroke="#94a3b8"/>
          <YAxis stroke="#94a3b8"/>
          <Tooltip contentStyle={{background:'#0f172a', border:'1px solid #1f2937', color:'#e2e8f0'}}/>
          <Legend/>
          <Line type="monotone" dataKey={dataKey} stroke="#6366f1" dot={false} strokeWidth={2}/>
          <Area type="monotone" dataKey={dataKey} stroke="#6366f1" fill="#4f46e5" fillOpacity={0.2}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function BarBlock({ data, title='Ingresos por día (USD)' }) {
  return (
    <div className="card p-4 h-[320px]">
      <div className="card-header mb-2">{title}</div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="day" stroke="#94a3b8"/>
          <YAxis stroke="#94a3b8"/>
          <Tooltip contentStyle={{background:'#0f172a', border:'1px solid #1f2937', color:'#e2e8f0'}}/>
          <Bar dataKey="revenue" fill="#22c55e" radius={[8,8,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function TableBlock({ rows }) {
  return (
    <div className="card p-4 overflow-hidden">
      <div className="card-header mb-3">Top videos (simulados)</div>
      <div className="overflow-auto -mx-2">
        <table className="min-w-full text-sm mx-2">
          <thead className="text-slate-400">
            <tr className="border-b border-slate-800">
              <th className="text-left py-2 pr-4">Video</th>
              <th className="text-right py-2 px-4">Vistas</th>
              <th className="text-right py-2 px-4">CTR</th>
              <th className="text-right py-2 pl-4">Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i)=>(
              <tr key={i} className="border-b border-slate-900/60 hover:bg-slate-900/40">
                <td className="py-2 pr-4">{r.title}</td>
                <td className="text-right py-2 px-4">{r.views.toLocaleString()}</td>
                <td className="text-right py-2 px-4">{r.ctr.toFixed(1)}%</td>
                <td className="text-right py-2 pl-4">${r.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Projections({ baseSeries }) {
  const [growth, setGrowth] = useState(15) // % mensual
  const { projected, summary } = useMemo(()=>projectSeries(baseSeries, growth), [baseSeries, growth])

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm text-slate-300">Proyección mensual (estimación sobre datos simulados)</div>
          <div className="text-lg font-semibold">Crecimiento aplicado: {growth}%</div>
          <span className="badge">Estimaciones • Solo demo</span>
        </div>
        <div className="flex items-center gap-3">
          <input type="range" min="-20" max="60" value={growth} onChange={(e)=>setGrowth(parseInt(e.target.value))} />
          <div className="text-sm text-slate-400">Ajusta el %</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Vistas (próx. 30d)" value={summary.views.toLocaleString()} delta={growth} />
        <KpiCard title="Ingresos (próx. 30d)" value={summary.revenue.toFixed(2)} delta={growth} prefix="$" />
        <KpiCard title="Subs (próx. 30d)" value={summary.subs.toLocaleString()} delta={growth} />
      </div>

      <LineBlock data={projected} dataKey="views" title="Vistas proyectadas (30 días)"/>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('panel')
  const [series, setSeries] = useState(generateInitialSeries())
  const summary = useMemo(()=>summarizeKPIs(series), [series])

  useEffect(()=>{
    const id = setInterval(()=>{
      setSeries(prev => tickSeries(prev))
    }, 900) // ~1 seg para animación fluida
    return ()=>clearInterval(id)
  }, [])

  return (
    <div>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {activeTab==='panel' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KpiCard title="Vistas" value={summary.views.toLocaleString()} delta={summary.viewsDelta} />
              <KpiCard title="Ingresos" value={summary.revenue.toFixed(2)} delta={summary.revDelta} prefix="$" />
              <KpiCard title="CTR" value={summary.ctr.toFixed(1)} delta={summary.ctrDelta} suffix="%" />
              <KpiCard title="Suscriptores" value={summary.subs.toLocaleString()} delta={summary.subsDelta} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LineBlock data={series} dataKey="views" title="Vistas por día (últimos 30)"/>
              <BarBlock data={series} title="Ingresos por día (USD)"/>
            </div>

            <TableBlock rows={series.slice(-8).map((d,i)=>({ 
              title: `Video #${series.length-8+i+1}`,
              views: Math.round(d.views*0.9 + Math.random()*0.2*d.views),
              ctr: Math.max(1, Math.min(20, d.ctr + (Math.random()-0.5)*1.5)),
              revenue: Math.max(0, d.revenue * (0.8 + Math.random()*0.4))
            }))} />
          </div>
        )}

        {activeTab==='proyecciones' && (
          <Projections baseSeries={series} />
        )}

        <footer className="text-xs text-slate-500 pt-6">
          Este panel es una <strong>demostración visual</strong> con <strong>datos simulados</strong>. Las proyecciones son <strong>estimaciones</strong> para efectos de video.
        </footer>
      </main>
    </div>
  )
}
