import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Kyc as KycService } from '../../services/kyc/kyc';
import { AuthService } from '../../services/auth/auth-service';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kyc',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './kyc.html',
  styleUrl: './kyc.css'
})
export class Kyc {

  kycService = inject(KycService)
  authService = inject(AuthService)

  @Output() cancelled = new EventEmitter<void>()
  @Output() kycCompleted = new EventEmitter<boolean>()

  fb = inject(FormBuilder)
  kycForm: FormGroup = this.fb.group({})

  uid: string | null = null
  isLoading = false
  isUploadingPan = false

  ngOnInit(): void {
    this.setFormState()
    this.getUser()


    this.kycForm.get('panNumber')?.valueChanges.subscribe(value => {
      if (value && value !== value.toUpperCase()) {
        this.kycForm.get('panNumber')?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });

  }

  getUser() {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        if (res) {
          this.uid = res.uid
        }
      },
      error: (e) => {
        console.log('error while finding user', e)
      }
    })
  }

  setFormState() {
    this.kycForm = this.fb.group({
      fullName: ['', Validators.required],
      mobile: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.email]],
      address: ['', Validators.required],
      bankAccount: ['', Validators.required],
      ifsc: ['', [Validators.pattern(/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/), Validators.required]],
      beneficiaryName: ['', Validators.required],
      panNumber: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/), Validators.required]],
      panCard: ['', Validators.required],
      aadhaarNumber: ['', Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}$/)]
    });
  }


  async onFileChange(event: Event) {
    this.isUploadingPan = true
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const storage = getStorage();
      const uniqueName = `${Date.now()}_${file.name}`;
      const fileRef = ref(storage, `PAN/${this.uid}/${uniqueName}`);
      try {
        await uploadBytes(fileRef, file);
        const downloadPan = await getDownloadURL(fileRef);
        this.kycForm.patchValue({ panCard: downloadPan });
        console.log('pan added succesfully')
        this.isUploadingPan = false
      } catch (e) {
        console.error('Upload failed:', e);
        this.isUploadingPan = false
      }
    }
  }


  submitKyc() {
    this.isLoading = true
    const panValue = this.kycForm.get('panNumber')?.value;
    if (panValue) {
      this.kycForm.patchValue({ panNumber: panValue.toUpperCase() });
    }

    if (this.uid) {
      const formData = this.kycForm.getRawValue();

      const contactData = {
        name: formData.fullName,
        email: formData.email,
        contact: formData.mobile,
        type: "employee",
        reference_id: this.uid
      };

      this.kycService.addKyc(this.uid, formData).subscribe({
        next: () => {
          this.kycService.createContact(contactData).subscribe({
            next: (res) => {
              console.log('contact added successfully', res);

              const contactId = res.id;

              const fundAccountData = {
                contact_id: contactId,
                account_type: 'bank_account',
                bank_account: {
                  name: formData.beneficiaryName,
                  ifsc: formData.ifsc,
                  account_number: formData.bankAccount
                }
              };

              this.kycService.createFundAccount(fundAccountData).subscribe({
                next: (res) => {
                  console.log('fund Account created successfully', res);

                  const updateStatus = { ...formData, kycCompleted: true }

                  this.kycService.updateKycStatus(this.uid!, updateStatus).subscribe({
                    next: (res) => {
                      this.isLoading = false
                      this.cancelled.emit();
                      this.kycCompleted.emit(true);
                      console.log('kyc update added succesfully')
                    },
                    error: (e) => {
                      console.log('kyc update failed miserably, you will have to try again for this mate')
                    }
                  })

                },
                error: (e) => {
                  console.log('fund Account error', e);
                  alert('Error creating fund account, Please re-check your details')
                  this.kycCompleted.emit(false);
                  this.isLoading = false
                }
              });

            },
            error: (e) => {
              console.error('An error occurred while saving contact', e);
            }
          });
        },
        error: (e) => {
          alert('KYC failed!! Try again');
          console.log('error while submitting kyc', e);
        }
      });
    } else {
      this.kycForm.markAllAsTouched();
    }
  }

}
