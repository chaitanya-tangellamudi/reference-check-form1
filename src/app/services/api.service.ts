import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://exelareweb.com/ExelareJobsAPI/api';
  private uploadUrl = 'https://exelareweb.com/ExelareJobsAPI/api/addDocument';
  private companyID = 'Exl_permtemplatedb';
  private username = 'Admin';
  private password = 'cbizadmin';

  constructor(private http: HttpClient) {}

  getRecord(entityId: string, entityName: string): Observable<any> {
    const payload = {
      CompanyID: this.companyID,
      Username: this.username,
      Password: this.password,
      EntityID: entityName,
      ItemIntID: entityId
    };
    return this.http.post<any>(`${this.baseUrl}/viewrecord`, payload);
  }

  uploadPdf(testId: string, additionalId: string, fileName: string, base64String: string): Observable<any> {
    const payload = {
      CompanyID: this.companyID, 
      Username: this.username,
      Password: this.password,
      ItemIntIDs: [testId, additionalId],
      DocName: fileName,
      DocContent: base64String,
      SubType: ""
    };
    return this.http.post<any>(`${this.uploadUrl}`, payload).pipe(
      retry(2),
      catchError((error) => {
        console.error("❌ Error uploading PDF:", error);
        return throwError(() => new Error("Failed to upload PDF. Please try again later."));
      })
    );
  }
}
