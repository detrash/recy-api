import { ResidueType } from './dtos/residue-type.enum';

export interface Metadata {
  attributes: { trait_type: string; value: string | undefined }[];
  description: string;
  name: string;
  image?: string | Buffer;
  [key: string]: unknown;
}

// Material type where each ResidueType has a weightKg property
export interface Material {
  [ResidueType.METAL]?: number;
  [ResidueType.PLASTIC]?: number;
  [ResidueType.PAPER]?: number;
  [ResidueType.GLASS]?: number;
  // The following index signature allows the object to have dynamic keys
  // that are not explicitly defined in the interface. This is useful if new
  // residue types (e.g., "ORGANIC") are added in the future, without needing
  // to modify the interface. It also allows for missing values by using
  // `undefined` (e.g., a material type may not be present in a report).
  [key: string]: number | undefined;
}

// Materials type as an array of Material objects
export type Materials = Material[];
