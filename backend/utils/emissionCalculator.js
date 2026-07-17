// simple emission factors
const EMISSION_FACTORS = {
  transport: {
    car: 0.12, // kg CO2/km
    bus: 0.05, // kg CO2/km
    'public transport': 0.05,
    bike: 0,
    walking: 0,
    none: 0
  },
  food: {
    'non-veg': 3.3, // keeping existing roughly
    veg: 1.0, // kg CO2 per veg serving/meal
    dairy: 2.0,
    none: 0
  },
  energy: {
    electricity: 0.82, // kg CO2/kWh
    acUsage: 1.5, // kg CO2/hour
  },
  waste: {
    plasticUsage: 0.05, // kg CO2 per item
  }
};

export const calculateEmissions = (data) => {
  let transportEmissions = 0;
  if (data.transport && data.transport.mode) {
    const factor = EMISSION_FACTORS.transport[data.transport.mode] || 0;
    transportEmissions = factor * (data.transport.distance || 0);
  }

  let foodEmissions = 0;
  if (data.food && data.food.diet) {
    // We will assume 1 serving per day if servings is not explicitly tracked, or multiply by servings if added
    const servings = data.food.servings || 1; 
    foodEmissions = (EMISSION_FACTORS.food[data.food.diet] || 0) * servings;
  }

  let energyEmissions = 0;
  if (data.energy) {
    energyEmissions += (data.energy.electricity || 0) * EMISSION_FACTORS.energy.electricity;
    energyEmissions += (data.energy.acUsage || 0) * EMISSION_FACTORS.energy.acUsage;
  }
  
  let wasteEmissions = 0;
  if (data.waste) {
     wasteEmissions = (data.waste.plasticUsage || 0) * EMISSION_FACTORS.waste.plasticUsage;
     if (data.waste.recycled) {
         wasteEmissions *= 0.5; // Reduce by half if recycled
     }
  }

  const total = transportEmissions + foodEmissions + energyEmissions + wasteEmissions;

  return {
    total: parseFloat(total.toFixed(2)),
    transport: parseFloat(transportEmissions.toFixed(2)),
    food: parseFloat(foodEmissions.toFixed(2)),
    energy: parseFloat((energyEmissions + wasteEmissions).toFixed(2))
  };
};
