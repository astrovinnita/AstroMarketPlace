import { HttpInterceptorFn } from '@angular/common/http';
import { RestURL } from '../Common/Constant/RestURL';
import { inject } from '@angular/core';
import { StorageService } from '../Common/Services/storage.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {

  let storage = inject(StorageService)

  if ((req.url.startsWith(RestURL.isAuthorized.user) || req.url.startsWith(RestURL.isAuthorized.seller) || RestURL.isAuthorized.token.includes(req.url)) && storage.getToken()) {
    const newReq = req.clone(({
      headers: req.headers.set("Authorization", "bwaedse" + storage.getToken())
    }))    
    return next(newReq);
  }
  else {
    return next(req)
  }
};
