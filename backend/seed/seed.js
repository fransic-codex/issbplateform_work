const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Test = require('../models/Test');
const Question = require('../models/Question');
const User = require('../models/User');

dotenv.config();

const testDefinitions = [
  {
    title: 'Self Confidence Test',
    category: 'Self Confidence',
    description: 'Measure your level of self-confidence and belief in your abilities.',
    duration: 15,
    instructions: 'Rate how much you agree with each statement based on your personal experience.',
    questions: [
      { questionText: 'I believe in my ability to succeed in challenging situations.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I feel comfortable expressing my opinions in group settings.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I can handle criticism without feeling discouraged.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I am confident in my decision-making abilities.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I trust my instincts when facing difficult choices.', questionType: 'true_false', correctAnswer: 1, options: [
        { label: 'True', value: 5, order: 1 },
        { label: 'False', value: 1, order: 2 }
      ]}
    ]
  },
  {
    title: 'Influencing Ability Test',
    category: 'Influencing Ability',
    description: 'Assess your ability to influence and persuade others effectively.',
    duration: 15,
    instructions: 'Answer based on how you typically behave in social situations.',
    questions: [
      { questionText: 'I can convince others to see my point of view.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'People often come to me for advice.', questionType: 'frequency', options: [
        { label: 'Not at all', value: 1, order: 1 },
        { label: 'Rarely', value: 2, order: 2 },
        { label: 'Sometimes', value: 3, order: 3 },
        { label: 'Often', value: 4, order: 4 },
        { label: 'Very Often', value: 5, order: 5 }
      ]},
      { questionText: 'I can change someone\'s mind when I believe I\'m right.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I am good at negotiating win-win solutions.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'Scenario: Your team disagrees on a project approach. What do you do?', questionType: 'mcq', scenario: 'Your team is divided on how to proceed with a critical project deadline approaching.', options: [
        { label: 'Let the majority decide without my input', value: 1, order: 1 },
        { label: 'Present data and persuade others to adopt my approach', value: 5, order: 2 },
        { label: 'Stay silent and follow whatever is decided', value: 1, order: 3 },
        { label: 'Suggest a compromise that incorporates different views', value: 4, order: 4 }
      ], correctAnswer: 1}
    ]
  },
  {
    title: 'Persuasion Skills Test',
    category: 'Persuasion Skills',
    description: 'Evaluate your ability to persuade others through communication and reasoning.',
    duration: 15,
    instructions: 'Consider how you persuade others in various situations.',
    questions: [
      { questionText: 'I use logical arguments to persuade others.', questionType: 'frequency', options: [
        { label: 'Not at all', value: 1, order: 1 },
        { label: 'Rarely', value: 2, order: 2 },
        { label: 'Sometimes', value: 3, order: 3 },
        { label: 'Often', value: 4, order: 4 },
        { label: 'Very Often', value: 5, order: 5 }
      ]},
      { questionText: 'I adapt my persuasion style based on the audience.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I can persuade people without being aggressive.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I use storytelling to make my points more convincing.', questionType: 'frequency', options: [
        { label: 'Not at all', value: 1, order: 1 },
        { label: 'Rarely', value: 2, order: 2 },
        { label: 'Sometimes', value: 3, order: 3 },
        { label: 'Often', value: 4, order: 4 },
        { label: 'Very Often', value: 5, order: 5 }
      ]},
      { questionText: 'Scenario: You need to convince a skeptical stakeholder to approve your proposal.', questionType: 'mcq', scenario: 'A key stakeholder is hesitant about your project proposal.', options: [
        { label: 'Give up and try a different approach', value: 1, order: 1 },
        { label: 'Present evidence and address their specific concerns', value: 5, order: 2 },
        { label: 'Get others to pressure them', value: 1, order: 3 },
        { label: 'Wait for them to change their mind', value: 1, order: 4 }
      ], correctAnswer: 1}
    ]
  },
  {
    title: 'Assertiveness Test',
    category: 'Assertiveness',
    description: 'Measure your ability to express yourself confidently and respectfully.',
    duration: 15,
    instructions: 'Rate how you typically respond in various situations.',
    questions: [
      { questionText: 'I can say "no" when I need to.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I express my needs clearly to others.', questionType: 'frequency', options: [
        { label: 'Not at all', value: 1, order: 1 },
        { label: 'Rarely', value: 2, order: 2 },
        { label: 'Sometimes', value: 3, order: 3 },
        { label: 'Often', value: 4, order: 4 },
        { label: 'Very Often', value: 5, order: 5 }
      ]},
      { questionText: 'I stand up for myself when treated unfairly.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I can handle conflict without becoming aggressive.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'Scenario: A colleague takes credit for your work. What do you do?', questionType: 'mcq', scenario: 'You discover a colleague has presented your ideas as their own.', options: [
        { label: 'Say nothing to avoid conflict', value: 1, order: 1 },
        { label: 'Confront them privately and assert your contribution', value: 5, order: 2 },
        { label: 'Complain to everyone else', value: 1, order: 3 },
        { label: 'Sabotage their work', value: 1, order: 4 }
      ], correctAnswer: 1}
    ]
  },
  {
    title: 'Bridging Ability Test',
    category: 'Bridging Ability',
    description: 'Assess your ability to connect different people, ideas, and perspectives.',
    duration: 15,
    instructions: 'Consider how you build connections between people and ideas.',
    questions: [
      { questionText: 'I can find common ground between opposing viewpoints.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I help others understand different perspectives.', questionType: 'frequency', options: [
        { label: 'Not at all', value: 1, order: 1 },
        { label: 'Rarely', value: 2, order: 2 },
        { label: 'Sometimes', value: 3, order: 3 },
        { label: 'Often', value: 4, order: 4 },
        { label: 'Very Often', value: 5, order: 5 }
      ]},
      { questionText: 'I can connect people who can help each other.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I integrate ideas from different sources effectively.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'Scenario: Two departments are in conflict. How do you help?', questionType: 'mcq', scenario: 'Marketing and Sales departments are blaming each other for missed targets.', options: [
        { label: 'Take sides with one department', value: 1, order: 1 },
        { label: 'Facilitate dialogue to find shared goals', value: 5, order: 2 },
        { label: 'Ignore the conflict', value: 1, order: 3 },
        { label: 'Report to management without intervening', value: 1, order: 4 }
      ], correctAnswer: 1}
    ]
  },
  {
    title: 'Self Motivation Test',
    category: 'Self Motivation',
    description: 'Evaluate your ability to motivate yourself and stay driven.',
    duration: 15,
    instructions: 'Rate how you maintain motivation in different situations.',
    questions: [
      { questionText: 'I stay motivated even when tasks are difficult.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I set challenging goals for myself.', questionType: 'frequency', options: [
        { label: 'Not at all', value: 1, order: 1 },
        { label: 'Rarely', value: 2, order: 2 },
        { label: 'Sometimes', value: 3, order: 3 },
        { label: 'Often', value: 4, order: 4 },
        { label: 'Very Often', value: 5, order: 5 }
      ]},
      { questionText: 'I can motivate myself without external rewards.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I bounce back quickly from setbacks.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I maintain focus on long-term goals.', questionType: 'true_false', correctAnswer: 1, options: [
        { label: 'True', value: 5, order: 1 },
        { label: 'False', value: 1, order: 2 }
      ]}
    ]
  },
  {
    title: 'Communication Skills Test',
    category: 'Communication Skills',
    description: 'Assess your ability to communicate effectively in various situations.',
    duration: 15,
    instructions: 'Consider how you communicate in different contexts.',
    questions: [
      { questionText: 'I listen actively to understand others\' perspectives.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I explain complex ideas clearly and simply.', questionType: 'frequency', options: [
        { label: 'Not at all', value: 1, order: 1 },
        { label: 'Rarely', value: 2, order: 2 },
        { label: 'Sometimes', value: 3, order: 3 },
        { label: 'Often', value: 4, order: 4 },
        { label: 'Very Often', value: 5, order: 5 }
      ]},
      { questionText: 'I adjust my communication style for different audiences.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I give constructive feedback effectively.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'Scenario: You need to deliver bad news to your team. How do you approach it?', questionType: 'mcq', scenario: 'You have to inform your team about a project cancellation.', options: [
        { label: 'Send an email to avoid face-to-face', value: 1, order: 1 },
        { label: 'Meet in person, be honest and empathetic', value: 5, order: 2 },
        { label: 'Let someone else deliver the news', value: 1, order: 3 },
        { label: 'Wait until they find out themselves', value: 1, order: 4 }
      ], correctAnswer: 1}
    ]
  },
  {
    title: 'Courage Test',
    category: 'Courage',
    description: 'Measure your ability to face fear and take calculated risks.',
    duration: 15,
    instructions: 'Rate how you respond to challenging and fearful situations.',
    questions: [
      { questionText: 'I take calculated risks when the potential reward is high.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I speak up for what I believe is right, even when unpopular.', questionType: 'frequency', options: [
        { label: 'Not at all', value: 1, order: 1 },
        { label: 'Rarely', value: 2, order: 2 },
        { label: 'Sometimes', value: 3, order: 3 },
        { label: 'Often', value: 4, order: 4 },
        { label: 'Very Often', value: 5, order: 5 }
      ]},
      { questionText: 'I face my fears rather than avoiding them.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I remain calm under pressure.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'Scenario: You see an unethical practice at work. What do you do?', questionType: 'mcq', scenario: 'You discover a colleague is engaging in unethical behavior.', options: [
        { label: 'Ignore it to avoid trouble', value: 1, order: 1 },
        { label: 'Report it through proper channels', value: 5, order: 2 },
        { label: 'Confront them aggressively', value: 1, order: 3 },
        { label: 'Gossip about it with others', value: 1, order: 4 }
      ], correctAnswer: 1}
    ]
  },
  {
    title: 'Self Determination Test',
    category: 'Self Determination',
    description: 'Evaluate your sense of autonomy and control over your life choices.',
    duration: 15,
    instructions: 'Consider how much control you feel over your decisions and actions.',
    questions: [
      { questionText: 'I make decisions based on my own values and beliefs.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I feel in control of my life direction.', questionType: 'frequency', options: [
        { label: 'Not at all', value: 1, order: 1 },
        { label: 'Rarely', value: 2, order: 2 },
        { label: 'Sometimes', value: 3, order: 3 },
        { label: 'Often', value: 4, order: 4 },
        { label: 'Very Often', value: 5, order: 5 }
      ]},
      { questionText: 'I pursue goals that are meaningful to me.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I take responsibility for my choices and outcomes.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I don\'t let others pressure me into decisions I don\'t want.', questionType: 'true_false', correctAnswer: 1, options: [
        { label: 'True', value: 5, order: 1 },
        { label: 'False', value: 1, order: 2 }
      ]}
    ]
  },
  {
    title: 'Self Efficacy Test',
    category: 'Self Efficacy',
    description: 'Assess your belief in your ability to succeed in specific situations.',
    duration: 15,
    instructions: 'Rate your confidence in your ability to handle various challenges.',
    questions: [
      { questionText: 'I can solve difficult problems if I try hard enough.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I can handle unexpected problems effectively.', questionType: 'frequency', options: [
        { label: 'Not at all', value: 1, order: 1 },
        { label: 'Rarely', value: 2, order: 2 },
        { label: 'Sometimes', value: 3, order: 3 },
        { label: 'Often', value: 4, order: 4 },
        { label: 'Very Often', value: 5, order: 5 }
      ]},
      { questionText: 'I can remain calm when facing difficulties.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I can find several solutions when faced with a problem.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I am confident in my ability to learn new skills.', questionType: 'true_false', correctAnswer: 1, options: [
        { label: 'True', value: 5, order: 1 },
        { label: 'False', value: 1, order: 2 }
      ]}
    ]
  },
  {
    title: 'Positive Thinking Test',
    category: 'Positive Thinking',
    description: 'Measure your tendency to maintain a positive outlook on life.',
    duration: 15,
    instructions: 'Rate how you typically think and react to situations.',
    questions: [
      { questionText: 'I see the positive side in difficult situations.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I expect good things to happen.', questionType: 'frequency', options: [
        { label: 'Not at all', value: 1, order: 1 },
        { label: 'Rarely', value: 2, order: 2 },
        { label: 'Sometimes', value: 3, order: 3 },
        { label: 'Often', value: 4, order: 4 },
        { label: 'Very Often', value: 5, order: 5 }
      ]},
      { questionText: 'I focus on solutions rather than problems.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I maintain hope during challenging times.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I believe setbacks are temporary.', questionType: 'true_false', correctAnswer: 1, options: [
        { label: 'True', value: 5, order: 1 },
        { label: 'False', value: 1, order: 2 }
      ]}
    ]
  },
  {
    title: 'Responsibility Test',
    category: 'Responsibility',
    description: 'Assess your sense of personal and social responsibility.',
    duration: 15,
    instructions: 'Consider how you handle your obligations and commitments.',
    questions: [
      { questionText: 'I take responsibility for my mistakes.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I fulfill my commitments reliably.', questionType: 'frequency', options: [
        { label: 'Not at all', value: 1, order: 1 },
        { label: 'Rarely', value: 2, order: 2 },
        { label: 'Sometimes', value: 3, order: 3 },
        { label: 'Often', value: 4, order: 4 },
        { label: 'Very Often', value: 5, order: 5 }
      ]},
      { questionText: 'I consider the impact of my actions on others.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'I admit when I don\'t know something.', questionType: 'likert', options: [
        { label: 'Strongly Disagree', value: 1, order: 1 },
        { label: 'Disagree', value: 2, order: 2 },
        { label: 'Neutral', value: 3, order: 3 },
        { label: 'Agree', value: 4, order: 4 },
        { label: 'Strongly Agree', value: 5, order: 5 }
      ]},
      { questionText: 'Scenario: You made a mistake that affects your team. What do you do?', questionType: 'mcq', scenario: 'Your error caused a project delay.', options: [
        { label: 'Hide it and hope no one notices', value: 1, order: 1 },
        { label: 'Admit it, apologize, and propose a solution', value: 5, order: 2 },
        { label: 'Blame someone else', value: 1, order: 3 },
        { label: 'Downplay its significance', value: 1, order: 4 }
      ], correctAnswer: 1}
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await Test.deleteMany({});
    await Question.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@issb.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Created admin user');

    // Create tests and questions
    for (const testDef of testDefinitions) {
      const test = await Test.create({
        title: testDef.title,
        category: testDef.category,
        description: testDef.description,
        duration: testDef.duration,
        instructions: testDef.instructions,
        questionCount: testDef.questions.length,
        maxScore: testDef.questions.length * 5,
        scoringType: 'sum'
      });

      const questions = testDef.questions.map((q, index) => ({
        test: test._id,
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options,
        correctAnswer: q.correctAnswer || null,
        score: 5,
        order: index,
        scenario: q.scenario || null
      }));

      await Question.insertMany(questions);
      console.log(`Created test: ${test.title} with ${questions.length} questions`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
