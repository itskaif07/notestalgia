export interface kycModel {
    id?:string,
    fullName: string;
    mobile?: string;         // Optional
    email?: string;          // Optional
    address: string;
    bankAccount: string;
    ifsc: string;
    beneficiaryName: string;
    panNumber: string;
    panCard: File | null;    // File or Blob depending on file input
    aadhaarNumber?: string;
}