'use strict';

const cache = require('memory-cache');

let memCache = new cache.Cache();
    let cacheMiddleware = (duration,req, res, next) => {
            let key =  '__bankPrices__' + req.originalUrl || req.url
            let cacheContent = memCache.get(key);
            if(cacheContent){
                res.send(cacheContent);
            }else{
                res.sendResponse = res.send
                res.send = (body) => {
                   // memCache.put(key,body,duration*1000);
                    res.sendResponse(body)
                }
                next();
            }
        }

module.exports = cacheMiddleware;