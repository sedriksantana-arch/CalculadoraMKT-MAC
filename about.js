const ABOUT={nome:'Calculadora MKT+',versao:'1.0.0',criado:'Outubro de 2026',autor:'Sedrik O Santana',marca:'Agência MKT+',ano:'2026'};
let aboutTxt='';
async function renderAbout(){
  let s={};try{s=(await bridge.ui('about'))||{}}catch(_){}
  const os={win32:'Windows',darwin:'macOS',linux:'Linux'}[s.platform],v=s.version||ABOUT.versao;
  const rows=[['Versão',v],['Criado em',ABOUT.criado],['Criador',ABOUT.autor],['Marca',ABOUT.marca]];
  if(os)rows.push(['Plataforma',os+' ('+s.arch+')'],['Tecnologia','Electron '+s.electron]);else rows.push(['Plataforma','Versão web (navegador)']);
  rows.push(['Direitos','© '+ABOUT.ano+' '+ABOUT.autor]);
  const box=$('ab-rows');box.textContent='';
  rows.forEach(([k,val])=>{const d=document.createElement('div'),a=document.createElement('span'),b=document.createElement('b');a.textContent=k;b.textContent=val;d.append(a,b);box.append(d)});
  aboutTxt=ABOUT.nome+' v'+v+'\nCriado em '+ABOUT.criado+' por '+ABOUT.autor+' ('+ABOUT.marca+')\n'+(os?os+' '+s.arch+' · Electron '+s.electron+' · Chromium '+s.chrome:'Versão web');
}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('on',x===b));$('tab-fees').hidden=b.dataset.tab!=='fees';$('tab-about').hidden=b.dataset.tab!=='about'});
$('btn-info').onclick=async function(){await copyTxt(aboutTxt);const t=this.textContent;this.textContent='Copiado';setTimeout(()=>this.textContent=t,1200)};
$('btn-close2').onclick=()=>bridge.ui('closeConfig');
renderAbout();
