/* Dashboard mockup live cycling animation - simulates a day in ClimaNexus apartment */
(function(){
  const mockup = document.querySelector('.dashboard-mockup');
  if (!mockup) return;

  const zones = mockup.querySelectorAll('.dm-zone');
  const charts = mockup.querySelectorAll('.dm-chart');

  // 4 scenes simulating a day cycle in a residential apartment
  const scenes = [
    {
      // Morning - everyone waking up, breathing OK, AC starting
      zoneStates: ['normal','normal','normal','normal'],
      stateTexts: ['NORMAL','NORMAL','NORMAL','NORMAL'],
      values: [
        {val:480, unit:'ppm', barPct:45, decimals:0},
        {val:12, unit:'µg/m³', barPct:24, decimals:0},
        {val:22.8, unit:'°C', barPct:65, decimals:1},
        {val:48, unit:'%', barPct:48, decimals:0}
      ]
    },
    {
      // Midday cooking - kitchen heat assist, CO2 rises
      zoneStates: ['normal','normal','heat','normal'],
      stateTexts: ['NORMAL','NORMAL','HEAT_ASSIST','NORMAL'],
      values: [
        {val:720, unit:'ppm', barPct:68, decimals:0},
        {val:32, unit:'µg/m³', barPct:64, decimals:0},
        {val:26.4, unit:'°C', barPct:80, decimals:1},
        {val:62, unit:'%', barPct:62, decimals:0}
      ]
    },
    {
      // Evening - family in living room, IAQ boost activated
      zoneStates: ['boost','normal','normal','normal'],
      stateTexts: ['IAQ_BOOST','NORMAL','NORMAL','NORMAL'],
      values: [
        {val:850, unit:'ppm', barPct:78, decimals:0},
        {val:22, unit:'µg/m³', barPct:44, decimals:0},
        {val:23.4, unit:'°C', barPct:70, decimals:1},
        {val:55, unit:'%', barPct:55, decimals:0}
      ]
    },
    {
      // Night - bedroom IAQ boost (sleep ventilation), cooler temp
      zoneStates: ['normal','boost','normal','normal'],
      stateTexts: ['NORMAL','IAQ_BOOST','NORMAL','NORMAL'],
      values: [
        {val:620, unit:'ppm', barPct:56, decimals:0},
        {val:15, unit:'µg/m³', barPct:30, decimals:0},
        {val:21.5, unit:'°C', barPct:60, decimals:1},
        {val:52, unit:'%', barPct:52, decimals:0}
      ]
    }
  ];

  let idx = 0;
  let timerId = null;

  function applyScene(s){
    zones.forEach((zone, i) => {
      zone.classList.remove('normal','boost','heat','dehum','alarm');
      if (s.zoneStates[i]) zone.classList.add(s.zoneStates[i]);
      const stateSpan = zone.querySelector('.zs');
      if (stateSpan && s.stateTexts[i]) stateSpan.textContent = s.stateTexts[i];
    });
    charts.forEach((chart, i) => {
      const v = s.values[i];
      if (!v) return;
      const bar = chart.querySelector('.br > div');
      const valSpan = chart.querySelector('.vl');
      if (bar) bar.style.width = v.barPct + '%';
      if (valSpan) {
        const num = v.decimals > 0 ? v.val.toFixed(v.decimals) : v.val;
        valSpan.textContent = num + ' ' + v.unit;
      }
    });
  }

  function start(){
    if (timerId) return;
    timerId = setInterval(() => {
      idx = (idx + 1) % scenes.length;
      applyScene(scenes[idx]);
    }, 4000);
  }

  function stop(){
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  // Apply first scene immediately
  applyScene(scenes[0]);

  // Start/stop animation based on viewport visibility (battery-friendly)
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? start() : stop());
  }, { threshold: 0.3 });
  obs.observe(mockup);
})();
