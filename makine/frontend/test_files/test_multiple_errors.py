def process_data(numbers):
    """Verilen sayıları işler"""
    
    # ZeroDivisionError - 1. hata
    avg = sum(numbers) / 0
    
    # IndexError - 2. hata
    first = numbers[100]
    
    return avg, first

result = process_data([1, 2, 3, 4, 5])
print(result)

