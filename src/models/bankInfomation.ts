export interface IBankInformation {
  name: string;
  presentationName: string;
  category: BankCategory;
  information: string;
  socialNetworks: string[];
  imageUrl?: string;
  locations: string[];
}

export enum BankCategory {
  CreditUnion = 'creditUnion',
  Agency = 'agency',
  Bank = 'bank',
}
