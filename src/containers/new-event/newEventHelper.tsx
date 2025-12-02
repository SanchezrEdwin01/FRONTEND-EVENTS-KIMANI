export const eventTypeOptions = [
  { value: 'KimaniEvent', label: 'Kimani event' },
  { value: 'MembersEvent', label: 'Members event' },
  { value: 'Other', label: 'Other event' }
];

export const planOptions = [
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' }
];

export const timezoneOptions = [
  { value: 'Pacific/Midway', label: 'Midway Island, Samoa (UTC-11:00)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii (UTC-10:00)' },
  { value: 'America/Anchorage', label: 'Alaska (UTC-09:00)' },
  {
    value: 'America/Los_Angeles',
    label: 'Pacific Time (US & Canada) (UTC-08:00)'
  },
  { value: 'America/Phoenix', label: 'Arizona (UTC-07:00)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada) (UTC-07:00)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada) (UTC-06:00)' },
  { value: 'America/Mexico_City', label: 'Mexico City (UTC-06:00)' },
  { value: 'America/Regina', label: 'Saskatchewan (UTC-06:00)' },
  {
    value: 'America/New_York',
    label: 'Eastern Time (US & Canada) (UTC-05:00)'
  },
  { value: 'America/Toronto', label: 'Toronto (UTC-05:00)' },
  { value: 'America/Bogota', label: 'Bogota (UTC-05:00)' },
  { value: 'America/Caracas', label: 'Caracas (UTC-04:00)' },
  { value: 'America/Santiago', label: 'Santiago (UTC-04:00)' },
  { value: 'America/St_Johns', label: 'Newfoundland (UTC-03:30)' },
  { value: 'America/Sao_Paulo', label: 'Brasilia (UTC-03:00)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (UTC-03:00)' },
  { value: 'America/Montevideo', label: 'Montevideo (UTC-03:00)' },
  { value: 'America/Godthab', label: 'Greenland (UTC-03:00)' },
  { value: 'Atlantic/Cape_Verde', label: 'Cape Verde Is. (UTC-01:00)' },
  { value: 'Atlantic/Azores', label: 'Azores (UTC-01:00)' },
  { value: 'Europe/London', label: 'London, Dublin (UTC+00:00)' },
  { value: 'Europe/Lisbon', label: 'Lisbon (UTC+00:00)' },
  { value: 'Europe/Dublin', label: 'Dublin (UTC+00:00)' },
  { value: 'Africa/Casablanca', label: 'Casablanca (UTC+00:00)' },
  { value: 'UTC', label: 'UTC (UTC+00:00)' },
  { value: 'Europe/Paris', label: 'Paris (UTC+01:00)' },
  { value: 'Europe/Berlin', label: 'Berlin (UTC+01:00)' },
  { value: 'Europe/Rome', label: 'Rome (UTC+01:00)' },
  { value: 'Europe/Madrid', label: 'Madrid (UTC+01:00)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (UTC+01:00)' },
  { value: 'Europe/Brussels', label: 'Brussels (UTC+01:00)' },
  { value: 'Europe/Vienna', label: 'Vienna (UTC+01:00)' },
  { value: 'Europe/Zurich', label: 'Zurich (UTC+01:00)' },
  { value: 'Europe/Stockholm', label: 'Stockholm (UTC+01:00)' },
  { value: 'Europe/Oslo', label: 'Oslo (UTC+01:00)' },
  { value: 'Europe/Copenhagen', label: 'Copenhagen (UTC+01:00)' },
  { value: 'Europe/Helsinki', label: 'Helsinki (UTC+02:00)' },
  { value: 'Europe/Athens', label: 'Athens (UTC+02:00)' },
  { value: 'Europe/Warsaw', label: 'Warsaw (UTC+01:00)' },
  { value: 'Europe/Kiev', label: 'Kiev (UTC+02:00)' },
  { value: 'Europe/Istanbul', label: 'Istanbul (UTC+03:00)' },
  { value: 'Africa/Cairo', label: 'Cairo (UTC+02:00)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (UTC+02:00)' },
  { value: 'Asia/Jerusalem', label: 'Jerusalem (UTC+02:00)' },
  { value: 'Europe/Moscow', label: 'Moscow (UTC+03:00)' },
  { value: 'Asia/Baghdad', label: 'Baghdad (UTC+03:00)' },
  { value: 'Asia/Riyadh', label: 'Riyadh (UTC+03:00)' },
  { value: 'Africa/Nairobi', label: 'Nairobi (UTC+03:00)' },
  { value: 'Asia/Tehran', label: 'Tehran (UTC+03:30)' },
  { value: 'Asia/Dubai', label: 'Dubai (UTC+04:00)' },
  { value: 'Asia/Baku', label: 'Baku (UTC+04:00)' },
  { value: 'Asia/Kabul', label: 'Kabul (UTC+04:30)' },
  { value: 'Asia/Karachi', label: 'Karachi (UTC+05:00)' },
  { value: 'Asia/Tashkent', label: 'Tashkent (UTC+05:00)' },
  { value: 'Asia/Kolkata', label: 'Kolkata, Mumbai, New Delhi (UTC+05:30)' },
  { value: 'Asia/Kathmandu', label: 'Kathmandu (UTC+05:45)' },
  { value: 'Asia/Dhaka', label: 'Dhaka (UTC+06:00)' },
  { value: 'Asia/Almaty', label: 'Almaty (UTC+06:00)' },
  { value: 'Asia/Yangon', label: 'Yangon (UTC+06:30)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (UTC+07:00)' },
  { value: 'Asia/Jakarta', label: 'Jakarta (UTC+07:00)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (UTC+08:00)' },
  { value: 'Asia/Singapore', label: 'Singapore (UTC+08:00)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (UTC+08:00)' },
  { value: 'Asia/Taipei', label: 'Taipei (UTC+08:00)' },
  { value: 'Asia/Seoul', label: 'Seoul (UTC+09:00)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+09:00)' },
  { value: 'Australia/Darwin', label: 'Darwin (UTC+09:30)' },
  { value: 'Australia/Adelaide', label: 'Adelaide (UTC+09:30)' },
  { value: 'Australia/Sydney', label: 'Sydney (UTC+10:00)' },
  { value: 'Australia/Brisbane', label: 'Brisbane (UTC+10:00)' },
  { value: 'Australia/Hobart', label: 'Hobart (UTC+10:00)' },
  { value: 'Asia/Vladivostok', label: 'Vladivostok (UTC+10:00)' },
  { value: 'Pacific/Guadalcanal', label: 'Solomon Is. (UTC+11:00)' },
  { value: 'Pacific/Auckland', label: 'Auckland (UTC+12:00)' },
  { value: 'Pacific/Fiji', label: 'Fiji (UTC+12:00)' },
  { value: 'Pacific/Tongatapu', label: "Nuku'alofa (UTC+13:00)" }
];

