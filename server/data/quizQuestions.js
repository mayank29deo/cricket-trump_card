/**
 * Cricket Quiz Questions
 *
 * Categories:
 *   International: general, test, odi, t20i
 *   IPL: general, mi, csk, rcb, kkr, dc, srh, rr, pbks, gt, lsg
 *
 * Each question: { id, category, question, options: [A,B,C,D], answer: 0-3, difficulty: 'easy'|'medium'|'hard' }
 */

const questions = [

  // ─── INTERNATIONAL — GENERAL ─────────────────────────────────────────────
  { id: 'ig1', category: 'international_general', question: 'Who holds the record for the most international runs in cricket history?', options: ['Ricky Ponting', 'Sachin Tendulkar', 'Kumar Sangakkara', 'Jacques Kallis'], answer: 1, difficulty: 'easy' },
  { id: 'ig2', category: 'international_general', question: 'Which country won the first-ever Cricket World Cup in 1975?', options: ['Australia', 'England', 'West Indies', 'India'], answer: 2, difficulty: 'easy' },
  { id: 'ig3', category: 'international_general', question: 'Who is known as the "God of Cricket"?', options: ['Virat Kohli', 'Brian Lara', 'Sachin Tendulkar', 'Sir Don Bradman'], answer: 2, difficulty: 'easy' },
  { id: 'ig4', category: 'international_general', question: 'Which bowler has taken the most wickets in international cricket?', options: ['Shane Warne', 'Muttiah Muralitharan', 'Anil Kumble', 'James Anderson'], answer: 1, difficulty: 'medium' },
  { id: 'ig5', category: 'international_general', question: 'Who hit six sixes in an over in international cricket for the first time?', options: ['Yuvraj Singh', 'Herschelle Gibbs', 'Sir Garfield Sobers', 'Ravi Shastri'], answer: 2, difficulty: 'hard' },
  { id: 'ig6', category: 'international_general', question: 'Which country has won the most ICC Cricket World Cups?', options: ['India', 'West Indies', 'England', 'Australia'], answer: 3, difficulty: 'easy' },
  { id: 'ig7', category: 'international_general', question: 'Who scored the fastest century in ODI cricket (off 31 balls)?', options: ['Chris Gayle', 'AB de Villiers', 'Shahid Afridi', 'Corey Anderson'], answer: 1, difficulty: 'medium' },
  { id: 'ig8', category: 'international_general', question: 'What is the highest individual score in ODI cricket?', options: ['264 by Rohit Sharma', '219 by Virender Sehwag', '200* by Sachin Tendulkar', '237* by Martin Guptill'], answer: 0, difficulty: 'medium' },
  { id: 'ig9', category: 'international_general', question: 'Which cricketer has scored the most double centuries in Test cricket?', options: ['Sachin Tendulkar', 'Don Bradman', 'Kumar Sangakkara', 'Brian Lara'], answer: 1, difficulty: 'hard' },
  { id: 'ig10', category: 'international_general', question: 'Who captained India to the 2011 World Cup victory?', options: ['Sachin Tendulkar', 'Virat Kohli', 'MS Dhoni', 'Sourav Ganguly'], answer: 2, difficulty: 'easy' },
  { id: 'ig11', category: 'international_general', question: 'What is Don Bradman\'s Test batting average?', options: ['95.14', '99.94', '102.00', '89.78'], answer: 1, difficulty: 'medium' },
  { id: 'ig12', category: 'international_general', question: 'Who was the first cricketer to score 10,000 Test runs?', options: ['Allan Border', 'Sunil Gavaskar', 'Brian Lara', 'Sachin Tendulkar'], answer: 1, difficulty: 'hard' },
  { id: 'ig13', category: 'international_general', question: 'Which team won the 2019 ICC Cricket World Cup?', options: ['New Zealand', 'India', 'Australia', 'England'], answer: 3, difficulty: 'easy' },
  { id: 'ig14', category: 'international_general', question: 'Who scored the highest individual Test score of 400*?', options: ['Brian Lara', 'Matthew Hayden', 'Virender Sehwag', 'Chris Gayle'], answer: 0, difficulty: 'medium' },
  { id: 'ig15', category: 'international_general', question: 'Which bowler has the best bowling figures in a Test innings (10/53)?', options: ['Anil Kumble', 'Jim Laker', 'Muttiah Muralitharan', 'Shane Warne'], answer: 1, difficulty: 'hard' },

  // ─── INTERNATIONAL — TEST ────────────────────────────────────────────────
  { id: 'it1', category: 'international_test', question: 'Who has scored the most centuries in Test cricket?', options: ['Ricky Ponting', 'Jacques Kallis', 'Sachin Tendulkar', 'Steve Smith'], answer: 2, difficulty: 'easy' },
  { id: 'it2', category: 'international_test', question: 'Which country played the first-ever Test match in 1877?', options: ['England vs India', 'England vs Australia', 'England vs South Africa', 'Australia vs West Indies'], answer: 1, difficulty: 'medium' },
  { id: 'it3', category: 'international_test', question: 'Who is the fastest to 10,000 Test runs?', options: ['Sachin Tendulkar', 'Brian Lara', 'Kumar Sangakkara', 'Virat Kohli'], answer: 0, difficulty: 'hard' },
  { id: 'it4', category: 'international_test', question: 'What is the highest team score in Test cricket?', options: ['952/6 by Sri Lanka', '903/7 by England', '849 by England', '759/7 by India'], answer: 1, difficulty: 'hard' },
  { id: 'it5', category: 'international_test', question: 'Who took a perfect 10-wicket haul in a Test innings for India?', options: ['Harbhajan Singh', 'Ravichandran Ashwin', 'Anil Kumble', 'Javagal Srinath'], answer: 2, difficulty: 'easy' },
  { id: 'it6', category: 'international_test', question: 'Which batsman has the most runs in a single Test series?', options: ['Don Bradman', 'Walter Hammond', 'Clyde Walcott', 'Brian Lara'], answer: 1, difficulty: 'hard' },
  { id: 'it7', category: 'international_test', question: 'Who has taken the most catches as a fielder in Test cricket?', options: ['Rahul Dravid', 'Jacques Kallis', 'Ricky Ponting', 'Mahela Jayawardene'], answer: 0, difficulty: 'medium' },
  { id: 'it8', category: 'international_test', question: 'Which team has won the most Test matches in history?', options: ['England', 'India', 'Australia', 'West Indies'], answer: 2, difficulty: 'easy' },
  { id: 'it9', category: 'international_test', question: 'Who holds the record for most Test wickets by a fast bowler?', options: ['Glenn McGrath', 'Courtney Walsh', 'James Anderson', 'Stuart Broad'], answer: 2, difficulty: 'medium' },
  { id: 'it10', category: 'international_test', question: 'What is the lowest team total in Test cricket?', options: ['26 by New Zealand', '30 by South Africa', '36 by Australia', '42 by India'], answer: 0, difficulty: 'hard' },

  // ─── INTERNATIONAL — ODI ─────────────────────────────────────────────────
  { id: 'io1', category: 'international_odi', question: 'Who has scored the most runs in ODI cricket history?', options: ['Virat Kohli', 'Sachin Tendulkar', 'Ricky Ponting', 'Kumar Sangakkara'], answer: 1, difficulty: 'easy' },
  { id: 'io2', category: 'international_odi', question: 'Who took the first hat-trick in a World Cup?', options: ['Wasim Akram', 'Chetan Sharma', 'Chaminda Vaas', 'Brett Lee'], answer: 1, difficulty: 'hard' },
  { id: 'io3', category: 'international_odi', question: 'Which player has the most ODI wickets?', options: ['Wasim Akram', 'Muttiah Muralitharan', 'Brett Lee', 'Chaminda Vaas'], answer: 1, difficulty: 'medium' },
  { id: 'io4', category: 'international_odi', question: 'Who scored the first ODI double century (200*)?', options: ['Rohit Sharma', 'Martin Guptill', 'Sachin Tendulkar', 'Virender Sehwag'], answer: 2, difficulty: 'easy' },
  { id: 'io5', category: 'international_odi', question: 'What is the highest team total in ODI cricket?', options: ['481/6 by England', '444/3 by England', '443/9 by Sri Lanka', '438/9 by South Africa'], answer: 0, difficulty: 'medium' },
  { id: 'io6', category: 'international_odi', question: 'Who hit the most sixes in a single ODI innings?', options: ['Chris Gayle', 'Rohit Sharma', 'Eoin Morgan', 'AB de Villiers'], answer: 0, difficulty: 'medium' },
  { id: 'io7', category: 'international_odi', question: 'Which bowler has the best ODI bowling figures (8/19)?', options: ['Chaminda Vaas', 'Glenn McGrath', 'Stuart Broad', 'Shahid Afridi'], answer: 0, difficulty: 'hard' },
  { id: 'io8', category: 'international_odi', question: 'Who won the 2023 ODI World Cup?', options: ['India', 'England', 'Pakistan', 'Australia'], answer: 3, difficulty: 'easy' },
  { id: 'io9', category: 'international_odi', question: 'Who has the most catches in ODI cricket?', options: ['Mahela Jayawardene', 'Ricky Ponting', 'MS Dhoni', 'Kumar Sangakkara'], answer: 0, difficulty: 'hard' },
  { id: 'io10', category: 'international_odi', question: 'Who scored the fastest ODI fifty (off 16 balls)?', options: ['Sanath Jayasuriya', 'AB de Villiers', 'Shahid Afridi', 'Mark Boucher'], answer: 1, difficulty: 'medium' },

  // ─── INTERNATIONAL — T20I ───────────────────────────────────────────────
  { id: 'i20_1', category: 'international_t20i', question: 'Who has scored the most runs in T20I cricket?', options: ['Virat Kohli', 'Rohit Sharma', 'Babar Azam', 'Martin Guptill'], answer: 1, difficulty: 'easy' },
  { id: 'i20_2', category: 'international_t20i', question: 'Who has taken the most wickets in T20I cricket?', options: ['Tim Southee', 'Rashid Khan', 'Shakib Al Hasan', 'Wanindu Hasaranga'], answer: 2, difficulty: 'medium' },
  { id: 'i20_3', category: 'international_t20i', question: 'Which country won the first T20 World Cup in 2007?', options: ['Australia', 'Pakistan', 'India', 'South Africa'], answer: 2, difficulty: 'easy' },
  { id: 'i20_4', category: 'international_t20i', question: 'What is the highest individual T20I score?', options: ['172 by Aaron Finch', '156* by Hazratullah Zazai', '162* by Ahmed Shehzad', '175* by Chris Gayle'], answer: 0, difficulty: 'medium' },
  { id: 'i20_5', category: 'international_t20i', question: 'Which team has won the most T20 World Cups?', options: ['India', 'West Indies', 'England', 'Australia'], answer: 1, difficulty: 'medium' },
  { id: 'i20_6', category: 'international_t20i', question: 'Who hit Yuvraj Singh\'s famous six sixes in the 2007 T20 World Cup?', options: ['Stuart Broad delivered them', 'Andrew Flintoff', 'James Anderson', 'Steve Harmison'], answer: 0, difficulty: 'easy' },
  { id: 'i20_7', category: 'international_t20i', question: 'What is the lowest team total in T20I cricket?', options: ['39 by Netherlands', '44 by Nepal', '56 by Mongolia', '60 by Hong Kong'], answer: 0, difficulty: 'hard' },
  { id: 'i20_8', category: 'international_t20i', question: 'Who bowled the final over in the 2016 T20 WC final?', options: ['Jasprit Bumrah', 'R Ashwin', 'Ben Stokes', 'Lendl Simmons'], answer: 2, difficulty: 'medium' },
  { id: 'i20_9', category: 'international_t20i', question: 'Which player has hit the most sixes in T20I history?', options: ['Chris Gayle', 'Rohit Sharma', 'Martin Guptill', 'Eoin Morgan'], answer: 1, difficulty: 'hard' },
  { id: 'i20_10', category: 'international_t20i', question: 'Who won the 2024 T20 World Cup?', options: ['South Africa', 'England', 'Australia', 'India'], answer: 3, difficulty: 'easy' },

  // ─── IPL — GENERAL ───────────────────────────────────────────────────────
  { id: 'ipl1', category: 'ipl_general', question: 'Who has scored the most runs in IPL history?', options: ['Rohit Sharma', 'David Warner', 'Virat Kohli', 'Shikhar Dhawan'], answer: 2, difficulty: 'easy' },
  { id: 'ipl2', category: 'ipl_general', question: 'Which team won the first IPL in 2008?', options: ['Chennai Super Kings', 'Rajasthan Royals', 'Mumbai Indians', 'Royal Challengers Bangalore'], answer: 1, difficulty: 'medium' },
  { id: 'ipl3', category: 'ipl_general', question: 'Who has taken the most wickets in IPL history?', options: ['Yuzvendra Chahal', 'Lasith Malinga', 'Amit Mishra', 'Dwayne Bravo'], answer: 0, difficulty: 'medium' },
  { id: 'ipl4', category: 'ipl_general', question: 'What is the highest individual score in IPL?', options: ['175* by Chris Gayle', '158* by Brendon McCullum', '128* by Rishabh Pant', '132 by AB de Villiers'], answer: 0, difficulty: 'easy' },
  { id: 'ipl5', category: 'ipl_general', question: 'Which franchise has won the most IPL titles?', options: ['Chennai Super Kings', 'Kolkata Knight Riders', 'Mumbai Indians', 'Gujarat Titans'], answer: 2, difficulty: 'easy' },
  { id: 'ipl6', category: 'ipl_general', question: 'Who hit 117 meters — the longest six in IPL history?', options: ['Chris Gayle', 'MS Dhoni', 'AB de Villiers', 'Liam Livingstone'], answer: 3, difficulty: 'hard' },
  { id: 'ipl7', category: 'ipl_general', question: 'Which bowler has the best bowling figures in an IPL match?', options: ['Anil Kumble', 'Sohail Tanvir', 'Adam Zampa', 'Alzarri Joseph'], answer: 3, difficulty: 'hard' },
  { id: 'ipl8', category: 'ipl_general', question: 'Who has the most fifties in IPL?', options: ['David Warner', 'Shikhar Dhawan', 'Virat Kohli', 'Rohit Sharma'], answer: 0, difficulty: 'medium' },
  { id: 'ipl9', category: 'ipl_general', question: 'What was the highest team score in IPL history?', options: ['263/5 by RCB', '246/5 by CSK', '287/3 by SRH', '248/4 by MI'], answer: 0, difficulty: 'hard' },
  { id: 'ipl10', category: 'ipl_general', question: 'Who has played the most IPL matches?', options: ['MS Dhoni', 'Virat Kohli', 'Rohit Sharma', 'Dinesh Karthik'], answer: 0, difficulty: 'medium' },
  { id: 'ipl11', category: 'ipl_general', question: 'Who was the most expensive player in IPL auction history (as of 2025)?', options: ['Sam Curran', 'Shreyas Iyer', 'Rishabh Pant', 'Mitchell Starc'], answer: 2, difficulty: 'medium' },
  { id: 'ipl12', category: 'ipl_general', question: 'Which player has won the most IPL MVP (Orange Cap + Purple Cap)?', options: ['Chris Gayle', 'David Warner', 'Virat Kohli', 'No one has won both'], answer: 3, difficulty: 'hard' },

  // ─── IPL — FRANCHISE SPECIFIC ────────────────────────────────────────────

  // Mumbai Indians
  { id: 'mi1', category: 'ipl_mi', question: 'How many IPL titles have Mumbai Indians won?', options: ['3', '4', '5', '6'], answer: 2, difficulty: 'easy' },
  { id: 'mi2', category: 'ipl_mi', question: 'Who is the all-time leading run scorer for Mumbai Indians?', options: ['Sachin Tendulkar', 'Rohit Sharma', 'Kieron Pollard', 'Suryakumar Yadav'], answer: 1, difficulty: 'easy' },
  { id: 'mi3', category: 'ipl_mi', question: 'Which bowler has the most wickets for Mumbai Indians?', options: ['Jasprit Bumrah', 'Lasith Malinga', 'Harbhajan Singh', 'Kieron Pollard'], answer: 1, difficulty: 'medium' },
  { id: 'mi4', category: 'ipl_mi', question: 'In which year did MI win their first IPL title?', options: ['2013', '2015', '2011', '2017'], answer: 0, difficulty: 'medium' },
  { id: 'mi5', category: 'ipl_mi', question: 'Who is the owner of Mumbai Indians?', options: ['Mukesh Ambani', 'Nita Ambani', 'Akash Ambani', 'Reliance Industries'], answer: 1, difficulty: 'easy' },

  // Chennai Super Kings
  { id: 'csk1', category: 'ipl_csk', question: 'How many IPL titles have CSK won?', options: ['4', '5', '6', '3'], answer: 1, difficulty: 'easy' },
  { id: 'csk2', category: 'ipl_csk', question: 'Who is the highest run scorer for CSK in IPL?', options: ['MS Dhoni', 'Suresh Raina', 'Faf du Plessis', 'Ruturaj Gaikwad'], answer: 1, difficulty: 'medium' },
  { id: 'csk3', category: 'ipl_csk', question: 'Which years was CSK banned from the IPL?', options: ['2014-2015', '2016-2017', '2013-2014', '2015-2016'], answer: 1, difficulty: 'medium' },
  { id: 'csk4', category: 'ipl_csk', question: 'Who captained CSK to their first IPL title?', options: ['Suresh Raina', 'MS Dhoni', 'Stephen Fleming', 'Matthew Hayden'], answer: 1, difficulty: 'easy' },
  { id: 'csk5', category: 'ipl_csk', question: 'Which bowler has taken the most wickets for CSK?', options: ['Ravichandran Ashwin', 'Dwayne Bravo', 'Deepak Chahar', 'Ravindra Jadeja'], answer: 1, difficulty: 'medium' },

  // Royal Challengers Bangalore
  { id: 'rcb1', category: 'ipl_rcb', question: 'How many IPL titles have RCB won?', options: ['0', '1', '2', '3'], answer: 0, difficulty: 'easy' },
  { id: 'rcb2', category: 'ipl_rcb', question: 'Who scored 973 runs in a single IPL season for RCB?', options: ['AB de Villiers', 'Chris Gayle', 'Virat Kohli', 'Faf du Plessis'], answer: 2, difficulty: 'easy' },
  { id: 'rcb3', category: 'ipl_rcb', question: 'What is the highest team total by RCB in IPL?', options: ['248/3', '263/5', '235/1', '240/2'], answer: 1, difficulty: 'medium' },
  { id: 'rcb4', category: 'ipl_rcb', question: 'Chris Gayle\'s 175* for RCB was scored against which team?', options: ['KKR', 'PWI (Pune Warriors)', 'MI', 'CSK'], answer: 1, difficulty: 'medium' },
  { id: 'rcb5', category: 'ipl_rcb', question: 'Who is the current captain of RCB (2025)?', options: ['Faf du Plessis', 'Virat Kohli', 'Rajat Patidar', 'Glenn Maxwell'], answer: 0, difficulty: 'easy' },

  // Kolkata Knight Riders
  { id: 'kkr1', category: 'ipl_kkr', question: 'Who owns Kolkata Knight Riders?', options: ['Shah Rukh Khan', 'Preity Zinta', 'Akash Ambani', 'Sanjiv Goenka'], answer: 0, difficulty: 'easy' },
  { id: 'kkr2', category: 'ipl_kkr', question: 'Who scored 158* in the first IPL match ever for KKR?', options: ['Chris Gayle', 'Jacques Kallis', 'Brendon McCullum', 'Gautam Gambhir'], answer: 2, difficulty: 'easy' },
  { id: 'kkr3', category: 'ipl_kkr', question: 'How many IPL titles have KKR won?', options: ['1', '2', '3', '4'], answer: 2, difficulty: 'medium' },
  { id: 'kkr4', category: 'ipl_kkr', question: 'Which spinner has the most wickets for KKR?', options: ['Sunil Narine', 'Kuldeep Yadav', 'Piyush Chawla', 'Shakib Al Hasan'], answer: 0, difficulty: 'medium' },
  { id: 'kkr5', category: 'ipl_kkr', question: 'Who captained KKR to their first IPL title in 2012?', options: ['Sourav Ganguly', 'Brendon McCullum', 'Gautam Gambhir', 'Dinesh Karthik'], answer: 2, difficulty: 'easy' },

  // Delhi Capitals
  { id: 'dc1', category: 'ipl_dc', question: 'What was Delhi Capitals previously known as?', options: ['Delhi Chargers', 'Delhi Daredevils', 'Delhi Dynamos', 'Delhi Kings'], answer: 1, difficulty: 'easy' },
  { id: 'dc2', category: 'ipl_dc', question: 'Who is the all-time leading run scorer for Delhi in IPL?', options: ['Virender Sehwag', 'Shreyas Iyer', 'Shikhar Dhawan', 'Rishabh Pant'], answer: 2, difficulty: 'medium' },
  { id: 'dc3', category: 'ipl_dc', question: 'In which year did DC first reach the IPL final?', options: ['2019', '2020', '2021', '2018'], answer: 1, difficulty: 'medium' },
  { id: 'dc4', category: 'ipl_dc', question: 'How many IPL titles have Delhi won?', options: ['0', '1', '2', '3'], answer: 0, difficulty: 'easy' },
  { id: 'dc5', category: 'ipl_dc', question: 'Who was the head coach when DC reached their first final?', options: ['Gary Kirsten', 'Ricky Ponting', 'Stephen Fleming', 'Tom Moody'], answer: 1, difficulty: 'medium' },

  // Sunrisers Hyderabad
  { id: 'srh1', category: 'ipl_srh', question: 'In which year did SRH win their only IPL title?', options: ['2013', '2015', '2016', '2018'], answer: 2, difficulty: 'easy' },
  { id: 'srh2', category: 'ipl_srh', question: 'Who captained SRH to their IPL title?', options: ['Kane Williamson', 'David Warner', 'Shikhar Dhawan', 'Bhuvneshwar Kumar'], answer: 1, difficulty: 'easy' },
  { id: 'srh3', category: 'ipl_srh', question: 'SRH replaced which defunct franchise?', options: ['Pune Warriors', 'Kochi Tuskers', 'Deccan Chargers', 'Gujarat Lions'], answer: 2, difficulty: 'medium' },
  { id: 'srh4', category: 'ipl_srh', question: 'Which SRH player scored 287/3 — the highest IPL score (2024)?', options: ['Travis Head', 'Heinrich Klaasen', 'Abhishek Sharma', 'Team effort'], answer: 3, difficulty: 'hard' },
  { id: 'srh5', category: 'ipl_srh', question: 'Who has the most wickets for SRH in IPL?', options: ['Rashid Khan', 'Bhuvneshwar Kumar', 'T Natarajan', 'Sandeep Sharma'], answer: 1, difficulty: 'medium' },

  // Rajasthan Royals
  { id: 'rr1', category: 'ipl_rr', question: 'Who captained Rajasthan Royals to the inaugural IPL title?', options: ['Rahul Dravid', 'Shane Warne', 'Graeme Smith', 'Shane Watson'], answer: 1, difficulty: 'easy' },
  { id: 'rr2', category: 'ipl_rr', question: 'How many IPL titles have RR won?', options: ['1', '2', '0', '3'], answer: 0, difficulty: 'easy' },
  { id: 'rr3', category: 'ipl_rr', question: 'Who is the highest run scorer for RR in IPL?', options: ['Shane Watson', 'Sanju Samson', 'Jos Buttler', 'Steve Smith'], answer: 1, difficulty: 'medium' },
  { id: 'rr4', category: 'ipl_rr', question: 'Jos Buttler scored how many centuries in IPL 2022?', options: ['2', '3', '4', '5'], answer: 2, difficulty: 'medium' },
  { id: 'rr5', category: 'ipl_rr', question: 'Who owns Rajasthan Royals?', options: ['Manoj Badale', 'Shilpa Shetty', 'Preity Zinta', 'Parth Jindal'], answer: 0, difficulty: 'hard' },

  // Punjab Kings
  { id: 'pbks1', category: 'ipl_pbks', question: 'What was Punjab Kings previously known as?', options: ['Punjab XI', 'Kings XI Punjab', 'Punjab Royals', 'Punjab Warriors'], answer: 1, difficulty: 'easy' },
  { id: 'pbks2', category: 'ipl_pbks', question: 'How many IPL titles have Punjab Kings won?', options: ['0', '1', '2', '3'], answer: 0, difficulty: 'easy' },
  { id: 'pbks3', category: 'ipl_pbks', question: 'Who holds the highest individual score for PBKS?', options: ['Chris Gayle', 'KL Rahul', 'Shaun Marsh', 'David Miller'], answer: 0, difficulty: 'medium' },
  { id: 'pbks4', category: 'ipl_pbks', question: 'Which season did PBKS reach the IPL final?', options: ['2008', '2014', '2011', 'Never'], answer: 1, difficulty: 'medium' },
  { id: 'pbks5', category: 'ipl_pbks', question: 'Who co-owns Punjab Kings with Ness Wadia?', options: ['Preity Zinta', 'Juhi Chawla', 'Shilpa Shetty', 'Sushmita Sen'], answer: 0, difficulty: 'easy' },

  // Gujarat Titans
  { id: 'gt1', category: 'ipl_gt', question: 'In which year did Gujarat Titans debut in the IPL?', options: ['2021', '2022', '2023', '2020'], answer: 1, difficulty: 'easy' },
  { id: 'gt2', category: 'ipl_gt', question: 'Who captained GT to their maiden IPL title?', options: ['Shubman Gill', 'Hardik Pandya', 'Rashid Khan', 'David Miller'], answer: 1, difficulty: 'easy' },
  { id: 'gt3', category: 'ipl_gt', question: 'How many IPL titles have GT won?', options: ['0', '1', '2', '3'], answer: 1, difficulty: 'easy' },
  { id: 'gt4', category: 'ipl_gt', question: 'Who is the highest run scorer for GT across IPL seasons?', options: ['Shubman Gill', 'Hardik Pandya', 'Wriddhiman Saha', 'David Miller'], answer: 0, difficulty: 'medium' },
  { id: 'gt5', category: 'ipl_gt', question: 'Who owns Gujarat Titans?', options: ['Adani Group', 'CVC Capital Partners', 'Tata Group', 'Reliance'], answer: 1, difficulty: 'hard' },

  // Lucknow Super Giants
  { id: 'lsg1', category: 'ipl_lsg', question: 'In which year did Lucknow Super Giants debut?', options: ['2021', '2022', '2023', '2024'], answer: 1, difficulty: 'easy' },
  { id: 'lsg2', category: 'ipl_lsg', question: 'Who was the first captain of LSG?', options: ['Rishabh Pant', 'KL Rahul', 'Quinton de Kock', 'Nicholas Pooran'], answer: 1, difficulty: 'easy' },
  { id: 'lsg3', category: 'ipl_lsg', question: 'Who owns Lucknow Super Giants?', options: ['CVC Capital', 'RPSG Group', 'Adani Group', 'Tata Group'], answer: 1, difficulty: 'medium' },
  { id: 'lsg4', category: 'ipl_lsg', question: 'How many IPL titles have LSG won?', options: ['0', '1', '2', '3'], answer: 0, difficulty: 'easy' },
  { id: 'lsg5', category: 'ipl_lsg', question: 'Which LSG player hit the fastest fifty in IPL 2023?', options: ['Nicholas Pooran', 'Marcus Stoinis', 'Kyle Mayers', 'KL Rahul'], answer: 1, difficulty: 'hard' },

  // ─── GUESS THE CRICKETER (stat-based) ────────────────────────────────────
  { id: 'gc1', category: 'guess_cricketer', question: 'Guess the cricketer: 15,921 Test runs, 51 centuries, Indian batsman', options: ['Virat Kohli', 'Sachin Tendulkar', 'Rahul Dravid', 'Sunil Gavaskar'], answer: 1, difficulty: 'easy' },
  { id: 'gc2', category: 'guess_cricketer', question: 'Guess the cricketer: 800 Test wickets, Sri Lankan spinner', options: ['Rangana Herath', 'Muttiah Muralitharan', 'Ajantha Mendis', 'Sanath Jayasuriya'], answer: 1, difficulty: 'easy' },
  { id: 'gc3', category: 'guess_cricketer', question: 'Guess the cricketer: 6,000+ IPL runs, played only for one franchise, known as "Mr. IPL"', options: ['Rohit Sharma', 'MS Dhoni', 'Virat Kohli', 'Suresh Raina'], answer: 3, difficulty: 'medium' },
  { id: 'gc4', category: 'guess_cricketer', question: 'Guess the cricketer: 99.94 Test average, Australian, played 1928-1948', options: ['Allan Border', 'Steve Waugh', 'Don Bradman', 'Bill Ponsford'], answer: 2, difficulty: 'easy' },
  { id: 'gc5', category: 'guess_cricketer', question: 'Guess the cricketer: 708 Test wickets, Australian leg-spinner, "Ball of the Century"', options: ['Stuart MacGill', 'Shane Warne', 'Richie Benaud', 'Bill O\'Reilly'], answer: 1, difficulty: 'easy' },
  { id: 'gc6', category: 'guess_cricketer', question: 'Guess the cricketer: 11,867 Test runs, most dismissals as wicketkeeper (2000s era)', options: ['MS Dhoni', 'Adam Gilchrist', 'Kumar Sangakkara', 'Mark Boucher'], answer: 2, difficulty: 'medium' },
  { id: 'gc7', category: 'guess_cricketer', question: 'Guess the cricketer: 169 IPL wickets, Trinidadian all-rounder, famous celebration dance', options: ['Kieron Pollard', 'Andre Russell', 'Dwayne Bravo', 'Sunil Narine'], answer: 2, difficulty: 'medium' },
  { id: 'gc8', category: 'guess_cricketer', question: 'Guess the cricketer: 100 international centuries, only player to achieve this feat', options: ['Ricky Ponting', 'Virat Kohli', 'Sachin Tendulkar', 'Jacques Kallis'], answer: 2, difficulty: 'easy' },
  { id: 'gc9', category: 'guess_cricketer', question: 'Guess the cricketer: Fastest T20I century (45 balls), South African, 360-degree player', options: ['Quinton de Kock', 'Faf du Plessis', 'David Miller', 'AB de Villiers'], answer: 3, difficulty: 'medium' },
  { id: 'gc10', category: 'guess_cricketer', question: 'Guess the cricketer: "Captain Cool", famous helicopter shot, finished matches for India', options: ['Virat Kohli', 'Sourav Ganguly', 'MS Dhoni', 'Kapil Dev'], answer: 2, difficulty: 'easy' },
  { id: 'gc11', category: 'guess_cricketer', question: 'Guess the cricketer: 400* in Tests, Trinidadian left-hander, held highest Test score record', options: ['Shivnarine Chanderpaul', 'Carl Hooper', 'Brian Lara', 'Viv Richards'], answer: 2, difficulty: 'medium' },
  { id: 'gc12', category: 'guess_cricketer', question: 'Guess the cricketer: Afghan leg-spinner, youngest T20I captain, 400+ T20 wickets globally', options: ['Mujeeb Ur Rahman', 'Rashid Khan', 'Nabi Mohammad', 'Qais Ahmad'], answer: 1, difficulty: 'medium' },
  { id: 'gc13', category: 'guess_cricketer', question: 'Guess the cricketer: Indian fast bowler, 6/19 in T20I, yorker specialist, plays for MI', options: ['Mohammed Shami', 'Bhuvneshwar Kumar', 'Jasprit Bumrah', 'Arshdeep Singh'], answer: 2, difficulty: 'easy' },
  { id: 'gc14', category: 'guess_cricketer', question: 'Guess the cricketer: 13,000+ ODI runs, 49 ODI centuries, Indian opener (modern era)', options: ['Rohit Sharma', 'Shikhar Dhawan', 'Virat Kohli', 'KL Rahul'], answer: 2, difficulty: 'medium' },
  { id: 'gc15', category: 'guess_cricketer', question: 'Guess the cricketer: 563 Test wickets, "Rawalpindi Express", fastest bowler in 2000s', options: ['Waqar Younis', 'Wasim Akram', 'Shoaib Akhtar', 'Mohammad Asif'], answer: 2, difficulty: 'hard' },
];

