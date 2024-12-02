import { useEffect, useReducer } from "react"
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import Questions from "./Questions";
import StartScreen from "./StartScreen";
import NextButton from "./NextButton";
import Progress from "./Progress";
import Finished from "./Finished";
import Timer from "./Timer";
import Footer from "./Footer";

const SEC_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready'
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error'
      }
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SEC_PER_QUESTION
      }
    case 'newAnswer':
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption 
          ? state.points +  question.points
          : state.points
      }
    case 'nextQuestion':
      return {
        ...state,
        index: state.index++,
        answer: null
      }
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore ? state.points : state.highscore
      }
    case 'restart':
      return {
        ...initialState,
        highscore: state.highscore,
        status: 'ready',
        questions: state.questions
      }
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status
      }
    default:
      throw new Error('Unknown Action');
  }
}

export default function App() {
  const [ { questions, status, index, answer, points, highscore, secondsRemaining }, dispatch ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0)

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => {
        dispatch({ type: 'dataFailed' }) 
        console.log(err)}
      )
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen 
            numQuestions={numQuestions} 
            dispatch={dispatch} 
          />
        )}
        {status === 'active' && (
          <>
            <Progress 
              index={index} 
              numQuestions={numQuestions} 
              points={points} 
              maxPossiblePoints={maxPossiblePoints} 
              answer={answer} 
            />
            <Questions 
              question={questions[index]} 
              answer={answer} 
              dispatch={dispatch}
              points={points} 
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton 
                dispatch={dispatch} 
                answer={answer} 
                numQuestions={numQuestions} 
                index={index} 
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <Finished points={points} 
          maxPossiblePoints={maxPossiblePoints} 
          highscore={highscore} 
          dispatch={dispatch} />
        )}
      </Main>
    </div>
  )
}