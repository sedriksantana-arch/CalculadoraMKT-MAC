const tw=mkTween('w-price'),tile=$('tile'),clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const SOLID=location.search.includes('solid=1');
if(SOLID)document.body.classList.add('solid');
let wp=0,lux=false,lastWa=null,lastSize='';
function fit(){const r=document.body.getBoundingClientRect(),w=Math.ceil(r.width),h=Math.ceil(r.height),k=w+'x'+h;if(k!==lastSize){lastSize=k;bridge.ui('resize',{w,h})}}
function render(S){
  const e=$('w-net');if(document.activeElement!==e)e.value=S.wnet;
  const r=compute(S.wnet,S),menu=!r.f;wp=r.price;tw(wp);
  $('t-plan-n').textContent=menu?'Cardápio digital':(S.plan==='s-c1'?'Entrega própria':'Entrega iFood');
  $('t-plan-v').textContent=pcFmt(r.fee);
  const campOn=!menu&&S.camp;
  $('t-camp').classList.toggle('on',campOn);$('t-emb').classList.toggle('on',r.emb);
  $('t-camp').disabled=menu;$('t-emb').disabled=menu;
  $('t-camp-v').textContent=campOn?'+ '+brl(S.campv):'desligada';
  $('t-emb-v').textContent=r.emb?'+ '+brl(r.sh):'desligado';
  if(S.wa!==lastWa){lastWa=S.wa;if(SOLID)bridge.ui('opacity',S.wa);else tile.style.setProperty('--wa',S.wa)}
  $('w-hint').textContent='Fundo '+Math.round(S.wa*100)+'% · role: ↑ sólido ↓ vidro';
}
const upd=p=>{setS(p);render(getS())},setLux=v=>{lux=v;document.body.classList.toggle('lux',v)};
render(getS());onS(render);
$('w-net').addEventListener('input',ev=>upd({wnet:num(ev.target.value)}));
$('w-copy').onclick=()=>{copyTxt(wp.toFixed(2).replace('.',','));const b=$('w-copy');b.classList.add('ok');setTimeout(()=>b.classList.remove('ok'),1200)};
$('t-plan').onclick=()=>{const S=getS();if(S.mode==='ifood')upd({plan:S.plan==='s-c1'?'s-c2':'s-c1'})};
$('t-camp').onclick=()=>upd({camp:!getS().camp});
$('t-emb').onclick=()=>upd({emb:!getS().emb});
$('w-lux').onclick=()=>setLux(!lux);
addEventListener('keydown',ev=>{if(ev.key==='Escape')setLux(false)});
addEventListener('wheel',ev=>{if(!lux)return;ev.preventDefault();upd({wa:clamp(Math.round((getS().wa+(ev.deltaY<0?.05:-.05))*100)/100,SOLID?.3:.12,1)})},{passive:false});
addEventListener('contextmenu',ev=>{ev.preventDefault();bridge.ui('menu')});
new ResizeObserver(fit).observe(document.body);
addEventListener('load',fit);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
