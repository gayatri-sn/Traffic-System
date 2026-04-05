// utils/mockData.js — Demo data when backend is not connected

export const mockStats = {
  totalViolations: 4821,
  totalVehicles: 12430,
  pendingFines: 892,
  resolvedCases: 3929,
  dailyAverage: 42,
  revenueCollected: 2480000,
};

export const mockDailyViolations = [
  { day: 'Mon', violations: 48, fines: 38400 },
  { day: 'Tue', violations: 62, fines: 49600 },
  { day: 'Wed', violations: 55, fines: 44000 },
  { day: 'Thu', violations: 71, fines: 56800 },
  { day: 'Fri', violations: 89, fines: 71200 },
  { day: 'Sat', violations: 43, fines: 34400 },
  { day: 'Sun', violations: 31, fines: 24800 },
];

export const mockMonthlyViolations = [
  { month: 'Jan', violations: 420 },
  { month: 'Feb', violations: 380 },
  { month: 'Mar', violations: 510 },
  { month: 'Apr', violations: 490 },
  { month: 'May', violations: 620 },
  { month: 'Jun', violations: 580 },
  { month: 'Jul', violations: 540 },
  { month: 'Aug', violations: 610 },
  { month: 'Sep', violations: 470 },
  { month: 'Oct', violations: 530 },
  { month: 'Nov', violations: 460 },
  { month: 'Dec', violations: 400 },
];

export const mockViolationTypes = [
  { type: 'Speeding', count: 1820 },
  { type: 'Red Light', count: 1240 },
  { type: 'No Seatbelt', count: 680 },
  { type: 'Wrong Lane', count: 420 },
  { type: 'Mobile Use', count: 380 },
  { type: 'Drunk Driving', count: 281 },
];

export const mockCongestion = [
  { time: '6AM', level: 35 },
  { time: '8AM', level: 85 },
  { time: '10AM', level: 60 },
  { time: '12PM', level: 70 },
  { time: '2PM', level: 55 },
  { time: '4PM', level: 75 },
  { time: '6PM', level: 92 },
  { time: '8PM', level: 50 },
  { time: '10PM', level: 25 },
];

export const mockAccidentZones = [
  { area: 'MG Road Junction', incidents: 42, severity: 'High' },
  { area: 'Highway 48 Exit', incidents: 38, severity: 'High' },
  { area: 'Central Market', incidents: 31, severity: 'Medium' },
  { area: 'Airport Road', incidents: 28, severity: 'Medium' },
  { area: 'Ring Road Overpass', incidents: 22, severity: 'Low' },
];

export const mockViolations = [
  { id: 'V001', vehicle: 'MH12AB1234', type: 'Speeding', location: 'MG Road', date: '2024-03-01 08:32', fine: 800, status: 'Pending', officer: 'Raj Kumar' },
  { id: 'V002', vehicle: 'KA05CD5678', type: 'Red Light', location: 'Brigade Road', date: '2024-03-01 09:15', fine: 1000, status: 'Paid', officer: 'Priya Sharma' },
  { id: 'V003', vehicle: 'DL3EF9012', type: 'No Seatbelt', location: 'NH-8', date: '2024-03-01 10:44', fine: 500, status: 'Pending', officer: 'Amit Singh' },
  { id: 'V004', vehicle: 'TN09GH3456', type: 'Mobile Use', location: 'Anna Salai', date: '2024-03-02 11:20', fine: 1500, status: 'Paid', officer: 'Raj Kumar' },
  { id: 'V005', vehicle: 'MH04IJ7890', type: 'Wrong Lane', location: 'Marine Drive', date: '2024-03-02 14:05', fine: 500, status: 'Contested', officer: 'Priya Sharma' },
  { id: 'V006', vehicle: 'GJ01KL2345', type: 'Drunk Driving', location: 'SG Highway', date: '2024-03-03 23:10', fine: 10000, status: 'Pending', officer: 'Amit Singh' },
];

export const mockCitizenData = {
  'MH12AB1234': {
    owner: 'Suresh Patel',
    vehicleType: 'Car',
    model: 'Honda City',
    violations: [
      { id: 'V001', date: '2024-03-01', type: 'Speeding', location: 'MG Road', fine: 800, status: 'Pending' },
      { id: 'V007', date: '2024-01-15', type: 'No Seatbelt', location: 'Ring Road', fine: 500, status: 'Paid' },
    ]
  },
  'KA05CD5678': {
    owner: 'Meena Reddy',
    vehicleType: 'Motorcycle',
    model: 'Bajaj Pulsar',
    violations: [
      { id: 'V002', date: '2024-03-01', type: 'Red Light', location: 'Brigade Road', fine: 1000, status: 'Paid' },
    ]
  }
};
