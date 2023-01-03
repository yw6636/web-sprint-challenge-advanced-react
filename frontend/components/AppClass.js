import React, { useState } from 'react'
import axios from 'axios';
import * as yup from 'yup';

const formSchema = yup.object().shape({
  formValues: yup.string()
    .email('Ouch: email must be a valid email')
    .required('Ouch: email is required')
    .notOneOf(['foo@bar.baz'], 'foo@bar.baz failure #71')
})

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initialX = 2
const initialY = 2


export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor () {
    super();
    this.state = {
      x: initialX,
      y: initialY,
      xy: initialIndex,
      steps: initialSteps,
      message: initialMessage,
      formValues: ''
    }
  }
  
  getXY = () => {
    // It is not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return (`${this.state.x}, ${this.state.y}`)
  }

  getXYMessage = () => {
    // It is not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      ...this.state,
      x:  initialX,
      y: initialY,
      xy: initialIndex,
      steps: initialSteps,
      message: initialMessage,
      formValues: ''
    })
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    console.log(this.state.x);
    console.log(this.state.y);
    if(direction === 'left'){
      if(this.state.x - 1 === 0){
        return ({"x": this.state.x, "y": this.state.y})
      }
      return ({"x": this.state.x - 1, "y": this.state.y, "xy": this.state.xy - 1, "steps": this.state.steps + 1})
    }
    if(direction === 'right'){
      if(this.state.x + 1 ===  4){
        return ({"x": this.state.x, "y": this.state.y})
      }
      return ({"x": this.state.x + 1, "y": this.state.y, "xy": this.state.xy + 1, "steps": this.state.steps + 1})
    }
    if(direction === "up"){
      if(this.state.y - 1 === 0){
        return ({"x": this.state.x, "y": this.state.y})
      }
      return ({"x": this.state.x, "y": this.state.y - 1, "xy": this.state.xy - 3, "steps": this.state.steps + 1})
    }
    if(direction === "down"){
      if(this.state.y + 1 === 4){
        return ({"x": this.state.x, "y": this.state.y})
      }
      return ({"x": this.state.x, "y": this.state.y + 1, "xy": this.state.xy + 3, "steps": this.state.steps + 1}) 
    }
    return ({"x": this.state.x, "y": this.state.y})
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    let nextMove = this.getNextIndex(evt.target.id)
    if (`${nextMove.x}, ${nextMove.y}` === this.getXY()){
      return this.setState({message: `You can't go ${evt.target.id}`})
    }
    this.setState({
      ...this.state,
      message: initialMessage,
      x: nextMove.x,
      y: nextMove.y,
      steps: nextMove.steps,
      xy: nextMove.xy
    })
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({...this.state, [evt.target.name]: evt.target.value})
  }

  validate = (name, value) => {
    yup.reach(formSchema, name)
      .validate(value)
      .then(() => {
        console.log("form is valid")
        this.post()
      })
      .catch(err => {
        console.log("form is invalid")
        this.setState({message:err.errors[0]})})
  }

  post = () => {
    const toSend = {
      "x": this.state.x,
      "y": this.state.y,
      "steps": this.state.steps,
      "email": this.state.formValues
    }
    axios.post('http://localhost:9000/api/result', toSend)
      .then ((res) => {
        console.log(res)
        this.setState ({message: res.data.message})})
      .finally (this.setState({...this.state, formValues: '', message: ''}))
  }
 
  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    console.log("formValues", this.state.formValues)
    this.validate("formValues", this.state.formValues)
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{`Coordinates (${this.getXY()})`}</h3>
          <h3 id="steps">{`You moved ${this.state.steps} ${this.state.steps === 1 ? 'time' : 'times'}`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.xy ? ' active' : ''}`}>
                {idx === this.state.xy ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick = {(evt) => this.move(evt)}>LEFT</button>
          <button id="up" onClick = {(evt) => this.move(evt)}>UP</button>
          <button id="right" onClick = {(evt) => this.move(evt)}>RIGHT</button>
          <button id="down" onClick = {(evt) => this.move(evt)}>DOWN</button>
          <button id="reset" onClick = {(evt) => this.reset(evt)}>reset</button>
        </div>
        <form onSubmit ={(evt) => this.onSubmit(evt)}>
          <input id="email" type="email" placeholder="type email" name="formValues" value={this.state.formValues} onChange = {(evt) => this.onChange(evt)}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
