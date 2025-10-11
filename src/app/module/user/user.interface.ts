export type createPatientInput = {
  name: string;
  email: string;
  password: string;
  contactNumber?: string;
  profilePhoto?: string;
  address?: string;
};

export type createAdminInput = {
  password: string;
  admin: {
    name: string;
    email: string;
    contactNumber: string;
    profilePhoto?: string;
  };
};

export type createDoctorInput = {
  password: string;
  doctor: {
    name: string;
    email: string;
    contactNumber: string;
    address?: string;
    profilePhoto?: string;
    registrationNumber: string;
    experience?: number;
    gender: "MALE" | "FEMALE";
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
  };
};

export enum Role {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  ADMIN = "ADMIN",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