export const hostOptions = [
  { value: 'Jhon Doe', label: 'Jhon Doe' },
  { value: 'Jane Doe', label: 'Jane Doe' },
  { value: 'Roger Smith', label: 'Roger Smith' }
];

export const sponsorOptions = [
  { value: 'Jhon Doe', label: 'Jhon Doe' },
  { value: 'Jane Doe', label: 'Jane Doe' },
  { value: 'Roger Smith', label: 'Roger Smith' }
];

export const cityOptions = [
  { value: 'Akron, OH', label: 'Akron, OH' },
  { value: 'Albuquerque, NM', label: 'Albuquerque, NM' },
  { value: 'Alexandria, VA', label: 'Alexandria, VA' },
  { value: 'Amarillo, TX', label: 'Amarillo, TX' },
  { value: 'Anaheim, CA', label: 'Anaheim, CA' },
  { value: 'Anchorage, AK', label: 'Anchorage, AK' },
  { value: 'Ann Arbor, MI', label: 'Ann Arbor, MI' },
  { value: 'Atlanta, GA', label: 'Atlanta, GA' },
  { value: 'Augusta, GA', label: 'Augusta, GA' },
  { value: 'Aurora, CO', label: 'Aurora, CO' },
  { value: 'Austin, TX', label: 'Austin, TX' },
  { value: 'Bakersfield, CA', label: 'Bakersfield, CA' },
  { value: 'Baltimore, MD', label: 'Baltimore, MD' },
  { value: 'Baton Rouge, LA', label: 'Baton Rouge, LA' },
  { value: 'Bellevue, WA', label: 'Bellevue, WA' },
  { value: 'Berkeley, CA', label: 'Berkeley, CA' },
  { value: 'Birmingham, AL', label: 'Birmingham, AL' },
  { value: 'Boise, ID', label: 'Boise, ID' },
  { value: 'Boston, MA', label: 'Boston, MA' },
  { value: 'Boulder, CO', label: 'Boulder, CO' },
  { value: 'Bridgeport, CT', label: 'Bridgeport, CT' },
  { value: 'Buffalo, NY', label: 'Buffalo, NY' },
  { value: 'Burlington, VT', label: 'Burlington, VT' },
  { value: 'Cambridge, MA', label: 'Cambridge, MA' },
  { value: 'Cape Coral, FL', label: 'Cape Coral, FL' },
  { value: 'Carlsbad, CA', label: 'Carlsbad, CA' },
  { value: 'Carrollton, TX', label: 'Carrollton, TX' },
  { value: 'Cary, NC', label: 'Cary, NC' },
  { value: 'Cedar Rapids, IA', label: 'Cedar Rapids, IA' },
  { value: 'Chandler, AZ', label: 'Chandler, AZ' },
  { value: 'Charleston, SC', label: 'Charleston, SC' },
  { value: 'Charlotte, NC', label: 'Charlotte, NC' },
  { value: 'Chattanooga, TN', label: 'Chattanooga, TN' },
  { value: 'Chesapeake, VA', label: 'Chesapeake, VA' },
  { value: 'Chicago, IL', label: 'Chicago, IL' },
  { value: 'Chula Vista, CA', label: 'Chula Vista, CA' },
  { value: 'Cincinnati, OH', label: 'Cincinnati, OH' },
  { value: 'Clarksville, TN', label: 'Clarksville, TN' },
  { value: 'Cleveland, OH', label: 'Cleveland, OH' },
  { value: 'Colorado Springs, CO', label: 'Colorado Springs, CO' },
  { value: 'Columbia, SC', label: 'Columbia, SC' },
  { value: 'Columbus, OH', label: 'Columbus, OH' },
  { value: 'Concord, CA', label: 'Concord, CA' },
  { value: 'Coral Springs, FL', label: 'Coral Springs, FL' },
  { value: 'Corona, CA', label: 'Corona, CA' },
  { value: 'Corpus Christi, TX', label: 'Corpus Christi, TX' },
  { value: 'Dallas, TX', label: 'Dallas, TX' },
  { value: 'Dayton, OH', label: 'Dayton, OH' },
  { value: 'Denton, TX', label: 'Denton, TX' },
  { value: 'Denver, CO', label: 'Denver, CO' },
  { value: 'Des Moines, IA', label: 'Des Moines, IA' },
  { value: 'Detroit, MI', label: 'Detroit, MI' },
  { value: 'Durham, NC', label: 'Durham, NC' },
  { value: 'El Paso, TX', label: 'El Paso, TX' },
  { value: 'Elizabeth, NJ', label: 'Elizabeth, NJ' },
  { value: 'Elk Grove, CA', label: 'Elk Grove, CA' },
  { value: 'Escondido, CA', label: 'Escondido, CA' },
  { value: 'Eugene, OR', label: 'Eugene, OR' },
  { value: 'Evansville, IN', label: 'Evansville, IN' },
  { value: 'Everett, WA', label: 'Everett, WA' },
  { value: 'Fairfield, CA', label: 'Fairfield, CA' },
  { value: 'Fargo, ND', label: 'Fargo, ND' },
  { value: 'Fayetteville, NC', label: 'Fayetteville, NC' },
  { value: 'Fort Collins, CO', label: 'Fort Collins, CO' },
  { value: 'Fort Lauderdale, FL', label: 'Fort Lauderdale, FL' },
  { value: 'Fort Wayne, IN', label: 'Fort Wayne, IN' },
  { value: 'Fort Worth, TX', label: 'Fort Worth, TX' },
  { value: 'Fremont, CA', label: 'Fremont, CA' },
  { value: 'Fresno, CA', label: 'Fresno, CA' },
  { value: 'Frisco, TX', label: 'Frisco, TX' },
  { value: 'Fullerton, CA', label: 'Fullerton, CA' },
  { value: 'Gainesville, FL', label: 'Gainesville, FL' },
  { value: 'Garden Grove, CA', label: 'Garden Grove, CA' },
  { value: 'Garland, TX', label: 'Garland, TX' },
  { value: 'Gilbert, AZ', label: 'Gilbert, AZ' },
  { value: 'Glendale, AZ', label: 'Glendale, AZ' },
  { value: 'Glendale, CA', label: 'Glendale, CA' },
  { value: 'Grand Prairie, TX', label: 'Grand Prairie, TX' },
  { value: 'Grand Rapids, MI', label: 'Grand Rapids, MI' },
  { value: 'Greensboro, NC', label: 'Greensboro, NC' },
  { value: 'Gresham, OR', label: 'Gresham, OR' },
  { value: 'Hampton, VA', label: 'Hampton, VA' },
  { value: 'Hartford, CT', label: 'Hartford, CT' },
  { value: 'Hayward, CA', label: 'Hayward, CA' },
  { value: 'Henderson, NV', label: 'Henderson, NV' },
  { value: 'Hialeah, FL', label: 'Hialeah, FL' },
  { value: 'High Point, NC', label: 'High Point, NC' },
  { value: 'Hollywood, FL', label: 'Hollywood, FL' },
  { value: 'Honolulu, HI', label: 'Honolulu, HI' },
  { value: 'Houston, TX', label: 'Houston, TX' },
  { value: 'Huntington Beach, CA', label: 'Huntington Beach, CA' },
  { value: 'Huntsville, AL', label: 'Huntsville, AL' },
  { value: 'Independence, MO', label: 'Independence, MO' },
  { value: 'Indianapolis, IN', label: 'Indianapolis, IN' },
  { value: 'Irvine, CA', label: 'Irvine, CA' },
  { value: 'Irving, TX', label: 'Irving, TX' },
  { value: 'Jackson, MS', label: 'Jackson, MS' },
  { value: 'Jacksonville, FL', label: 'Jacksonville, FL' },
  { value: 'Jersey City, NJ', label: 'Jersey City, NJ' },
  { value: 'Joliet, IL', label: 'Joliet, IL' },
  { value: 'Kansas City, MO', label: 'Kansas City, MO' },
  { value: 'Kent, WA', label: 'Kent, WA' },
  { value: 'Killeen, TX', label: 'Killeen, TX' },
  { value: 'Knoxville, TN', label: 'Knoxville, TN' },
  { value: 'Lafayette, LA', label: 'Lafayette, LA' },
  { value: 'Lakewood, CO', label: 'Lakewood, CO' },
  { value: 'Lancaster, CA', label: 'Lancaster, CA' },
  { value: 'Lansing, MI', label: 'Lansing, MI' },
  { value: 'Laredo, TX', label: 'Laredo, TX' },
  { value: 'Las Vegas, NV', label: 'Las Vegas, NV' },
  { value: 'Lexington, KY', label: 'Lexington, KY' },
  { value: 'Lincoln, NE', label: 'Lincoln, NE' },
  { value: 'Little Rock, AR', label: 'Little Rock, AR' },
  { value: 'Long Beach, CA', label: 'Long Beach, CA' },
  { value: 'Los Angeles, CA', label: 'Los Angeles, CA' },
  { value: 'Louisville, KY', label: 'Louisville, KY' },
  { value: 'Lowell, MA', label: 'Lowell, MA' },
  { value: 'Lubbock, TX', label: 'Lubbock, TX' },
  { value: 'Madison, WI', label: 'Madison, WI' },
  { value: 'Manchester, NH', label: 'Manchester, NH' },
  { value: 'McAllen, TX', label: 'McAllen, TX' },
  { value: 'Memphis, TN', label: 'Memphis, TN' },
  { value: 'Mesa, AZ', label: 'Mesa, AZ' },
  { value: 'Mesquite, TX', label: 'Mesquite, TX' },
  { value: 'Miami, FL', label: 'Miami, FL' },
  { value: 'Miami Gardens, FL', label: 'Miami Gardens, FL' },
  { value: 'Midland, TX', label: 'Midland, TX' },
  { value: 'Milwaukee, WI', label: 'Milwaukee, WI' },
  { value: 'Minneapolis, MN', label: 'Minneapolis, MN' },
  { value: 'Miramar, FL', label: 'Miramar, FL' },
  { value: 'Mobile, AL', label: 'Mobile, AL' },
  { value: 'Modesto, CA', label: 'Modesto, CA' },
  { value: 'Montgomery, AL', label: 'Montgomery, AL' },
  { value: 'Moreno Valley, CA', label: 'Moreno Valley, CA' },
  { value: 'Murfreesboro, TN', label: 'Murfreesboro, TN' },
  { value: 'Murrieta, CA', label: 'Murrieta, CA' },
  { value: 'Naperville, IL', label: 'Naperville, IL' },
  { value: 'Nashville, TN', label: 'Nashville, TN' },
  { value: 'New Haven, CT', label: 'New Haven, CT' },
  { value: 'New Orleans, LA', label: 'New Orleans, LA' },
  { value: 'New York, NY', label: 'New York, NY' },
  { value: 'Newark, NJ', label: 'Newark, NJ' },
  { value: 'Newport News, VA', label: 'Newport News, VA' },
  { value: 'Norfolk, VA', label: 'Norfolk, VA' },
  { value: 'Norman, OK', label: 'Norman, OK' },
  { value: 'North Las Vegas, NV', label: 'North Las Vegas, NV' },
  { value: 'Norwalk, CA', label: 'Norwalk, CA' },
  { value: 'Oakland, CA', label: 'Oakland, CA' },
  { value: 'Oceanside, CA', label: 'Oceanside, CA' },
  { value: 'Odessa, TX', label: 'Odessa, TX' },
  { value: 'Oklahoma City, OK', label: 'Oklahoma City, OK' },
  { value: 'Olathe, KS', label: 'Olathe, KS' },
  { value: 'Omaha, NE', label: 'Omaha, NE' },
  { value: 'Ontario, CA', label: 'Ontario, CA' },
  { value: 'Orange, CA', label: 'Orange, CA' },
  { value: 'Orlando, FL', label: 'Orlando, FL' },
  { value: 'Overland Park, KS', label: 'Overland Park, KS' },
  { value: 'Oxnard, CA', label: 'Oxnard, CA' },
  { value: 'Palm Bay, FL', label: 'Palm Bay, FL' },
  { value: 'Palmdale, CA', label: 'Palmdale, CA' },
  { value: 'Pasadena, CA', label: 'Pasadena, CA' },
  { value: 'Pasadena, TX', label: 'Pasadena, TX' },
  { value: 'Paterson, NJ', label: 'Paterson, NJ' },
  { value: 'Pearland, TX', label: 'Pearland, TX' },
  { value: 'Pembroke Pines, FL', label: 'Pembroke Pines, FL' },
  { value: 'Peoria, AZ', label: 'Peoria, AZ' },
  { value: 'Peoria, IL', label: 'Peoria, IL' },
  { value: 'Philadelphia, PA', label: 'Philadelphia, PA' },
  { value: 'Phoenix, AZ', label: 'Phoenix, AZ' },
  { value: 'Pittsburgh, PA', label: 'Pittsburgh, PA' },
  { value: 'Plano, TX', label: 'Plano, TX' },
  { value: 'Pomona, CA', label: 'Pomona, CA' },
  { value: 'Pompano Beach, FL', label: 'Pompano Beach, FL' },
  { value: 'Portland, OR', label: 'Portland, OR' },
  { value: 'Providence, RI', label: 'Providence, RI' },
  { value: 'Provo, UT', label: 'Provo, UT' },
  { value: 'Pueblo, CO', label: 'Pueblo, CO' },
  { value: 'Raleigh, NC', label: 'Raleigh, NC' },
  { value: 'Rancho Cucamonga, CA', label: 'Rancho Cucamonga, CA' },
  { value: 'Reno, NV', label: 'Reno, NV' },
  { value: 'Renton, WA', label: 'Renton, WA' },
  { value: 'Richmond, VA', label: 'Richmond, VA' },
  { value: 'Riverside, CA', label: 'Riverside, CA' },
  { value: 'Rochester, NY', label: 'Rochester, NY' },
  { value: 'Rockford, IL', label: 'Rockford, IL' },
  { value: 'Roseville, CA', label: 'Roseville, CA' },
  { value: 'Round Rock, TX', label: 'Round Rock, TX' },
  { value: 'Sacramento, CA', label: 'Sacramento, CA' },
  { value: 'Salem, OR', label: 'Salem, OR' },
  { value: 'Salinas, CA', label: 'Salinas, CA' },
  { value: 'Salt Lake City, UT', label: 'Salt Lake City, UT' },
  { value: 'San Antonio, TX', label: 'San Antonio, TX' },
  { value: 'San Bernardino, CA', label: 'San Bernardino, CA' },
  { value: 'San Diego, CA', label: 'San Diego, CA' },
  { value: 'San Francisco, CA', label: 'San Francisco, CA' },
  { value: 'San Jose, CA', label: 'San Jose, CA' },
  { value: 'San Mateo, CA', label: 'San Mateo, CA' },
  { value: 'Santa Ana, CA', label: 'Santa Ana, CA' },
  { value: 'Santa Clara, CA', label: 'Santa Clara, CA' },
  { value: 'Santa Clarita, CA', label: 'Santa Clarita, CA' },
  { value: 'Santa Rosa, CA', label: 'Santa Rosa, CA' },
  { value: 'Savannah, GA', label: 'Savannah, GA' },
  { value: 'Scottsdale, AZ', label: 'Scottsdale, AZ' },
  { value: 'Seattle, WA', label: 'Seattle, WA' },
  { value: 'Shreveport, LA', label: 'Shreveport, LA' },
  { value: 'Simi Valley, CA', label: 'Simi Valley, CA' },
  { value: 'Sioux Falls, SD', label: 'Sioux Falls, SD' },
  { value: 'South Bend, IN', label: 'South Bend, IN' },
  { value: 'Spokane, WA', label: 'Spokane, WA' },
  { value: 'Springfield, IL', label: 'Springfield, IL' },
  { value: 'Springfield, MO', label: 'Springfield, MO' },
  { value: 'St. Louis, MO', label: 'St. Louis, MO' },
  { value: 'St. Paul, MN', label: 'St. Paul, MN' },
  { value: 'St. Petersburg, FL', label: 'St. Petersburg, FL' },
  { value: 'Stamford, CT', label: 'Stamford, CT' },
  { value: 'Sterling Heights, MI', label: 'Sterling Heights, MI' },
  { value: 'Stockton, CA', label: 'Stockton, CA' },
  { value: 'Sunnyvale, CA', label: 'Sunnyvale, CA' },
  { value: 'Surprise, AZ', label: 'Surprise, AZ' },
  { value: 'Syracuse, NY', label: 'Syracuse, NY' },
  { value: 'Tacoma, WA', label: 'Tacoma, WA' },
  { value: 'Tallahassee, FL', label: 'Tallahassee, FL' },
  { value: 'Tampa, FL', label: 'Tampa, FL' },
  { value: 'Temecula, CA', label: 'Temecula, CA' },
  { value: 'Tempe, AZ', label: 'Tempe, AZ' },
  { value: 'Thornton, CO', label: 'Thornton, CO' },
  { value: 'Thousand Oaks, CA', label: 'Thousand Oaks, CA' },
  { value: 'Toledo, OH', label: 'Toledo, OH' },
  { value: 'Topeka, KS', label: 'Topeka, KS' },
  { value: 'Torrance, CA', label: 'Torrance, CA' },
  { value: 'Tucson, AZ', label: 'Tucson, AZ' },
  { value: 'Tulsa, OK', label: 'Tulsa, OK' },
  { value: 'Tyler, TX', label: 'Tyler, TX' },
  { value: 'Vallejo, CA', label: 'Vallejo, CA' },
  { value: 'Vancouver, WA', label: 'Vancouver, WA' },
  { value: 'Ventura, CA', label: 'Ventura, CA' },
  { value: 'Victorville, CA', label: 'Victorville, CA' },
  { value: 'Virginia Beach, VA', label: 'Virginia Beach, VA' },
  { value: 'Visalia, CA', label: 'Visalia, CA' },
  { value: 'Waco, TX', label: 'Waco, TX' },
  { value: 'Warren, MI', label: 'Warren, MI' },
  { value: 'Washington, DC', label: 'Washington, DC' },
  { value: 'Waterbury, CT', label: 'Waterbury, CT' },
  { value: 'West Covina, CA', label: 'West Covina, CA' },
  { value: 'West Jordan, UT', label: 'West Jordan, UT' },
  { value: 'West Palm Beach, FL', label: 'West Palm Beach, FL' },
  { value: 'West Valley City, UT', label: 'West Valley City, UT' },
  { value: 'Westminster, CO', label: 'Westminster, CO' },
  { value: 'Wichita, KS', label: 'Wichita, KS' },
  { value: 'Wichita Falls, TX', label: 'Wichita Falls, TX' },
  { value: 'Wilmington, NC', label: 'Wilmington, NC' },
  { value: 'Winston-Salem, NC', label: 'Winston-Salem, NC' },
  { value: 'Worcester, MA', label: 'Worcester, MA' },
  { value: 'Yonkers, NY', label: 'Yonkers, NY' }
];

