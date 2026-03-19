
                    const CACHE_BLOQUEIO = 'trava-perimetro-v1';
                    let clienteID = null;'Cliente editor'
                    self.addEventListener('install', e => self.skipWaiting());
                    self.addEventListener('activate', e => e.waitUntil(clients.claim()));
                    self.addEventListener('fetch', e => {
                        e.respondWith(caches.open(CACHE_BLOQUEIO).then(cache => {
                            return cache.match('status_perimetro').then(lock => {
                                if(lock) return new Response('<h1 style="color:red;background:#000;height:100vh;text-align:center;padding-top:20%">SISTEMA BLOQUEADO - JDP INDUSTRIAL</h1>', {headers:{'Content-Type':'text/html'}});
                                return fetch(e.request);
                            });
                        }));
                    });
                    self.addEventListener('message', e => {
                        if(e.data.action === 'configurar_cliente') clienteID = e.data.id;
                        if(e.data.action === 'verificar_seguranca' && clienteID) {
                            fetch('https://raw.githubusercontent.com/pradodalapa-hue/Tetstserbidor/main/clientes.json?t=' + Date.now())
                            .then(r => r.json()).then(dados => {
                                const u = dados.find(c => c.id === clienteID);
                                caches.open(CACHE_BLOQUEIO).then(cache => {
                                    if(u && u.status === 'bloqueado') cache.put('status_perimetro', new Response('BLOQUEADO'));
                                    else cache.delete('status_perimetro');
                                });
                            });
                        }
                    });