// Category metadata for UI
const QUIZ_CATEGORIES = {
  international: {
    label: 'International',
    icon: '🌍',
    subcategories: {
      international_general: { label: 'General', icon: '🏏' },
      international_test: { label: 'Test Cricket', icon: '🏟️' },
      international_odi: { label: 'ODIs', icon: '🏆' },
      international_t20i: { label: 'T20Is', icon: '⚡' },
      guess_cricketer: { label: 'Guess the Cricketer', icon: '🤔' },
    }
  },
  ipl: {
    label: 'IPL',
    icon: '🏆',
    subcategories: {
      ipl_general: { label: 'General', icon: '🏏' },
      ipl_mi: { label: 'Mumbai Indians', icon: '💙' },
      ipl_csk: { label: 'Chennai Super Kings', icon: '💛' },
      ipl_rcb: { label: 'Royal Challengers', icon: '❤️' },
      ipl_kkr: { label: 'Knight Riders', icon: '💜' },
      ipl_dc: { label: 'Delhi Capitals', icon: '🔵' },
      ipl_srh: { label: 'Sunrisers Hyderabad', icon: '🧡' },
      ipl_rr: { label: 'Rajasthan Royals', icon: '💗' },
      ipl_pbks: { label: 'Punjab Kings', icon: '🔴' },
      ipl_gt: { label: 'Gujarat Titans', icon: '🩵' },
      ipl_lsg: { label: 'Lucknow Super Giants', icon: '🩶' },
    }
  }
};

module.exports = { questions, QUIZ_CATEGORIES };
