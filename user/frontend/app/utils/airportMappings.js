/**
 * Airport coordinates mapping
 */
export const airportCoordinates = {
  'Indira Gandhi International Airport': { lat: 28.5621, lon: 77.1200 },
  'Chhatrapati Shivaji Maharaj Airport': { lat: 19.0881, lon: 72.8678 },
  'Kempegowda International Airport': { lat: 13.1939, lon: 77.7064 },
  'Rajiv Gandhi International Airport': { lat: 17.3732, lon: 78.4694 },
  'Chennai International Airport': { lat: 12.9899, lon: 80.1693 },
  'Netaji Subhas Chandra Bose International Airport': { lat: 22.6542, lon: 88.4476 },
  'Pune Airport': { lat: 18.5824, lon: 73.9197 },
  'Cochin International Airport': { lat: 10.1524, lon: 76.3905 },
  'Sardar Vallabhbhai Patel International Airport': { lat: 23.0725, lon: 72.6268 },
  'Amausi Airport': { lat: 26.7606, lon: 80.8985 },
  'Dabolim Airport': { lat: 15.3809, lon: 73.8310 },
  'Indore Airport': { lat: 22.7187, lon: 75.8063 },
  'Jaipur International Airport': { lat: 24.9465, lon: 75.8119 },
  'Chandigarh International Airport': { lat: 30.6735, lon: 76.7904 },
  'Visakhapatnam Airport': { lat: 17.6869, lon: 83.2284 },
  'Coimbatore International Airport': { lat: 11.0146, lon: 76.7310 },
  'Varanasi International Airport': { lat: 25.3964, lon: 82.8640 },
  'Patna Airport': { lat: 25.5891, lon: 84.8766 },
  'Ranchi Airport': { lat: 23.3142, lon: 85.3252 },
};

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
 * Creates drop location object with coordinates from departure airport and terminal
 * @param {string} depAirport - Departure airport name
 * @param {string} terminal - Terminal (e.g., "T2")
 * @returns {object} Drop location with address, latitude, longitude
 */
export const createDropLocation = (depAirport, terminal) => {
  if (!depAirport) return null;
  
  const terminalNum = terminal ? terminal.replace(/[^0-9]/g, '') : '';
  const address = terminalNum ? `${depAirport} - Terminal ${terminalNum}` : depAirport;
  
  // Get coordinates for the airport
  const coords = airportCoordinates[depAirport] || { lat: 0, lon: 0 };
  
  return {
    address: address,
    latitude: coords.lat,
    longitude: coords.lon,
    name: depAirport,
    terminal: terminal || 'N/A'
  };
};
