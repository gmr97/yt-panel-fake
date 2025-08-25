const days = Array.from({length: 30}, (_,i)=>i+1)

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)) }

export function generateInitialSeries(){
  let baseViews = 12000
  let baseRevenue = 60
  let baseCTR = 8
  let baseSubs = 50
  const arr = []
  for(let i=0;i<days.length;i++){
    const noise = (Math.random()-0.5)
    baseViews = clamp(baseViews * (1 + 0.01 + noise*0.08), 3000, 100000)
    baseRevenue = clamp(baseRevenue * (1 + 0.01 + noise*0.1), 5, 800)
    baseCTR = clamp(baseCTR + noise*0.8, 2, 18)
    baseSubs = clamp(baseSubs * (1 + 0.02 + noise*0.15), 5, 1500)
    arr.push({
      day: String(i+1).padStart(2,'0'),
      views: Math.round(baseViews),
      revenue: Math.round(baseRevenue*100)/100,
      ctr: Math.round(baseCTR*10)/10,
      subs: Math.round(baseSubs)
    })
  }
  return arr
}

export function tickSeries(prev){
  const next = prev.slice(1) // desplaza ventana de 30 días
  const last = prev[prev.length-1]
  const noise = (Math.random()-0.5)
  const newViews = clamp(last.views * (1 + 0.015 + noise*0.08), 3000, 120000)
  const newRevenue = clamp(last.revenue * (1 + 0.015 + noise*0.12), 5, 1200)
  const newCtr = clamp(last.ctr + noise*0.9, 2, 20)
  const newSubs = clamp(last.subs * (1 + 0.02 + noise*0.18), 5, 2000)
  next.push({
    day: String(Number(last.day)+1).padStart(2,'0'),
    views: Math.round(newViews),
    revenue: Math.round(newRevenue*100)/100,
    ctr: Math.round(newCtr*10)/10,
    subs: Math.round(newSubs)
  })
  return next
}

export function summarizeKPIs(series){
  const last7 = series.slice(-7)
  const prev7 = series.slice(-14,-7)
  const sum = (a,k)=>a.reduce((acc,x)=>acc+(x[k]||0),0)
  const views = sum(last7,'views')
  const revenue = sum(last7,'revenue')
  const subs = sum(last7,'subs')
  const ctr = last7.reduce((acc,x)=>acc+x.ctr,0) / last7.length
  const p_views = sum(prev7,'views') || 1
  const p_rev = sum(prev7,'revenue') || 1
  const p_subs = sum(prev7,'subs') || 1
  const p_ctr = (prev7.reduce((acc,x)=>acc+x.ctr,0) / (prev7.length||1)) || 1

  return {
    views,
    revenue,
    subs,
    ctr,
    viewsDelta: ((views - p_views)/p_views)*100,
    revDelta: ((revenue - p_rev)/p_rev)*100,
    subsDelta: ((subs - p_subs)/p_subs)*100,
    ctrDelta: ((ctr - p_ctr)/p_ctr)*100,
  }
}

export function projectSeries(base, growthPct){
  const factor = 1 + (growthPct/100)
  const projected = base.map((d,i)=>{
    return {
      ...d,
      views: Math.round(d.views * factor),
      revenue: Math.round(d.revenue * factor * 100)/100,
      subs: Math.round(d.subs * factor)
    }
  })
  const sum = (a,k)=>a.reduce((acc,x)=>acc+(x[k]||0),0)
  const summary = {
    views: sum(projected,'views'),
    revenue: sum(projected,'revenue'),
    subs: sum(projected,'subs')
  }
  return { projected, summary }
}
