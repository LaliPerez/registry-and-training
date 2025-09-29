// Fix: Replaced placeholder content with the application's type definitions.
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
