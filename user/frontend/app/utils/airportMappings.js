/**
 * Helper function to get full airport name from city name
 * Maps Indian cities to their airport names
 */
export const getAirportFromCity = (city) => {
  const airportMap = {
    // Major Indian Airports
    'Delhi': 'Indira Gandhi International Airport',
    'Mumbai': 'Chhatrapati Shivaji Maharaj Airport',
    'Bangalore': 'Kempegowda International Airport',
    'Hyderabad': 'Rajiv Gandhi International Airport',
    'Chennai': 'Chennai International Airport',
    'Kolkata': 'Netaji Subhas Chandra Bose International Airport',
    'Pune': 'Pune Airport',
    'Kochi': 'Cochin International Airport',
    'Ahmedabad': 'Sardar Vallabhbhai Patel International Airport',
    'Lucknow': 'Amausi Airport',
    'Goa': 'Dabolim Airport',
    'Indore': 'Indore Airport',
    'Jaipur': 'Jaipur International Airport',
    'Chandigarh': 'Chandigarh International Airport',
    'Visakhapatnam': 'Visakhapatnam Airport',
    'Coimbatore': 'Coimbatore International Airport',
    'Varanasi': 'Varanasi International Airport',
    'Patna': 'Patna Airport',
    'Ranchi': 'Ranchi Airport',
  };

  return airportMap[city] || `${city} Airport`;
};

/**
 * Creates drop location string from departure city/airport and terminal
 * @param {string} depAirport - Departure airport name
 * @param {string} terminal - Terminal (e.g., "T2")
 * @returns {string} Formatted drop location
 */
export const createDropLocation = (depAirport, terminal) => {
  if (!depAirport || !terminal) return 'Airport Terminal';
  
  // Extract just the terminal number if it has the T prefix
  const terminalNum = terminal.replace(/[^0-9]/g, '');
  
  return `${depAirport} - Terminal ${terminalNum}`;
};
