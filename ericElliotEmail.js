const personFactory = function personFactory() {
  const attr = {}

  const set = (key, value) => attr[key] = value
  const get = (key) => attr[key]

  const fullName = () => `${get('firstName')} ${get('lastName')}`

  return {
    set,
    get,
    fullName
  }
}

const mark = personFactory()
mark.set('firstName', 'Mark')
mark.set('lastName', 'Vilrokx')
console.log(mark.fullName()) // 'Mark Vilrokx'

// This works great, I do not have direct access to the attributes of the object
// And I have to use the accessor function to manage the private data

// Now I want to move the accessor functions to a prototype so I can "inherit"
// and reuse them and conserve memory space

const proto = {
  // attr: {},
  set(key, value) {this.attr[key] = value},
  get(key) {return this.attr[key]}
}

const personFactory2 = function personFactory2() {
  const attr = {}

  // Object.assign works, but I don't want to do that as this copies the proto
  // object's attributes into this object, which does not preserve memory
  const instance = Object.assign({}, proto)

  // const instance = Object.create(proto)

  instance.fullName = () => `${instance.get('firstName')} ${instance.get('lastName')}`
  return instance
}

const eric = personFactory2()
eric.set('firstName', 'Eric')
// eric.set('lastName', 'Elliot')
// console.log(eric.fullName()) // 'Eric Elliot'
// eric.attr.firstName = 'Erika'
// console.log(eric.fullName())
