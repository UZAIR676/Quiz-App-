// Run: node seed.js
// This seeds the old quiz questions into MongoDB

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from './models/Quiz.js';

dotenv.config();

const questions = [
  { question: "Which of the following is an example of a maritime cyber threat?", option1: "Traffic congestion in port areas", option2: "GPS spoofing attack", option3: "Cargo container mishandling", option4: "Weather-related delays", ans: 2 },
  { question: "How can players defend against malware attacks on maritime systems?", option1: "Increasing vessel speed", option2: "Installing antivirus software and conducting regular scans", option3: "Painting the hull with antifouling paint", option4: "Adjusting navigation charts", ans: 2 },
  { question: "What is a recommended strategy for preventing unauthorized access to onboard systems?", option1: "Publishing system vulnerabilities publicly", option2: "Implementing strong password policies and conducting regular security audits", option3: "Allowing unrestricted physical access to server rooms", option4: "Disabling all security measures for ease of access", ans: 2 },
  { question: "In the event of a ransomware attack on maritime systems, what should players prioritize?", option1: "Negotiating with the attackers for a lower ransom", option2: "Paying the ransom immediately to regain control", option3: "Isolating infected systems and notifying cybersecurity experts", option4: "Ignoring the attack and continuing regular operations", ans: 3 },
  { question: "What measure can players employ to maintain reliable communication in the face of interference or jamming?", option1: "Lowering anchor to stabilize the vessel", option2: "Using alternative communication methods such as satellite communication", option3: "Increasing engine power for faster movement", option4: "Requesting assistance from nearby vessels", ans: 2 },
  { question: "Which of the following is a key feature of a maritime cyber range video game?", option1: "Real-time weather updates", option2: "Navigation charts customization", option3: "Scenario-based challenges simulating maritime cyber threats", option4: "Cargo management optimization", ans: 3 },
  { question: "How does the maritime cyber range adapt to different player skill levels?", option1: "By limiting access to certain game features based on player age", option2: "By adjusting the difficulty levels of scenarios and challenges", option3: "By providing unlimited resources to all players", option4: "By randomizing game mechanics for each player", ans: 2 },
  { question: "What role does collaboration play in the maritime cyber range video game?", option1: "None, as the game is designed for solo play only", option2: "Players can collaborate to defend against cyber threats and solve challenges", option3: "Collaboration is encouraged but not necessary for gameplay", option4: "Players compete against each other with no opportunity for collaboration", ans: 2 },
  { question: "What consequences can players experience for their actions within the maritime cyber range?", option1: "None, as actions do not affect gameplay", option2: "Rewards for successful completion of challenges", option3: "Realistic consequences such as system failures or data breaches", option4: "Unlimited resources regardless of performance", ans: 3 },
  { question: "How does the maritime cyber range contribute to improving cybersecurity preparedness?", option1: "By providing fishing tips for maritime enthusiasts", option2: "By offering a platform for hands-on training and skill development", option3: "By simulating naval battles for entertainment purposes", option4: "By showcasing maritime history and heritage", ans: 2 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');
  await Quiz.deleteMany({});
  await Quiz.insertMany(questions);
  console.log(`✅ Seeded ${questions.length} questions`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
