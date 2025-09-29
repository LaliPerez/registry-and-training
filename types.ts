export interface RegistrationData {
  fullName: string;
  company: string;
  dni: string;
  phone: string;
  email: string;
}

export interface CompletedRegistration extends RegistrationData {
  signatureDataUrl: string;
  registrationDate: string;
}

export interface FormErrors {
  fullName?: string;
  company?: string;
  dni?: string;
  phone?: string;
  email?: string;
}