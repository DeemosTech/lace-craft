'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo = document.querySelector('#hero-video');
const motionToggle = document.querySelector('#motion-toggle');
const heroMedia = document.querySelector('.hero-media');
function loadHero() { const source = heroVideo.querySelector('source'); if (!source.src) { source.src = source.dataset.src; heroVideo.load(); } }
function syncMotion() { motionToggle.textContent = heroVideo.paused ? 'Play preview' : 'Pause preview'; motionToggle.setAttribute('aria-pressed', String(!heroVideo.paused)); }
function showPoster() { heroMedia.classList.remove('video-ready'); }
function revealDecodedFrame() { if (heroVideo.readyState >= 2 && heroVideo.videoWidth > 0 && !document.hidden) heroMedia.classList.add('video-ready'); }
heroVideo.addEventListener('playing', () => { if ('requestVideoFrameCallback' in heroVideo) heroVideo.requestVideoFrameCallback(revealDecodedFrame); else revealDecodedFrame(); });
heroVideo.addEventListener('error', () => { showPoster(); motionToggle.textContent = 'Retry preview'; motionToggle.setAttribute('aria-pressed','false'); });
heroVideo.addEventListener('emptied', showPoster);
motionToggle.addEventListener('click', async () => { loadHero(); if (heroVideo.error) heroVideo.load(); if (heroVideo.paused) { try { await heroVideo.play(); } catch { showPoster(); syncMotion(); } } else { heroVideo.pause(); showPoster(); } });
heroVideo.addEventListener('play', syncMotion); heroVideo.addEventListener('pause', syncMotion);
if (!reducedMotion.matches && !navigator.connection?.saveData) { loadHero(); heroVideo.play().catch(syncMotion); }
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) heroVideo.pause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { heroVideo.pause(); showPoster(); } });

const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab) { tabs.forEach(t => { const active = t === tab; t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1; document.getElementById(t.getAttribute('aria-controls')).hidden = !active; }); }
tabs.forEach((tab, i) => { tab.addEventListener('click', () => activateTab(tab)); tab.addEventListener('keydown', e => { let index; if (e.key === 'ArrowRight') index = (i+1)%tabs.length; if (e.key === 'ArrowLeft') index = (i+tabs.length-1)%tabs.length; if (e.key === 'Home') index = 0; if (e.key === 'End') index = tabs.length-1; if (index !== undefined) { e.preventDefault(); activateTab(tabs[index]); tabs[index].focus(); } }); });

const demo = document.querySelector('#demo-video');
document.querySelectorAll('[data-time]').forEach(button => button.addEventListener('click', async () => { const target = Number(button.dataset.time); const seek = () => { demo.currentTime = Math.min(target, Number.isFinite(demo.duration) ? demo.duration : target); }; if (demo.readyState >= 1) seek(); else { demo.addEventListener('loadedmetadata', seek, {once:true}); demo.load(); } try { await demo.play(); } catch { demo.focus(); } }));

const figureDialog = document.querySelector('#figure-dialog');
document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => { const expanded = document.querySelector('#expanded-figure'); expanded.src = button.dataset.zoom; expanded.alt = button.querySelector('img').alt; document.querySelector('#figure-dialog-title').textContent = button.dataset.title; figureDialog.showModal(); }));
document.querySelector('#close-figure').addEventListener('click', () => figureDialog.close());
figureDialog.addEventListener('click', e => { if (e.target === figureDialog) { const r = figureDialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) figureDialog.close(); } });

const number = n => n.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
async function prepareResults() {
  const response = await fetch('assets/results.json'); if (!response.ok) throw new Error('Results unavailable'); const tasks = await response.json();
  const methods = [['Default','Default','default'],['D2C','D2C','d2c'],['Full','LACE–CRAFT','ours']];
  function render(name) { const task = tasks.find(t => t.name === name); const max = Math.max(...methods.map(([key]) => task.values[key].mean)); document.querySelector('#task-name').textContent = name; document.querySelector('#gain').textContent = '+' + ((task.values.Full.mean/task.values.D2C.mean-1)*100).toFixed(1) + '% vs. D2C'; const bars = document.querySelector('#bars'); bars.replaceChildren(); methods.forEach(([key,label,cls]) => { const {mean,sd} = task.values[key]; const row = document.createElement('div'); row.className = 'result-row '+cls; const title=document.createElement('span'); title.className='result-label'; title.textContent=label; const track=document.createElement('div'); track.className='result-track'; track.setAttribute('aria-hidden','true'); const fill=document.createElement('div'); fill.className='result-fill'; fill.style.setProperty('--value',`${mean/max*100}%`); track.append(fill); const value=document.createElement('span'); value.className='result-value'; value.append(number(mean)+' '); const error=document.createElement('small'); error.textContent='± '+number(sd); value.append(error); row.append(title,track,value); bars.append(row); }); document.querySelectorAll('[data-task]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.task===name))); }
  document.querySelectorAll('[data-task]').forEach(button=>button.addEventListener('click',()=>render(button.dataset.task)));
  const body=document.querySelector('#result-table'); tasks.forEach(task=>{const tr=document.createElement('tr'); const th=document.createElement('th'); th.scope='row'; th.textContent=task.name; tr.append(th); ['Default','D2C','No Actor','No replay','Full'].forEach(key=>{const td=document.createElement('td'); const v=task.values[key]; td.append(number(v.mean)); const sd=document.createElement('small'); sd.textContent='± '+number(v.sd); td.append(sd); tr.append(td);}); body.append(tr);}); render('Ant');
}
prepareResults().catch(()=>{document.querySelector('#bars').textContent='Results could not be loaded. Please reload the page.';document.querySelectorAll('[data-task]').forEach(b=>b.disabled=true);});
