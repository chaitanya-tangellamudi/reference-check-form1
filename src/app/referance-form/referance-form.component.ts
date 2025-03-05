import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { PdfService } from '../services/pdf.service';
import { TaskbarComponent } from '../taskbar/taskbar.component';

@Component({
  selector: 'app-referance-form',
  standalone: true,
  imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        TaskbarComponent,


  ],
  templateUrl: './referance-form.component.html',
  styleUrl: './referance-form.component.css'
})
export class ReferanceFormComponent implements OnInit {
  referenceForm: FormGroup;
  isLoading = false;
  consid: string | null = null;
  contid: string | null = null;
  companyID: string | null = null;
  name: string = '';

  relationshipOptions: string[] = [
    'Employment Reference',
    'Personal Character Reference',
    'Babysitting Reference',
    'Part-Time Employment',
    'Full-Time Employment'
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private pdfService: PdfService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.referenceForm = this.fb.group({
      referenceName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emailUpdates: [false],
      nannyApplicantName: ['', Validators.required],
      relationship: [[]],
      knownDuration: ['', Validators.required],
      ratingTimeliness: ['', Validators.required],
      ratingAttitude: ['', Validators.required],
      ratingCommonSense: ['', Validators.required],
      ratingCreativity: ['', Validators.required],
      ratingCommunication: ['', Validators.required],
      ratingCopingwithStress: ['', Validators.required],
      ratingCleanliness: ['', Validators.required],
      ratingDependability: ['', Validators.required],
      ratingEnergyLevel: ['', Validators.required],
      ratingSafety: ['', Validators.required],
      ratingFlexibility: ['', Validators.required],
      ratingSuggestions: ['', Validators.required],
      ratingHealthy: ['', Validators.required],
      ratingProfessionalism: ['', Validators.required],
      ratingTrustworthy: ['', Validators.required],
      ratingSelfConfidence: ['', Validators.required],
      ratingChildcare: ['', Validators.required],
      Howleftjob: ['', Validators.required],
      hireagain: ['', Validators.required],
      improvementAreas: [''],
      recommend: ['', Validators.required],
      strongSupport: ['', Validators.required],
      additionalComments: ['', Validators.required]
    });
  }

  updateRelationship(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    let selectedRelationships: string[] = this.referenceForm.get('relationship')?.value || [];

    if (checkbox.checked) {
      if (!selectedRelationships.includes(checkbox.value)) {
        selectedRelationships.push(checkbox.value);
      }
    } else {
      selectedRelationships = selectedRelationships.filter((item: string) => item !== checkbox.value);
    }

    this.referenceForm.patchValue({ relationship: selectedRelationships });
  }

// app.component.ts

ngOnInit() {
  this.isLoading = true;
  this.route.queryParams.subscribe(params => {
  
    if (params['companyID']) {
      this.companyID = params['companyID'];
      console.log("📌 Extracted companyID from URL:", this.companyID);
    
    } else {
      console.warn("⚠️ No companyID found in the URL.");
      this.companyID = null;
    }

    if (params['consid']) {
      this.consid = params['consid'];
      console.log("📌 Extracted testId (consid) from URL:", this.consid);
    } else {
      console.warn("⚠️ No testId (consid) found in the URL.");
      this.consid = null;
    }

    if (params['contid']) {
      this.contid = params['contid'];
      console.log("📌 Extracted additionalId (contid) from URL:", this.contid);
    } else {
      console.warn("⚠️ No additionalId (contid) found in the URL.");
      this.contid = null;
    }

    if (this.consid) {
      this.fetchAdditionalData(this.consid.toString());
    }
    if (this.contid) {
      this.fetchData();
    }
  });
}

  


  isSuccess = false;
  isError = false;

  showErrorMessage() {
    this.isError = true;
    this.isSuccess = false;
    setTimeout(() => {
      this.isError = false;
    }, 3000);
  }

