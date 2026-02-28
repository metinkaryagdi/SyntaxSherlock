from math import sqrt

 def compute(x):
    if x == 0:
        print("Dividing by zero...") # hata açıklaması ama engellenmemiş
    return 10 / x  # ZeroDivisionError

  def buggy_func(data):
    for i in range(5):
        if data[i] > 0: # IndexError potansiyeli
            result = compute(data[i])
            print(result)

buggy_func([5, -1])
