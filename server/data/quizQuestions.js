/**
 * Cricket Quiz Questions
 *
 * Categories:
 *   International: general, test, odi, t20i, guess_cricketer
 *   IPL: general, mi, csk, rcb, kkr, dc, srh, rr, pbks, gt, lsg
 *
 * Each question: { id, category, question, options: [A,B,C,D], answer: 0-3, difficulty: 'easy'|'medium'|'hard' }
 *
 * 500+ questions total
 */

const questions = [

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL — GENERAL (50+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'ig1', category: 'international_general', question: 'Who holds the record for the most international runs in cricket history?', options: ['Ricky Ponting', 'Sachin Tendulkar', 'Kumar Sangakkara', 'Jacques Kallis'], answer: 1, difficulty: 'easy' },
  { id: 'ig2', category: 'international_general', question: 'Which country won the first-ever Cricket World Cup in 1975?', options: ['Australia', 'England', 'West Indies', 'India'], answer: 2, difficulty: 'easy' },
  { id: 'ig3', category: 'international_general', question: 'Who is known as the "God of Cricket"?', options: ['Virat Kohli', 'Brian Lara', 'Sachin Tendulkar', 'Sir Don Bradman'], answer: 2, difficulty: 'easy' },
  { id: 'ig4', category: 'international_general', question: 'Which bowler has taken the most wickets in international cricket?', options: ['Shane Warne', 'Muttiah Muralitharan', 'Anil Kumble', 'James Anderson'], answer: 1, difficulty: 'medium' },
  { id: 'ig5', category: 'international_general', question: 'Who hit six sixes in an over in international cricket for the first time?', options: ['Yuvraj Singh', 'Herschelle Gibbs', 'Sir Garfield Sobers', 'Ravi Shastri'], answer: 2, difficulty: 'hard' },
  { id: 'ig6', category: 'international_general', question: 'Which country has won the most ICC Cricket World Cups (ODI)?', options: ['India', 'West Indies', 'England', 'Australia'], answer: 3, difficulty: 'easy' },
  { id: 'ig7', category: 'international_general', question: 'Who scored the fastest century in ODI cricket (off 31 balls)?', options: ['Chris Gayle', 'AB de Villiers', 'Shahid Afridi', 'Corey Anderson'], answer: 1, difficulty: 'medium' },
  { id: 'ig8', category: 'international_general', question: 'What is the highest individual score in ODI cricket?', options: ['264 by Rohit Sharma', '219 by Virender Sehwag', '200* by Sachin Tendulkar', '237* by Martin Guptill'], answer: 0, difficulty: 'medium' },
  { id: 'ig9', category: 'international_general', question: 'Which cricketer has scored the most double centuries in Test cricket?', options: ['Sachin Tendulkar', 'Don Bradman', 'Kumar Sangakkara', 'Brian Lara'], answer: 1, difficulty: 'hard' },
  { id: 'ig10', category: 'international_general', question: 'Who captained India to the 2011 World Cup victory?', options: ['Sachin Tendulkar', 'Virat Kohli', 'MS Dhoni', 'Sourav Ganguly'], answer: 2, difficulty: 'easy' },
  { id: 'ig11', category: 'international_general', question: 'What is Don Bradman\'s Test batting average?', options: ['95.14', '99.94', '102.00', '89.78'], answer: 1, difficulty: 'medium' },
  { id: 'ig12', category: 'international_general', question: 'Who was the first cricketer to score 10,000 Test runs?', options: ['Allan Border', 'Sunil Gavaskar', 'Brian Lara', 'Sachin Tendulkar'], answer: 1, difficulty: 'hard' },
  { id: 'ig13', category: 'international_general', question: 'Which team won the 2019 ICC Cricket World Cup?', options: ['New Zealand', 'India', 'Australia', 'England'], answer: 3, difficulty: 'easy' },
  { id: 'ig14', category: 'international_general', question: 'Who scored the highest individual Test score of 400*?', options: ['Brian Lara', 'Matthew Hayden', 'Virender Sehwag', 'Chris Gayle'], answer: 0, difficulty: 'medium' },
  { id: 'ig15', category: 'international_general', question: 'Which bowler has the best bowling figures in a Test innings (10/53)?', options: ['Anil Kumble', 'Jim Laker', 'Muttiah Muralitharan', 'Shane Warne'], answer: 1, difficulty: 'hard' },
  { id: 'ig16', category: 'international_general', question: 'Who was the first cricketer to score a triple century in Test cricket?', options: ['Don Bradman', 'Andy Sandham', 'Brian Lara', 'Wally Hammond'], answer: 1, difficulty: 'hard' },
  { id: 'ig17', category: 'international_general', question: 'Which cricketer is nicknamed "The Wall"?', options: ['VVS Laxman', 'Rahul Dravid', 'Cheteshwar Pujara', 'Jacques Kallis'], answer: 1, difficulty: 'easy' },
  { id: 'ig18', category: 'international_general', question: 'Who was the first player to take 800 wickets in Test cricket?', options: ['Shane Warne', 'Muttiah Muralitharan', 'Anil Kumble', 'James Anderson'], answer: 1, difficulty: 'medium' },
  { id: 'ig19', category: 'international_general', question: 'Which ground is known as the "Home of Cricket"?', options: ['Melbourne Cricket Ground', 'Eden Gardens', 'Lord\'s Cricket Ground', 'The Oval'], answer: 2, difficulty: 'easy' },
  { id: 'ig20', category: 'international_general', question: 'Who holds the record for most international centuries?', options: ['Ricky Ponting', 'Virat Kohli', 'Sachin Tendulkar', 'Kumar Sangakkara'], answer: 2, difficulty: 'easy' },
  { id: 'ig21', category: 'international_general', question: 'Which country became the first to be bowled out for 26 in a Test match?', options: ['South Africa', 'Bangladesh', 'New Zealand', 'Zimbabwe'], answer: 2, difficulty: 'hard' },
  { id: 'ig22', category: 'international_general', question: 'Who is the youngest player to score a Test century?', options: ['Sachin Tendulkar', 'Mohammad Ashraful', 'Hasan Raza', 'Shahid Afridi'], answer: 0, difficulty: 'medium' },
  { id: 'ig23', category: 'international_general', question: 'Which country hosted the 1987 Cricket World Cup?', options: ['England', 'Australia', 'India and Pakistan', 'West Indies'], answer: 2, difficulty: 'medium' },
  { id: 'ig24', category: 'international_general', question: 'Who is the all-time highest wicket-taker in Test cricket?', options: ['Shane Warne', 'James Anderson', 'Anil Kumble', 'Muttiah Muralitharan'], answer: 3, difficulty: 'easy' },
  { id: 'ig25', category: 'international_general', question: 'Which cricketer has the most catches in international cricket?', options: ['Mahela Jayawardene', 'Ricky Ponting', 'Rahul Dravid', 'Ross Taylor'], answer: 0, difficulty: 'hard' },
  { id: 'ig26', category: 'international_general', question: 'What does "LBW" stand for in cricket?', options: ['Left Before Wicket', 'Leg Before Wicket', 'Leg Behind Wicket', 'Left Behind Wicket'], answer: 1, difficulty: 'easy' },
  { id: 'ig27', category: 'international_general', question: 'Who captained Australia to three consecutive World Cup wins (1999, 2003, 2007)?', options: ['Steve Waugh', 'Ricky Ponting', 'Adam Gilchrist', 'Mark Taylor'], answer: 1, difficulty: 'medium' },
  { id: 'ig28', category: 'international_general', question: 'Which cricketer is known as "Captain Cool"?', options: ['Kane Williamson', 'MS Dhoni', 'AB de Villiers', 'Kumar Sangakkara'], answer: 1, difficulty: 'easy' },
  { id: 'ig29', category: 'international_general', question: 'Who was the first cricketer to score 100 international centuries?', options: ['Ricky Ponting', 'Sachin Tendulkar', 'Jacques Kallis', 'Brian Lara'], answer: 1, difficulty: 'easy' },
  { id: 'ig30', category: 'international_general', question: 'Which team won the inaugural ICC World Test Championship in 2021?', options: ['India', 'Australia', 'New Zealand', 'England'], answer: 2, difficulty: 'medium' },
  { id: 'ig31', category: 'international_general', question: 'Who has the most stumpings in international cricket?', options: ['Adam Gilchrist', 'Kumar Sangakkara', 'MS Dhoni', 'Mark Boucher'], answer: 2, difficulty: 'medium' },
  { id: 'ig32', category: 'international_general', question: 'Which country did cricket originate in?', options: ['Australia', 'India', 'England', 'South Africa'], answer: 2, difficulty: 'easy' },
  { id: 'ig33', category: 'international_general', question: 'Who was the first batsman to score 10,000 ODI runs?', options: ['Sachin Tendulkar', 'Desmond Haynes', 'Javed Miandad', 'Allan Border'], answer: 0, difficulty: 'medium' },
  { id: 'ig34', category: 'international_general', question: 'How many players are there in a cricket team?', options: ['9', '10', '11', '12'], answer: 2, difficulty: 'easy' },
  { id: 'ig35', category: 'international_general', question: 'Which cricketer famously hit the winning six in the 2011 World Cup final?', options: ['Sachin Tendulkar', 'Gautam Gambhir', 'MS Dhoni', 'Yuvraj Singh'], answer: 2, difficulty: 'easy' },
  { id: 'ig36', category: 'international_general', question: 'Who was the first cricketer to take 600 Test wickets?', options: ['Muttiah Muralitharan', 'Shane Warne', 'Courtney Walsh', 'Anil Kumble'], answer: 1, difficulty: 'hard' },
  { id: 'ig37', category: 'international_general', question: 'Which country won the 2023 ODI World Cup?', options: ['India', 'England', 'Pakistan', 'Australia'], answer: 3, difficulty: 'easy' },
  { id: 'ig38', category: 'international_general', question: 'Who is the only batsman to score a century on Test debut and in the last Test?', options: ['Mohammad Azharuddin', 'Greg Chappell', 'Jacques Kallis', 'Sourav Ganguly'], answer: 0, difficulty: 'hard' },
  { id: 'ig39', category: 'international_general', question: 'Which cricketer is known as "Master Blaster"?', options: ['Virat Kohli', 'Chris Gayle', 'Sachin Tendulkar', 'Viv Richards'], answer: 2, difficulty: 'easy' },
  { id: 'ig40', category: 'international_general', question: 'What is the Duckworth-Lewis-Stern method used for?', options: ['Calculating batting averages', 'Revised targets in rain-affected matches', 'Determining run rate', 'Net run rate calculation'], answer: 1, difficulty: 'medium' },
  { id: 'ig41', category: 'international_general', question: 'Who was the first bowler to take a hat-trick in all three formats?', options: ['Lasith Malinga', 'Wasim Akram', 'Brett Lee', 'Rashid Khan'], answer: 0, difficulty: 'hard' },
  { id: 'ig42', category: 'international_general', question: 'Which country has played the most Test matches?', options: ['India', 'Australia', 'England', 'West Indies'], answer: 2, difficulty: 'medium' },
  { id: 'ig43', category: 'international_general', question: 'Who was the first woman to score a double century in ODIs?', options: ['Meg Lanning', 'Belinda Clark', 'Mithali Raj', 'Smriti Mandhana'], answer: 1, difficulty: 'hard' },
  { id: 'ig44', category: 'international_general', question: 'What is the maximum number of overs a bowler can bowl in an ODI?', options: ['8', '10', '12', '15'], answer: 1, difficulty: 'easy' },
  { id: 'ig45', category: 'international_general', question: 'Which cricketer is known as "The Little Master" from India?', options: ['Rahul Dravid', 'Sunil Gavaskar', 'Sachin Tendulkar', 'Kapil Dev'], answer: 1, difficulty: 'medium' },
  { id: 'ig46', category: 'international_general', question: 'Which cricketer has the most not-outs in ODI cricket?', options: ['MS Dhoni', 'Michael Bevan', 'Javed Miandad', 'Lance Klusener'], answer: 0, difficulty: 'medium' },
  { id: 'ig47', category: 'international_general', question: 'Who was the first cricketer to be given out by the third umpire?', options: ['Sachin Tendulkar', 'Jonty Rhodes', 'Brian Lara', 'Steve Waugh'], answer: 0, difficulty: 'hard' },
  { id: 'ig48', category: 'international_general', question: 'Which ICC trophy is awarded to the number one ranked Test team?', options: ['ICC Trophy', 'ICC Test Championship Mace', 'Ashes Urn', 'Wisden Trophy'], answer: 1, difficulty: 'medium' },
  { id: 'ig49', category: 'international_general', question: 'Who is the only cricketer to have scored a century in all three formats on debut?', options: ['Nobody has done this', 'Rohit Sharma', 'Babar Azam', 'Joe Root'], answer: 0, difficulty: 'hard' },
  { id: 'ig50', category: 'international_general', question: 'Which team won the 2022 T20 World Cup?', options: ['India', 'Pakistan', 'England', 'New Zealand'], answer: 2, difficulty: 'easy' },
  { id: 'ig51', category: 'international_general', question: 'Who holds the record for the fastest fifty in ODI cricket (off 16 balls)?', options: ['Shahid Afridi', 'AB de Villiers', 'Sanath Jayasuriya', 'Mark Boucher'], answer: 1, difficulty: 'medium' },
  { id: 'ig52', category: 'international_general', question: 'Which cricketer has the nickname "Boom Boom"?', options: ['Shahid Afridi', 'Chris Gayle', 'Andre Russell', 'Glenn Maxwell'], answer: 0, difficulty: 'easy' },
  { id: 'ig53', category: 'international_general', question: 'Who was the Man of the Tournament in the 2011 Cricket World Cup?', options: ['MS Dhoni', 'Sachin Tendulkar', 'Yuvraj Singh', 'Zaheer Khan'], answer: 2, difficulty: 'medium' },
  { id: 'ig54', category: 'international_general', question: 'What is a "maiden over" in cricket?', options: ['First over of the match', 'An over with no runs conceded', 'An over with a wicket', 'Last over of the innings'], answer: 1, difficulty: 'easy' },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL — TEST (40+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'it1', category: 'international_test', question: 'Who has scored the most centuries in Test cricket?', options: ['Ricky Ponting', 'Jacques Kallis', 'Sachin Tendulkar', 'Steve Smith'], answer: 2, difficulty: 'easy' },
  { id: 'it2', category: 'international_test', question: 'Which two countries played the first-ever Test match in 1877?', options: ['England vs India', 'England vs Australia', 'England vs South Africa', 'Australia vs West Indies'], answer: 1, difficulty: 'medium' },
  { id: 'it3', category: 'international_test', question: 'Who took a perfect 10-wicket haul in a Test innings for India?', options: ['Harbhajan Singh', 'Ravichandran Ashwin', 'Anil Kumble', 'Javagal Srinath'], answer: 2, difficulty: 'easy' },
  { id: 'it4', category: 'international_test', question: 'What is the highest team score in Test cricket (903/7)?', options: ['Australia vs England', 'Sri Lanka vs India', 'England vs Australia', 'India vs Sri Lanka'], answer: 2, difficulty: 'hard' },
  { id: 'it5', category: 'international_test', question: 'Who has taken the most catches as a non-wicketkeeper in Tests?', options: ['Rahul Dravid', 'Jacques Kallis', 'Ricky Ponting', 'Mahela Jayawardene'], answer: 0, difficulty: 'medium' },
  { id: 'it6', category: 'international_test', question: 'Which team has won the most Test matches in history?', options: ['England', 'India', 'Australia', 'West Indies'], answer: 2, difficulty: 'easy' },
  { id: 'it7', category: 'international_test', question: 'Who holds the record for most Test wickets by a fast bowler?', options: ['Glenn McGrath', 'Courtney Walsh', 'James Anderson', 'Stuart Broad'], answer: 2, difficulty: 'medium' },
  { id: 'it8', category: 'international_test', question: 'What is the lowest team total in Test cricket?', options: ['26 by New Zealand', '30 by South Africa', '36 by Australia', '42 by India'], answer: 0, difficulty: 'hard' },
  { id: 'it9', category: 'international_test', question: 'Which batsman scored 374 in a Test against England in 2004?', options: ['Sachin Tendulkar', 'Brian Lara', 'Matthew Hayden', 'Virender Sehwag'], answer: 1, difficulty: 'medium' },
  { id: 'it10', category: 'international_test', question: 'Who has played the most Test matches?', options: ['Sachin Tendulkar', 'Steve Waugh', 'Allan Border', 'Jacques Kallis'], answer: 0, difficulty: 'easy' },
  { id: 'it11', category: 'international_test', question: 'Which bowler took 19 wickets in a single Test match?', options: ['Muttiah Muralitharan', 'Jim Laker', 'Sydney Barnes', 'Anil Kumble'], answer: 1, difficulty: 'medium' },
  { id: 'it12', category: 'international_test', question: 'Which ground hosted the first Test match ever played?', options: ['Lord\'s', 'The Oval', 'Melbourne Cricket Ground', 'Sydney Cricket Ground'], answer: 2, difficulty: 'medium' },
  { id: 'it13', category: 'international_test', question: 'Who scored 309 in a day in a Test match against Pakistan in 2003?', options: ['Matthew Hayden', 'Adam Gilchrist', 'Virender Sehwag', 'Brian Lara'], answer: 2, difficulty: 'hard' },
  { id: 'it14', category: 'international_test', question: 'What is the Ashes series played between?', options: ['England and South Africa', 'England and Australia', 'Australia and India', 'England and West Indies'], answer: 1, difficulty: 'easy' },
  { id: 'it15', category: 'international_test', question: 'Who has the most Test runs without scoring a century?', options: ['Shivnarine Chanderpaul', 'Andy Flower', 'Chris Martin', 'Daniel Vettori'], answer: 3, difficulty: 'hard' },
  { id: 'it16', category: 'international_test', question: 'Which wicketkeeper has the most dismissals in Test cricket?', options: ['Adam Gilchrist', 'Mark Boucher', 'Ian Healy', 'MS Dhoni'], answer: 1, difficulty: 'medium' },
  { id: 'it17', category: 'international_test', question: 'Who scored the fastest Test century (off 54 balls)?', options: ['Brendon McCullum', 'Viv Richards', 'Adam Gilchrist', 'Jack Gregory'], answer: 0, difficulty: 'medium' },
  { id: 'it18', category: 'international_test', question: 'Which country played their first Test match in 2018?', options: ['Ireland', 'Afghanistan', 'Nepal', 'Both Ireland and Afghanistan'], answer: 3, difficulty: 'medium' },
  { id: 'it19', category: 'international_test', question: 'Who has the highest individual Test score for India?', options: ['Sachin Tendulkar', 'Virender Sehwag', 'Karun Nair', 'VVS Laxman'], answer: 2, difficulty: 'hard' },
  { id: 'it20', category: 'international_test', question: 'What is the "Gabba" (Brisbane) famous for in Test cricket?', options: ['Australia\'s unbeaten record until 2021', 'Highest Test score', 'Fastest bowling recorded', 'Most drawn Tests'], answer: 0, difficulty: 'easy' },
  { id: 'it21', category: 'international_test', question: 'Who broke Australia\'s Gabba fortress in January 2021?', options: ['England', 'New Zealand', 'India', 'South Africa'], answer: 2, difficulty: 'easy' },
  { id: 'it22', category: 'international_test', question: 'Who scored 281 at the Gabba to help India win in 2021?', options: ['Ajinkya Rahane', 'Shubman Gill', 'Rishabh Pant', 'Cheteshwar Pujara'], answer: 2, difficulty: 'hard' },
  { id: 'it23', category: 'international_test', question: 'What is Sir Don Bradman\'s highest Test score?', options: ['304', '334', '270', '299*'], answer: 1, difficulty: 'medium' },
  { id: 'it24', category: 'international_test', question: 'Which spinner has taken the most Test wickets for India?', options: ['Harbhajan Singh', 'Bishan Singh Bedi', 'Anil Kumble', 'Ravichandran Ashwin'], answer: 2, difficulty: 'medium' },
  { id: 'it25', category: 'international_test', question: 'Who was the first player to score 11,000 Test runs?', options: ['Brian Lara', 'Sachin Tendulkar', 'Allan Border', 'Steve Waugh'], answer: 1, difficulty: 'hard' },
  { id: 'it26', category: 'international_test', question: 'In Test cricket, how many balls are in an over?', options: ['5', '6', '7', '8'], answer: 1, difficulty: 'easy' },
  { id: 'it27', category: 'international_test', question: 'Which team won the 2023 World Test Championship final?', options: ['India', 'Australia', 'England', 'South Africa'], answer: 1, difficulty: 'easy' },
  { id: 'it28', category: 'international_test', question: 'Who has the most five-wicket hauls in Test cricket?', options: ['Shane Warne', 'Muttiah Muralitharan', 'Anil Kumble', 'Richard Hadlee'], answer: 1, difficulty: 'medium' },
  { id: 'it29', category: 'international_test', question: 'Which fast bowler took 10 wickets on Test debut for India vs Pakistan in 1999?', options: ['Javagal Srinath', 'Irfan Pathan', 'Zaheer Khan', 'Ajit Agarkar'], answer: 3, difficulty: 'hard' },
  { id: 'it30', category: 'international_test', question: 'What is the longest Test match ever played (in days)?', options: ['7 days', '9 days', '10 days', '12 days'], answer: 2, difficulty: 'hard' },
  { id: 'it31', category: 'international_test', question: 'Who holds the record for most Test match appearances as captain?', options: ['Allan Border', 'Graeme Smith', 'Stephen Fleming', 'Ricky Ponting'], answer: 1, difficulty: 'medium' },
  { id: 'it32', category: 'international_test', question: 'Which batsman has the most ducks in Test cricket?', options: ['Courtney Walsh', 'Chris Martin', 'Shane Warne', 'Muttiah Muralitharan'], answer: 1, difficulty: 'hard' },
  { id: 'it33', category: 'international_test', question: 'Who scored a century in his 100th Test match at Chennai in 2008?', options: ['Ricky Ponting', 'Sachin Tendulkar', 'Rahul Dravid', 'VVS Laxman'], answer: 1, difficulty: 'medium' },
  { id: 'it34', category: 'international_test', question: 'What was the result of the famous Tied Test in 1960?', options: ['Australia vs West Indies ended in a tie', 'England vs Australia ended in a tie', 'India vs Pakistan ended in a tie', 'South Africa vs England ended in a tie'], answer: 0, difficulty: 'medium' },
  { id: 'it35', category: 'international_test', question: 'Who took 10 wickets in a Test innings for England against Australia in 1956?', options: ['Fred Trueman', 'Jim Laker', 'Alec Bedser', 'Brian Statham'], answer: 1, difficulty: 'medium' },
  { id: 'it36', category: 'international_test', question: 'Which batsman scored 281 and 149* in the same Test match at Kolkata in 2001?', options: ['Sachin Tendulkar', 'Rahul Dravid', 'VVS Laxman', 'Sourav Ganguly'], answer: 2, difficulty: 'medium' },
  { id: 'it37', category: 'international_test', question: 'Who has the best bowling average in Test cricket (min 2000 wickets)?', options: ['George Lohmann', 'Sydney Barnes', 'Malcolm Marshall', 'Glenn McGrath'], answer: 0, difficulty: 'hard' },
  { id: 'it38', category: 'international_test', question: 'Which Indian bowler took a hat-trick against Australia at Kolkata in 2001?', options: ['Anil Kumble', 'Javagal Srinath', 'Harbhajan Singh', 'Zaheer Khan'], answer: 2, difficulty: 'easy' },
  { id: 'it39', category: 'international_test', question: 'Who is the youngest player to score a Test double century?', options: ['Javed Miandad', 'Sachin Tendulkar', 'Mohammad Ashraful', 'Gary Sobers'], answer: 0, difficulty: 'hard' },
  { id: 'it40', category: 'international_test', question: 'What is the Border-Gavaskar Trophy contested between?', options: ['India and England', 'Australia and South Africa', 'India and Australia', 'India and West Indies'], answer: 2, difficulty: 'easy' },
  { id: 'it41', category: 'international_test', question: 'Who scored 335* in Test cricket for Pakistan against India?', options: ['Inzamam-ul-Haq', 'Javed Miandad', 'Hanif Mohammad', 'Younis Khan'], answer: 2, difficulty: 'hard' },
  { id: 'it42', category: 'international_test', question: 'Which country was bowled out for 36 in a Test match in 2020?', options: ['Bangladesh', 'India', 'Sri Lanka', 'West Indies'], answer: 1, difficulty: 'easy' },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL — ODI (40+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'io1', category: 'international_odi', question: 'Who has scored the most runs in ODI cricket history?', options: ['Virat Kohli', 'Sachin Tendulkar', 'Ricky Ponting', 'Kumar Sangakkara'], answer: 1, difficulty: 'easy' },
  { id: 'io2', category: 'international_odi', question: 'Who took the first hat-trick in a World Cup match?', options: ['Wasim Akram', 'Chetan Sharma', 'Chaminda Vaas', 'Brett Lee'], answer: 1, difficulty: 'hard' },
  { id: 'io3', category: 'international_odi', question: 'Which player has the most ODI wickets?', options: ['Wasim Akram', 'Muttiah Muralitharan', 'Brett Lee', 'Chaminda Vaas'], answer: 1, difficulty: 'medium' },
  { id: 'io4', category: 'international_odi', question: 'Who scored the first ODI double century (200*)?', options: ['Rohit Sharma', 'Martin Guptill', 'Sachin Tendulkar', 'Virender Sehwag'], answer: 2, difficulty: 'easy' },
  { id: 'io5', category: 'international_odi', question: 'What is the highest team total in ODI cricket?', options: ['481/6 by England', '444/3 by England', '443/9 by Sri Lanka', '438/9 by South Africa'], answer: 0, difficulty: 'medium' },
  { id: 'io6', category: 'international_odi', question: 'Who hit the most sixes in a single ODI innings (16 sixes)?', options: ['Chris Gayle', 'Rohit Sharma', 'Eoin Morgan', 'AB de Villiers'], answer: 0, difficulty: 'medium' },
  { id: 'io7', category: 'international_odi', question: 'Which bowler has the best ODI bowling figures (8/19)?', options: ['Chaminda Vaas', 'Glenn McGrath', 'Stuart Broad', 'Shahid Afridi'], answer: 0, difficulty: 'hard' },
  { id: 'io8', category: 'international_odi', question: 'How many times has India won the ODI World Cup?', options: ['1', '2', '3', '4'], answer: 1, difficulty: 'easy' },
  { id: 'io9', category: 'international_odi', question: 'Who scored 183 against Pakistan in the 2003 World Cup?', options: ['Sachin Tendulkar', 'Sourav Ganguly', 'Rahul Dravid', 'Virender Sehwag'], answer: 0, difficulty: 'medium' },
  { id: 'io10', category: 'international_odi', question: 'Which bowler has taken the most wickets in World Cup history?', options: ['Glenn McGrath', 'Muttiah Muralitharan', 'Wasim Akram', 'Mitchell Starc'], answer: 3, difficulty: 'medium' },
  { id: 'io11', category: 'international_odi', question: 'Who has the highest individual score in a World Cup match?', options: ['Chris Gayle (215)', 'Martin Guptill (237*)', 'Rohit Sharma (264)', 'Glenn Maxwell (201*)'], answer: 1, difficulty: 'medium' },
  { id: 'io12', category: 'international_odi', question: 'How many overs are there in a standard ODI match per innings?', options: ['40', '45', '50', '60'], answer: 2, difficulty: 'easy' },
  { id: 'io13', category: 'international_odi', question: 'Who holds the record for the most centuries in ODI cricket?', options: ['Sachin Tendulkar', 'Virat Kohli', 'Ricky Ponting', 'Hashim Amla'], answer: 1, difficulty: 'medium' },
  { id: 'io14', category: 'international_odi', question: 'Which team won the 1996 Cricket World Cup?', options: ['Australia', 'India', 'Sri Lanka', 'Pakistan'], answer: 2, difficulty: 'easy' },
  { id: 'io15', category: 'international_odi', question: 'Who was the Man of the Match in the 2019 World Cup final?', options: ['Ben Stokes', 'Jos Buttler', 'Jason Roy', 'Jofra Archer'], answer: 0, difficulty: 'medium' },
  { id: 'io16', category: 'international_odi', question: 'Which team scored 438/9 in a famous ODI match in 2006?', options: ['Australia', 'England', 'India', 'South Africa'], answer: 3, difficulty: 'medium' },
  { id: 'io17', category: 'international_odi', question: 'Who has the most runs in a single ODI World Cup edition?', options: ['Sachin Tendulkar (2003)', 'Sachin Tendulkar (1996)', 'Martin Guptill (2015)', 'Rohit Sharma (2019)'], answer: 0, difficulty: 'hard' },
  { id: 'io18', category: 'international_odi', question: 'Which cricketer scored five centuries in a single World Cup?', options: ['Sachin Tendulkar', 'Rohit Sharma', 'Kumar Sangakkara', 'David Warner'], answer: 1, difficulty: 'medium' },
  { id: 'io19', category: 'international_odi', question: 'Who scored three ODI double centuries?', options: ['Sachin Tendulkar', 'Chris Gayle', 'Rohit Sharma', 'Martin Guptill'], answer: 2, difficulty: 'easy' },
  { id: 'io20', category: 'international_odi', question: 'Which bowler took 7/15 in a 2015 World Cup match?', options: ['Mitchell Starc', 'Tim Southee', 'Trent Boult', 'Glenn Maxwell'], answer: 1, difficulty: 'hard' },
  { id: 'io21', category: 'international_odi', question: 'Who has the most Player of the Match awards in World Cup history?', options: ['Sachin Tendulkar', 'Ricky Ponting', 'Glenn McGrath', 'Adam Gilchrist'], answer: 0, difficulty: 'medium' },
  { id: 'io22', category: 'international_odi', question: 'Which pair holds the record for highest ODI partnership (331 runs)?', options: ['Tendulkar and Ganguly', 'Tendulkar and Dravid', 'Rohit and Kohli', 'Jayasuriya and Mahanama'], answer: 3, difficulty: 'hard' },
  { id: 'io23', category: 'international_odi', question: 'Who captained the West Indies to the 1979 World Cup victory?', options: ['Viv Richards', 'Clive Lloyd', 'Gordon Greenidge', 'Desmond Haynes'], answer: 1, difficulty: 'medium' },
  { id: 'io24', category: 'international_odi', question: 'In which year did Kapil Dev lead India to their first World Cup win?', options: ['1979', '1983', '1987', '1992'], answer: 1, difficulty: 'easy' },
  { id: 'io25', category: 'international_odi', question: 'Who has the best bowling strike rate in ODI World Cup history (min 30 wickets)?', options: ['Mitchell Starc', 'Glenn McGrath', 'Wasim Akram', 'Chaminda Vaas'], answer: 0, difficulty: 'hard' },
  { id: 'io26', category: 'international_odi', question: 'Which batsman scored a century in a World Cup final?', options: ['Sachin Tendulkar', 'Ricky Ponting', 'Adam Gilchrist', 'All of them'], answer: 3, difficulty: 'medium' },
  { id: 'io27', category: 'international_odi', question: 'What was unique about the 2019 World Cup final?', options: ['It was rained out', 'It ended in a tie and was decided by Super Over', 'It was the first final in Asia', 'A bowler won Man of the Match'], answer: 1, difficulty: 'easy' },
  { id: 'io28', category: 'international_odi', question: 'Who scored 149 in the 2003 World Cup final?', options: ['Sachin Tendulkar', 'Matthew Hayden', 'Ricky Ponting', 'Adam Gilchrist'], answer: 2, difficulty: 'medium' },
  { id: 'io29', category: 'international_odi', question: 'Which country has reached the most ODI World Cup finals?', options: ['India', 'England', 'Australia', 'West Indies'], answer: 2, difficulty: 'easy' },
  { id: 'io30', category: 'international_odi', question: 'Who has the most ODI runs without scoring a century?', options: ['Paul Collingwood', 'Michael Bevan', 'Grant Flower', 'Andy Flower'], answer: 1, difficulty: 'hard' },
  { id: 'io31', category: 'international_odi', question: 'Which country won the 1992 World Cup?', options: ['England', 'South Africa', 'Pakistan', 'New Zealand'], answer: 2, difficulty: 'easy' },
  { id: 'io32', category: 'international_odi', question: 'Who hit 6 sixes in an over against England in the 2007 T20 World Cup?', options: ['MS Dhoni', 'Yuvraj Singh', 'Virender Sehwag', 'Rohit Sharma'], answer: 1, difficulty: 'easy' },
  { id: 'io33', category: 'international_odi', question: 'Which player has the highest ODI batting average (min 50 innings)?', options: ['Virat Kohli', 'Babar Azam', 'Ryan ten Doeschate', 'AB de Villiers'], answer: 2, difficulty: 'hard' },
  { id: 'io34', category: 'international_odi', question: 'Who scored the fastest ODI century for India?', options: ['Virat Kohli', 'Virender Sehwag', 'Yuvraj Singh', 'KL Rahul'], answer: 1, difficulty: 'medium' },
  { id: 'io35', category: 'international_odi', question: 'Which was the first ODI match ever played?', options: ['England vs Australia (1971)', 'England vs India (1974)', 'Australia vs West Indies (1975)', 'England vs West Indies (1973)'], answer: 0, difficulty: 'medium' },
  { id: 'io36', category: 'international_odi', question: 'Who has the most ODI appearances (463 matches)?', options: ['Sachin Tendulkar', 'Sanath Jayasuriya', 'Mahela Jayawardene', 'Inzamam-ul-Haq'], answer: 0, difficulty: 'easy' },
  { id: 'io37', category: 'international_odi', question: 'What is the lowest team total in ODI cricket?', options: ['35 by Zimbabwe', '36 by Canada', '43 by Pakistan', '45 by Canada'], answer: 0, difficulty: 'hard' },
  { id: 'io38', category: 'international_odi', question: 'Who won the Man of the Tournament in the 2023 ODI World Cup?', options: ['Virat Kohli', 'Travis Head', 'Glenn Maxwell', 'Mohammed Shami'], answer: 0, difficulty: 'medium' },
  { id: 'io39', category: 'international_odi', question: 'Which bowler claimed 7 wickets in the 2023 World Cup semifinal for India?', options: ['Jasprit Bumrah', 'Mohammed Siraj', 'Mohammed Shami', 'Ravindra Jadeja'], answer: 2, difficulty: 'medium' },
  { id: 'io40', category: 'international_odi', question: 'Who has the most catches by a fielder in ODI cricket?', options: ['Ricky Ponting', 'Mahela Jayawardene', 'Sachin Tendulkar', 'Ross Taylor'], answer: 1, difficulty: 'medium' },
  { id: 'io41', category: 'international_odi', question: 'Which batsman scored 175 against Australia in the 2011 World Cup quarterfinal?', options: ['Sachin Tendulkar', 'Virat Kohli', 'Yuvraj Singh', 'Virender Sehwag'], answer: 0, difficulty: 'medium' },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL — T20I (35+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'i20_1', category: 'international_t20i', question: 'Which country won the inaugural ICC T20 World Cup in 2007?', options: ['Pakistan', 'Australia', 'India', 'South Africa'], answer: 2, difficulty: 'easy' },
  { id: 'i20_2', category: 'international_t20i', question: 'Who has the highest individual score in T20I cricket?', options: ['Aaron Finch', 'Hazratullah Zazai', 'Rohit Sharma', 'Colin Munro'], answer: 0, difficulty: 'medium' },
  { id: 'i20_3', category: 'international_t20i', question: 'What is Aaron Finch\'s record T20I score?', options: ['156*', '162*', '172', '175'], answer: 2, difficulty: 'hard' },
  { id: 'i20_4', category: 'international_t20i', question: 'Who has the most T20I wickets?', options: ['Rashid Khan', 'Tim Southee', 'Shakib Al Hasan', 'Wanindu Hasaranga'], answer: 2, difficulty: 'medium' },
  { id: 'i20_5', category: 'international_t20i', question: 'Which bowler has the best T20I bowling figures of 6/7?', options: ['Ajantha Mendis', 'Rashid Khan', 'Bhuvneshwar Kumar', 'Yuzvendra Chahal'], answer: 0, difficulty: 'hard' },
  { id: 'i20_6', category: 'international_t20i', question: 'Who has scored the most runs in T20I cricket?', options: ['Virat Kohli', 'Rohit Sharma', 'Babar Azam', 'Martin Guptill'], answer: 1, difficulty: 'medium' },
  { id: 'i20_7', category: 'international_t20i', question: 'Which country won the 2007 T20 World Cup final?', options: ['India beat Pakistan', 'Australia beat India', 'Pakistan beat India', 'India beat Australia'], answer: 0, difficulty: 'easy' },
  { id: 'i20_8', category: 'international_t20i', question: 'How many overs per side in a T20 match?', options: ['15', '18', '20', '25'], answer: 2, difficulty: 'easy' },
  { id: 'i20_9', category: 'international_t20i', question: 'Who hit the famous "remember the name" six in the 2016 T20 World Cup?', options: ['Ben Stokes', 'Carlos Brathwaite', 'Marlon Samuels', 'Dwayne Bravo'], answer: 1, difficulty: 'easy' },
  { id: 'i20_10', category: 'international_t20i', question: 'Which country has won the most T20 World Cups?', options: ['India', 'West Indies', 'England', 'Australia'], answer: 1, difficulty: 'medium' },
  { id: 'i20_11', category: 'international_t20i', question: 'Who bowled the famous last over in the 2007 T20 World Cup final?', options: ['Zaheer Khan', 'Harbhajan Singh', 'RP Singh', 'Joginder Sharma'], answer: 3, difficulty: 'medium' },
  { id: 'i20_12', category: 'international_t20i', question: 'Who has the most T20I centuries?', options: ['Rohit Sharma', 'Colin Munro', 'Glenn Maxwell', 'Suryakumar Yadav'], answer: 0, difficulty: 'medium' },
  { id: 'i20_13', category: 'international_t20i', question: 'Which was the first T20I match ever played?', options: ['Australia vs New Zealand', 'England vs Australia', 'India vs South Africa', 'Australia vs South Africa'], answer: 0, difficulty: 'hard' },
  { id: 'i20_14', category: 'international_t20i', question: 'Who was named Player of the Tournament in the 2014 T20 World Cup?', options: ['Virat Kohli', 'Lasith Malinga', 'Dale Steyn', 'Kumar Sangakkara'], answer: 0, difficulty: 'hard' },
  { id: 'i20_15', category: 'international_t20i', question: 'Which Indian batsman is known as "Mr. 360" in T20Is?', options: ['Hardik Pandya', 'Suryakumar Yadav', 'Rishabh Pant', 'KL Rahul'], answer: 1, difficulty: 'easy' },
  { id: 'i20_16', category: 'international_t20i', question: 'What is the highest team total in T20I cricket?', options: ['260/5 by Sri Lanka', '278/3 by Afghanistan', '263/3 by Australia', '267/3 by Czech Republic'], answer: 1, difficulty: 'hard' },
  { id: 'i20_17', category: 'international_t20i', question: 'Who scored 52 off 18 balls to win the 2024 T20 World Cup semifinal?', options: ['Rohit Sharma', 'Virat Kohli', 'Suryakumar Yadav', 'Axar Patel'], answer: 3, difficulty: 'medium' },
  { id: 'i20_18', category: 'international_t20i', question: 'Which team won the 2024 T20 World Cup?', options: ['England', 'South Africa', 'India', 'Australia'], answer: 2, difficulty: 'easy' },
  { id: 'i20_19', category: 'international_t20i', question: 'Who took the catch of David Miller in the 2024 T20 World Cup final?', options: ['Virat Kohli', 'Suryakumar Yadav', 'Rohit Sharma', 'Axar Patel'], answer: 1, difficulty: 'medium' },
  { id: 'i20_20', category: 'international_t20i', question: 'Who holds the record for most sixes in T20I cricket?', options: ['Chris Gayle', 'Martin Guptill', 'Rohit Sharma', 'Eoin Morgan'], answer: 2, difficulty: 'medium' },
  { id: 'i20_21', category: 'international_t20i', question: 'What is the fastest T20I century (off 35 balls)?', options: ['David Miller', 'Rohit Sharma', 'Sahil Chauhan', 'Aaron Finch'], answer: 2, difficulty: 'hard' },
  { id: 'i20_22', category: 'international_t20i', question: 'Which bowler has the best economy rate in T20 World Cups (min 20 overs)?', options: ['Saeed Ajmal', 'Samuel Badree', 'Rashid Khan', 'Jasprit Bumrah'], answer: 3, difficulty: 'hard' },
  { id: 'i20_23', category: 'international_t20i', question: 'Who captained India in the 2007 T20 World Cup?', options: ['Rahul Dravid', 'MS Dhoni', 'Sourav Ganguly', 'Virender Sehwag'], answer: 1, difficulty: 'easy' },
  { id: 'i20_24', category: 'international_t20i', question: 'Which West Indian hit 4 consecutive sixes in the last over of the 2016 T20 WC final?', options: ['Dwayne Bravo', 'Andre Russell', 'Carlos Brathwaite', 'Chris Gayle'], answer: 2, difficulty: 'easy' },
  { id: 'i20_25', category: 'international_t20i', question: 'Who has taken the most T20I wickets for India?', options: ['Jasprit Bumrah', 'Yuzvendra Chahal', 'Bhuvneshwar Kumar', 'Ravindra Jadeja'], answer: 1, difficulty: 'medium' },
  { id: 'i20_26', category: 'international_t20i', question: 'What is the lowest team total in T20I cricket?', options: ['39 by Netherlands', '44 by Zimbabwe', '51 by Ireland', '53 by Nepal'], answer: 0, difficulty: 'hard' },
  { id: 'i20_27', category: 'international_t20i', question: 'Who scored 117 off 55 balls against England in the 2022 T20I series?', options: ['Rohit Sharma', 'Virat Kohli', 'Suryakumar Yadav', 'Ishan Kishan'], answer: 2, difficulty: 'medium' },
  { id: 'i20_28', category: 'international_t20i', question: 'Who was the top scorer in the 2016 T20 World Cup?', options: ['Virat Kohli', 'Joe Root', 'Tamim Iqbal', 'Chris Gayle'], answer: 0, difficulty: 'medium' },
  { id: 'i20_29', category: 'international_t20i', question: 'Which country hosted the 2021 T20 World Cup?', options: ['India', 'Australia', 'UAE and Oman', 'England'], answer: 2, difficulty: 'easy' },
  { id: 'i20_30', category: 'international_t20i', question: 'Who was named ICC T20I Cricketer of the Year 2022?', options: ['Babar Azam', 'Suryakumar Yadav', 'Sam Curran', 'Wanindu Hasaranga'], answer: 1, difficulty: 'medium' },
  { id: 'i20_31', category: 'international_t20i', question: 'In which year was the first T20I match played?', options: ['2003', '2005', '2007', '2004'], answer: 1, difficulty: 'medium' },
  { id: 'i20_32', category: 'international_t20i', question: 'Who has the most T20I matches as captain?', options: ['MS Dhoni', 'Eoin Morgan', 'Babar Azam', 'Rohit Sharma'], answer: 1, difficulty: 'hard' },
  { id: 'i20_33', category: 'international_t20i', question: 'Which player has the fastest T20I fifty (off 9 balls)?', options: ['Yuvraj Singh', 'Chris Gayle', 'Sahil Chauhan', 'David Miller'], answer: 2, difficulty: 'hard' },
  { id: 'i20_34', category: 'international_t20i', question: 'What is the powerplay restriction in T20I cricket?', options: ['First 4 overs', 'First 6 overs', 'First 8 overs', 'First 10 overs'], answer: 1, difficulty: 'easy' },
  { id: 'i20_35', category: 'international_t20i', question: 'Who scored 82* in the 2022 T20 World Cup final for England?', options: ['Jos Buttler', 'Ben Stokes', 'Alex Hales', 'Harry Brook'], answer: 1, difficulty: 'medium' },
  { id: 'i20_36', category: 'international_t20i', question: 'Who was the leading wicket-taker in the 2021 T20 World Cup?', options: ['Adam Zampa', 'Josh Hazlewood', 'Wanindu Hasaranga', 'Trent Boult'], answer: 2, difficulty: 'medium' },

  // ═══════════════════════════════════════════════════════════════════════════
  // GUESS THE CRICKETER (40+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'gc1', category: 'guess_cricketer', question: '15,921 Test runs, 51 centuries, Indian batsman known as "The Little Master"', options: ['Rahul Dravid', 'Sachin Tendulkar', 'Virat Kohli', 'Sunil Gavaskar'], answer: 1, difficulty: 'easy' },
  { id: 'gc2', category: 'guess_cricketer', question: '13,378 ODI runs, 43 centuries, Indian, played for RCB and Delhi Daredevils in IPL', options: ['Sachin Tendulkar', 'Rohit Sharma', 'Virat Kohli', 'MS Dhoni'], answer: 2, difficulty: 'easy' },
  { id: 'gc3', category: 'guess_cricketer', question: '800 Test wickets, Sri Lankan, right-arm off-spin bowler', options: ['Anil Kumble', 'Muttiah Muralitharan', 'Shane Warne', 'Rangana Herath'], answer: 1, difficulty: 'easy' },
  { id: 'gc4', category: 'guess_cricketer', question: '708 Test wickets, Australian leg-spinner, nicknamed "King of Spin"', options: ['Stuart MacGill', 'Shane Warne', 'Richie Benaud', 'Kerry O\'Keeffe'], answer: 1, difficulty: 'easy' },
  { id: 'gc5', category: 'guess_cricketer', question: '10,889 Test runs, captained India, famous for the 281 at Kolkata 2001, nicknamed "VVS"', options: ['Rahul Dravid', 'Sachin Tendulkar', 'VVS Laxman', 'Sourav Ganguly'], answer: 2, difficulty: 'medium' },
  { id: 'gc6', category: 'guess_cricketer', question: 'South African, scored the fastest ODI 150 (off 64 balls), played for RCB', options: ['Jacques Kallis', 'Hashim Amla', 'AB de Villiers', 'Dale Steyn'], answer: 2, difficulty: 'easy' },
  { id: 'gc7', category: 'guess_cricketer', question: '13,289 Test runs, 36 centuries, played for South Africa, all-rounder with 292 wickets', options: ['Shaun Pollock', 'Jacques Kallis', 'Lance Klusener', 'Jonty Rhodes'], answer: 1, difficulty: 'medium' },
  { id: 'gc8', category: 'guess_cricketer', question: 'West Indian, scored 400* in Tests, held the record for highest Test score twice', options: ['Viv Richards', 'Chris Gayle', 'Brian Lara', 'Shivnarine Chanderpaul'], answer: 2, difficulty: 'easy' },
  { id: 'gc9', category: 'guess_cricketer', question: 'Pakistani, 362 ODI wickets, left-arm fast bowler, known as "Sultan of Swing"', options: ['Shoaib Akhtar', 'Waqar Younis', 'Wasim Akram', 'Mohammad Asif'], answer: 2, difficulty: 'medium' },
  { id: 'gc10', category: 'guess_cricketer', question: 'Australian wicketkeeper, 379 Test dismissals, famous for aggressive batting style', options: ['Ian Healy', 'Rod Marsh', 'Adam Gilchrist', 'Brad Haddin'], answer: 2, difficulty: 'medium' },
  { id: 'gc11', category: 'guess_cricketer', question: '10,099 ODI runs, Indian wicketkeeper-captain, known for helicopter shot', options: ['Rishabh Pant', 'KL Rahul', 'MS Dhoni', 'Dinesh Karthik'], answer: 2, difficulty: 'easy' },
  { id: 'gc12', category: 'guess_cricketer', question: '8,586 Test runs, 22 centuries, Indian captain who scored a century on debut vs England at Lord\'s', options: ['Sachin Tendulkar', 'Rahul Dravid', 'Sourav Ganguly', 'Virender Sehwag'], answer: 2, difficulty: 'medium' },
  { id: 'gc13', category: 'guess_cricketer', question: 'Australian, 71 Test centuries, batting average of 99.94', options: ['Steve Smith', 'Ricky Ponting', 'Matthew Hayden', 'Don Bradman'], answer: 3, difficulty: 'easy' },
  { id: 'gc14', category: 'guess_cricketer', question: '563 Test wickets, Australian fast bowler, nicknamed "Pigeon"', options: ['Brett Lee', 'Jason Gillespie', 'Glenn McGrath', 'Mitchell Johnson'], answer: 2, difficulty: 'medium' },
  { id: 'gc15', category: 'guess_cricketer', question: 'Indian all-rounder, 1983 World Cup winning captain, took 434 Test wickets', options: ['Kapil Dev', 'Mohinder Amarnath', 'Ravi Shastri', 'Javagal Srinath'], answer: 0, difficulty: 'easy' },
  { id: 'gc16', category: 'guess_cricketer', question: '11,867 Test runs, Sri Lankan, scored a triple century (374), captained Sri Lanka', options: ['Aravinda de Silva', 'Kumar Sangakkara', 'Mahela Jayawardene', 'Sanath Jayasuriya'], answer: 2, difficulty: 'medium' },
  { id: 'gc17', category: 'guess_cricketer', question: 'New Zealand captain, known for sportsmanship, right-handed batsman, nicknamed "Steady"', options: ['Ross Taylor', 'Brendon McCullum', 'Kane Williamson', 'Daniel Vettori'], answer: 2, difficulty: 'easy' },
  { id: 'gc18', category: 'guess_cricketer', question: 'English, 700+ Test wickets, right-arm fast-medium, bowled until age 41', options: ['Stuart Broad', 'Andrew Flintoff', 'James Anderson', 'Steve Harmison'], answer: 2, difficulty: 'medium' },
  { id: 'gc19', category: 'guess_cricketer', question: 'Pakistani, fastest bowler to reach 100 mph, nicknamed "Rawalpindi Express"', options: ['Wasim Akram', 'Waqar Younis', 'Shoaib Akhtar', 'Mohammad Amir'], answer: 2, difficulty: 'easy' },
  { id: 'gc20', category: 'guess_cricketer', question: '12,472 Test runs, 38 centuries, South African left-handed opener, captained in 109 Tests', options: ['Jacques Kallis', 'Hashim Amla', 'AB de Villiers', 'Graeme Smith'], answer: 3, difficulty: 'medium' },
  { id: 'gc21', category: 'guess_cricketer', question: 'Indian, 619 Test wickets, right-arm leg-spin, took 10/74 in an innings', options: ['Ravichandran Ashwin', 'Harbhajan Singh', 'Anil Kumble', 'Bishan Singh Bedi'], answer: 2, difficulty: 'easy' },
  { id: 'gc22', category: 'guess_cricketer', question: '8,781 ODI runs, West Indian, holds records for most T20I sixes, known for "Universe Boss"', options: ['Brian Lara', 'Chris Gayle', 'Kieron Pollard', 'Dwayne Bravo'], answer: 1, difficulty: 'easy' },
  { id: 'gc23', category: 'guess_cricketer', question: 'Indian opener, 3 ODI double centuries (200, 209, 264), captains India in all formats', options: ['Virat Kohli', 'Shikhar Dhawan', 'KL Rahul', 'Rohit Sharma'], answer: 3, difficulty: 'easy' },
  { id: 'gc24', category: 'guess_cricketer', question: 'Sri Lankan, 4-ball hat-trick specialist, took hat-tricks in 3 World Cups', options: ['Chaminda Vaas', 'Muttiah Muralitharan', 'Lasith Malinga', 'Nuwan Kulasekara'], answer: 2, difficulty: 'medium' },
  { id: 'gc25', category: 'guess_cricketer', question: '13,378 Test runs, 45 centuries, "The Wall" of Indian cricket, Mr. Dependable', options: ['VVS Laxman', 'Sachin Tendulkar', 'Rahul Dravid', 'Sourav Ganguly'], answer: 2, difficulty: 'easy' },
  { id: 'gc26', category: 'guess_cricketer', question: 'English all-rounder, famous for 2005 Ashes, scored 167 at Edgbaston', options: ['Kevin Pietersen', 'Andrew Flintoff', 'Ben Stokes', 'Ian Botham'], answer: 1, difficulty: 'medium' },
  { id: 'gc27', category: 'guess_cricketer', question: 'Indian, fastest T20I century for India, "King of IPL", plays for PBKS (formerly)', options: ['Virat Kohli', 'Suresh Raina', 'Yuvraj Singh', 'KL Rahul'], answer: 3, difficulty: 'hard' },
  { id: 'gc28', category: 'guess_cricketer', question: 'Australian, scored 380 in Test cricket vs Zimbabwe, left-handed opener', options: ['Justin Langer', 'Mark Taylor', 'Matthew Hayden', 'David Warner'], answer: 2, difficulty: 'medium' },
  { id: 'gc29', category: 'guess_cricketer', question: 'New Zealand, first player to take 431 Test wickets as a fast bowler, knighted', options: ['Shane Bond', 'Daniel Vettori', 'Chris Cairns', 'Richard Hadlee'], answer: 3, difficulty: 'medium' },
  { id: 'gc30', category: 'guess_cricketer', question: 'Indian, 8,586 Test runs, triple century (319) in Tests, aggressive opener', options: ['Rohit Sharma', 'Gautam Gambhir', 'Virender Sehwag', 'Sachin Tendulkar'], answer: 2, difficulty: 'medium' },
  { id: 'gc31', category: 'guess_cricketer', question: 'English all-rounder, 2019 World Cup hero, scored 135* in the final', options: ['Joe Root', 'Eoin Morgan', 'Ben Stokes', 'Jos Buttler'], answer: 2, difficulty: 'easy' },
  { id: 'gc32', category: 'guess_cricketer', question: 'Pakistani, 362 ODI wickets, 414 Test wickets, reverse swing specialist, fast bowler', options: ['Wasim Akram', 'Imran Khan', 'Shoaib Akhtar', 'Waqar Younis'], answer: 3, difficulty: 'medium' },
  { id: 'gc33', category: 'guess_cricketer', question: 'South African, fastest 150+ km/h bowler, played for RCB and SRH, "Steyn Gun"', options: ['Morne Morkel', 'Kagiso Rabada', 'Dale Steyn', 'Allan Donald'], answer: 2, difficulty: 'easy' },
  { id: 'gc34', category: 'guess_cricketer', question: 'Indian, 2011 World Cup MOTM in final, left-handed all-rounder, cancer survivor', options: ['Harbhajan Singh', 'Yuvraj Singh', 'Suresh Raina', 'Irfan Pathan'], answer: 1, difficulty: 'easy' },
  { id: 'gc35', category: 'guess_cricketer', question: 'Australian, scored 27 Test centuries, modern era batting great, average above 60', options: ['David Warner', 'Ricky Ponting', 'Steve Smith', 'Matthew Hayden'], answer: 2, difficulty: 'medium' },
  { id: 'gc36', category: 'guess_cricketer', question: 'West Indian, 519 Test wickets, fast bowler, first to 500 Test wickets', options: ['Malcolm Marshall', 'Curtly Ambrose', 'Courtney Walsh', 'Joel Garner'], answer: 2, difficulty: 'hard' },
  { id: 'gc37', category: 'guess_cricketer', question: 'Sri Lankan, 12,400 Test runs, 38 centuries, wicketkeeper-batsman, ICC Player of the Year twice', options: ['Mahela Jayawardene', 'Aravinda de Silva', 'Kumar Sangakkara', 'Tillakaratne Dilshan'], answer: 2, difficulty: 'medium' },
  { id: 'gc38', category: 'guess_cricketer', question: 'Indian, left-arm fast bowler, swung the ball both ways, 311 ODI wickets, played 2003/2011 WC', options: ['Irfan Pathan', 'Ashish Nehra', 'Zaheer Khan', 'RP Singh'], answer: 2, difficulty: 'medium' },
  { id: 'gc39', category: 'guess_cricketer', question: 'Pakistani captain, led to 1992 World Cup win, later became Prime Minister', options: ['Wasim Akram', 'Javed Miandad', 'Imran Khan', 'Shahid Afridi'], answer: 2, difficulty: 'easy' },
  { id: 'gc40', category: 'guess_cricketer', question: 'Indian wicketkeeper, scored 89* at Gabba 2021, left-handed, plays for DC in IPL', options: ['MS Dhoni', 'Wriddhiman Saha', 'Rishabh Pant', 'KL Rahul'], answer: 2, difficulty: 'easy' },
  { id: 'gc41', category: 'guess_cricketer', question: 'Australian, 168 Test wickets, lethal left-arm fast bowler, famous for 2013-14 Ashes', options: ['Mitchell Starc', 'Mitchell Johnson', 'Brett Lee', 'Jason Gillespie'], answer: 1, difficulty: 'medium' },
  { id: 'gc42', category: 'guess_cricketer', question: 'English, 604 Test wickets, left-arm fast bowler, took 8/15 in an ODI', options: ['James Anderson', 'Stuart Broad', 'Andrew Flintoff', 'Steve Harmison'], answer: 1, difficulty: 'medium' },
  { id: 'gc43', category: 'guess_cricketer', question: 'Indian, 530+ Test wickets, right-arm off-spin, fastest Indian to 500 Test wickets', options: ['Harbhajan Singh', 'Anil Kumble', 'Ravindra Jadeja', 'Ravichandran Ashwin'], answer: 3, difficulty: 'medium' },

  // ═══════════════════════════════════════════════════════════════════════════
  // IPL — GENERAL (50+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'ipl1', category: 'ipl_general', question: 'Which team won the first IPL in 2008?', options: ['Chennai Super Kings', 'Mumbai Indians', 'Rajasthan Royals', 'Royal Challengers Bangalore'], answer: 2, difficulty: 'easy' },
  { id: 'ipl2', category: 'ipl_general', question: 'Who is the all-time leading run-scorer in IPL history?', options: ['Rohit Sharma', 'David Warner', 'Virat Kohli', 'Shikhar Dhawan'], answer: 2, difficulty: 'easy' },
  { id: 'ipl3', category: 'ipl_general', question: 'Who is the highest wicket-taker in IPL history?', options: ['Lasith Malinga', 'Amit Mishra', 'Yuzvendra Chahal', 'Dwayne Bravo'], answer: 2, difficulty: 'medium' },
  { id: 'ipl4', category: 'ipl_general', question: 'Which team has won the most IPL titles?', options: ['Chennai Super Kings', 'Mumbai Indians', 'Kolkata Knight Riders', 'Royal Challengers Bangalore'], answer: 1, difficulty: 'easy' },
  { id: 'ipl5', category: 'ipl_general', question: 'In which year did the IPL begin?', options: ['2006', '2007', '2008', '2009'], answer: 2, difficulty: 'easy' },
  { id: 'ipl6', category: 'ipl_general', question: 'Who holds the record for the highest individual score in IPL (175*)?', options: ['AB de Villiers', 'Chris Gayle', 'Brendon McCullum', 'David Warner'], answer: 1, difficulty: 'easy' },
  { id: 'ipl7', category: 'ipl_general', question: 'Who scored 158* in the very first IPL match?', options: ['Adam Gilchrist', 'Virender Sehwag', 'Brendon McCullum', 'Chris Gayle'], answer: 2, difficulty: 'medium' },
  { id: 'ipl8', category: 'ipl_general', question: 'Which franchise was suspended for two years (2016-17)?', options: ['Rajasthan Royals and CSK', 'RCB and DC', 'KKR and PBKS', 'MI and SRH'], answer: 0, difficulty: 'medium' },
  { id: 'ipl9', category: 'ipl_general', question: 'Who hit the longest six in IPL history (117 meters)?', options: ['Chris Gayle', 'AB de Villiers', 'Liam Livingstone', 'Andre Russell'], answer: 2, difficulty: 'hard' },
  { id: 'ipl10', category: 'ipl_general', question: 'Who has the most Player of the Match awards in IPL?', options: ['Chris Gayle', 'AB de Villiers', 'David Warner', 'Virat Kohli'], answer: 0, difficulty: 'medium' },
  { id: 'ipl11', category: 'ipl_general', question: 'Which player has hit the most sixes in IPL history?', options: ['Chris Gayle', 'AB de Villiers', 'MS Dhoni', 'Rohit Sharma'], answer: 0, difficulty: 'easy' },
  { id: 'ipl12', category: 'ipl_general', question: 'Who captained Rajasthan Royals to the first IPL title?', options: ['Graeme Smith', 'Shane Warne', 'Rahul Dravid', 'Shane Watson'], answer: 1, difficulty: 'easy' },
  { id: 'ipl13', category: 'ipl_general', question: 'What is the highest team total in IPL history?', options: ['263/5 by RCB', '287/3 by SRH', '277/3 by KKR', '246/5 by CSK'], answer: 0, difficulty: 'medium' },
  { id: 'ipl14', category: 'ipl_general', question: 'Which bowler has the best bowling figures in a single IPL match?', options: ['Sohail Tanvir (6/14)', 'Alzarri Joseph (6/12)', 'Anil Kumble (5/5)', 'Adam Zampa (6/19)'], answer: 1, difficulty: 'hard' },
  { id: 'ipl15', category: 'ipl_general', question: 'How many teams currently play in the IPL?', options: ['8', '10', '12', '9'], answer: 1, difficulty: 'easy' },
  { id: 'ipl16', category: 'ipl_general', question: 'Which two teams were added to the IPL in 2022?', options: ['GT and LSG', 'DC and SRH', 'PBKS and RR', 'KTK and UP'], answer: 0, difficulty: 'easy' },
  { id: 'ipl17', category: 'ipl_general', question: 'What is the lowest team total in IPL history?', options: ['58 by KKR', '49 by RCB', '67 by DC', '73 by RR'], answer: 1, difficulty: 'medium' },
  { id: 'ipl18', category: 'ipl_general', question: 'Who has won the most IPL Orange Caps (most runs)?', options: ['Virat Kohli', 'David Warner', 'Chris Gayle', 'Shikhar Dhawan'], answer: 1, difficulty: 'medium' },
  { id: 'ipl19', category: 'ipl_general', question: 'Who has won the most IPL Purple Caps (most wickets)?', options: ['Bhuvneshwar Kumar', 'Dwayne Bravo', 'Lasith Malinga', 'Yuzvendra Chahal'], answer: 1, difficulty: 'medium' },
  { id: 'ipl20', category: 'ipl_general', question: 'Which player was sold for the highest price in IPL auction history (2024)?', options: ['Rishabh Pant', 'Mitchell Starc', 'Pat Cummins', 'Shreyas Iyer'], answer: 1, difficulty: 'medium' },
  { id: 'ipl21', category: 'ipl_general', question: 'Who has played the most IPL matches?', options: ['MS Dhoni', 'Virat Kohli', 'Rohit Sharma', 'Dinesh Karthik'], answer: 0, difficulty: 'medium' },
  { id: 'ipl22', category: 'ipl_general', question: 'Who scored the fastest IPL century (off 30 balls)?', options: ['Chris Gayle', 'AB de Villiers', 'KL Rahul', 'David Miller'], answer: 0, difficulty: 'medium' },
  { id: 'ipl23', category: 'ipl_general', question: 'Which team\'s home ground is the M. Chinnaswamy Stadium?', options: ['CSK', 'MI', 'RCB', 'DC'], answer: 2, difficulty: 'easy' },
  { id: 'ipl24', category: 'ipl_general', question: 'Who hit 4 sixes in the last over of an IPL final?', options: ['MS Dhoni', 'Andre Russell', 'Kieron Pollard', 'Carlos Brathwaite'], answer: 0, difficulty: 'hard' },
  { id: 'ipl25', category: 'ipl_general', question: 'Who has the best economy rate in IPL history (min 50 overs)?', options: ['Rashid Khan', 'Sunil Narine', 'Jasprit Bumrah', 'Ravindra Jadeja'], answer: 0, difficulty: 'medium' },
  { id: 'ipl26', category: 'ipl_general', question: 'Which overseas player has scored the most runs in IPL?', options: ['Chris Gayle', 'David Warner', 'AB de Villiers', 'Shane Watson'], answer: 1, difficulty: 'medium' },
  { id: 'ipl27', category: 'ipl_general', question: 'Who was the first player to score 5000 IPL runs?', options: ['Virat Kohli', 'Suresh Raina', 'Chris Gayle', 'Rohit Sharma'], answer: 1, difficulty: 'hard' },
  { id: 'ipl28', category: 'ipl_general', question: 'How many overs are bowled per side in an IPL match?', options: ['15', '18', '20', '25'], answer: 2, difficulty: 'easy' },
  { id: 'ipl29', category: 'ipl_general', question: 'Which IPL team plays at Eden Gardens?', options: ['MI', 'RCB', 'KKR', 'DC'], answer: 2, difficulty: 'easy' },
  { id: 'ipl30', category: 'ipl_general', question: 'Who holds the record for most fifties in IPL history?', options: ['Virat Kohli', 'David Warner', 'Shikhar Dhawan', 'Rohit Sharma'], answer: 2, difficulty: 'medium' },
  { id: 'ipl31', category: 'ipl_general', question: 'Which IPL team is owned by Bollywood actor Shah Rukh Khan?', options: ['MI', 'KKR', 'RR', 'DC'], answer: 1, difficulty: 'easy' },
  { id: 'ipl32', category: 'ipl_general', question: 'Who was the first player retained for Rs 16.25 crore in IPL retention?', options: ['Virat Kohli', 'MS Dhoni', 'Rohit Sharma', 'Jasprit Bumrah'], answer: 0, difficulty: 'hard' },
  { id: 'ipl33', category: 'ipl_general', question: 'Which IPL franchise is based in Hyderabad?', options: ['DC', 'SRH', 'GT', 'LSG'], answer: 1, difficulty: 'easy' },
  { id: 'ipl34', category: 'ipl_general', question: 'Who scored 973 runs in a single IPL season (2016)?', options: ['David Warner', 'Virat Kohli', 'Chris Gayle', 'KL Rahul'], answer: 1, difficulty: 'easy' },
  { id: 'ipl35', category: 'ipl_general', question: 'Which team has the most losses in IPL history?', options: ['Delhi Capitals', 'Punjab Kings', 'Royal Challengers Bangalore', 'Rajasthan Royals'], answer: 0, difficulty: 'hard' },
  { id: 'ipl36', category: 'ipl_general', question: 'Who has hit the most fours in IPL history?', options: ['Virat Kohli', 'Shikhar Dhawan', 'David Warner', 'Rohit Sharma'], answer: 1, difficulty: 'medium' },
  { id: 'ipl37', category: 'ipl_general', question: 'Which player has the most hat-tricks in IPL?', options: ['Amit Mishra', 'Bhuvneshwar Kumar', 'Lasith Malinga', 'Andrew Tye'], answer: 0, difficulty: 'medium' },
  { id: 'ipl38', category: 'ipl_general', question: 'Which IPL stadium has the highest seating capacity?', options: ['Wankhede Stadium', 'Eden Gardens', 'Narendra Modi Stadium', 'M. Chinnaswamy Stadium'], answer: 2, difficulty: 'medium' },
  { id: 'ipl39', category: 'ipl_general', question: 'Who is the IPL chairman and BCCI secretary credited with founding the IPL?', options: ['Sourav Ganguly', 'Lalit Modi', 'N. Srinivasan', 'Sharad Pawar'], answer: 1, difficulty: 'medium' },
  { id: 'ipl40', category: 'ipl_general', question: 'Which team did Sachin Tendulkar play for in the IPL?', options: ['Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bangalore', 'Kolkata Knight Riders'], answer: 1, difficulty: 'easy' },
  { id: 'ipl41', category: 'ipl_general', question: 'What is the strategic timeout duration in an IPL match?', options: ['2 minutes', '2.5 minutes', '3 minutes', '5 minutes'], answer: 1, difficulty: 'medium' },
  { id: 'ipl42', category: 'ipl_general', question: 'Who scored a century in an IPL final (2023)?', options: ['Devon Conway', 'Faf du Plessis', 'Ajinkya Rahane', 'Ruturaj Gaikwad'], answer: 0, difficulty: 'hard' },
  { id: 'ipl43', category: 'ipl_general', question: 'Which bowler took a hat-trick on IPL debut?', options: ['Alzarri Joseph', 'Thangarasu Natarajan', 'Umesh Yadav', 'Sam Curran'], answer: 0, difficulty: 'hard' },
  { id: 'ipl44', category: 'ipl_general', question: 'Who has taken the most catches in IPL history?', options: ['Virat Kohli', 'Suresh Raina', 'AB de Villiers', 'Kieron Pollard'], answer: 1, difficulty: 'hard' },
  { id: 'ipl45', category: 'ipl_general', question: 'What was Deccan Chargers renamed to?', options: ['Delhi Capitals', 'Sunrisers Hyderabad', 'Gujarat Titans', 'Lucknow Super Giants'], answer: 1, difficulty: 'medium' },
  { id: 'ipl46', category: 'ipl_general', question: 'In which IPL season did the Impact Player rule get introduced?', options: ['IPL 2022', 'IPL 2023', 'IPL 2024', 'IPL 2021'], answer: 1, difficulty: 'medium' },
  { id: 'ipl47', category: 'ipl_general', question: 'Who has won the IPL MVP award the most times?', options: ['Andre Russell', 'Sunil Narine', 'Shane Watson', 'Chris Gayle'], answer: 0, difficulty: 'hard' },
  { id: 'ipl48', category: 'ipl_general', question: 'Which pair holds the record for the highest partnership in IPL?', options: ['Kohli and de Villiers', 'Warner and Bairstow', 'Faf and Ruturaj', 'Gayle and Kohli'], answer: 0, difficulty: 'medium' },
  { id: 'ipl49', category: 'ipl_general', question: 'Who was the first uncapped player bought for over 10 crore in IPL auction?', options: ['Pawan Negi', 'Krunal Pandya', 'Yash Dayal', 'Varun Chakaravarthy'], answer: 0, difficulty: 'hard' },
  { id: 'ipl50', category: 'ipl_general', question: 'Which team won IPL 2024?', options: ['Chennai Super Kings', 'Kolkata Knight Riders', 'Sunrisers Hyderabad', 'Mumbai Indians'], answer: 1, difficulty: 'easy' },
  { id: 'ipl51', category: 'ipl_general', question: 'How many overseas players can play in an IPL XI?', options: ['3', '4', '5', '6'], answer: 1, difficulty: 'easy' },
  { id: 'ipl52', category: 'ipl_general', question: 'Who has the fastest fifty in IPL history (off 14 balls)?', options: ['KL Rahul', 'Pat Cummins', 'Nicholas Pooran', 'Sunil Narine'], answer: 1, difficulty: 'hard' },

  // ═══════════════════════════════════════════════════════════════════════════
  // IPL — MUMBAI INDIANS (25+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'mi1', category: 'ipl_mi', question: 'How many IPL titles have Mumbai Indians won?', options: ['3', '4', '5', '6'], answer: 2, difficulty: 'easy' },
  { id: 'mi2', category: 'ipl_mi', question: 'Who is the most successful captain of Mumbai Indians?', options: ['Sachin Tendulkar', 'Ricky Ponting', 'Rohit Sharma', 'Hardik Pandya'], answer: 2, difficulty: 'easy' },
  { id: 'mi3', category: 'ipl_mi', question: 'Which bowler has the most wickets for Mumbai Indians in IPL?', options: ['Lasith Malinga', 'Jasprit Bumrah', 'Harbhajan Singh', 'Rahul Chahar'], answer: 1, difficulty: 'medium' },
  { id: 'mi4', category: 'ipl_mi', question: 'Who is the owner of Mumbai Indians?', options: ['Mukesh Ambani', 'Nita Ambani', 'Anant Ambani', 'Reliance Industries'], answer: 1, difficulty: 'easy' },
  { id: 'mi5', category: 'ipl_mi', question: 'In which year did Mumbai Indians win their first IPL title?', options: ['2010', '2011', '2013', '2015'], answer: 2, difficulty: 'medium' },
  { id: 'mi6', category: 'ipl_mi', question: 'Who scored 87* off 25 balls for MI, one of the greatest IPL innings?', options: ['Rohit Sharma', 'Kieron Pollard', 'Ishan Kishan', 'Hardik Pandya'], answer: 1, difficulty: 'medium' },
  { id: 'mi7', category: 'ipl_mi', question: 'Which MI player is famous for yorkers and death bowling?', options: ['Trent Boult', 'Lasith Malinga', 'Mitchell McClenaghan', 'Dhawal Kulkarni'], answer: 1, difficulty: 'easy' },
  { id: 'mi8', category: 'ipl_mi', question: 'What is Mumbai Indians\' home ground?', options: ['Eden Gardens', 'Wankhede Stadium', 'DY Patil Stadium', 'Brabourne Stadium'], answer: 1, difficulty: 'easy' },
  { id: 'mi9', category: 'ipl_mi', question: 'Who was MI\'s first captain?', options: ['Sachin Tendulkar', 'Harbhajan Singh', 'Sanath Jayasuriya', 'Shaun Pollock'], answer: 0, difficulty: 'medium' },
  { id: 'mi10', category: 'ipl_mi', question: 'Which year did MI win the IPL by just 1 run in the final?', options: ['2017', '2019', '2020', '2015'], answer: 1, difficulty: 'medium' },
  { id: 'mi11', category: 'ipl_mi', question: 'Who hit 6 sixes in an over for MI against Akash Chopra\'s commentary in 2021?', options: ['Rohit Sharma', 'Kieron Pollard', 'Hardik Pandya', 'Ishan Kishan'], answer: 1, difficulty: 'medium' },
  { id: 'mi12', category: 'ipl_mi', question: 'Which MI player scored the fastest IPL half-century at the time (18 balls) in 2017?', options: ['Kieron Pollard', 'Ishan Kishan', 'Suryakumar Yadav', 'Hardik Pandya'], answer: 0, difficulty: 'hard' },
  { id: 'mi13', category: 'ipl_mi', question: 'Who was appointed MI captain for IPL 2024?', options: ['Suryakumar Yadav', 'Rohit Sharma', 'Hardik Pandya', 'Ishan Kishan'], answer: 2, difficulty: 'easy' },
  { id: 'mi14', category: 'ipl_mi', question: 'Which spinner played over 100 matches for MI and took 100+ wickets?', options: ['Harbhajan Singh', 'Rahul Chahar', 'Krunal Pandya', 'Piyush Chawla'], answer: 2, difficulty: 'hard' },
  { id: 'mi15', category: 'ipl_mi', question: 'Who has the highest individual score for MI in IPL?', options: ['Rohit Sharma', 'Sachin Tendulkar', 'Ishan Kishan', 'Liam Livingstone'], answer: 2, difficulty: 'hard' },
  { id: 'mi16', category: 'ipl_mi', question: 'Which overseas all-rounder was retained by MI for IPL 2022 mega auction?', options: ['Kieron Pollard', 'Trent Boult', 'Quinton de Kock', 'Jofra Archer'], answer: 3, difficulty: 'hard' },
  { id: 'mi17', category: 'ipl_mi', question: 'In which years did MI win back-to-back IPL titles?', options: ['2013 and 2014', '2017 and 2018', '2019 and 2020', '2015 and 2016'], answer: 2, difficulty: 'medium' },
  { id: 'mi18', category: 'ipl_mi', question: 'Who was MI\'s coach during their 5 title wins?', options: ['Ricky Ponting', 'Mahela Jayawardene', 'Stephen Fleming', 'John Wright'], answer: 1, difficulty: 'medium' },
  { id: 'mi19', category: 'ipl_mi', question: 'Which MI player scored a century on IPL debut?', options: ['Dewald Brevis', 'Ishan Kishan', 'Quinton de Kock', 'Brendon McCullum'], answer: 0, difficulty: 'hard' },
  { id: 'mi20', category: 'ipl_mi', question: 'What is MI\'s team motto/song?', options: ['Halla Bol', 'Duniya Hila Denge', 'Korbo Lorbo Jeetbo', 'Whistle Podu'], answer: 1, difficulty: 'medium' },
  { id: 'mi21', category: 'ipl_mi', question: 'Who was Mumbai Indians\' first overseas signing?', options: ['Dwayne Bravo', 'Sanath Jayasuriya', 'Shaun Pollock', 'Andrew Symonds'], answer: 1, difficulty: 'hard' },
  { id: 'mi22', category: 'ipl_mi', question: 'Which MI player took a hat-trick in the 2019 IPL final qualifier?', options: ['Jasprit Bumrah', 'Lasith Malinga', 'Rahul Chahar', 'Krunal Pandya'], answer: 0, difficulty: 'hard' },
  { id: 'mi23', category: 'ipl_mi', question: 'Which MI batsman scored over 400 runs in the 2020 IPL season?', options: ['Rohit Sharma', 'Quinton de Kock', 'Ishan Kishan', 'Suryakumar Yadav'], answer: 3, difficulty: 'medium' },
  { id: 'mi24', category: 'ipl_mi', question: 'Who bowled the last over in the 2019 IPL final for MI?', options: ['Jasprit Bumrah', 'Lasith Malinga', 'Krunal Pandya', 'Rahul Chahar'], answer: 1, difficulty: 'medium' },
  { id: 'mi25', category: 'ipl_mi', question: 'What color jersey does Mumbai Indians wear?', options: ['Yellow', 'Red', 'Blue', 'Orange'], answer: 2, difficulty: 'easy' },

  // ═══════════════════════════════════════════════════════════════════════════
  // IPL — CHENNAI SUPER KINGS (25+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'csk1', category: 'ipl_csk', question: 'How many IPL titles have Chennai Super Kings won?', options: ['3', '4', '5', '6'], answer: 2, difficulty: 'easy' },
  { id: 'csk2', category: 'ipl_csk', question: 'Who has captained CSK in the most IPL matches?', options: ['Suresh Raina', 'Ravindra Jadeja', 'MS Dhoni', 'Faf du Plessis'], answer: 2, difficulty: 'easy' },
  { id: 'csk3', category: 'ipl_csk', question: 'What is CSK\'s famous fan chant?', options: ['Halla Bol', 'Mumbai Mumbai', 'Whistle Podu', 'Go Challengers'], answer: 2, difficulty: 'easy' },
  { id: 'csk4', category: 'ipl_csk', question: 'Who is the all-time leading run-scorer for CSK?', options: ['MS Dhoni', 'Suresh Raina', 'Faf du Plessis', 'Ruturaj Gaikwad'], answer: 1, difficulty: 'easy' },
  { id: 'csk5', category: 'ipl_csk', question: 'Which ground is CSK\'s traditional home?', options: ['Wankhede Stadium', 'MA Chidambaram Stadium', 'Eden Gardens', 'Narendra Modi Stadium'], answer: 1, difficulty: 'easy' },
  { id: 'csk6', category: 'ipl_csk', question: 'Who is the owner of Chennai Super Kings?', options: ['Mukesh Ambani', 'N. Srinivasan', 'Chennai Super Kings Cricket Ltd', 'Shah Rukh Khan'], answer: 2, difficulty: 'medium' },
  { id: 'csk7', category: 'ipl_csk', question: 'In which year did CSK return from a 2-year suspension?', options: ['2017', '2018', '2019', '2020'], answer: 1, difficulty: 'medium' },
  { id: 'csk8', category: 'ipl_csk', question: 'Who scored 3 centuries in IPL 2021 for CSK?', options: ['MS Dhoni', 'Ruturaj Gaikwad', 'Faf du Plessis', 'Moeen Ali'], answer: 2, difficulty: 'medium' },
  { id: 'csk9', category: 'ipl_csk', question: 'Who is CSK\'s long-time coach?', options: ['Ricky Ponting', 'Mahela Jayawardene', 'Stephen Fleming', 'Tom Moody'], answer: 2, difficulty: 'medium' },
  { id: 'csk10', category: 'ipl_csk', question: 'Which CSK player is known as "Mr. IPL" for his consistent performances?', options: ['MS Dhoni', 'Suresh Raina', 'Dwayne Bravo', 'Ravindra Jadeja'], answer: 1, difficulty: 'easy' },
  { id: 'csk11', category: 'ipl_csk', question: 'Who has taken the most wickets for CSK in IPL?', options: ['Ravichandran Ashwin', 'Dwayne Bravo', 'Ravindra Jadeja', 'Deepak Chahar'], answer: 1, difficulty: 'medium' },
  { id: 'csk12', category: 'ipl_csk', question: 'CSK won the IPL title in 2018 after returning from suspension. Who was the final\'s opponent?', options: ['MI', 'KKR', 'SRH', 'RCB'], answer: 2, difficulty: 'medium' },
  { id: 'csk13', category: 'ipl_csk', question: 'Which CSK all-rounder has a song called "Champion"?', options: ['Suresh Raina', 'Dwayne Bravo', 'Ravindra Jadeja', 'Shane Watson'], answer: 1, difficulty: 'easy' },
  { id: 'csk14', category: 'ipl_csk', question: 'Who scored a century in the 2018 IPL final for CSK?', options: ['MS Dhoni', 'Suresh Raina', 'Shane Watson', 'Faf du Plessis'], answer: 2, difficulty: 'medium' },
  { id: 'csk15', category: 'ipl_csk', question: 'In how many IPL finals has CSK appeared?', options: ['7', '8', '9', '10'], answer: 3, difficulty: 'medium' },
  { id: 'csk16', category: 'ipl_csk', question: 'Who was CSK\'s first-ever match winning performer in 2008?', options: ['MS Dhoni', 'Matthew Hayden', 'Suresh Raina', 'Muttiah Muralitharan'], answer: 1, difficulty: 'hard' },
  { id: 'csk17', category: 'ipl_csk', question: 'Which CSK player won the Orange Cap in 2021?', options: ['Faf du Plessis', 'Ruturaj Gaikwad', 'Moeen Ali', 'Robin Uthappa'], answer: 1, difficulty: 'medium' },
  { id: 'csk18', category: 'ipl_csk', question: 'What animal is CSK\'s mascot?', options: ['Tiger', 'Elephant', 'Lion', 'Bull'], answer: 2, difficulty: 'easy' },
  { id: 'csk19', category: 'ipl_csk', question: 'Who was named CSK captain for IPL 2024?', options: ['MS Dhoni', 'Ruturaj Gaikwad', 'Ravindra Jadeja', 'Devon Conway'], answer: 1, difficulty: 'easy' },
  { id: 'csk20', category: 'ipl_csk', question: 'Which spinner played for CSK from 2008-2015 and took 90+ wickets?', options: ['Harbhajan Singh', 'Ravichandran Ashwin', 'Imran Tahir', 'Suresh Raina'], answer: 1, difficulty: 'medium' },
  { id: 'csk21', category: 'ipl_csk', question: 'CSK finished last in the points table in which year?', options: ['2020', '2022', '2019', 'They never finished last'], answer: 1, difficulty: 'hard' },
  { id: 'csk22', category: 'ipl_csk', question: 'Who hit the winning runs for CSK in the 2023 IPL final?', options: ['MS Dhoni', 'Ravindra Jadeja', 'Shivam Dube', 'Devon Conway'], answer: 0, difficulty: 'medium' },
  { id: 'csk23', category: 'ipl_csk', question: 'Which West Indian fast bowler played for CSK and was known for death bowling?', options: ['Andre Russell', 'Sunil Narine', 'Dwayne Bravo', 'Kieron Pollard'], answer: 2, difficulty: 'easy' },
  { id: 'csk24', category: 'ipl_csk', question: 'What year did CSK win their 5th IPL title?', options: ['2021', '2022', '2023', '2024'], answer: 2, difficulty: 'easy' },
  { id: 'csk25', category: 'ipl_csk', question: 'Who scored a match-winning 71* in the 2021 IPL final for CSK?', options: ['Ruturaj Gaikwad', 'Faf du Plessis', 'MS Dhoni', 'Robin Uthappa'], answer: 1, difficulty: 'hard' },
  { id: 'csk26', category: 'ipl_csk', question: 'What color jersey does CSK wear?', options: ['Blue', 'Red', 'Yellow', 'Orange'], answer: 2, difficulty: 'easy' },

  // ═══════════════════════════════════════════════════════════════════════════
  // IPL — ROYAL CHALLENGERS BANGALORE (25+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'rcb1', category: 'ipl_rcb', question: 'How many IPL titles have RCB won?', options: ['0', '1', '2', '3'], answer: 0, difficulty: 'easy' },
  { id: 'rcb2', category: 'ipl_rcb', question: 'Who has scored the most runs for RCB in IPL?', options: ['AB de Villiers', 'Chris Gayle', 'Virat Kohli', 'Faf du Plessis'], answer: 2, difficulty: 'easy' },
  { id: 'rcb3', category: 'ipl_rcb', question: 'Who scored 973 runs in IPL 2016 playing for RCB?', options: ['AB de Villiers', 'Chris Gayle', 'Virat Kohli', 'KL Rahul'], answer: 2, difficulty: 'easy' },
  { id: 'rcb4', category: 'ipl_rcb', question: 'Who hit 175* in an IPL match playing for RCB?', options: ['Virat Kohli', 'AB de Villiers', 'Chris Gayle', 'KL Rahul'], answer: 2, difficulty: 'easy' },
  { id: 'rcb5', category: 'ipl_rcb', question: 'What is RCB\'s famous fan slogan?', options: ['Whistlepodu', 'Ee Sala Cup Namde', 'Halla Bol', 'Duniya Hila Denge'], answer: 1, difficulty: 'easy' },
  { id: 'rcb6', category: 'ipl_rcb', question: 'Who scored 129 off 52 balls against Gujarat Lions in IPL 2016 for RCB?', options: ['Virat Kohli', 'AB de Villiers', 'Chris Gayle', 'Shane Watson'], answer: 1, difficulty: 'medium' },
  { id: 'rcb7', category: 'ipl_rcb', question: 'What was RCB\'s record low score of 49 against?', options: ['MI', 'KKR', 'CSK', 'DC'], answer: 1, difficulty: 'medium' },
  { id: 'rcb8', category: 'ipl_rcb', question: 'Which South African legend played for RCB from 2011-2021?', options: ['Dale Steyn', 'Faf du Plessis', 'AB de Villiers', 'Hashim Amla'], answer: 2, difficulty: 'easy' },
  { id: 'rcb9', category: 'ipl_rcb', question: 'Who captained RCB in IPL 2022 and 2023?', options: ['Virat Kohli', 'Glenn Maxwell', 'Faf du Plessis', 'Dinesh Karthik'], answer: 2, difficulty: 'medium' },
  { id: 'rcb10', category: 'ipl_rcb', question: 'Which RCB bowler won the Purple Cap in 2023?', options: ['Mohammed Siraj', 'Harshal Patel', 'Josh Hazlewood', 'Wanindu Hasaranga'], answer: 0, difficulty: 'medium' },
  { id: 'rcb11', category: 'ipl_rcb', question: 'RCB scored 263/5, the highest IPL total ever, against which team?', options: ['MI', 'PBKS', 'DC', 'KKR'], answer: 1, difficulty: 'medium' },
  { id: 'rcb12', category: 'ipl_rcb', question: 'Who was RCB\'s first captain in IPL 2008?', options: ['Virat Kohli', 'Kevin Pietersen', 'Rahul Dravid', 'Jacques Kallis'], answer: 2, difficulty: 'medium' },
  { id: 'rcb13', category: 'ipl_rcb', question: 'Which RCB player won the Purple Cap in IPL 2021?', options: ['Yuzvendra Chahal', 'Mohammed Siraj', 'Harshal Patel', 'Kyle Jamieson'], answer: 2, difficulty: 'medium' },
  { id: 'rcb14', category: 'ipl_rcb', question: 'How many IPL finals have RCB reached?', options: ['1', '2', '3', '4'], answer: 2, difficulty: 'medium' },
  { id: 'rcb15', category: 'ipl_rcb', question: 'Which Australian all-rounder played for RCB in 2021-2023?', options: ['Marcus Stoinis', 'Glenn Maxwell', 'Mitchell Marsh', 'Cameron Green'], answer: 1, difficulty: 'easy' },
  { id: 'rcb16', category: 'ipl_rcb', question: 'Who took 5/5 for RCB, the best bowling figures in IPL at the time?', options: ['Zaheer Khan', 'Anil Kumble', 'Dale Steyn', 'Yuzvendra Chahal'], answer: 1, difficulty: 'hard' },
  { id: 'rcb17', category: 'ipl_rcb', question: 'In which IPL final did RCB face SRH?', options: ['2015', '2016', '2017', '2018'], answer: 1, difficulty: 'medium' },
  { id: 'rcb18', category: 'ipl_rcb', question: 'Which RCB player hit 37 sixes in IPL 2012?', options: ['Virat Kohli', 'AB de Villiers', 'Chris Gayle', 'Tillakaratne Dilshan'], answer: 2, difficulty: 'medium' },
  { id: 'rcb19', category: 'ipl_rcb', question: 'Who was RCB\'s coach in the 2016 season?', options: ['Gary Kirsten', 'Daniel Vettori', 'Simon Katich', 'Mike Hesson'], answer: 1, difficulty: 'hard' },
  { id: 'rcb20', category: 'ipl_rcb', question: 'What is RCB\'s home ground?', options: ['Eden Gardens', 'M. Chinnaswamy Stadium', 'Wankhede Stadium', 'MA Chidambaram Stadium'], answer: 1, difficulty: 'easy' },
  { id: 'rcb21', category: 'ipl_rcb', question: 'Who became the first player retained by RCB for IPL 2025 mega auction?', options: ['Faf du Plessis', 'Virat Kohli', 'Glenn Maxwell', 'Mohammed Siraj'], answer: 1, difficulty: 'easy' },
  { id: 'rcb22', category: 'ipl_rcb', question: 'Which RCB wicketkeeper was known for his finishing skills in IPL 2022?', options: ['KS Bharat', 'Dinesh Karthik', 'Quinton de Kock', 'Srikar Bharat'], answer: 1, difficulty: 'medium' },
  { id: 'rcb23', category: 'ipl_rcb', question: 'Who scored 117 in 57 balls for RCB against PBKS in 2020?', options: ['Virat Kohli', 'AB de Villiers', 'KL Rahul', 'Devdutt Padikkal'], answer: 2, difficulty: 'hard' },
  { id: 'rcb24', category: 'ipl_rcb', question: 'Which RCB spinner took the most wickets in IPL 2018?', options: ['Yuzvendra Chahal', 'Washington Sundar', 'Murugan Ashwin', 'Pawan Negi'], answer: 0, difficulty: 'medium' },
  { id: 'rcb25', category: 'ipl_rcb', question: 'What is the RCB team color?', options: ['Yellow', 'Blue', 'Red and Black', 'Purple'], answer: 2, difficulty: 'easy' },

  // ═══════════════════════════════════════════════════════════════════════════
  // IPL — KOLKATA KNIGHT RIDERS (20+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'kkr1', category: 'ipl_kkr', question: 'How many IPL titles have KKR won?', options: ['1', '2', '3', '4'], answer: 2, difficulty: 'easy' },
  { id: 'kkr2', category: 'ipl_kkr', question: 'Who owns the Kolkata Knight Riders?', options: ['Mukesh Ambani', 'Shah Rukh Khan', 'Preity Zinta', 'Vijay Mallya'], answer: 1, difficulty: 'easy' },
  { id: 'kkr3', category: 'ipl_kkr', question: 'Who captained KKR to their first two IPL titles?', options: ['Sourav Ganguly', 'Brendon McCullum', 'Gautam Gambhir', 'Dinesh Karthik'], answer: 2, difficulty: 'easy' },
  { id: 'kkr4', category: 'ipl_kkr', question: 'Who has been KKR\'s mystery spinner for many years?', options: ['Kuldeep Yadav', 'Piyush Chawla', 'Sunil Narine', 'Varun Chakaravarthy'], answer: 2, difficulty: 'easy' },
  { id: 'kkr5', category: 'ipl_kkr', question: 'What is KKR\'s famous anthem?', options: ['Halla Bol', 'Korbo Lorbo Jeetbo', 'Whistle Podu', 'Go Go Go'], answer: 1, difficulty: 'easy' },
  { id: 'kkr6', category: 'ipl_kkr', question: 'Which KKR player scored 158* in the first-ever IPL match?', options: ['Chris Gayle', 'Brendon McCullum', 'Sourav Ganguly', 'Adam Gilchrist'], answer: 1, difficulty: 'easy' },
  { id: 'kkr7', category: 'ipl_kkr', question: 'In which years did KKR win their first two IPL titles?', options: ['2012 and 2014', '2011 and 2013', '2013 and 2015', '2012 and 2013'], answer: 0, difficulty: 'medium' },
  { id: 'kkr8', category: 'ipl_kkr', question: 'Who was KKR\'s first captain?', options: ['Sourav Ganguly', 'Brendon McCullum', 'Ricky Ponting', 'John Buchanan'], answer: 0, difficulty: 'medium' },
  { id: 'kkr9', category: 'ipl_kkr', question: 'Which KKR all-rounder is known for his explosive hitting and played from 2014-2022?', options: ['Sunil Narine', 'Andre Russell', 'Chris Lynn', 'Shakib Al Hasan'], answer: 1, difficulty: 'easy' },
  { id: 'kkr10', category: 'ipl_kkr', question: 'Who captained KKR in IPL 2024 to the title?', options: ['Nitish Rana', 'Andre Russell', 'Shreyas Iyer', 'Sunil Narine'], answer: 2, difficulty: 'easy' },
  { id: 'kkr11', category: 'ipl_kkr', question: 'Which KKR player hit the fastest fifty (14 balls) in IPL history?', options: ['Andre Russell', 'Sunil Narine', 'Pat Cummins', 'Rinku Singh'], answer: 2, difficulty: 'hard' },
  { id: 'kkr12', category: 'ipl_kkr', question: 'What is KKR\'s home ground?', options: ['Wankhede Stadium', 'MA Chidambaram', 'Eden Gardens', 'Narendra Modi Stadium'], answer: 2, difficulty: 'easy' },
  { id: 'kkr13', category: 'ipl_kkr', question: 'Which KKR player hit 5 sixes in the last 5 balls against GT in 2023?', options: ['Andre Russell', 'Sunil Narine', 'Rinku Singh', 'Venkatesh Iyer'], answer: 2, difficulty: 'easy' },
  { id: 'kkr14', category: 'ipl_kkr', question: 'Who was KKR\'s most expensive buy in the IPL 2022 mega auction?', options: ['Shreyas Iyer', 'Pat Cummins', 'Sam Billings', 'Nitish Rana'], answer: 0, difficulty: 'medium' },
  { id: 'kkr15', category: 'ipl_kkr', question: 'Which left-arm spinner took the most wickets for KKR?', options: ['Kuldeep Yadav', 'Shakib Al Hasan', 'Sunil Narine', 'Piyush Chawla'], answer: 2, difficulty: 'medium' },
  { id: 'kkr16', category: 'ipl_kkr', question: 'Who scored the most runs for KKR in IPL history?', options: ['Gautam Gambhir', 'Robin Uthappa', 'Sunil Narine', 'Andre Russell'], answer: 0, difficulty: 'medium' },
  { id: 'kkr17', category: 'ipl_kkr', question: 'What color jersey does KKR wear?', options: ['Blue', 'Yellow', 'Purple and Gold', 'Red'], answer: 2, difficulty: 'easy' },
  { id: 'kkr18', category: 'ipl_kkr', question: 'Which KKR bowler took a hat-trick against RCB in 2017?', options: ['Sunil Narine', 'Umesh Yadav', 'Nathan Coulter-Nile', 'Colin de Grandhomme'], answer: 1, difficulty: 'hard' },
  { id: 'kkr19', category: 'ipl_kkr', question: 'Who was KKR\'s head coach for the 2024 title-winning season?', options: ['Jacques Kallis', 'Brendon McCullum', 'Chandrakant Pandit', 'Trevor Bayliss'], answer: 2, difficulty: 'medium' },
  { id: 'kkr20', category: 'ipl_kkr', question: 'Which KKR player scored a century in the 2024 IPL final?', options: ['Shreyas Iyer', 'Sunil Narine', 'Venkatesh Iyer', 'Andre Russell'], answer: 2, difficulty: 'medium' },
  { id: 'kkr21', category: 'ipl_kkr', question: 'Who opened with Sunil Narine for KKR in IPL 2024?', options: ['Rahmanullah Gurbaz', 'Phil Salt', 'Alex Hales', 'Jason Roy'], answer: 1, difficulty: 'medium' },

  // ═══════════════════════════════════════════════════════════════════════════
  // IPL — DELHI CAPITALS (20+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'dc1', category: 'ipl_dc', question: 'What was Delhi Capitals previously known as?', options: ['Delhi Royals', 'Delhi Daredevils', 'Delhi Chargers', 'Delhi Warriors'], answer: 1, difficulty: 'easy' },
  { id: 'dc2', category: 'ipl_dc', question: 'In which year did Delhi Daredevils rebrand to Delhi Capitals?', options: ['2017', '2018', '2019', '2020'], answer: 2, difficulty: 'medium' },
  { id: 'dc3', category: 'ipl_dc', question: 'Who has scored the most runs for Delhi in IPL?', options: ['Virender Sehwag', 'Shikhar Dhawan', 'Rishabh Pant', 'David Warner'], answer: 1, difficulty: 'medium' },
  { id: 'dc4', category: 'ipl_dc', question: 'Who captained DC to their first IPL final in 2020?', options: ['Rishabh Pant', 'Shreyas Iyer', 'Shikhar Dhawan', 'Kagiso Rabada'], answer: 1, difficulty: 'easy' },
  { id: 'dc5', category: 'ipl_dc', question: 'Which South African fast bowler won the Purple Cap for DC in 2020?', options: ['Dale Steyn', 'Kagiso Rabada', 'Anrich Nortje', 'Lungi Ngidi'], answer: 1, difficulty: 'medium' },
  { id: 'dc6', category: 'ipl_dc', question: 'Who was DC\'s head coach from 2019-2021?', options: ['Gary Kirsten', 'Ricky Ponting', 'Stephen Fleming', 'Justin Langer'], answer: 1, difficulty: 'easy' },
  { id: 'dc7', category: 'ipl_dc', question: 'What is DC\'s home ground?', options: ['Eden Gardens', 'Arun Jaitley Stadium', 'Wankhede Stadium', 'MA Chidambaram Stadium'], answer: 1, difficulty: 'easy' },
  { id: 'dc8', category: 'ipl_dc', question: 'How many IPL titles have Delhi Capitals won?', options: ['0', '1', '2', '3'], answer: 0, difficulty: 'easy' },
  { id: 'dc9', category: 'ipl_dc', question: 'Which DC player scored 97* off 63 balls against SRH in 2019 playoffs?', options: ['Shikhar Dhawan', 'Shreyas Iyer', 'Rishabh Pant', 'Prithvi Shaw'], answer: 2, difficulty: 'hard' },
  { id: 'dc10', category: 'ipl_dc', question: 'Who was Delhi Daredevils\' first captain in IPL 2008?', options: ['Virender Sehwag', 'Gautam Gambhir', 'Shoaib Malik', 'AB de Villiers'], answer: 0, difficulty: 'medium' },
  { id: 'dc11', category: 'ipl_dc', question: 'Which DC spinner took 4 wickets in 4 balls (including hat-trick) in 2019?', options: ['Ravichandran Ashwin', 'Amit Mishra', 'Axar Patel', 'Sandeep Lamichhane'], answer: 1, difficulty: 'hard' },
  { id: 'dc12', category: 'ipl_dc', question: 'Who bought Rishabh Pant for 20 crore in the 2025 mega auction?', options: ['MI', 'CSK', 'DC', 'LSG'], answer: 3, difficulty: 'medium' },
  { id: 'dc13', category: 'ipl_dc', question: 'Who has taken the most wickets for Delhi in IPL?', options: ['Amit Mishra', 'Kagiso Rabada', 'Ishant Sharma', 'Axar Patel'], answer: 0, difficulty: 'medium' },
  { id: 'dc14', category: 'ipl_dc', question: 'Which Australian fast bowler played for DC and bowled 150+ km/h regularly?', options: ['Pat Cummins', 'Mitchell Starc', 'Anrich Nortje', 'Kagiso Rabada'], answer: 2, difficulty: 'medium' },
  { id: 'dc15', category: 'ipl_dc', question: 'Who is the co-owner of Delhi Capitals from the JSW Group?', options: ['Parth Jindal', 'Nita Ambani', 'Juhi Chawla', 'Preity Zinta'], answer: 0, difficulty: 'hard' },
  { id: 'dc16', category: 'ipl_dc', question: 'Which DC opener scored 99 runs in a match against RR in 2019?', options: ['Shikhar Dhawan', 'Prithvi Shaw', 'Shreyas Iyer', 'Rishabh Pant'], answer: 1, difficulty: 'hard' },
  { id: 'dc17', category: 'ipl_dc', question: 'Who scored the fastest century for Delhi in IPL history?', options: ['Rishabh Pant', 'Virender Sehwag', 'AB de Villiers', 'David Warner'], answer: 1, difficulty: 'medium' },
  { id: 'dc18', category: 'ipl_dc', question: 'Who was DC\'s captain for IPL 2022?', options: ['Shreyas Iyer', 'Rishabh Pant', 'David Warner', 'Prithvi Shaw'], answer: 1, difficulty: 'easy' },
  { id: 'dc19', category: 'ipl_dc', question: 'Which DC player is known as the "Dilli Boy" and played for India U-19?', options: ['Rishabh Pant', 'Prithvi Shaw', 'Axar Patel', 'Shreyas Iyer'], answer: 1, difficulty: 'medium' },
  { id: 'dc20', category: 'ipl_dc', question: 'What color jersey does Delhi Capitals wear?', options: ['Yellow', 'Red and Blue', 'Blue and Red', 'Purple'], answer: 2, difficulty: 'easy' },

  // ═══════════════════════════════════════════════════════════════════════════
  // IPL — SUNRISERS HYDERABAD (20+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'srh1', category: 'ipl_srh', question: 'In which year did SRH win the IPL?', options: ['2013', '2015', '2016', '2018'], answer: 2, difficulty: 'easy' },
  { id: 'srh2', category: 'ipl_srh', question: 'Who captained SRH to their IPL title in 2016?', options: ['Shikhar Dhawan', 'Kane Williamson', 'David Warner', 'Bhuvneshwar Kumar'], answer: 2, difficulty: 'easy' },
  { id: 'srh3', category: 'ipl_srh', question: 'Which franchise did SRH replace in the IPL?', options: ['Kochi Tuskers', 'Deccan Chargers', 'Pune Warriors', 'Gujarat Lions'], answer: 1, difficulty: 'medium' },
  { id: 'srh4', category: 'ipl_srh', question: 'Who has scored the most runs for SRH in IPL?', options: ['Shikhar Dhawan', 'David Warner', 'Kane Williamson', 'Jonny Bairstow'], answer: 1, difficulty: 'easy' },
  { id: 'srh5', category: 'ipl_srh', question: 'Which SRH bowler won multiple Purple Caps?', options: ['Rashid Khan', 'Bhuvneshwar Kumar', 'Dwayne Bravo', 'Dale Steyn'], answer: 1, difficulty: 'medium' },
  { id: 'srh6', category: 'ipl_srh', question: 'What is SRH\'s home ground?', options: ['Rajiv Gandhi International Stadium', 'Eden Gardens', 'MA Chidambaram Stadium', 'Wankhede Stadium'], answer: 0, difficulty: 'easy' },
  { id: 'srh7', category: 'ipl_srh', question: 'Who joined SRH in 2013 and became their star Afghan spinner?', options: ['Mohammad Nabi', 'Rashid Khan', 'Mujeeb Ur Rahman', 'Naveen-ul-Haq'], answer: 1, difficulty: 'easy' },
  { id: 'srh8', category: 'ipl_srh', question: 'Who scored 126* for SRH, the highest individual score for the franchise?', options: ['David Warner', 'Jonny Bairstow', 'Abhishek Sharma', 'Travis Head'], answer: 2, difficulty: 'hard' },
  { id: 'srh9', category: 'ipl_srh', question: 'SRH scored 287/3, the then-highest IPL total, in 2024 against which team?', options: ['MI', 'RCB', 'CSK', 'DC'], answer: 1, difficulty: 'medium' },
  { id: 'srh10', category: 'ipl_srh', question: 'Who captained SRH in IPL 2024?', options: ['Kane Williamson', 'Aiden Markram', 'Pat Cummins', 'Travis Head'], answer: 2, difficulty: 'easy' },
  { id: 'srh11', category: 'ipl_srh', question: 'Which New Zealand captain led SRH to the 2018 IPL final?', options: ['Brendon McCullum', 'Ross Taylor', 'Kane Williamson', 'Daniel Vettori'], answer: 2, difficulty: 'easy' },
  { id: 'srh12', category: 'ipl_srh', question: 'Who is the owner of SRH?', options: ['RPSG Group', 'Sun TV Network', 'CVC Capital', 'GMR Group'], answer: 1, difficulty: 'medium' },
  { id: 'srh13', category: 'ipl_srh', question: 'Which SRH pair put on 185 runs for the opening wicket in 2019?', options: ['Warner and Saha', 'Warner and Bairstow', 'Warner and Dhawan', 'Bairstow and Williamson'], answer: 1, difficulty: 'medium' },
  { id: 'srh14', category: 'ipl_srh', question: 'Who has taken the most wickets for SRH in IPL?', options: ['Rashid Khan', 'Bhuvneshwar Kumar', 'Sandeep Sharma', 'T Natarajan'], answer: 1, difficulty: 'medium' },
  { id: 'srh15', category: 'ipl_srh', question: 'Which SRH player was known for his yorkers and "yorker king" tag?', options: ['Bhuvneshwar Kumar', 'Thangarasu Natarajan', 'Sandeep Sharma', 'Khaleel Ahmed'], answer: 1, difficulty: 'medium' },
  { id: 'srh16', category: 'ipl_srh', question: 'In the 2016 IPL final, SRH beat which team?', options: ['MI', 'KKR', 'RCB', 'CSK'], answer: 2, difficulty: 'medium' },
  { id: 'srh17', category: 'ipl_srh', question: 'Who scored 92 off 35 balls for SRH against RCB in 2024?', options: ['Travis Head', 'Heinrich Klaasen', 'Abhishek Sharma', 'Aiden Markram'], answer: 0, difficulty: 'hard' },
  { id: 'srh18', category: 'ipl_srh', question: 'What color jersey does SRH wear?', options: ['Yellow', 'Orange', 'Blue', 'Red'], answer: 1, difficulty: 'easy' },
  { id: 'srh19', category: 'ipl_srh', question: 'In which year was SRH formed?', options: ['2011', '2012', '2013', '2014'], answer: 2, difficulty: 'medium' },
  { id: 'srh20', category: 'ipl_srh', question: 'Which SRH player won the Orange Cap in 2024?', options: ['Travis Head', 'Virat Kohli', 'Ruturaj Gaikwad', 'Abhishek Sharma'], answer: 0, difficulty: 'medium' },
  { id: 'srh21', category: 'ipl_srh', question: 'Who was Deccan Chargers\' captain when they won the IPL in 2009?', options: ['VVS Laxman', 'Adam Gilchrist', 'Andrew Symonds', 'Rohit Sharma'], answer: 1, difficulty: 'medium' },

  // ═══════════════════════════════════════════════════════════════════════════
  // IPL — RAJASTHAN ROYALS (20+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'rr1', category: 'ipl_rr', question: 'Who captained Rajasthan Royals to their only IPL title in 2008?', options: ['Rahul Dravid', 'Shane Warne', 'Shane Watson', 'Graeme Smith'], answer: 1, difficulty: 'easy' },
  { id: 'rr2', category: 'ipl_rr', question: 'How many IPL titles have Rajasthan Royals won?', options: ['0', '1', '2', '3'], answer: 1, difficulty: 'easy' },
  { id: 'rr3', category: 'ipl_rr', question: 'Who is the current captain of Rajasthan Royals?', options: ['Steve Smith', 'Jos Buttler', 'Sanju Samson', 'Ravichandran Ashwin'], answer: 2, difficulty: 'easy' },
  { id: 'rr4', category: 'ipl_rr', question: 'Which RR player scored 5 centuries in IPL 2022?', options: ['Sanju Samson', 'Yashasvi Jaiswal', 'Shimron Hetmyer', 'Jos Buttler'], answer: 3, difficulty: 'medium' },
  { id: 'rr5', category: 'ipl_rr', question: 'What is RR\'s home ground?', options: ['Narendra Modi Stadium', 'Sawai Mansingh Stadium', 'Rajiv Gandhi Stadium', 'Eden Gardens'], answer: 1, difficulty: 'medium' },
  { id: 'rr6', category: 'ipl_rr', question: 'RR was suspended from IPL for how many years?', options: ['1', '2', '3', '4'], answer: 1, difficulty: 'medium' },
  { id: 'rr7', category: 'ipl_rr', question: 'Which RR all-rounder won the Player of the Tournament in IPL 2008?', options: ['Shane Warne', 'Shane Watson', 'Yusuf Pathan', 'Graeme Smith'], answer: 1, difficulty: 'easy' },
  { id: 'rr8', category: 'ipl_rr', question: 'Who scored 124 off 62 balls for RR, the first IPL century for the franchise?', options: ['Shane Watson', 'Yusuf Pathan', 'Rahul Dravid', 'Ajinkya Rahane'], answer: 1, difficulty: 'hard' },
  { id: 'rr9', category: 'ipl_rr', question: 'RR reached the IPL final in 2022. Who did they lose to?', options: ['CSK', 'MI', 'GT', 'KKR'], answer: 2, difficulty: 'easy' },
  { id: 'rr10', category: 'ipl_rr', question: 'Who has scored the most runs for RR in IPL?', options: ['Shane Watson', 'Ajinkya Rahane', 'Jos Buttler', 'Sanju Samson'], answer: 3, difficulty: 'medium' },
  { id: 'rr11', category: 'ipl_rr', question: 'Which English wicketkeeper-batsman played for RR from 2018-2023?', options: ['Ben Stokes', 'Jofra Archer', 'Jos Buttler', 'Liam Livingstone'], answer: 2, difficulty: 'easy' },
  { id: 'rr12', category: 'ipl_rr', question: 'Who was RR\'s most expensive buy in IPL 2023?', options: ['Shimron Hetmyer', 'Yashasvi Jaiswal', 'Joe Root', 'Donovan Ferreira'], answer: 2, difficulty: 'hard' },
  { id: 'rr13', category: 'ipl_rr', question: 'Which RR bowler was known for his pace and played for England?', options: ['Ben Stokes', 'Jofra Archer', 'Chris Jordan', 'Liam Plunkett'], answer: 1, difficulty: 'easy' },
  { id: 'rr14', category: 'ipl_rr', question: 'Who was the Emerging Player award winner from RR in 2019?', options: ['Riyan Parag', 'Yashasvi Jaiswal', 'Shubman Gill', 'Devdutt Padikkal'], answer: 0, difficulty: 'hard' },
  { id: 'rr15', category: 'ipl_rr', question: 'Which spinner has taken the most wickets for RR in IPL?', options: ['Pravin Tambe', 'Yuzvendra Chahal', 'Shreyas Gopal', 'Rahul Chahar'], answer: 2, difficulty: 'hard' },
  { id: 'rr16', category: 'ipl_rr', question: 'Who captained RR in 2018 after the franchise returned from suspension?', options: ['Steve Smith', 'Ajinkya Rahane', 'Ben Stokes', 'Sanju Samson'], answer: 1, difficulty: 'medium' },
  { id: 'rr17', category: 'ipl_rr', question: 'What color jersey does RR traditionally wear?', options: ['Yellow', 'Blue', 'Pink', 'Orange'], answer: 2, difficulty: 'easy' },
  { id: 'rr18', category: 'ipl_rr', question: 'Which RR player scored 100 off 35 balls in 2022 IPL?', options: ['Shimron Hetmyer', 'Jos Buttler', 'Sanju Samson', 'Devdutt Padikkal'], answer: 1, difficulty: 'medium' },
  { id: 'rr19', category: 'ipl_rr', question: 'Who is the co-owner of Rajasthan Royals who played for India women\'s team?', options: ['Mithali Raj', 'Shilpa Shetty', 'No one', 'Manoj Badale'], answer: 3, difficulty: 'hard' },
  { id: 'rr20', category: 'ipl_rr', question: 'Which RR player hit 6 sixes in an over against RCB in 2021?', options: ['Chris Morris', 'Jos Buttler', 'No one did this for RR', 'Rahul Tewatia'], answer: 2, difficulty: 'hard' },

  // ═══════════════════════════════════════════════════════════════════════════
  // IPL — PUNJAB KINGS (15+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'pbks1', category: 'ipl_pbks', question: 'What was Punjab Kings previously known as?', options: ['Punjab Royals', 'Kings XI Punjab', 'Punjab Super Kings', 'Punjab Warriors'], answer: 1, difficulty: 'easy' },
  { id: 'pbks2', category: 'ipl_pbks', question: 'How many IPL titles have Punjab Kings won?', options: ['0', '1', '2', '3'], answer: 0, difficulty: 'easy' },
  { id: 'pbks3', category: 'ipl_pbks', question: 'Who is the co-owner of Punjab Kings from Bollywood?', options: ['Shah Rukh Khan', 'Juhi Chawla', 'Preity Zinta', 'Shilpa Shetty'], answer: 2, difficulty: 'easy' },
  { id: 'pbks4', category: 'ipl_pbks', question: 'Who has scored the most runs for PBKS in IPL?', options: ['Chris Gayle', 'KL Rahul', 'Shikhar Dhawan', 'David Miller'], answer: 1, difficulty: 'medium' },
  { id: 'pbks5', category: 'ipl_pbks', question: 'Which PBKS player scored 100 in 55 balls in the 2014 IPL final?', options: ['Glenn Maxwell', 'David Miller', 'Virender Sehwag', 'Wriddhiman Saha'], answer: 3, difficulty: 'hard' },
  { id: 'pbks6', category: 'ipl_pbks', question: 'What is PBKS\'s home ground?', options: ['Wankhede Stadium', 'PCA Stadium, Mohali', 'Eden Gardens', 'Arun Jaitley Stadium'], answer: 1, difficulty: 'easy' },
  { id: 'pbks7', category: 'ipl_pbks', question: 'Who scored the fastest IPL century at the time (56 balls) for KXIP?', options: ['Adam Gilchrist', 'Paul Valthaty', 'Glenn Maxwell', 'Yuvraj Singh'], answer: 0, difficulty: 'hard' },
  { id: 'pbks8', category: 'ipl_pbks', question: 'Which PBKS captain scored 132* against RCB in 2020?', options: ['Chris Gayle', 'KL Rahul', 'Mayank Agarwal', 'Nicholas Pooran'], answer: 1, difficulty: 'medium' },
  { id: 'pbks9', category: 'ipl_pbks', question: 'Who captained KXIP in the inaugural 2008 season?', options: ['Adam Gilchrist', 'Yuvraj Singh', 'Mahela Jayawardene', 'Brett Lee'], answer: 1, difficulty: 'medium' },
  { id: 'pbks10', category: 'ipl_pbks', question: 'In which year did KXIP reach the IPL final?', options: ['2012', '2013', '2014', '2015'], answer: 2, difficulty: 'medium' },
  { id: 'pbks11', category: 'ipl_pbks', question: 'Which PBKS player scored the most sixes in a single IPL season (2014)?', options: ['David Miller', 'Glenn Maxwell', 'Chris Gayle', 'George Bailey'], answer: 1, difficulty: 'hard' },
  { id: 'pbks12', category: 'ipl_pbks', question: 'Who took 5/14 for KXIP, the best bowling figures for the franchise?', options: ['Sandeep Sharma', 'Ankit Rajpoot', 'Piyush Chawla', 'Mohammed Shami'], answer: 1, difficulty: 'hard' },
  { id: 'pbks13', category: 'ipl_pbks', question: 'In which year did Kings XI Punjab rebrand to Punjab Kings?', options: ['2019', '2020', '2021', '2022'], answer: 2, difficulty: 'easy' },
  { id: 'pbks14', category: 'ipl_pbks', question: 'Which PBKS player was known as "The Big Show"?', options: ['David Miller', 'Glenn Maxwell', 'Chris Gayle', 'Marcus Stoinis'], answer: 1, difficulty: 'easy' },
  { id: 'pbks15', category: 'ipl_pbks', question: 'Who captained PBKS in IPL 2023?', options: ['KL Rahul', 'Mayank Agarwal', 'Shikhar Dhawan', 'Sam Curran'], answer: 2, difficulty: 'medium' },
  { id: 'pbks16', category: 'ipl_pbks', question: 'What color jersey does PBKS wear?', options: ['Yellow', 'Red', 'Blue', 'Orange'], answer: 1, difficulty: 'easy' },

  // ═══════════════════════════════════════════════════════════════════════════
  // IPL — GUJARAT TITANS (15+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'gt1', category: 'ipl_gt', question: 'In which year was Gujarat Titans formed?', options: ['2020', '2021', '2022', '2023'], answer: 1, difficulty: 'easy' },
  { id: 'gt2', category: 'ipl_gt', question: 'Who captained GT to win the IPL in their debut season (2022)?', options: ['Rashid Khan', 'Shubman Gill', 'Hardik Pandya', 'David Miller'], answer: 2, difficulty: 'easy' },
  { id: 'gt3', category: 'ipl_gt', question: 'GT won the IPL title in which year?', options: ['2022', '2023', '2024', '2022 and 2023'], answer: 0, difficulty: 'easy' },
  { id: 'gt4', category: 'ipl_gt', question: 'Who is the owner of Gujarat Titans?', options: ['Adani Group', 'CVC Capital Partners', 'RPSG Group', 'Sun TV Network'], answer: 1, difficulty: 'medium' },
  { id: 'gt5', category: 'ipl_gt', question: 'Which GT player won the Orange Cap in 2023?', options: ['Shubman Gill', 'Wriddhiman Saha', 'David Miller', 'B Sai Sudharsan'], answer: 0, difficulty: 'medium' },
  { id: 'gt6', category: 'ipl_gt', question: 'What is GT\'s home ground?', options: ['Wankhede Stadium', 'Narendra Modi Stadium', 'MA Chidambaram Stadium', 'Eden Gardens'], answer: 1, difficulty: 'easy' },
  { id: 'gt7', category: 'ipl_gt', question: 'Who hit the match-winning six for GT in the 2022 IPL final?', options: ['Hardik Pandya', 'David Miller', 'Shubman Gill', 'Rahul Tewatia'], answer: 0, difficulty: 'medium' },
  { id: 'gt8', category: 'ipl_gt', question: 'Which GT all-rounder was known for his last-ball finishes in 2022?', options: ['Hardik Pandya', 'Rahul Tewatia', 'Rashid Khan', 'David Miller'], answer: 1, difficulty: 'medium' },
  { id: 'gt9', category: 'ipl_gt', question: 'GT reached the final in 2023 but lost to which team?', options: ['MI', 'RCB', 'CSK', 'KKR'], answer: 2, difficulty: 'easy' },
  { id: 'gt10', category: 'ipl_gt', question: 'Which Afghan spinner was one of GT\'s draft picks before IPL 2022?', options: ['Mohammad Nabi', 'Mujeeb Ur Rahman', 'Rashid Khan', 'Naveen-ul-Haq'], answer: 2, difficulty: 'easy' },
  { id: 'gt11', category: 'ipl_gt', question: 'Who was GT\'s most expensive buy in the 2022 auction?', options: ['Lockie Ferguson', 'Jason Roy', 'Rahul Tewatia', 'Matthew Wade'], answer: 0, difficulty: 'hard' },
  { id: 'gt12', category: 'ipl_gt', question: 'Which young Indian batter scored a century for GT in 2023?', options: ['Shubman Gill', 'B Sai Sudharsan', 'Wriddhiman Saha', 'Vijay Shankar'], answer: 0, difficulty: 'medium' },
  { id: 'gt13', category: 'ipl_gt', question: 'Who captained GT in IPL 2024 after Hardik Pandya left?', options: ['Rashid Khan', 'Shubman Gill', 'David Miller', 'Kane Williamson'], answer: 1, difficulty: 'easy' },
  { id: 'gt14', category: 'ipl_gt', question: 'What color does GT\'s jersey primarily feature?', options: ['Yellow', 'Blue', 'Navy Blue and Titanium', 'Red'], answer: 2, difficulty: 'medium' },
  { id: 'gt15', category: 'ipl_gt', question: 'Which GT player scored the fastest fifty for the franchise?', options: ['David Miller', 'Rahul Tewatia', 'Shubman Gill', 'Sai Sudharsan'], answer: 0, difficulty: 'hard' },
  { id: 'gt16', category: 'ipl_gt', question: 'How many matches did GT win in their debut IPL season (2022)?', options: ['8', '9', '10', '12'], answer: 2, difficulty: 'hard' },

  // ═══════════════════════════════════════════════════════════════════════════
  // IPL — LUCKNOW SUPER GIANTS (15+ questions)
  // ═══════════════════════════════════════════════════════════════════════════

  { id: 'lsg1', category: 'ipl_lsg', question: 'In which year was Lucknow Super Giants formed?', options: ['2020', '2021', '2022', '2023'], answer: 1, difficulty: 'easy' },
  { id: 'lsg2', category: 'ipl_lsg', question: 'Who was LSG\'s first captain?', options: ['Quinton de Kock', 'KL Rahul', 'Marcus Stoinis', 'Rishabh Pant'], answer: 1, difficulty: 'easy' },
  { id: 'lsg3', category: 'ipl_lsg', question: 'Who is the owner of LSG?', options: ['CVC Capital', 'RPSG Group', 'Sun TV Network', 'Adani Group'], answer: 1, difficulty: 'medium' },
  { id: 'lsg4', category: 'ipl_lsg', question: 'What is LSG\'s home ground?', options: ['Narendra Modi Stadium', 'BRSABV Ekana Stadium', 'Arun Jaitley Stadium', 'Wankhede Stadium'], answer: 1, difficulty: 'medium' },
  { id: 'lsg5', category: 'ipl_lsg', question: 'Which LSG player scored a century on debut against CSK in 2022?', options: ['KL Rahul', 'Quinton de Kock', 'Deepak Hooda', 'Ayush Badoni'], answer: 2, difficulty: 'hard' },
  { id: 'lsg6', category: 'ipl_lsg', question: 'How many IPL titles have LSG won?', options: ['0', '1', '2', '3'], answer: 0, difficulty: 'easy' },
  { id: 'lsg7', category: 'ipl_lsg', question: 'Who scored the most runs for LSG in their debut season 2022?', options: ['Quinton de Kock', 'KL Rahul', 'Deepak Hooda', 'Ayush Badoni'], answer: 1, difficulty: 'medium' },
  { id: 'lsg8', category: 'ipl_lsg', question: 'Which LSG bowler was known for his pace and was a draft pick?', options: ['Avesh Khan', 'Mark Wood', 'Ravi Bishnoi', 'Jason Holder'], answer: 1, difficulty: 'medium' },
  { id: 'lsg9', category: 'ipl_lsg', question: 'Did LSG qualify for the playoffs in their debut season?', options: ['No', 'Yes, reached Qualifier 2', 'Yes, reached Eliminator', 'Yes, reached final'], answer: 2, difficulty: 'medium' },
  { id: 'lsg10', category: 'ipl_lsg', question: 'Which young Indian debutant impressed for LSG with his finishing?', options: ['Ravi Bishnoi', 'Ayush Badoni', 'Manan Vohra', 'Deepak Hooda'], answer: 1, difficulty: 'medium' },
  { id: 'lsg11', category: 'ipl_lsg', question: 'Which South African played for LSG as wicketkeeper-batsman?', options: ['AB de Villiers', 'Heinrich Klaasen', 'Quinton de Kock', 'David Miller'], answer: 2, difficulty: 'easy' },
  { id: 'lsg12', category: 'ipl_lsg', question: 'Who was LSG\'s head coach in their first two seasons?', options: ['Andy Flower', 'Justin Langer', 'Trevor Bayliss', 'Ricky Ponting'], answer: 0, difficulty: 'medium' },
  { id: 'lsg13', category: 'ipl_lsg', question: 'Which leg-spinner was one of LSG\'s draft picks before IPL 2022?', options: ['Yuzvendra Chahal', 'Rashid Khan', 'Ravi Bishnoi', 'Kuldeep Yadav'], answer: 2, difficulty: 'medium' },
  { id: 'lsg14', category: 'ipl_lsg', question: 'What color jersey does LSG wear?', options: ['Yellow', 'Blue', 'Turquoise/Cyan', 'Red'], answer: 2, difficulty: 'easy' },
  { id: 'lsg15', category: 'ipl_lsg', question: 'Which LSG player scored 2 centuries in IPL 2024?', options: ['KL Rahul', 'Quinton de Kock', 'Nicholas Pooran', 'Devdutt Padikkal'], answer: 1, difficulty: 'hard' },
  { id: 'lsg16', category: 'ipl_lsg', question: 'Who captained LSG in IPL 2025 after KL Rahul left?', options: ['Quinton de Kock', 'Nicholas Pooran', 'Rishabh Pant', 'Marcus Stoinis'], answer: 2, difficulty: 'easy' },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL QUESTIONS TO REACH 500+
  // ═══════════════════════════════════════════════════════════════════════════

  // More international_general
  { id: 'ig55', category: 'international_general', question: 'Who holds the record for the fastest ball bowled in cricket history (161.3 km/h)?', options: ['Brett Lee', 'Shoaib Akhtar', 'Mitchell Starc', 'Shaun Tait'], answer: 1, difficulty: 'medium' },
  { id: 'ig56', category: 'international_general', question: 'Which cricketer retired from all formats of international cricket after the 2024 T20 World Cup?', options: ['Rohit Sharma', 'Virat Kohli', 'Ravindra Jadeja', 'All of the above'], answer: 3, difficulty: 'medium' },
  { id: 'ig57', category: 'international_general', question: 'What does "playing a reverse sweep" mean?', options: ['Bowling behind the wicket', 'Batting left-handed when right-handed to sweep', 'Running between wickets backwards', 'Fielding behind the stumps'], answer: 1, difficulty: 'easy' },

  // More international_test
  { id: 'it43', category: 'international_test', question: 'Who scored a century in both innings of a Test match most times?', options: ['Sunil Gavaskar', 'Ricky Ponting', 'Steve Smith', 'David Warner'], answer: 0, difficulty: 'hard' },
  { id: 'it44', category: 'international_test', question: 'Which country was the last to be granted Test status (before Ireland and Afghanistan)?', options: ['Zimbabwe', 'Sri Lanka', 'Bangladesh', 'Kenya'], answer: 2, difficulty: 'medium' },

  // More international_odi
  { id: 'io42', category: 'international_odi', question: 'Who scored 109 off 55 balls in the 2023 World Cup for Australia against Afghanistan?', options: ['David Warner', 'Glenn Maxwell', 'Steve Smith', 'Mitchell Marsh'], answer: 1, difficulty: 'medium' },
  { id: 'io43', category: 'international_odi', question: 'Which country hosted the 2023 ODI World Cup?', options: ['England', 'Australia', 'India', 'South Africa'], answer: 2, difficulty: 'easy' },

  // More international_t20i
  { id: 'i20_37', category: 'international_t20i', question: 'Who scored 82* off 53 balls in the 2024 T20 World Cup final for India?', options: ['Rohit Sharma', 'Virat Kohli', 'Suryakumar Yadav', 'Hardik Pandya'], answer: 1, difficulty: 'medium' },
  { id: 'i20_38', category: 'international_t20i', question: 'Which bowler took 3/20 in the 2024 T20 World Cup final?', options: ['Jasprit Bumrah', 'Arshdeep Singh', 'Hardik Pandya', 'Axar Patel'], answer: 0, difficulty: 'hard' },

  // More guess_cricketer
  { id: 'gc44', category: 'guess_cricketer', question: 'Indian, right-arm fast, 150+ km/h, played for MI, 5 wickets in a T20 World Cup final', options: ['Mohammed Shami', 'Jasprit Bumrah', 'Bhuvneshwar Kumar', 'Umesh Yadav'], answer: 1, difficulty: 'easy' },
  { id: 'gc45', category: 'guess_cricketer', question: 'Pakistani, 7,000+ Test runs, nicknamed "Inzi", known for slow running', options: ['Younis Khan', 'Mohammad Yousuf', 'Inzamam-ul-Haq', 'Saeed Anwar'], answer: 2, difficulty: 'easy' },

  // More IPL general
  { id: 'ipl53', category: 'ipl_general', question: 'Which franchise has never won the IPL title?', options: ['Rajasthan Royals', 'Sunrisers Hyderabad', 'Royal Challengers Bangalore', 'Kolkata Knight Riders'], answer: 2, difficulty: 'easy' },
  { id: 'ipl54', category: 'ipl_general', question: 'Who hit the most sixes in a single IPL season?', options: ['Chris Gayle', 'Andre Russell', 'AB de Villiers', 'Jos Buttler'], answer: 0, difficulty: 'medium' },

  // More IPL MI
  { id: 'mi26', category: 'ipl_mi', question: 'Which MI player scored 87 off 34 balls in the 2019 IPL final?', options: ['Rohit Sharma', 'Quinton de Kock', 'Kieron Pollard', 'Hardik Pandya'], answer: 2, difficulty: 'hard' },

  // More IPL CSK
  { id: 'csk27', category: 'ipl_csk', question: 'Which bowler took 4/13 in the 2023 IPL final for CSK?', options: ['Deepak Chahar', 'Ravindra Jadeja', 'Tushar Deshpande', 'Matheesha Pathirana'], answer: 2, difficulty: 'hard' },

  // More IPL RCB
  { id: 'rcb26', category: 'ipl_rcb', question: 'Which RCB player scored a century in 46 balls against PBKS in IPL 2016?', options: ['AB de Villiers', 'Virat Kohli', 'Chris Gayle', 'KL Rahul'], answer: 0, difficulty: 'medium' },

  // More IPL KKR
  { id: 'kkr22', category: 'ipl_kkr', question: 'Which KKR player took 5/19 in the 2024 IPL final?', options: ['Sunil Narine', 'Mitchell Starc', 'Varun Chakaravarthy', 'Andre Russell'], answer: 1, difficulty: 'hard' },

  // More IPL DC
  { id: 'dc21', category: 'ipl_dc', question: 'Which DC player scored the most runs in IPL 2020?', options: ['Shreyas Iyer', 'Shikhar Dhawan', 'Marcus Stoinis', 'Rishabh Pant'], answer: 1, difficulty: 'medium' },

  // More IPL SRH
  { id: 'srh22', category: 'ipl_srh', question: 'Who scored 277/3 for SRH in 2024, what was the opposition?', options: ['CSK', 'MI', 'RCB', 'PBKS'], answer: 1, difficulty: 'hard' },

  // More IPL RR
  { id: 'rr21', category: 'ipl_rr', question: 'Who hit 5 sixes off Mustafizur Rahman in one over for RR in IPL 2020?', options: ['Jos Buttler', 'Sanju Samson', 'Rahul Tewatia', 'Steve Smith'], answer: 2, difficulty: 'medium' },

  // More IPL PBKS
  { id: 'pbks17', category: 'ipl_pbks', question: 'Which PBKS player scored 67* off 21 balls against SRH in 2022?', options: ['Liam Livingstone', 'Jonny Bairstow', 'Shikhar Dhawan', 'Jitesh Sharma'], answer: 0, difficulty: 'hard' },

  // More IPL GT
  { id: 'gt17', category: 'ipl_gt', question: 'Who scored 129 in a match for GT against MI in 2023?', options: ['Shubman Gill', 'David Miller', 'Wriddhiman Saha', 'B Sai Sudharsan'], answer: 0, difficulty: 'medium' },

  // More IPL LSG
  { id: 'lsg17', category: 'ipl_lsg', question: 'Which LSG all-rounder scored a crucial 55* off 25 balls in a 2022 playoff?', options: ['Deepak Hooda', 'Marcus Stoinis', 'Krunal Pandya', 'Jason Holder'], answer: 1, difficulty: 'hard' },

  // Final additions to cross 500
  { id: 'ig58', category: 'international_general', question: 'Which cricketer has the nickname "Universe Boss"?', options: ['Shahid Afridi', 'Viv Richards', 'Chris Gayle', 'Brian Lara'], answer: 2, difficulty: 'easy' },
  { id: 'it45', category: 'international_test', question: 'Who scored 319 in a single Test innings for India?', options: ['Sachin Tendulkar', 'Virender Sehwag', 'Rahul Dravid', 'VVS Laxman'], answer: 1, difficulty: 'medium' },
  { id: 'io44', category: 'international_odi', question: 'Who hit 201* in an ODI against New Zealand in 2017?', options: ['Fakhar Zaman', 'Rohit Sharma', 'Glenn Maxwell', 'Martin Guptill'], answer: 2, difficulty: 'hard' },
  { id: 'ipl55', category: 'ipl_general', question: 'Which team holds the record for most consecutive IPL wins?', options: ['CSK', 'MI', 'KKR', 'GT'], answer: 1, difficulty: 'hard' },

];

