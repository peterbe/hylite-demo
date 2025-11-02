def collatz(number):
    """
    Generates the next number in the Collatz sequence based on the given number.
    Prints the calculated value and returns it.
    """
    if number % 2 == 0:  # If the number is even
        next_number = number // 2
        print(next_number)
        return next_number
    else:  # If the number is odd
        next_number = 3 * number + 1
        print(next_number)
        return next_number
