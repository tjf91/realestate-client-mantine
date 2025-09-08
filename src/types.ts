export type RealEstateType =
  | "house"
  | "department"
  | "land"
  | "commercial_ground";

export interface RowData {
  id: number;
  name: string;
  type: string; // alias of real_state_type from backend index()
  city: string;
  country: string;
}

export interface RealEstate {
  id: number;
  name: string;
  real_state_type: RealEstateType;
  street: string;
  external_number: string;
  internal_number?: string | null;
  neighborhood: string;
  city: string;
  country: string;
  rooms: number;
  bathrooms: number;
  comments?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type Tab = "list" | "create" | "edit";