// ═══════════════════════════════════════════════════════════════════════════
// QUIZ CATEGORIES METADATA
// ═══════════════════════════════════════════════════════════════════════════

const QUIZ_CATEGORIES = {
  international: {
    label: 'International',
    icon: '\u{1F30D}',
    subcategories: {
      international_general: { label: 'General', icon: '\u{1F3CF}' },
      international_test: { label: 'Test Cricket', icon: '\u{1F3DF}\uFE0F' },
      international_odi: { label: 'ODIs', icon: '\u{1F3C6}' },
      international_t20i: { label: 'T20Is', icon: '\u26A1' },
      guess_cricketer: { label: 'Guess the Cricketer', icon: '\u{1F914}' },
    }
  },
  ipl: {
    label: 'IPL',
    icon: '\u{1F3C6}',
    subcategories: {
      ipl_general: { label: 'General', icon: '\u{1F3CF}' },
      ipl_mi: { label: 'Mumbai Indians', icon: '\u{1F499}' },
      ipl_csk: { label: 'Chennai Super Kings', icon: '\u{1F49B}' },
      ipl_rcb: { label: 'Royal Challengers', icon: '\u2764\uFE0F' },
      ipl_kkr: { label: 'Knight Riders', icon: '\u{1F49C}' },
      ipl_dc: { label: 'Delhi Capitals', icon: '\u{1F535}' },
      ipl_srh: { label: 'Sunrisers Hyderabad', icon: '\u{1F9E1}' },
      ipl_rr: { label: 'Rajasthan Royals', icon: '\u{1F497}' },
      ipl_pbks: { label: 'Punjab Kings', icon: '\u{1F534}' },
      ipl_gt: { label: 'Gujarat Titans', icon: '\u{1FA75}' },
      ipl_lsg: { label: 'Lucknow Super Giants', icon: '\u{1FA76}' },
    }
  }
};

module.exports = { questions, QUIZ_CATEGORIES };
