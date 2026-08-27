import { readdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot=resolve(fileURLToPath(new URL('..',import.meta.url)));
const outputRoot=join(projectRoot,'out');
const port=Number(process.env.PORT??3000);
const mime={'.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.ico':'image/x-icon','.jpg':'image/jpeg','.jpeg':'image/jpeg','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2'};
const fileCache=new Map();

async function preload(directory){
  for(const entry of await readdir(directory,{withFileTypes:true})){
    const absolute=join(directory,entry.name);
    if(entry.isDirectory()){await preload(absolute);continue;}
    if(!entry.isFile())continue;
    const path=`/${relative(outputRoot,absolute).split(sep).join('/')}`;
    const file={absolute,body:await readFile(absolute)};
    fileCache.set(path,file);
    if(path.endsWith('/index.html')){
      const directoryPath=path.slice(0,-'index.html'.length);
      fileCache.set(directoryPath,file);
      fileCache.set(directoryPath.slice(0,-1)||'/',file);
    }
  }
}

await preload(outputRoot);

createServer(async (request,response)=>{
  if(request.method!=='GET'&&request.method!=='HEAD'){response.writeHead(405).end();return;}
  let path;
  try{path=decodeURIComponent((request.url??'/').split('?')[0]);}catch{path='/404.html';}
  const requested=fileCache.get(path)||fileCache.get(path.endsWith('/')?path.slice(0,-1):`${path}/`);
  const file=requested??fileCache.get('/404.html');
  if(!file){response.writeHead(503,{'Content-Type':'text/plain; charset=utf-8'}).end('Static export not found. Run npm run build first.');return;}
  const extension=extname(file.absolute).toLowerCase();
  const immutable=file.absolute.includes(`${join('out','_next','static')}`);
  response.writeHead(requested?200:404,{
    'Content-Type':mime[extension]??'application/octet-stream',
    'Content-Length':file.body.length,
    'Cache-Control':immutable?'public, max-age=31536000, immutable':extension==='.html'?'no-cache':'public, max-age=3600',
    'X-Content-Type-Options':'nosniff',
  });
  if(request.method==='HEAD'){response.end();return;}
  response.end(file.body);
}).listen(port,'0.0.0.0',()=>{
  process.stdout.write(`Fast static preview: http://localhost:${port} (${fileCache.size} cached routes and assets)\n`);
});
