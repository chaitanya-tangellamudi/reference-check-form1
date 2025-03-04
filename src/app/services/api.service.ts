import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;
  private uploadUrl = environment.uploadUrl;
  private companyID = environment.companyID;
  private username = environment.username;
  private password = environment.password;

  constructor(private http: HttpClient) {}

  // Fetch record data
  getRecord(contid: string): Observable<any> {
    const payload = {
      CompanyID: this.companyID,
      Username: this.username,
      Password: this.password,
      EntityID: 'Contacts',
      ItemIntID: contid
    };
    return this.http.post<any>(`${this.baseUrl}/viewrecord`, payload);
  }
  getRecord1(consid: string): Observable<any> {
    const payload = {
      CompanyID: this.companyID,
      Username: this.username,
      Password: this.password,
      EntityID: 'Consultants',
      ItemIntID: consid
    };
    return this.http.post<any>(`${this.baseUrl}/viewrecord`, payload);
  }

  // Upload PDF file
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
      retry(2), // 🔁 Retries the request 3 times
      catchError((error) => {
        console.error("❌ Error uploading PDF:", error);
        return throwError(() => new Error("Failed to upload PDF. Please try again later."));
      })
    ); 
  }
}
