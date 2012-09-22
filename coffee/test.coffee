$ ->
	demoTask = (start, end) -> end - start
	foods = ['broccoli', 'spinach', 'chocolate']
	eat food for food in foods when food isnt 'chocolate'
	test = (x)-> x*2
	fill = (container, liquid = "coffee") ->
  		"Filling the #{container} with #{liquid}..."
	shortNames = (name for name in list when name.length < 5)
	numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

	numbers[3..6] = [-3, -4, -5, -6]	
	window.like
		ss:"nihak"
		
class Animal
  constructor: (@name) ->

  move: (meters) ->
    alert @name + " moved #{meters}m."

class Snake extends Animal
  move: ->
    alert "Slithering..."
    super 5

class Horse extends Animal
  move: ->
    alert "Galloping..."
    super 45

sam = new Snake "Sammy the Python"
tom = new Horse "Tommy the Palomino"

sam.move()
tom.move()