  isFormInvalid = false;
  validateFormBeforeSubmit() {
    if (!this.referenceForm.valid) {
      this.isFormInvalid = true;
      setTimeout(() => {
        this.isFormInvalid = false;
      }, 5000); 
    } else {
      this.isFormInvalid = false;
    }
  }

showSuccessMessage() {
  this.isSuccess = true;

  setTimeout(() => {
    this.isSuccess = false;
  }, 3000); 
}




// app.component.ts

fetchRecordData(testId: string, entityName: string, onSuccess: (record: any) => void) {
  console.log(`🔄 Fetching data for ${entityName} with testId: ${testId}`);
  this.apiService.getRecord(testId, entityName).subscribe({
    next: (response) => {
      if (!response.IsError) {
        onSuccess(response.Record);
        console.log(`✅ Data from ${entityName} API:`, response.Record);
      } else {
        console.error(`❌ API Error for ${entityName}:`, response.ErrorMsg);
      }
      this.isLoading = false;
    },
    error: (err) => {
      console.error(`❌ API request failed for ${entityName}:`, err);
      this.isLoading = false;
    }
  });
}

// Usage for fetching Contacts data
fetchData() {
  if (!this.contid) {
    console.error("❌ Cannot fetch data. testId is missing!");
    return;
  }
  
  this.isLoading = true;
  this.fetchRecordData(this.contid, 'Contacts', (record) => {
    this.referenceForm.patchValue({
      referenceName: record.DisplayName,
      phone: record.MobilePhone,
      email: record.EMail1
    });
  });
}

// Usage for fetching Consultants data
fetchAdditionalData(testId: string) {
  this.isLoading = true;
  this.fetchRecordData(testId, 'Consultants', (record) => {
    this.name = record.DisplayName;
  });
}






  debugFormValidation() {
    console.log("❌ Form validation errors:");
    Object.keys(this.referenceForm.controls).forEach((key) => {
      const control = this.referenceForm.get(key);
      if (control && control.errors) {
        console.log(` ${key}:`, control.errors);
      }
    });
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const control = this.referenceForm.get(fieldName);
    return !!(control && control.invalid && (control.touched || control.dirty || this.isFormInvalid));
  }
  

  async onSubmit() {
    console.log("🚀 Form submission triggered");
  
    if (!this.referenceForm.valid) {
      console.log("❌ Form is invalid");
      this.isFormInvalid = true;
      this.referenceForm.markAllAsTouched()
      return;
    }
  
    console.log("✅ Form is valid, starting PDF generation...");
    const formElement = document.getElementById('formContainer');
  
    if (!formElement) {
      console.error("❌ Form element not found! Ensure `id=formContainer` is set.");
      return;
    }
  
    this.isLoading = true;
    
    // Hide submit button
    const submitButton = document.querySelector('.submit-btn') as HTMLElement;
    if (submitButton) submitButton.style.display = 'none';

    this.validateFormBeforeSubmit(); 
  
    try {
      // Generate PDF using PdfService
      const pdfBytes = await this.pdfService.generatePdf(formElement);
  
      if (!pdfBytes) {
        throw new Error("PDF generation failed.");
      }
  
      const base64String = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));
  
      if (!this.consid) {
        throw new Error("Missing testId! PDF upload skipped.");
      }
  
      // Upload PDF using API service
      this.apiService.uploadPdf(
        this.consid,
        this.contid ?? '',
        `${this.referenceForm.value.referenceName?.trim() || 'reference'}.pdf`,
        base64String
      ).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response && !response.IsError) {
            console.log("✅ PDF uploaded successfully!", response);
            this.showSuccessMessage(); // 🎉 Show success message
          } else {
            console.error("❌ API Error:", response?.ErrorMsg || "Unknown error");
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error("❌ Upload API request failed:", err);
        
        }
      });
  
    } catch (error) {
      this.isLoading = false;
      console.error("❌ Error:", error);
      this.showErrorMessage();
    } finally {
      // Show submit button again
      if (submitButton) submitButton.style.display = 'block';
    }
  }
  

}
