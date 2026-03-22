const cricketers = [
  {
    id: 1,
    name: "Sachin Tendulkar",
    country: "India",
    countryCode: "IN",
    role: "Batsman",
    era: "1989-2013",
    stats: {
      batting_avg: 48.52,
      strike_rate: 86.23,
      centuries: 100,
      total_runs: 34357,
      wickets: 201,
      catches: 256
    },
    rarity: "legendary"
  },
  {
    id: 2,
    name: "Virat Kohli",
    country: "India",
    countryCode: "IN",
    role: "Batsman",
    era: "2008-present",
    stats: {
      batting_avg: 58.07,
      strike_rate: 93.17,
      centuries: 80,
      total_runs: 26000,
      wickets: 4,
      catches: 200
    },
    rarity: "legendary"
  },
  {
    id: 3,
    name: "MS Dhoni",
    country: "India",
    countryCode: "IN",
    role: "WK-Batsman",
    era: "2004-2020",
    stats: {
      batting_avg: 50.57,
      strike_rate: 87.56,
      centuries: 16,
      total_runs: 17266,
      wickets: 1,
      catches: 256
    },
    rarity: "legendary"
  },
  {
    id: 4,
    name: "Rohit Sharma",
    country: "India",
    countryCode: "IN",
    role: "Batsman",
    era: "2007-present",
    stats: {
      batting_avg: 48.96,
      strike_rate: 88.96,
      centuries: 48,
      total_runs: 18000,
      wickets: 8,
      catches: 150
    },
    rarity: "epic"
  },
  {
    id: 5,
    name: "Rahul Dravid",
    country: "India",
    countryCode: "IN",
    role: "Batsman",
    era: "1996-2012",
    stats: {
      batting_avg: 52.31,
      strike_rate: 71.20,
      centuries: 48,
      total_runs: 24177,
      wickets: 1,
      catches: 210
    },
    rarity: "epic"
  },
  {
    id: 6,
    name: "Sourav Ganguly",
    country: "India",
    countryCode: "IN",
    role: "All-Rounder",
    era: "1992-2008",
    stats: {
      batting_avg: 42.17,
      strike_rate: 73.70,
      centuries: 22,
      total_runs: 18575,
      wickets: 100,
      catches: 140
    },
    rarity: "epic"
  },
  {
    id: 7,
    name: "Kapil Dev",
    country: "India",
    countryCode: "IN",
    role: "All-Rounder",
    era: "1978-1994",
    stats: {
      batting_avg: 31.05,
      strike_rate: 95.07,
      centuries: 8,
      total_runs: 9031,
      wickets: 687,
      catches: 192
    },
    rarity: "legendary"
  },
  {
    id: 8,
    name: "Anil Kumble",
    country: "India",
    countryCode: "IN",
    role: "Bowler",
    era: "1990-2008",
    stats: {
      batting_avg: 29.65,
      strike_rate: 65.40,
      centuries: 0,
      total_runs: 2506,
      wickets: 956,
      catches: 148
    },
    rarity: "epic"
  },
  {
    id: 9,
    name: "Yuvraj Singh",
    country: "India",
    countryCode: "IN",
    role: "All-Rounder",
    era: "2000-2017",
    stats: {
      batting_avg: 36.55,
      strike_rate: 87.66,
      centuries: 14,
      total_runs: 11778,
      wickets: 148,
      catches: 115
    },
    rarity: "rare"
  },
  {
    id: 10,
    name: "Virender Sehwag",
    country: "India",
    countryCode: "IN",
    role: "Batsman",
    era: "1999-2015",
    stats: {
      batting_avg: 49.34,
      strike_rate: 104.33,
      centuries: 38,
      total_runs: 17253,
      wickets: 96,
      catches: 140
    },
    rarity: "epic"
  },
  {
    id: 11,
    name: "Sunil Gavaskar",
    country: "India",
    countryCode: "IN",
    role: "Batsman",
    era: "1971-1987",
    stats: {
      batting_avg: 51.12,
      strike_rate: 65.00,
      centuries: 34,
      total_runs: 13214,
      wickets: 1,
      catches: 108
    },
    rarity: "legendary"
  },
  {
    id: 12,
    name: "Jasprit Bumrah",
    country: "India",
    countryCode: "IN",
    role: "Bowler",
    era: "2016-present",
    stats: {
      batting_avg: 26.56,
      strike_rate: 55.00,
      centuries: 0,
      total_runs: 180,
      wickets: 287,
      catches: 38
    },
    rarity: "rare"
  },
  {
    id: 13,
    name: "Ravichandran Ashwin",
    country: "India",
    countryCode: "IN",
    role: "All-Rounder",
    era: "2010-present",
    stats: {
      batting_avg: 26.68,
      strike_rate: 60.00,
      centuries: 6,
      total_runs: 3100,
      wickets: 516,
      catches: 95
    },
    rarity: "rare"
  },
  {
    id: 14,
    name: "Ravindra Jadeja",
    country: "India",
    countryCode: "IN",
    role: "All-Rounder",
    era: "2009-present",
    stats: {
      batting_avg: 35.92,
      strike_rate: 60.20,
      centuries: 3,
      total_runs: 5900,
      wickets: 500,
      catches: 175
    },
    rarity: "rare"
  },
  {
    id: 15,
    name: "Brian Lara",
    country: "West Indies",
    countryCode: "WI",
    role: "Batsman",
    era: "1990-2007",
    stats: {
      batting_avg: 52.88,
      strike_rate: 82.58,
      centuries: 53,
      total_runs: 22358,
      wickets: 4,
      catches: 164
    },
    rarity: "legendary"
  },
  {
    id: 16,
    name: "Viv Richards",
    country: "West Indies",
    countryCode: "WI",
    role: "Batsman",
    era: "1974-1991",
    stats: {
      batting_avg: 50.23,
      strike_rate: 90.20,
      centuries: 36,
      total_runs: 15168,
      wickets: 32,
      catches: 160
    },
    rarity: "legendary"
  },
  {
    id: 17,
    name: "Chris Gayle",
    country: "West Indies",
    countryCode: "WI",
    role: "Batsman",
    era: "1999-2021",
    stats: {
      batting_avg: 42.18,
      strike_rate: 95.40,
      centuries: 25,
      total_runs: 15350,
      wickets: 165,
      catches: 130
    },
    rarity: "epic"
  },
  {
    id: 18,
    name: "Curtly Ambrose",
    country: "West Indies",
    countryCode: "WI",
    role: "Bowler",
    era: "1988-2000",
    stats: {
      batting_avg: 20.99,
      strike_rate: 50.00,
      centuries: 0,
      total_runs: 1439,
      wickets: 630,
      catches: 68
    },
    rarity: "rare"
  },
  {
    id: 19,
    name: "Malcolm Marshall",
    country: "West Indies",
    countryCode: "WI",
    role: "Bowler",
    era: "1978-1991",
    stats: {
      batting_avg: 20.94,
      strike_rate: 65.00,
      centuries: 0,
      total_runs: 1810,
      wickets: 376,
      catches: 65
    },
    rarity: "rare"
  },
  {
    id: 20,
    name: "Ricky Ponting",
    country: "Australia",
    countryCode: "AU",
    role: "Batsman",
    era: "1995-2012",
    stats: {
      batting_avg: 51.85,
      strike_rate: 80.39,
      centuries: 71,
      total_runs: 27483,
      wickets: 5,
      catches: 196
    },
    rarity: "legendary"
  },
  {
    id: 21,
    name: "Adam Gilchrist",
    country: "Australia",
    countryCode: "AU",
    role: "WK-Batsman",
    era: "1996-2008",
    stats: {
      batting_avg: 47.60,
      strike_rate: 96.95,
      centuries: 17,
      total_runs: 15475,
      wickets: 1,
      catches: 416
    },
    rarity: "legendary"
  },
  {
    id: 22,
    name: "Shane Warne",
    country: "Australia",
    countryCode: "AU",
    role: "Bowler",
    era: "1992-2007",
    stats: {
      batting_avg: 25.41,
      strike_rate: 57.49,
      centuries: 0,
      total_runs: 3154,
      wickets: 1001,
      catches: 125
    },
    rarity: "legendary"
  },
  {
    id: 23,
    name: "Glenn McGrath",
    country: "Australia",
    countryCode: "AU",
    role: "Bowler",
    era: "1993-2007",
    stats: {
      batting_avg: 21.64,
      strike_rate: 51.00,
      centuries: 0,
      total_runs: 641,
      wickets: 949,
      catches: 75
    },
    rarity: "epic"
  },
  {
    id: 24,
    name: "Brett Lee",
    country: "Australia",
    countryCode: "AU",
    role: "Bowler",
    era: "1999-2012",
    stats: {
      batting_avg: 24.27,
      strike_rate: 66.78,
      centuries: 0,
      total_runs: 1441,
      wickets: 718,
      catches: 60
    },
    rarity: "rare"
  },
  {
    id: 25,
    name: "Steve Waugh",
    country: "Australia",
    countryCode: "AU",
    role: "Batsman",
    era: "1985-2004",
    stats: {
      batting_avg: 51.06,
      strike_rate: 72.99,
      centuries: 32,
      total_runs: 19000,
      wickets: 195,
      catches: 175
    },
    rarity: "epic"
  },
  {
    id: 26,
    name: "Matthew Hayden",
    country: "Australia",
    countryCode: "AU",
    role: "Batsman",
    era: "1994-2009",
    stats: {
      batting_avg: 50.73,
      strike_rate: 78.80,
      centuries: 30,
      total_runs: 15379,
      wickets: 0,
      catches: 130
    },
    rarity: "rare"
  },
  {
    id: 27,
    name: "David Warner",
    country: "Australia",
    countryCode: "AU",
    role: "Batsman",
    era: "2009-present",
    stats: {
      batting_avg: 48.20,
      strike_rate: 95.80,
      centuries: 26,
      total_runs: 17000,
      wickets: 0,
      catches: 118
    },
    rarity: "rare"
  },
  {
    id: 28,
    name: "AB de Villiers",
    country: "South Africa",
    countryCode: "ZA",
    role: "WK-Batsman",
    era: "2004-2018",
    stats: {
      batting_avg: 50.66,
      strike_rate: 101.19,
      centuries: 25,
      total_runs: 20014,
      wickets: 1,
      catches: 247
    },
    rarity: "legendary"
  },
  {
    id: 29,
    name: "Jacques Kallis",
    country: "South Africa",
    countryCode: "ZA",
    role: "All-Rounder",
    era: "1995-2014",
    stats: {
      batting_avg: 55.37,
      strike_rate: 72.89,
      centuries: 45,
      total_runs: 25534,
      wickets: 577,
      catches: 200
    },
    rarity: "legendary"
  },
  {
    id: 30,
    name: "Dale Steyn",
    country: "South Africa",
    countryCode: "ZA",
    role: "Bowler",
    era: "2004-2019",
    stats: {
      batting_avg: 22.95,
      strike_rate: 55.10,
      centuries: 0,
      total_runs: 1155,
      wickets: 699,
      catches: 66
    },
    rarity: "epic"
  },
  {
    id: 31,
    name: "Graeme Smith",
    country: "South Africa",
    countryCode: "ZA",
    role: "Batsman",
    era: "2002-2014",
    stats: {
      batting_avg: 48.25,
      strike_rate: 73.68,
      centuries: 27,
      total_runs: 17359,
      wickets: 0,
      catches: 165
    },
    rarity: "rare"
  },
  {
    id: 32,
    name: "Hashim Amla",
    country: "South Africa",
    countryCode: "ZA",
    role: "Batsman",
    era: "2004-2019",
    stats: {
      batting_avg: 46.64,
      strike_rate: 86.71,
      centuries: 28,
      total_runs: 17366,
      wickets: 0,
      catches: 115
    },
    rarity: "rare"
  },
  {
    id: 33,
    name: "Wasim Akram",
    country: "Pakistan",
    countryCode: "PK",
    role: "Bowler",
    era: "1984-2003",
    stats: {
      batting_avg: 23.62,
      strike_rate: 54.62,
      centuries: 3,
      total_runs: 6615,
      wickets: 916,
      catches: 113
    },
    rarity: "legendary"
  },
  {
    id: 34,
    name: "Waqar Younis",
    country: "Pakistan",
    countryCode: "PK",
    role: "Bowler",
    era: "1989-2003",
    stats: {
      batting_avg: 23.56,
      strike_rate: 43.49,
      centuries: 0,
      total_runs: 1010,
      wickets: 789,
      catches: 61
    },
    rarity: "epic"
  },
  {
    id: 35,
    name: "Imran Khan",
    country: "Pakistan",
    countryCode: "PK",
    role: "All-Rounder",
    era: "1971-1992",
    stats: {
      batting_avg: 37.69,
      strike_rate: 72.70,
      centuries: 6,
      total_runs: 7805,
      wickets: 687,
      catches: 117
    },
    rarity: "legendary"
  },
  {
    id: 36,
    name: "Babar Azam",
    country: "Pakistan",
    countryCode: "PK",
    role: "Batsman",
    era: "2015-present",
    stats: {
      batting_avg: 59.13,
      strike_rate: 88.64,
      centuries: 30,
      total_runs: 12400,
      wickets: 0,
      catches: 92
    },
    rarity: "epic"
  },
  {
    id: 37,
    name: "Shahid Afridi",
    country: "Pakistan",
    countryCode: "PK",
    role: "All-Rounder",
    era: "1996-2018",
    stats: {
      batting_avg: 23.57,
      strike_rate: 117.00,
      centuries: 6,
      total_runs: 12248,
      wickets: 541,
      catches: 131
    },
    rarity: "rare"
  },
  {
    id: 38,
    name: "Inzamam-ul-Haq",
    country: "Pakistan",
    countryCode: "PK",
    role: "Batsman",
    era: "1991-2007",
    stats: {
      batting_avg: 49.60,
      strike_rate: 74.20,
      centuries: 35,
      total_runs: 20580,
      wickets: 1,
      catches: 175
    },
    rarity: "rare"
  },
  {
    id: 39,
    name: "Joe Root",
    country: "England",
    countryCode: "GB",
    role: "Batsman",
    era: "2012-present",
    stats: {
      batting_avg: 50.39,
      strike_rate: 88.16,
      centuries: 35,
      total_runs: 18000,
      wickets: 44,
      catches: 180
    },
    rarity: "epic"
  },
  {
    id: 40,
    name: "Ben Stokes",
    country: "England",
    countryCode: "GB",
    role: "All-Rounder",
    era: "2011-present",
    stats: {
      batting_avg: 37.46,
      strike_rate: 89.48,
      centuries: 13,
      total_runs: 8500,
      wickets: 214,
      catches: 125
    },
    rarity: "epic"
  },
  {
    id: 41,
    name: "James Anderson",
    country: "England",
    countryCode: "GB",
    role: "Bowler",
    era: "2003-present",
    stats: {
      batting_avg: 26.45,
      strike_rate: 55.30,
      centuries: 0,
      total_runs: 1261,
      wickets: 900,
      catches: 70
    },
    rarity: "epic"
  },
  {
    id: 42,
    name: "Ian Botham",
    country: "England",
    countryCode: "GB",
    role: "All-Rounder",
    era: "1977-1992",
    stats: {
      batting_avg: 33.54,
      strike_rate: 78.00,
      centuries: 14,
      total_runs: 12200,
      wickets: 528,
      catches: 180
    },
    rarity: "legendary"
  },
  {
    id: 43,
    name: "Alastair Cook",
    country: "England",
    countryCode: "GB",
    role: "Batsman",
    era: "2006-2018",
    stats: {
      batting_avg: 45.35,
      strike_rate: 60.39,
      centuries: 33,
      total_runs: 19490,
      wickets: 0,
      catches: 175
    },
    rarity: "rare"
  },
  {
    id: 44,
    name: "Kumar Sangakkara",
    country: "Sri Lanka",
    countryCode: "LK",
    role: "WK-Batsman",
    era: "2000-2015",
    stats: {
      batting_avg: 57.40,
      strike_rate: 77.54,
      centuries: 63,
      total_runs: 28016,
      wickets: 1,
      catches: 309
    },
    rarity: "legendary"
  },
  {
    id: 45,
    name: "Mahela Jayawardena",
    country: "Sri Lanka",
    countryCode: "LK",
    role: "Batsman",
    era: "1997-2015",
    stats: {
      batting_avg: 49.84,
      strike_rate: 82.41,
      centuries: 41,
      total_runs: 25957,
      wickets: 0,
      catches: 205
    },
    rarity: "epic"
  },
  {
    id: 46,
    name: "Muttiah Muralitharan",
    country: "Sri Lanka",
    countryCode: "LK",
    role: "Bowler",
    era: "1992-2011",
    stats: {
      batting_avg: 22.72,
      strike_rate: 55.00,
      centuries: 0,
      total_runs: 1261,
      wickets: 1347,
      catches: 72
    },
    rarity: "legendary"
  },
  {
    id: 47,
    name: "Kane Williamson",
    country: "New Zealand",
    countryCode: "NZ",
    role: "Batsman",
    era: "2010-present",
    stats: {
      batting_avg: 54.21,
      strike_rate: 77.97,
      centuries: 33,
      total_runs: 14000,
      wickets: 52,
      catches: 145
    },
    rarity: "epic"
  },
  {
    id: 48,
    name: "Richard Hadlee",
    country: "New Zealand",
    countryCode: "NZ",
    role: "All-Rounder",
    era: "1973-1990",
    stats: {
      batting_avg: 27.16,
      strike_rate: 60.00,
      centuries: 2,
      total_runs: 5444,
      wickets: 431,
      catches: 101
    },
    rarity: "legendary"
  },
  {
    id: 49,
    name: "Martin Crowe",
    country: "New Zealand",
    countryCode: "NZ",
    role: "Batsman",
    era: "1982-1995",
    stats: {
      batting_avg: 45.36,
      strike_rate: 65.00,
      centuries: 17,
      total_runs: 8375,
      wickets: 14,
      catches: 71
    },
    rarity: "rare"
  },
  {
    id: 50,
    name: "Brendon McCullum",
    country: "New Zealand",
    countryCode: "NZ",
    role: "WK-Batsman",
    era: "2002-2016",
    stats: {
      batting_avg: 38.64,
      strike_rate: 90.58,
      centuries: 12,
      total_runs: 14500,
      wickets: 0,
      catches: 230
    },
    rarity: "rare"
  },
  {
    id: 51,
    name: "Andrew Flintoff",
    country: "England",
    countryCode: "GB",
    role: "All-Rounder",
    era: "1998-2009",
    stats: {
      batting_avg: 31.77,
      strike_rate: 73.15,
      centuries: 5,
      total_runs: 7929,
      wickets: 400,
      catches: 130
    },
    rarity: "rare"
  },
  {
    id: 52,
    name: "Don Bradman",
    country: "Australia",
    countryCode: "AU",
    role: "Batsman",
    era: "1928-1948",
    stats: {
      batting_avg: 99.94,
      strike_rate: 60.00,
      centuries: 29,
      total_runs: 6996,
      wickets: 36,
      catches: 32
    },
    rarity: "legendary"
  }
];

export default cricketers;
