const {app,BrowserWindow,ipcMain,globalShortcut,screen,Menu}=require('electron');
const path=require('path'),fs=require('fs');
if(!app.requestSingleInstanceLock())app.quit();
app.disableHardwareAcceleration(); // evita janelas transparentes/cortadas em alguns PCs com Windows

const file=()=>path.join(app.getPath('userData'),'window-state.json');
let st={widgetOn:true,pinned:true,solid:true,x:null,y:null};
try{st={...st,...JSON.parse(fs.readFileSync(file(),'utf8'))}}catch(_){}
const saveSt=()=>{try{fs.writeFileSync(file(),JSON.stringify(st))}catch(_){}};
const view=()=>({widgetOn:st.widgetOn,pinned:st.pinned});
const broadcast=()=>BrowserWindow.getAllWindows().forEach(w=>{if(!w.isDestroyed())w.webContents.send('state',view())});
const web={preload:path.join(__dirname,'preload.js'),contextIsolation:true};
const BG='#0b1320';
let main,wg,cfg;

const onScreen=(x,y)=>x!=null&&y!=null&&screen.getAllDisplays().some(d=>x>=d.bounds.x&&x<d.bounds.x+d.bounds.width-40&&y>=d.bounds.y&&y<d.bounds.y+d.bounds.height-40);

// ALWAYS ON TOP do widget (nível 'floating'; no Mac também aparece sobre apps em tela cheia)
function applyPin(){
  if(!wg)return;
  wg.setAlwaysOnTop(st.pinned,'floating');
  if(process.platform==='darwin')wg.setVisibleOnAllWorkspaces(st.pinned,{visibleOnFullScreen:true});
}
function makeMain(){
  const wa=screen.getPrimaryDisplay().workArea;
  main=new BrowserWindow({width:392,height:Math.min(780,wa.height-20),minWidth:360,minHeight:420,autoHideMenuBar:true,backgroundColor:BG,title:'Calculadora MKT+',icon:path.join(__dirname,'icon.png'),webPreferences:web});
  main.center();main.loadFile('index.html');
  main.on('closed',()=>app.quit());
}
function widgetMenu(){
  Menu.buildFromTemplate([
    {label:'Fixar no topo (Always on Top)',type:'checkbox',checked:st.pinned,click:()=>{st.pinned=!st.pinned;applyPin();saveSt();broadcast()}},
    {label:'Fundo transparente (experimental)',type:'checkbox',checked:!st.solid,click:()=>{st.solid=!st.solid;saveSt();rebuildWidget()}},
    {label:'Abrir calculadora',click:()=>{main.show();main.focus()}},
    {type:'separator'},
    {label:'Ocultar widget',click:()=>{st.widgetOn=false;wg.hide();saveSt();broadcast()}}
  ]).popup({window:wg});
}
function makeWidget(){
  const d=screen.getPrimaryDisplay().workArea,ok=onScreen(st.x,st.y),W=st.solid?260:280;
  // padrão = modo sólido (compatível). O transparente é opcional pelo menu do clique direito.
  const look=st.solid?{backgroundColor:BG}:{transparent:true,hasShadow:false,thickFrame:false,backgroundColor:'#00000000'};
  wg=new BrowserWindow({width:W,height:290,x:ok?st.x:d.x+d.width-W-28,y:ok?st.y:d.y+60,frame:false,resizable:false,maximizable:false,minimizable:false,fullscreenable:false,skipTaskbar:true,show:false,...look,webPreferences:web});
  wg.loadFile('widget.html',{query:{solid:st.solid?'1':'0'}});
  wg.once('ready-to-show',()=>{applyPin();if(st.widgetOn)wg.show()});
  wg.on('moved',()=>{[st.x,st.y]=wg.getPosition();saveSt()});
  wg.on('system-context-menu',e=>{e.preventDefault();widgetMenu()}); // clique direito em área de arrastar (Windows)
}
function rebuildWidget(){const old=wg;wg=null;if(old)old.destroy();makeWidget()}
function openCfg(){
  if(cfg){cfg.focus();return}
  cfg=new BrowserWindow({width:380,height:440,useContentSize:true,parent:main,resizable:false,minimizable:false,maximizable:false,backgroundColor:BG,title:'Configurar Taxas',webPreferences:web});
  cfg.removeMenu();cfg.loadFile('config.html');cfg.on('closed',()=>{cfg=null});
}
ipcMain.handle('ui',(e,a,v)=>{
  switch(a){
    case 'toggleWidget':st.widgetOn=!st.widgetOn;st.widgetOn?(wg.show(),wg.focus()):wg.hide();break;
    case 'pin':st.pinned=!st.pinned;applyPin();break;
    case 'openMain':main.show();main.focus();break;
    case 'config':openCfg();break;
    case 'closeConfig':cfg&&cfg.close();break;
    case 'resize':if(wg&&v){const b=wg.getBounds();wg.setBounds({x:b.x,y:b.y,width:Math.ceil(v.w),height:Math.ceil(v.h)})}return;
    case 'opacity':wg&&wg.setOpacity(Math.min(1,Math.max(.3,+v||1)));return;
    case 'menu':if(wg)widgetMenu();return;
    case 'about':return {version:app.getVersion(),electron:process.versions.electron,chrome:process.versions.chrome,platform:process.platform,arch:process.arch};
  }
  saveSt();broadcast();return view();
});
app.whenReady().then(()=>{
  makeMain();makeWidget();
  globalShortcut.register('CommandOrControl+Shift+M',()=>{st.widgetOn=true;wg.show();wg.focus();saveSt();broadcast()});
});
app.on('will-quit',()=>globalShortcut.unregisterAll());
app.on('window-all-closed',()=>app.quit());
