import React, { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./styles.css"

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {
    switch(type) {
        // Add digits to the current operand
        case ACTIONS.ADD_DIGIT: 
            if(state.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false
                }
            }

            // Prevent adding more 0 when the first digit is already 0 (ex: 00000)
            if(payload.digit === "0" && state.currentOperand === "0") {
                return state
            }

            // Prevent more than one "."
            if(payload.digit === "." && state.currentOperand.includes(".")) {
                return state
            } 

            // Default return state
            return {
                ...state,
                currentOperand: `${state.currentOperand || "" }${payload.digit}`
            }
        
        // All Clear Use Case
        case ACTIONS.CLEAR: 
            return {}
        
        // Delete a digit at the end
        case ACTIONS.DELETE_DIGIT:
            if(state.overwrite) {
                return {
                    ...state,
                    currentOperand: null,
                    overwrite: false
                }
            }

            // reture state if there is no digit
            if (state.currentOperand == null) return state

            // Return null when there is only a digit 
            if (state.currentOperand.length === 1) {
                return { ... state, currentOperand: null }
            }

            // Normal Deleting UC
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }
        
        // Adding in an operation to the formula
        case ACTIONS.CHOOSE_OPERATION:
            // return null when the operands are not entered in yet
            if(state.currentOperand == null && state.previousOperand == null ) {
                return state
            }

            if (state.currentOperand == null ) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }

            if(state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }

            return {
                ...state,
                previousOperand: evaluate(state),
                currentOperand: null,
                operation: payload.operation
            }
        
        case ACTIONS.EVALUATE:
            if(state.operation == null || state.previousOperand == null || state.currentOperand == null) {
                return state
            }

            return {
                ...state,
                previousOperand: null,
                currentOperand: evaluate(state),
                operation: null,
                overwrite: true
            }
    }
}

function evaluate( { currentOperand, previousOperand, operation} ) {
    const prev = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)
    if(isNaN(prev) || isNaN(current)) return ""
    let compuation = ""
    switch (operation) {
        case "+": 
            compuation = prev + current
            break
        case "-":
            compuation = prev - current
            break
        case "*":
            compuation = prev * current
            break
        case "÷":
            compuation = prev / current
            break
    }

    return compuation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
})

function formatOperand(operand) {
    if (operand == null) return
    const [integer, decimal] = operand.split('.')

    if (decimal == null ) return INTEGER_FORMATTER.format(integer)
    
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

const App = () => {

    const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})


    return (
        <div className="calculator-grid">
            <div className="output">
                <div className="previous-operand"> {formatOperand(previousOperand)} {operation} </div>
                <div className="current-operand"> {formatOperand(currentOperand)} </div>
            </div>
            <button className="span-two" onClick={() => dispatch( {type: ACTIONS.CLEAR })}>AC</button>
            <button onClick={() => dispatch( {type: ACTIONS.DELETE_DIGIT })}>DEL</button>
            <OperationButton operation="÷" dispatch={dispatch}/>
            <DigitButton digit="1" dispatch={dispatch}/>
            <DigitButton digit="2" dispatch={dispatch}/>
            <DigitButton digit="3" dispatch={dispatch}/>
            <OperationButton operation="*" dispatch={dispatch}/>
            <DigitButton digit="4" dispatch={dispatch}/>
            <DigitButton digit="5" dispatch={dispatch}/>
            <DigitButton digit="6" dispatch={dispatch}/>
            <OperationButton operation="+" dispatch={dispatch}/>
            <DigitButton digit="7" dispatch={dispatch}/>
            <DigitButton digit="8" dispatch={dispatch}/>
            <DigitButton digit="9" dispatch={dispatch}/>
            <OperationButton operation="-" dispatch={dispatch}/>
            <DigitButton digit="." dispatch={dispatch}/>
            <DigitButton digit="0" dispatch={dispatch}/>
            <button className="span-two" onClick={() => dispatch( {type: ACTIONS.EVALUATE })}>
                =
            </button>
        </div>
    )
}

export default App