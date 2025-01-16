import { ResidueType } from '@/modules/recycling-reports/dtos/residue-type.enum';
import { Materials } from '@/modules/recycling-reports/types';

// Calculate total residue weights
export const getTotalResidueKgsReported = (materials: Materials) => {
  const totalKg = materials.reduce((sum, material) => {
    // Accumulate weight for each residue type
    Object.values(material).forEach((weightKg) => {
      // Ensure weightKg is a valid number before adding to the sum
      if (typeof weightKg === 'number' && !isNaN(weightKg)) {
        sum += weightKg;
      }
    });
    return sum;
  }, 0);

  // Round the total weight to 2 decimal places
  const roundedTotalKg = parseFloat(totalKg.toFixed(2));

  return { totalKg: roundedTotalKg };
};

// Function to calculate the total of materials from multiple reports
export function calculateTotalMaterials(materials: Materials): {
  [key in ResidueType]?: number;
} {
  // Use the reduce method to iterate over the array of materials and accumulate totals
  return materials.reduce((totals, current) => {
    // Check if the current item is a valid object (a report)
    if (current && typeof current === 'object') {
      // Iterate over each key in the current material object
      for (const material in current) {
        // Ensure the key is a property of the object, not inherited
        if (current.hasOwnProperty(material)) {
          // Cast the material key to the ResidueType enum for type safety
          const residueType = material as ResidueType;

          // Add the amount of this residue type to the totals object
          // If the residue type already exists in the totals object, add the current amount
          // If it doesn't exist, initialize it with the current amount (defaulting to 0 if undefined)
          totals[residueType] = (totals[residueType] || 0) + (current[residueType] || 0);
        }
      }
    }

    // Return the updated totals after processing the current report
    return totals;
  }, {} as { [key in ResidueType]?: number }); // Initializing the totals object with a type for each ResidueType
}
