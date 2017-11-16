export const INCREMENT_REQUESTED = 'counter/INCREMENT_REQUESTED'
export const INCREMENT = 'counter/INCREMENT'
export const DECREMENT_REQUESTED = 'counter/DECREMENT_REQUESTED'
export const DECREMENT = 'counter/DECREMENT'
export const INCREMENT_TIMER = 'counter/INCREMENT_TIMER'
export const INCREMENT_TIMER_MANNUAL = 'counter/INCREMENT_TIMER_MANNUAL'

export const TIMER_START = 'counter/TIMER_START'
export const STOP_TIMER = 'counter/TIMER_STOP'
export const LOADING_FINISHED = 'counter/LOADING_FINISHED'
export const SET_TOTAL = 'counter/SET_TOTAL'
export const SET_ALLPHOTOS = 'counter/SET_ALLPHOTOS'

// export const TIMER_TICK = 'counter/TIMER_TICK'

const initialState = {
  // timerFunction: null,
//   count: 0,
  totalPhotoNum: -1,
  timer: 0,
  loading: true,
  allGalaryPhotos: []
  // timerIncrementing: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_TIMER_MANNUAL:
      // console.log('INCREMENT_TIMER_MANNUAL ACTION CALLED');
      var currentTimer = -1;
      if(state.timer + 1 < state.totalPhotoNum)
      {
        currentTimer = state.timer + 1;
      }
      else
      {
        currentTimer = 0;
      }
      return {
        ...state,
        timer: currentTimer,        
      }      

    case SET_ALLPHOTOS:
      // console.log('SET_ALLPHOTOS ACTION CALLED');
      return {
        ...state,
        allGalaryPhotos: action.value,        
      }     

    case SET_TOTAL:
      // console.log('SET_TOTAL ACTION CALLED');
      return {
        ...state,
        totalPhotoNum: action.value,        
      }      

    case LOADING_FINISHED:
      // console.log('LOADING FINISHED ACTION CALLED');
      return {
        ...state,
        loading: false,        
      }      

    case STOP_TIMER:
      // console.log('STOP_TIMER ACTION CALLED');
      clearInterval(timerFunc);
      return state
      
    case INCREMENT_TIMER:
      // console.log('INCREMENT_TIMER ACTION CALLED!');
      var currentTimer = -1;
      if(state.timer + 1 < state.totalPhotoNum)
      {
        currentTimer = state.timer + 1;
      }
      else
      {
        currentTimer = 0;
      }
      // console.log('currentTimer is: ',currentTimer,', totlaPhotoNum: ', state.totalPhotoNum);
      
      return {
        ...state,
        timer: currentTimer,        
      }

    default:
      return state
  }
}


var timerFunc = null;

export function setAllPhotosFunc(value) {
  return {
    type: 'ADD_TODO', 
    value
  }
}

// type,
// value,
// somethingelse


export const setAllPhotosTEST = (value) => {
  return dispatch => 
  {
    dispatch({
      type: 'counter/SET_ALLPHOTOS',
      value
    })

  }
}


export const setAllPhotos = (value) => {
  return dispatch => 
  {
    dispatch({
      type: SET_ALLPHOTOS,
      value
    })

  }
}

export const setTotalPhotos = (value) => {
  return dispatch => 
  {
    dispatch({
      type: SET_TOTAL,
      value
    })

  }
}


export const stopTimer = () => {
  return dispatch => 
  {
    dispatch({
      type: STOP_TIMER
    })

  }
}




export const incrementTimerMannual = () => {
  return dispatch => 
  {
    dispatch({
      type: INCREMENT_TIMER_MANNUAL
    })

  }
}

export const incrementTimer = () => {
  return dispatch => 
  {
    timerFunc = setInterval(() => {
      dispatch({
        type: INCREMENT_TIMER
      })
    }, 2000)

    return timerFunc;

  }
}

export const loadingfinished = () => {
  return dispatch => 
  {
    dispatch({
      type: LOADING_FINISHED
    })

  }
}