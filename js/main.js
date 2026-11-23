const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
window.addEventListener('load',()=>setTimeout(()=>$('.preloader')?.classList.add('done'),700));
if(window.lucide) lucide.createIcons();
$('#year').textContent=new Date().getFullYear();
// Theme preference
const savedTheme=localStorage.getItem('biruntha-theme');if(savedTheme==='light')document.body.classList.add('light');
$('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('biruntha-theme',document.body.classList.contains('light')?'light':'dark')});
// Navigation panel
const panel=$('#menuPanel'),shade=$('#menuShade');function closeMenu(){panel.classList.remove('open');shade.classList.remove('show')}
$('#menuToggle').addEventListener('click',()=>{panel.classList.add('open');shade.classList.add('show')});$('#menuClose').addEventListener('click',closeMenu);shade.addEventListener('click',closeMenu);$$('#menuPanel a').forEach(a=>a.addEventListener('click',closeMenu));
// Typewriter loop: Web Developer, then AI-Powered Full Stack Developer.
const roles=['Web Developer','AI-Powered Full Stack Developer'];let roleIndex=0,letterIndex=0,deleting=false;
const roleEl=$('#roleText');
function typeRole(){if(!roleEl)return;const current=roles[roleIndex];roleEl.textContent=current.slice(0,letterIndex);
 if(!deleting){if(letterIndex<current.length){letterIndex++;setTimeout(typeRole,85)}else{deleting=true;setTimeout(typeRole,1250)}}
 else if(letterIndex>0){letterIndex--;setTimeout(typeRole,43)}else{deleting=false;roleIndex=(roleIndex+1)%roles.length;setTimeout(typeRole,420)}}
roleEl.textContent='';typeRole();
// Background music: attempt autoplay on entry; browsers may require a first interaction.
const ambientAudio=$('#ambientAudio'),musicBtn=$('#musicToggle');
ambientAudio.volume=0.72;
function musicState(on){musicBtn.classList.toggle('playing',on);musicBtn.setAttribute('aria-label',on?'Pause background music':'Play background music');musicBtn.querySelector('em').textContent=on?'Playing':'Music'}
async function startMusic(){try{await ambientAudio.play();musicState(true);return true}catch(e){musicState(false);return false}}
startMusic();
let firstGestureHandled=false;
async function resumeOnGesture(){if(firstGestureHandled)return;firstGestureHandled=true;if(ambientAudio.paused)await startMusic();['pointerdown','keydown','touchstart'].forEach(ev=>document.removeEventListener(ev,resumeOnGesture,true))}
['pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,resumeOnGesture,true));
musicBtn.addEventListener('click',async()=>{if(ambientAudio.paused){await startMusic()}else{ambientAudio.pause();musicState(false)}});
ambientAudio.addEventListener('play',()=>musicState(true));ambientAudio.addEventListener('pause',()=>musicState(false));
// Smooth scroll and reveal animations
if(window.Lenis){const lenis=new Lenis({duration:1.1,smoothWheel:true});function raf(t){lenis.raf(t);requestAnimationFrame(raf)}requestAnimationFrame(raf);$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(target){e.preventDefault();lenis.scrollTo(target,{offset:-20})}}))}
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});$$('.reveal').forEach(el=>revealObserver.observe(el));
if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);gsap.utils.toArray('.section-heading').forEach(h=>gsap.from(h,{y:28,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 85%'}}));gsap.utils.toArray('.skill-item').forEach((el,i)=>gsap.from(el,{y:18,opacity:0,duration:.5,delay:(i%4)*.07,scrollTrigger:{trigger:el,start:'top 92%'}}))}
// Projects are displayed vertically; use normal page scrolling between project cards.
const cards=$$('.project-card');cards.forEach(c=>c.classList.add('active'));
// Project screenshot carousels: arrow navigation through every supplied screenshot.
const galleries={
 attendance:['SA -[dashboard].png','SA -[login].png','SA -[face attendance].png','SA -[student reg].png','SA -[weekly report].png','SA - [forget passcode].png'].map(n=>'assets/images/projects/smartattendance/'+n),
 billz:['SB -[dashboard].png','SB -[welcome page].png','SB -[shop reg].png','SB -[add item].png','SB -[billing].png','SB -[stock management].png','SB -[customers].png','SB -[expenses].png','SB -[analytics].png','SB -[settings].png','SB- [reports].png'].map(n=>'assets/images/projects/smartbillz/'+n)
};
const galleryIndex={attendance:0,billz:0};
$$('.gallery-controls').forEach(control=>{
 const key=control.dataset.gallery,card=control.closest('.project-card'),img=$('.project-preview>img',card),count=$('.gallery-count',control);
 const update=()=>{const list=galleries[key],idx=galleryIndex[key];img.style.opacity='0';setTimeout(()=>{img.src=list[idx];img.style.opacity='1'},140);count.textContent=String(idx+1).padStart(2,'0')+' / '+String(list.length).padStart(2,'0')};
 $('.gallery-prev',control).addEventListener('click',()=>{galleryIndex[key]=(galleryIndex[key]-1+galleries[key].length)%galleries[key].length;update()});
 $('.gallery-next',control).addEventListener('click',()=>{galleryIndex[key]=(galleryIndex[key]+1)%galleries[key].length;update()});
});
// Full-screen project screenshot viewer with zoom and keyboard close.
const lightbox=$('#imageLightbox'),lightboxImg=$('#lightboxImage');let zoom=1;
$$('.project-preview>img').forEach(img=>{img.tabIndex=0;img.style.cursor='zoom-in';const open=()=>{lightboxImg.src=img.src;zoom=1;lightboxImg.style.transform='scale(1)';lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false')};img.addEventListener('click',open);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lightboxImg.src=''}
$('#lightboxClose').addEventListener('click',closeLightbox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});lightbox.addEventListener('wheel',e=>{if(!lightbox.classList.contains('open'))return;e.preventDefault();zoom=Math.max(1,Math.min(3,zoom+(e.deltaY<0?.15:-.15)));lightboxImg.style.transform=`scale(${zoom})`},{passive:false});
// GitHub profile data is generated by GitHub Actions and served from this site.
// This avoids visitors' browsers having to connect directly to api.github.com.
const GITHUB_USER='birunthar007';
const GH_DATA_URL='./github-data.json';
const GH_CACHE_KEY=`portfolio-github-${GITHUB_USER}-v3`;
const GH_CACHE_TTL=5*60*1000;
let githubLoading=false;
function renderGitHub(data,stale=false){
  const user=data.user||{},repos=Array.isArray(data.repos)?data.repos:[];
  const totalStars=repos.reduce((sum,repo)=>sum+(Number(repo.stargazers_count)||0),0);
  $('#ghRepos').textContent=Number(user.public_repos)||repos.length;
  $('#ghFollowers').textContent=Number(user.followers)||0;
  $('#ghFollowing').textContent=Number(user.following)||0;
  $('#ghStars').textContent=totalStars;
  $('#aboutFollowers').textContent=Number(user.followers)||0;
  $('#aboutStars').textContent=totalStars;
  const featured=repos.filter(repo=>!repo.fork).slice(0,3);
  const grid=$('#repoGrid');
  grid.innerHTML=featured.map(repo=>`<a class="repo-card" href="${repo.html_url}" target="_blank" rel="noopener noreferrer"><h5>⌘ ${escapeHTML(repo.name)}</h5><p>${escapeHTML(repo.description||'A project in my development journey.')}</p><small>✳ ${escapeHTML(repo.language||'Code')} &nbsp; ★ ${Number(repo.stargazers_count)||0}</small></a>`).join('')||'<div class="repo-placeholder">No public repositories found yet.</div>';
  grid.dataset.loaded='true';
  const updated=data.generated_at?new Date(data.generated_at):null;
  $('#githubNote').textContent=stale
    ?'Showing the latest saved GitHub data · Waiting for the next update.'
    :`GitHub data updated${updated&&!isNaN(updated)?' · '+updated.toLocaleString():''}.`;
}
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function getGitHubCache(){try{const value=JSON.parse(localStorage.getItem(GH_CACHE_KEY)||'null');return value&&value.data?value:null}catch(_){return null}}
async function loadGitHub(force=false){
  if(githubLoading)return;
  const cached=getGitHubCache();
  if(cached)renderGitHub(cached.data,true);
  if(!force&&cached&&Date.now()-cached.savedAt<GH_CACHE_TTL)return;
  githubLoading=true;
  const note=$('#githubNote');
  if(!cached)note.textContent='Loading GitHub profile…';
  try{
    const response=await fetch(`${GH_DATA_URL}?v=${Date.now()}`,{cache:'no-store'});
    if(!response.ok)throw new Error(`GitHub data file returned ${response.status}`);
    const data=await response.json();
    if(!data||!data.user||!Array.isArray(data.repos))throw new Error('GitHub data file has an invalid format');
    try{localStorage.setItem(GH_CACHE_KEY,JSON.stringify({savedAt:Date.now(),data}))}catch(_){/* Storage may be disabled. */}
    renderGitHub(data,false);
  }catch(err){
    console.warn('GitHub snapshot could not be loaded:',err);
    if(cached)renderGitHub(cached.data,true);
    else{
      note.textContent='GitHub stats are not available yet. The site will show them after its first GitHub Actions update.';
      const grid=$('#repoGrid');
      if(!grid.dataset.loaded)grid.innerHTML=`<a class="repo-card" href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer"><h5>Visit my GitHub ↗</h5><p>Explore repositories and recent work on my profile.</p><small>github.com/${GITHUB_USER}</small></a>`;
    }
  }finally{githubLoading=false;}
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)loadGitHub(true)});
setInterval(()=>loadGitHub(true),GH_CACHE_TTL);
loadGitHub();
// Contact form opens a prefilled email (no backend required)
$('#contactForm').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget),name=d.get('name'),email=d.get('email'),message=d.get('message');const subject=encodeURIComponent('Portfolio enquiry from '+name);const body=encodeURIComponent(`Hi Biruntha,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`);window.location.href=`mailto:birunthar007@gmail.com?subject=${subject}&body=${body}`;showToast('Opening your email app…')});
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
// Cursor C: smooth trailing orange particles.
if(matchMedia('(pointer:fine)').matches){document.body.classList.add('custom-cursor');const dots=Array.from({length:7},(_,i)=>{const d=document.createElement('i');d.className='cursor-trail';d.style.setProperty('--trail-i',i);document.body.appendChild(d);return {el:d,x:0,y:0}});let mx=0,my=0;document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dots[0].x=mx;dots[0].y=my});function trail(){dots.forEach((d,i)=>{if(i){const prev=dots[i-1];d.x+=(prev.x-d.x)*(.34-i*.025);d.y+=(prev.y-d.y)*(.34-i*.025)}d.el.style.left=d.x+'px';d.el.style.top=d.y+'px';d.el.style.opacity=mx||my?String(1-i*.1):'0'});requestAnimationFrame(trail)}trail();document.addEventListener('mouseleave',()=>dots.forEach(d=>d.el.style.opacity=0));}
