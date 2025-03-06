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
  private companyID!: string;
  private username = 'Admin';
  private password = 'cbizadmin';

  constructor(private http: HttpClient) {}

  // Set CompanyID dynamically
  setCompanyID(companyID: string) {
    this.companyID = companyID;
  }

  // Get CompanyID with validation
  getCompanyID(): string {
    if (!this.companyID) {
      console.error("❌ CompanyID is missing! API call aborted.");
      throw new Error("CompanyID is required");
    }
    return this.companyID;
  }

  // Fetch record details
  getRecord(companyID: string, entityId: string, entityName: string): Observable<any> {
    const payload = {
      CompanyID: companyID, // Pass companyID dynamically
      Username: this.username,
      Password: this.password,
      EntityID: entityName,
      ItemIntID: entityId
    };
    return this.http.post<any>(`${this.baseUrl}/viewrecord`, payload);
  }

  // Upload PDF
  uploadPdf(companyID: string, testId: string, additionalId: string, fileName: string, base64String: string): Observable<any> {
    if (!companyID) {
      console.error("❌ CompanyID is missing! Upload aborted.");
      return throwError(() => new Error("CompanyID is required"));
    }

    const payload = {
      CompanyID: companyID, // Pass dynamically instead of using instance variable
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
