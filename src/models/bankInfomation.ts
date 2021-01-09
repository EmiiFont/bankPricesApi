export interface IBankInformation{
    name: string;
    presentationName: string;
    category: BankCategory;
    information: string;
    socialNetworks: string[];
    locations: string[];
}

export type BankCategory = "creditUnion" | "agency" | "bank";
