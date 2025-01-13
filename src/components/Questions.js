import { useQuiz } from "../context/QuizContext"
import Options from "./Options"

function Questions() {
  const { questions, index } = useQuiz();
  const question = questions.at(index)
  
  return (
    <div>
      <h4>{question.question}</h4>

      <div>
        <Options question={question} />
      </div>
    </div>
  )
}

export default Questions
