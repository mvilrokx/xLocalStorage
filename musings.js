// Usefull sources:
//    https://rainsoft.io/gentle-explanation-of-this-in-javascript/

const person = {
  name: 'Mark',
  getName: function getName(){
    // Here, this refers to this object, i.e. the person Object literal
    // therefor, to access the name attribute of ... well, this (object)
    // I have te refer it with this
    return this.name
  },
  // This is the same as above, just in ES6 you can ommit the function keyword
  // and function name, assuming they are the same (and they always should be)
  getNameES6Style() {
    return this.name
  }
}

console.log(person.name, person.getName(), person.getNameES6Style()) // Mark
person.name = 'Hijacked!'
console.log(person.name, person.getName(), person.getNameES6Style()) // Hijacked!


// This offers NO privacy, I can change the name attribute at will
// and I have NO control over this = BAD!
// I don't even need a getter here really, I can just get it when I want

// Lets see if we can improve on this
function personFactory(name) {
  const localName = name // Private!

  // ES6 syntax
  const getName = () => localName
  // ES6 syntax
  return {
    getName
  }
}

const newPerson = personFactory('Mark Factory')
console.log(newPerson.getName()) // 'Mark Factory'
// This will create a new attribute but not change the localName,
// In fact it cannot be changed as we did not provide a public setter method
newPerson.localName = 'Try as you might'
console.log(newPerson.getName()) // 'Mark Factory'
console.log(newPerson) // This will show the newly (wrongly) added localName attribute


// So now the question is, how do I add prototypes to this sort of construct.
// start by creating you prototype object
const proto = {
  setName(name) {
    this.localName = name
  },
  getName() {
    return this.localName
  }
}

// Then "inherit" this behaviour
const personFactory2 = function personFactory2(name) {
  const instance = Object.assign({}, proto)
  instance.localName = name
  return instance
}

const person2 = personFactory2('Mark')
console.log(person2.getName()) // 'Mark'

// Unfortunatelly, we have now made localName public again:
console.log(person2.localName) // 'Mark'
person2.localName = 'Hijacked!'
console.log(person2.localName) // 'Hijacked!'

// In order to avoid this, we can keep the localName a private variable and create
// getters and setters that can then be used in the prototype
const proto2 = {
  setName(name) {
    this.setLocalName(name)
  },
  getName() {
    return this.getLocalName()
  }
}

const personFactory3 = function personFactory3(name) {
  const localName = name // Private!

  const instance = Object.assign({}, proto2)

  instance.getLocalName = () => localName
  instance.setLocalName = (name) => localName = name

  return instance
}

const person3 = personFactory3('Mark')
console.log('person3.getName() = ', person3.getName()) // 'Mark'
person3.localName = 'Try as you might'
console.log('person3.getName() = ', person3.getName()) // 'Mark'
console.log(person3) // This will show the newly (wrongly) added localName attribute

////////////////////////////////////////////////////////////////////////
// Sidenote on 'this' in a Prototype:
// 'this' on a prototype also refers to the object (the prototype is attached to)

// 'prototype'
const employee = {
  getEmployeeId() {
    console.log(this === employeePerson) // => true
    return this.employeeId
  }

}
// create new object with employee as Prototype
const employeePerson = Object.assign({employeeId: 1}, employee)
// Essentially, the following 'method invocation' sets 'this' on the prototype = employeePerson
console.log(employeePerson.getEmployeeId())
// Still no private members though!
employeePerson.employeeId = 2
console.log(employeePerson.getEmployeeId())

// Also, DO NOT use arrow functions on Prototypes as 'this' will refer to
// the global scope in that situation
////////////////////////////////////////////////////////////////////////


