import Options from "./Options"

function Questions({ question, answer, dispatch, points }) {
  return (
    <div>
      <h4>{question.question}</h4>

      <div>
        <Options question={question} answer={answer} dispatch={dispatch} />
      </div>
    </div>
  )
}

export default Questions
