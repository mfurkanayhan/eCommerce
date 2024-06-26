import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  
  constructor(
    private primeng: MessageService
  ) {}

  errorHandler(err: HttpErrorResponse) {
    console.log(err);

    switch (err.status) {
      case 0:
        this.primeng.add({ severity: "warn", detail: "API is not working", summary: "Error!"});
        break;
      
      case 400:
        this.primeng.add({ severity: "warn", detail: err.error.message, summary: "Error!"});
        break;

      case 404:
        this.primeng.add({ severity: "warn", detail: "API address not found", summary: "Error!"});
        break;

      case 422:
        for(const e of err.error){
          this.primeng.add({ severity: "warn", detail: e, summary: "Validation Error!"});
        }
        break;
    }
  }
}