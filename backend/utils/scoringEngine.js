const Test = require('../models/Test');
const Question = require('../models/Question');
const { puter } = require('@heyputer/puter.js');

const generateAIAnalysis = async (test, questions, answers) => {
  try {
    let prompt = `Act as an expert ISSB psychologist. Analyze the following candidate's answers for the test "${test.title}" (Category: ${test.category}).\n`;
    prompt += `Provide a nuanced, accurate psychological assessment of their personality traits based on their answers. Be careful to note if they selected "Always" or high frequencies for negative traits, and provide realistic feedback rather than blindly praising them.\n\n`;
    prompt += `Candidate's Answers:\n`;
    
    questions.forEach((q, index) => {
      const userAnswer = answers.find(a => a.questionId === q._id.toString());
      if (userAnswer) {
        let answerLabel = userAnswer.selectedOption;
        const option = q.options.find(o => o.value === userAnswer.selectedOption);
        if (option) answerLabel = option.label;
        
        prompt += `${index + 1}. Statement: ${q.questionText}\n   Answer: ${answerLabel}\n`;
      }
    });
    
    prompt += `\nProvide a comprehensive summary of their psychological profile based on these specific answers.`;

    const response = await puter.ai.chat(prompt, {
      model: 'gemini-1.5-flash'
    });
    
    return response.message.content || response.toString() || response;
  } catch (error) {
    console.error("Puter AI Error:", error);
    return "AI Analysis could not be generated at this time due to an error processing the request.";
  }
};

// Calculate score based on test type and answers
exports.calculateScore = async (testId, answers) => {
  try {
    const test = await Test.findById(testId);
    const questions = await Question.find({ test: testId, isActive: true });
    
    let totalScore = 0;
    let maxScore = 0;
    const answerDetails = [];

    for (const question of questions) {
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      
      if (userAnswer) {
        let score = 0;
        
        // Calculate score based on question type
        switch (question.questionType) {
          case 'likert':
          case 'frequency':
            // For Likert and frequency scales, use the option value directly
            const selectedOption = question.options.find(o => o.value === userAnswer.selectedOption);
            score = selectedOption ? selectedOption.value : 0;
            break;
          
          case 'true_false':
            // For true/false, check if answer matches correct answer
            score = userAnswer.selectedOption === question.correctAnswer ? question.score : 0;
            break;
          
          case 'mcq':
            // For MCQs, check if answer matches correct answer
            score = userAnswer.selectedOption === question.correctAnswer ? question.score : 0;
            break;
          
          default:
            score = 0;
        }
        
        totalScore += score;
        answerDetails.push({
          question: question._id,
          selectedOption: userAnswer.selectedOption,
          score: score
        });
      }
      
      maxScore += question.score;
    }

    // Apply scoring type
    let finalScore = totalScore;
    if (test.scoringType === 'average') {
      finalScore = questions.length > 0 ? totalScore / questions.length : 0;
    }

    const percentage = maxScore > 0 ? (finalScore / maxScore) * 100 : 0;

    // Determine level and interpretation
    const { level, interpretation } = getInterpretation(percentage, test.category);

    // Generate AI Analysis
    const aiAnalysis = await generateAIAnalysis(test, questions, answers);

    return {
      totalScore: finalScore,
      maxScore: maxScore,
      percentage: percentage,
      answers: answerDetails,
      level,
      interpretation,
      aiAnalysis
    };
  } catch (error) {
    throw new Error(`Scoring error: ${error.message}`);
  }
};

// Get interpretation based on percentage and test category
const getInterpretation = (percentage, category) => {
  let level = '';
  let interpretation = '';

  if (percentage >= 90) {
    level = 'Excellent';
    interpretation = `Outstanding performance in ${category}. You demonstrate exceptional abilities and traits in this area.`;
  } else if (percentage >= 75) {
    level = 'Good';
    interpretation = `Strong performance in ${category}. You show good capabilities and positive traits in this area.`;
  } else if (percentage >= 60) {
    level = 'Average';
    interpretation = `Moderate performance in ${category}. You have average abilities in this area with room for improvement.`;
  } else if (percentage >= 40) {
    level = 'Below Average';
    interpretation = `Performance in ${category} needs improvement. Consider focusing on developing skills in this area.`;
  } else {
    level = 'Poor';
    interpretation = `Low performance in ${category}. Significant improvement is needed in this area. Consider seeking guidance and practice.`;
  }

  return { level, interpretation };
};
