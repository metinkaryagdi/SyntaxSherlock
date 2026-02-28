import math

def area(radius):
    # yarıçap negatifse uyarı vermek yeterli olur
    if radius < 0:
        print("Warning: radius is negative, returning absolute value")
    return math.pi * (abs(radius) ** 2)

r_values = [1, 2, 3, -4]
for r in r_values:
    print("Area:", area(r))