export const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'JPY', label: 'JPY' },
  { value: 'AUD', label: 'AUD' },
  { value: 'CAD', label: 'CAD' },
  { value: 'CHF', label: 'CHF' },
  { value: 'CNY', label: 'CNY' },
  { value: 'INR', label: 'INR' }
];

export const countryOptions = [
  {
    country: 'Afghanistan',
    cities: [{ city: 'Kabul', timezone: 'UTC+04:30' }]
  },
  { country: 'Albania', cities: [{ city: 'Tirana', timezone: 'UTC+01:00' }] },
  { country: 'Algeria', cities: [{ city: 'Algiers', timezone: 'UTC+01:00' }] },
  {
    country: 'Andorra',
    cities: [{ city: 'Andorra la Vella', timezone: 'UTC+01:00' }]
  },
  { country: 'Angola', cities: [{ city: 'Luanda', timezone: 'UTC+01:00' }] },
  {
    country: 'Antigua and Barbuda',
    cities: [{ city: "Saint John's", timezone: 'UTC-04:00' }]
  },
  {
    country: 'Argentina',
    cities: [{ city: 'Buenos Aires', timezone: 'UTC-03:00' }]
  },
  { country: 'Armenia', cities: [{ city: 'Yerevan', timezone: 'UTC+04:00' }] },
  {
    country: 'Australia',
    cities: [
      { city: 'Sydney', timezone: 'UTC+10:00' },
      { city: 'Melbourne', timezone: 'UTC+10:00' },
      { city: 'Brisbane', timezone: 'UTC+10:00' }
    ]
  },
  { country: 'Austria', cities: [{ city: 'Vienna', timezone: 'UTC+01:00' }] },
  { country: 'Azerbaijan', cities: [{ city: 'Baku', timezone: 'UTC+04:00' }] },
  { country: 'Bahamas', cities: [{ city: 'Nassau', timezone: 'UTC-05:00' }] },
  { country: 'Bahrain', cities: [{ city: 'Manama', timezone: 'UTC+03:00' }] },
  { country: 'Bangladesh', cities: [{ city: 'Dhaka', timezone: 'UTC+06:00' }] },
  {
    country: 'Barbados',
    cities: [{ city: 'Bridgetown', timezone: 'UTC-04:00' }]
  },
  { country: 'Belarus', cities: [{ city: 'Minsk', timezone: 'UTC+03:00' }] },
  { country: 'Belgium', cities: [{ city: 'Brussels', timezone: 'UTC+01:00' }] },
  { country: 'Belize', cities: [{ city: 'Belmopan', timezone: 'UTC-06:00' }] },
  { country: 'Benin', cities: [{ city: 'Porto-Novo', timezone: 'UTC+01:00' }] },
  { country: 'Bhutan', cities: [{ city: 'Thimphu', timezone: 'UTC+06:00' }] },
  { country: 'Bolivia', cities: [{ city: 'Sucre', timezone: 'UTC-04:00' }] },
  {
    country: 'Bosnia and Herzegovina',
    cities: [{ city: 'Sarajevo', timezone: 'UTC+01:00' }]
  },
  {
    country: 'Botswana',
    cities: [{ city: 'Gaborone', timezone: 'UTC+02:00' }]
  },
  {
    country: 'Brazil',
    cities: [
      { city: 'Brasília', timezone: 'UTC-03:00' },
      { city: 'São Paulo', timezone: 'UTC-03:00' },
      { city: 'Rio de Janeiro', timezone: 'UTC-03:00' }
    ]
  },
  {
    country: 'Brunei',
    cities: [{ city: 'Bandar Seri Begawan', timezone: 'UTC+08:00' }]
  },
  { country: 'Bulgaria', cities: [{ city: 'Sofia', timezone: 'UTC+02:00' }] },
  {
    country: 'Burkina Faso',
    cities: [{ city: 'Ouagadougou', timezone: 'UTC+00:00' }]
  },
  {
    country: 'Burundi',
    cities: [{ city: 'Bujumbura', timezone: 'UTC+02:00' }]
  },
  { country: 'Cabo Verde', cities: [{ city: 'Praia', timezone: 'UTC-01:00' }] },
  {
    country: 'Cambodia',
    cities: [{ city: 'Phnom Penh', timezone: 'UTC+07:00' }]
  },
  { country: 'Cameroon', cities: [{ city: 'Yaoundé', timezone: 'UTC+01:00' }] },
  {
    country: 'Canada',
    cities: [
      { city: 'Ottawa', timezone: 'UTC-05:00' },
      { city: 'Toronto', timezone: 'UTC-05:00' },
      { city: 'Vancouver', timezone: 'UTC-08:00' }
    ]
  },
  {
    country: 'Central African Republic',
    cities: [{ city: 'Bangui', timezone: 'UTC+01:00' }]
  },
  { country: 'Chad', cities: [{ city: "N'Djamena", timezone: 'UTC+01:00' }] },
  { country: 'Chile', cities: [{ city: 'Santiago', timezone: 'UTC-04:00' }] },
  {
    country: 'China',
    cities: [
      { city: 'Beijing', timezone: 'UTC+08:00' },
      { city: 'Shanghai', timezone: 'UTC+08:00' },
      { city: 'Hong Kong', timezone: 'UTC+08:00' }
    ]
  },
  { country: 'Colombia', cities: [{ city: 'Bogotá', timezone: 'UTC-05:00' }] },
  { country: 'Comoros', cities: [{ city: 'Moroni', timezone: 'UTC+03:00' }] },
  {
    country: 'Congo (Congo-Brazzaville)',
    cities: [{ city: 'Brazzaville', timezone: 'UTC+01:00' }]
  },
  {
    country: 'Congo (Democratic Republic of the)',
    cities: [{ city: 'Kinshasa', timezone: 'UTC+01:00' }]
  },
  {
    country: 'Costa Rica',
    cities: [{ city: 'San José', timezone: 'UTC-06:00' }]
  },
  { country: 'Croatia', cities: [{ city: 'Zagreb', timezone: 'UTC+01:00' }] },
  { country: 'Cuba', cities: [{ city: 'Havana', timezone: 'UTC-05:00' }] },
  { country: 'Cyprus', cities: [{ city: 'Nicosia', timezone: 'UTC+02:00' }] },
  {
    country: 'Czech Republic',
    cities: [{ city: 'Prague', timezone: 'UTC+01:00' }]
  },
  {
    country: 'Denmark',
    cities: [{ city: 'Copenhagen', timezone: 'UTC+01:00' }]
  },
  {
    country: 'Djibouti',
    cities: [{ city: 'Djibouti', timezone: 'UTC+03:00' }]
  },
  { country: 'Dominica', cities: [{ city: 'Roseau', timezone: 'UTC-04:00' }] },
  {
    country: 'Dominican Republic',
    cities: [{ city: 'Santo Domingo', timezone: 'UTC-04:00' }]
  },
  { country: 'Ecuador', cities: [{ city: 'Quito', timezone: 'UTC-05:00' }] },
  { country: 'Egypt', cities: [{ city: 'Cairo', timezone: 'UTC+02:00' }] },
  {
    country: 'El Salvador',
    cities: [{ city: 'San Salvador', timezone: 'UTC-06:00' }]
  },
  {
    country: 'Equatorial Guinea',
    cities: [{ city: 'Malabo', timezone: 'UTC+01:00' }]
  },
  { country: 'Eritrea', cities: [{ city: 'Asmara', timezone: 'UTC+03:00' }] },
  { country: 'Estonia', cities: [{ city: 'Tallinn', timezone: 'UTC+02:00' }] },
  { country: 'Eswatini', cities: [{ city: 'Mbabane', timezone: 'UTC+02:00' }] },
  {
    country: 'Ethiopia',
    cities: [{ city: 'Addis Ababa', timezone: 'UTC+03:00' }]
  },
  { country: 'Fiji', cities: [{ city: 'Suva', timezone: 'UTC+12:00' }] },
  { country: 'Finland', cities: [{ city: 'Helsinki', timezone: 'UTC+02:00' }] },
  { country: 'France', cities: [{ city: 'Paris', timezone: 'UTC+01:00' }] },
  { country: 'Gabon', cities: [{ city: 'Libreville', timezone: 'UTC+01:00' }] },
  { country: 'Gambia', cities: [{ city: 'Banjul', timezone: 'UTC+00:00' }] },
  { country: 'Georgia', cities: [{ city: 'Tbilisi', timezone: 'UTC+04:00' }] },
  { country: 'Germany', cities: [{ city: 'Berlin', timezone: 'UTC+01:00' }] },
  { country: 'Ghana', cities: [{ city: 'Accra', timezone: 'UTC+00:00' }] },
  { country: 'Greece', cities: [{ city: 'Athens', timezone: 'UTC+02:00' }] },
  {
    country: 'Grenada',
    cities: [{ city: "St. George's", timezone: 'UTC-04:00' }]
  },
  {
    country: 'Guatemala',
    cities: [{ city: 'Guatemala City', timezone: 'UTC-06:00' }]
  },
  { country: 'Guinea', cities: [{ city: 'Conakry', timezone: 'UTC+00:00' }] },
  {
    country: 'Guinea-Bissau',
    cities: [{ city: 'Bissau', timezone: 'UTC+00:00' }]
  },
  {
    country: 'Guyana',
    cities: [{ city: 'Georgetown', timezone: 'UTC-04:00' }]
  },
  {
    country: 'Haiti',
    cities: [{ city: 'Port-au-Prince', timezone: 'UTC-05:00' }]
  },
  {
    country: 'Honduras',
    cities: [{ city: 'Tegucigalpa', timezone: 'UTC-06:00' }]
  },
  { country: 'Hungary', cities: [{ city: 'Budapest', timezone: 'UTC+01:00' }] },
  {
    country: 'Iceland',
    cities: [{ city: 'Reykjavík', timezone: 'UTC+00:00' }]
  },
  { country: 'India', cities: [{ city: 'New Delhi', timezone: 'UTC+05:30' }] },
  {
    country: 'Indonesia',
    cities: [{ city: 'Jakarta', timezone: 'UTC+07:00' }]
  },
  { country: 'Iran', cities: [{ city: 'Tehran', timezone: 'UTC+03:30' }] },
  { country: 'Iraq', cities: [{ city: 'Baghdad', timezone: 'UTC+03:00' }] },
  { country: 'Ireland', cities: [{ city: 'Dublin', timezone: 'UTC+00:00' }] },
  { country: 'Israel', cities: [{ city: 'Tel Aviv', timezone: 'UTC+02:00' }] },
  { country: 'Italy', cities: [{ city: 'Rome', timezone: 'UTC+01:00' }] },
  { country: 'Jamaica', cities: [{ city: 'Kingston', timezone: 'UTC-05:00' }] },
  { country: 'Japan', cities: [{ city: 'Tokyo', timezone: 'UTC+09:00' }] },
  { country: 'Jordan', cities: [{ city: 'Amman', timezone: 'UTC+02:00' }] },
  {
    country: 'Kazakhstan',
    cities: [{ city: 'Almaty', timezone: 'UTC+06:00' }]
  },
  { country: 'Kenya', cities: [{ city: 'Nairobi', timezone: 'UTC+03:00' }] },
  { country: 'Kiribati', cities: [{ city: 'Tarawa', timezone: 'UTC+12:00' }] },
  {
    country: 'Korea (North)',
    cities: [{ city: 'Pyongyang', timezone: 'UTC+09:00' }]
  },
  {
    country: 'Korea (South)',
    cities: [{ city: 'Seoul', timezone: 'UTC+09:00' }]
  },
  {
    country: 'Kuwait',
    cities: [{ city: 'Kuwait City', timezone: 'UTC+03:00' }]
  },
  {
    country: 'Kyrgyzstan',
    cities: [{ city: 'Bishkek', timezone: 'UTC+06:00' }]
  },
  { country: 'Laos', cities: [{ city: 'Vientiane', timezone: 'UTC+07:00' }] },
  { country: 'Latvia', cities: [{ city: 'Riga', timezone: 'UTC+02:00' }] },
  { country: 'Lebanon', cities: [{ city: 'Beirut', timezone: 'UTC+02:00' }] },
  { country: 'Lesotho', cities: [{ city: 'Maseru', timezone: 'UTC+02:00' }] },
  { country: 'Liberia', cities: [{ city: 'Monrovia', timezone: 'UTC+00:00' }] },
  { country: 'Libya', cities: [{ city: 'Tripoli', timezone: 'UTC+02:00' }] },
  {
    country: 'Liechtenstein',
    cities: [{ city: 'Vaduz', timezone: 'UTC+01:00' }]
  },
  {
    country: 'Lithuania',
    cities: [{ city: 'Vilnius', timezone: 'UTC+02:00' }]
  },
  {
    country: 'Luxembourg',
    cities: [{ city: 'Luxembourg City', timezone: 'UTC+01:00' }]
  },
  {
    country: 'Madagascar',
    cities: [{ city: 'Antananarivo', timezone: 'UTC+03:00' }]
  },
  { country: 'Malawi', cities: [{ city: 'Lilongwe', timezone: 'UTC+02:00' }] },
  {
    country: 'Malaysia',
    cities: [{ city: 'Kuala Lumpur', timezone: 'UTC+08:00' }]
  },
  { country: 'Maldives', cities: [{ city: 'Malé', timezone: 'UTC+05:00' }] },
  { country: 'Mali', cities: [{ city: 'Bamako', timezone: 'UTC+00:00' }] },
  { country: 'Malta', cities: [{ city: 'Valletta', timezone: 'UTC+01:00' }] },
  {
    country: 'Marshall Islands',
    cities: [{ city: 'Majuro', timezone: 'UTC+12:00' }]
  },
  {
    country: 'Mauritania',
    cities: [{ city: 'Nouakchott', timezone: 'UTC+00:00' }]
  },
  {
    country: 'Mauritius',
    cities: [{ city: 'Port Louis', timezone: 'UTC+04:00' }]
  },
  {
    country: 'Mexico',
    cities: [{ city: 'Mexico City', timezone: 'UTC-06:00' }]
  },
  {
    country: 'Micronesia',
    cities: [{ city: 'Palikir', timezone: 'UTC+11:00' }]
  },
  { country: 'Moldova', cities: [{ city: 'Chișinău', timezone: 'UTC+02:00' }] },
  { country: 'Monaco', cities: [{ city: 'Monaco', timezone: 'UTC+01:00' }] },
  {
    country: 'Mongolia',
    cities: [{ city: 'Ulaanbaatar', timezone: 'UTC+08:00' }]
  },
  {
    country: 'Montenegro',
    cities: [{ city: 'Podgorica', timezone: 'UTC+01:00' }]
  },
  { country: 'Morocco', cities: [{ city: 'Rabat', timezone: 'UTC+01:00' }] },
  {
    country: 'Mozambique',
    cities: [{ city: 'Maputo', timezone: 'UTC+02:00' }]
  },
  {
    country: 'Myanmar',
    cities: [{ city: 'Naypyidaw', timezone: 'UTC+06:30' }]
  },
  { country: 'Namibia', cities: [{ city: 'Windhoek', timezone: 'UTC+02:00' }] },
  { country: 'Nauru', cities: [{ city: 'Yaren', timezone: 'UTC+12:00' }] },
  { country: 'Nepal', cities: [{ city: 'Kathmandu', timezone: 'UTC+05:45' }] },
  {
    country: 'Netherlands',
    cities: [{ city: 'Amsterdam', timezone: 'UTC+01:00' }]
  },
  {
    country: 'New Zealand',
    cities: [{ city: 'Wellington', timezone: 'UTC+12:00' }]
  },
  {
    country: 'Nicaragua',
    cities: [{ city: 'Managua', timezone: 'UTC-06:00' }]
  },
  { country: 'Niger', cities: [{ city: 'Niamey', timezone: 'UTC+01:00' }] },
  { country: 'Nigeria', cities: [{ city: 'Abuja', timezone: 'UTC+01:00' }] },
  {
    country: 'North Macedonia',
    cities: [{ city: 'Skopje', timezone: 'UTC+01:00' }]
  },
  { country: 'Norway', cities: [{ city: 'Oslo', timezone: 'UTC+01:00' }] },
  { country: 'Oman', cities: [{ city: 'Muscat', timezone: 'UTC+04:00' }] },
  {
    country: 'Pakistan',
    cities: [{ city: 'Islamabad', timezone: 'UTC+05:00' }]
  },
  { country: 'Palau', cities: [{ city: 'Ngerulmud', timezone: 'UTC+09:00' }] },
  {
    country: 'Panama',
    cities: [{ city: 'Panama City', timezone: 'UTC-05:00' }]
  },
  {
    country: 'Papua New Guinea',
    cities: [{ city: 'Port Moresby', timezone: 'UTC+10:00' }]
  },
  {
    country: 'Paraguay',
    cities: [{ city: 'Asunción', timezone: 'UTC-04:00' }]
  },
  { country: 'Peru', cities: [{ city: 'Lima', timezone: 'UTC-05:00' }] },
  {
    country: 'Philippines',
    cities: [{ city: 'Manila', timezone: 'UTC+08:00' }]
  },
  { country: 'Poland', cities: [{ city: 'Warsaw', timezone: 'UTC+01:00' }] },
  { country: 'Portugal', cities: [{ city: 'Lisbon', timezone: 'UTC+00:00' }] },
  { country: 'Qatar', cities: [{ city: 'Doha', timezone: 'UTC+03:00' }] },
  {
    country: 'Romania',
    cities: [{ city: 'Bucharest', timezone: 'UTC+02:00' }]
  },
  { country: 'Russia', cities: [{ city: 'Moscow', timezone: 'UTC+03:00' }] },
  { country: 'Rwanda', cities: [{ city: 'Kigali', timezone: 'UTC+02:00' }] },
  {
    country: 'Saint Kitts and Nevis',
    cities: [{ city: 'Basseterre', timezone: 'UTC-04:00' }]
  },
  {
    country: 'Saint Lucia',
    cities: [{ city: 'Castries', timezone: 'UTC-04:00' }]
  },
  {
    country: 'Saint Vincent and the Grenadines',
    cities: [{ city: 'Kingstown', timezone: 'UTC-04:00' }]
  },
  { country: 'Samoa', cities: [{ city: 'Apia', timezone: 'UTC+13:00' }] },
  {
    country: 'San Marino',
    cities: [{ city: 'San Marino', timezone: 'UTC+01:00' }]
  },
  {
    country: 'Sao Tome and Principe',
    cities: [{ city: 'São Tomé', timezone: 'UTC+00:00' }]
  },
  {
    country: 'Saudi Arabia',
    cities: [{ city: 'Riyadh', timezone: 'UTC+03:00' }]
  },
  { country: 'Senegal', cities: [{ city: 'Dakar', timezone: 'UTC+00:00' }] },
  { country: 'Serbia', cities: [{ city: 'Belgrade', timezone: 'UTC+01:00' }] },
  {
    country: 'Seychelles',
    cities: [{ city: 'Victoria', timezone: 'UTC+04:00' }]
  },
  {
    country: 'Sierra Leone',
    cities: [{ city: 'Freetown', timezone: 'UTC+00:00' }]
  },
  {
    country: 'Singapore',
    cities: [{ city: 'Singapore', timezone: 'UTC+08:00' }]
  },
  {
    country: 'Slovakia',
    cities: [{ city: 'Bratislava', timezone: 'UTC+01:00' }]
  },
  {
    country: 'Slovenia',
    cities: [{ city: 'Ljubljana', timezone: 'UTC+01:00' }]
  },
  {
    country: 'Solomon Islands',
    cities: [{ city: 'Honiara', timezone: 'UTC+11:00' }]
  },
  {
    country: 'Somalia',
    cities: [{ city: 'Mogadishu', timezone: 'UTC+03:00' }]
  },
  {
    country: 'South Africa',
    cities: [{ city: 'Pretoria', timezone: 'UTC+02:00' }]
  },
  { country: 'South Sudan', cities: [{ city: 'Juba', timezone: 'UTC+03:00' }] },
  { country: 'Spain', cities: [{ city: 'Madrid', timezone: 'UTC+01:00' }] },
  {
    country: 'Sri Lanka',
    cities: [{ city: 'Colombo', timezone: 'UTC+05:30' }]
  },
  { country: 'Sudan', cities: [{ city: 'Khartoum', timezone: 'UTC+02:00' }] },
  {
    country: 'Suriname',
    cities: [{ city: 'Paramaribo', timezone: 'UTC-03:00' }]
  },
  { country: 'Sweden', cities: [{ city: 'Stockholm', timezone: 'UTC+01:00' }] },
  { country: 'Switzerland', cities: [{ city: 'Bern', timezone: 'UTC+01:00' }] },
  { country: 'Syria', cities: [{ city: 'Damascus', timezone: 'UTC+02:00' }] },
  { country: 'Taiwan', cities: [{ city: 'Taipei', timezone: 'UTC+08:00' }] },
  {
    country: 'Tajikistan',
    cities: [{ city: 'Dushanbe', timezone: 'UTC+05:00' }]
  },
  { country: 'Tanzania', cities: [{ city: 'Dodoma', timezone: 'UTC+03:00' }] },
  { country: 'Thailand', cities: [{ city: 'Bangkok', timezone: 'UTC+07:00' }] },
  { country: 'Togo', cities: [{ city: 'Lomé', timezone: 'UTC+00:00' }] },
  { country: 'Tonga', cities: [{ city: "Nuku'alofa", timezone: 'UTC+13:00' }] },
  {
    country: 'Trinidad and Tobago',
    cities: [{ city: 'Port of Spain', timezone: 'UTC-04:00' }]
  },
  { country: 'Tunisia', cities: [{ city: 'Tunis', timezone: 'UTC+01:00' }] },
  { country: 'Turkey', cities: [{ city: 'Ankara', timezone: 'UTC+03:00' }] },
  {
    country: 'Turkmenistan',
    cities: [{ city: 'Ashgabat', timezone: 'UTC+05:00' }]
  },
  { country: 'Tuvalu', cities: [{ city: 'Funafuti', timezone: 'UTC+12:00' }] },
  { country: 'Uganda', cities: [{ city: 'Kampala', timezone: 'UTC+03:00' }] },
  { country: 'Ukraine', cities: [{ city: 'Kyiv', timezone: 'UTC+02:00' }] },
  {
    country: 'United Arab Emirates',
    cities: [{ city: 'Abu Dhabi', timezone: 'UTC+04:00' }]
  },
  {
    country: 'United Kingdom',
    cities: [{ city: 'London', timezone: 'UTC+00:00' }]
  },
  {
    country: 'United States',
    cities: [
      { city: 'New York', timezone: 'UTC-05:00' },
      { city: 'Los Angeles', timezone: 'UTC-08:00' },
      { city: 'Chicago', timezone: 'UTC-06:00' },
      { city: 'Houston', timezone: 'UTC-06:00' },
      { city: 'Phoenix', timezone: 'UTC-07:00' },
      { city: 'Philadelphia', timezone: 'UTC-05:00' },
      { city: 'San Antonio', timezone: 'UTC-06:00' },
      { city: 'San Diego', timezone: 'UTC-08:00' },
      { city: 'Dallas', timezone: 'UTC-06:00' },
      { city: 'San Jose', timezone: 'UTC-08:00' },
      { city: 'Austin', timezone: 'UTC-06:00' },
      { city: 'Jacksonville', timezone: 'UTC-05:00' },
      { city: 'Fort Worth', timezone: 'UTC-06:00' },
      { city: 'Columbus', timezone: 'UTC-05:00' },
      { city: 'San Francisco', timezone: 'UTC-08:00' },
      { city: 'Charlotte', timezone: 'UTC-05:00' },
      { city: 'Indianapolis', timezone: 'UTC-05:00' },
      { city: 'Seattle', timezone: 'UTC-08:00' },
      { city: 'Denver', timezone: 'UTC-07:00' },
      { city: 'Washington, D.C.', timezone: 'UTC-05:00' },
      { city: 'Boston', timezone: 'UTC-05:00' },
      { city: 'El Paso', timezone: 'UTC-07:00' },
      { city: 'Nashville', timezone: 'UTC-06:00' },
      { city: 'Detroit', timezone: 'UTC-05:00' },
      { city: 'Oklahoma City', timezone: 'UTC-06:00' },
      { city: 'Portland', timezone: 'UTC-08:00' },
      { city: 'Las Vegas', timezone: 'UTC-08:00' },
      { city: 'Memphis', timezone: 'UTC-06:00' },
      { city: 'Louisville', timezone: 'UTC-05:00' },
      { city: 'Baltimore', timezone: 'UTC-05:00' },
      { city: 'Milwaukee', timezone: 'UTC-06:00' },
      { city: 'Albuquerque', timezone: 'UTC-07:00' },
      { city: 'Tucson', timezone: 'UTC-07:00' },
      { city: 'Fresno', timezone: 'UTC-08:00' },
      { city: 'Sacramento', timezone: 'UTC-08:00' },
      { city: 'Mesa', timezone: 'UTC-07:00' },
      { city: 'Kansas City', timezone: 'UTC-06:00' },
      { city: 'Atlanta', timezone: 'UTC-05:00' },
      { city: 'Long Beach', timezone: 'UTC-08:00' },
      { city: 'Colorado Springs', timezone: 'UTC-07:00' },
      { city: 'Miami', timezone: 'UTC-05:00' }
    ]
  },
  {
    country: 'Uruguay',
    cities: [{ city: 'Montevideo', timezone: 'UTC-03:00' }]
  },
  {
    country: 'Uzbekistan',
    cities: [{ city: 'Tashkent', timezone: 'UTC+05:00' }]
  },
  {
    country: 'Vanuatu',
    cities: [{ city: 'Port Vila', timezone: 'UTC+11:00' }]
  },
  {
    country: 'Vatican City',
    cities: [{ city: 'Vatican City', timezone: 'UTC+01:00' }]
  },
  {
    country: 'Venezuela',
    cities: [{ city: 'Caracas', timezone: 'UTC-04:00' }]
  },
  { country: 'Vietnam', cities: [{ city: 'Hanoi', timezone: 'UTC+07:00' }] },
  { country: 'Yemen', cities: [{ city: "Sana'a", timezone: 'UTC+03:00' }] },
  { country: 'Zambia', cities: [{ city: 'Lusaka', timezone: 'UTC+02:00' }] },
  { country: 'Zimbabwe', cities: [{ city: 'Harare', timezone: 'UTC+02:00' }] }
];
