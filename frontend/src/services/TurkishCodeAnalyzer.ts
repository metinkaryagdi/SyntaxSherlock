// Backend'deki tüm hata kodlarının Türkçe açıklamaları
export interface CodeIssue {
  code: string
  message: string
  line: number
  column: number
  severity: 'error' | 'warning' | 'info' | 'convention' | 'naming'
  turkishExplanation: string
  badExample: string
  goodExample: string
  fixSuggestion: string
}

export class TurkishCodeAnalyzer {
  // Backend'deki classify_severity fonksiyonuna uygun severity mapping
  static classifySeverity(code: string): string {
    if (!code) return "info"
    const prefix = code[0].toUpperCase()
    if (prefix === "F" || prefix === "E") return "error"
    else if (prefix === "W") return "warning"
    else if (prefix === "C") return "convention"
    else if (prefix === "N") return "naming"
    else return "info"
  }

  // Backend'deki tüm hata kodlarının Türkçe açıklamaları
  static getIssueDetails(code: string): Partial<CodeIssue> {
    const issueMap: Record<string, Partial<CodeIssue>> = {
      // E kodları (pycodestyle - PEP 8 hataları)
      'E101': {
        turkishExplanation: 'Indentation hatası - karışık tab ve space kullanımı',
        badExample: 'def func():\n\t    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: '1. Editörünüzde "Show Whitespace" özelliğini açın\n2. Tab karakterlerini (\t) görün\n3. Tüm tab karakterlerini 4 space ile değiştirin\n4. Gelecekte sadece space kullanın'
      },
      'E111': {
        turkishExplanation: 'Indentation hatası - 4 space yerine farklı sayıda space',
        badExample: 'def func():\n  pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: '1. Hatalı satırı bulun\n2. Satır başındaki space sayısını sayın\n3. Eksik space\'leri ekleyin (toplam 4 olmalı)\n4. Editörünüzde "Tab Size: 4" ayarını yapın'
      },
      'E112': {
        turkishExplanation: 'Beklenen indentation eksik',
        badExample: 'if True:\npass',
        goodExample: 'if True:\n    pass',
        fixSuggestion: '1. if/for/while/def/try/except\'ten sonraki satırları bulun\n2. Bu satırların başına 4 space ekleyin\n3. İç içe bloklar için her seviyede 4 space daha ekleyin\n4. Python\'da indentation zorunludur!'
      },
      'E113': {
        turkishExplanation: 'Indentation hatası - beklenmeyen indent',
        badExample: 'def func():\n        pass\n    return',
        goodExample: 'def func():\n    pass\n    return',
        fixSuggestion: 'Indentation seviyelerini kontrol edin'
      },
      'E114': {
        turkishExplanation: 'Indentation hatası - tab ve space karışımı',
        badExample: 'def func():\n\t    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Sadece space veya sadece tab kullanın'
      },
      'E115': {
        turkishExplanation: 'Indentation hatası - beklenmeyen indent',
        badExample: 'def func():\n        pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Doğru indentation seviyesini kullanın'
      },
      'E116': {
        turkishExplanation: 'Indentation hatası - beklenmeyen indent',
        badExample: 'if True:\n        pass',
        goodExample: 'if True:\n    pass',
        fixSuggestion: 'Kontrol yapıları için doğru indentation kullanın'
      },
      'E117': {
        turkishExplanation: 'Indentation hatası - beklenmeyen indent',
        badExample: 'for i in range(5):\n        pass',
        goodExample: 'for i in range(5):\n    pass',
        fixSuggestion: 'Döngüler için doğru indentation kullanın'
      },
      'E201': {
        turkishExplanation: 'Parantez öncesi gereksiz boşluk',
        badExample: 'func( )',
        goodExample: 'func()',
        fixSuggestion: '1. Parantez öncesindeki boşluğu silin\n2. Parantez içinde de boşluk varsa onu da silin\n3. Örnek: "func( )" → "func()"\n4. PEP 8\'e göre parantez öncesi boşluk olmamalı'
      },
      'E202': {
        turkishExplanation: 'Parantez sonrası gereksiz boşluk',
        badExample: 'func( )',
        goodExample: 'func()',
        fixSuggestion: 'Parantez sonrası boşlukları kaldırın'
      },
      'E203': {
        turkishExplanation: 'Virgül öncesi gereksiz boşluk',
        badExample: 'a, b, c',
        goodExample: 'a,b,c',
        fixSuggestion: 'Virgül öncesi boşlukları kaldırın'
      },
      'E211': {
        turkishExplanation: 'Parantez öncesi gereksiz boşluk',
        badExample: 'func (arg)',
        goodExample: 'func(arg)',
        fixSuggestion: 'Parantez öncesi boşlukları kaldırın'
      },
      'E221': {
        turkishExplanation: 'Operatör öncesi gereksiz boşluk',
        badExample: 'a =  b',
        goodExample: 'a = b',
        fixSuggestion: 'Operatör öncesi boşlukları kaldırın'
      },
      'E222': {
        turkishExplanation: 'Operatör sonrası gereksiz boşluk',
        badExample: 'a =  b',
        goodExample: 'a = b',
        fixSuggestion: 'Operatör sonrası boşlukları kaldırın'
      },
      'E223': {
        turkishExplanation: 'Operatör öncesi gereksiz boşluk',
        badExample: 'a =  b',
        goodExample: 'a = b',
        fixSuggestion: 'Operatör öncesi boşlukları kaldırın'
      },
      'E224': {
        turkishExplanation: 'Operatör sonrası gereksiz boşluk',
        badExample: 'a =  b',
        goodExample: 'a = b',
        fixSuggestion: 'Operatör sonrası boşlukları kaldırın'
      },
      'E225': {
        turkishExplanation: 'Operatör öncesi/sonrası gereksiz boşluk',
        badExample: 'a =  b',
        goodExample: 'a = b',
        fixSuggestion: 'Operatör çevresindeki boşlukları kontrol edin'
      },
      'E226': {
        turkishExplanation: 'Operatör öncesi/sonrası gereksiz boşluk',
        badExample: 'a =  b',
        goodExample: 'a = b',
        fixSuggestion: 'Operatör çevresindeki boşlukları kontrol edin'
      },
      'E227': {
        turkishExplanation: 'Operatör öncesi/sonrası gereksiz boşluk',
        badExample: 'a =  b',
        goodExample: 'a = b',
        fixSuggestion: 'Operatör çevresindeki boşlukları kontrol edin'
      },
      'E228': {
        turkishExplanation: 'Operatör öncesi/sonrası gereksiz boşluk',
        badExample: 'a =  b',
        goodExample: 'a = b',
        fixSuggestion: 'Operatör çevresindeki boşlukları kontrol edin'
      },
      'E231': {
        turkishExplanation: 'Virgül sonrası eksik boşluk',
        badExample: 'a,b,c',
        goodExample: 'a, b, c',
        fixSuggestion: '1. Virgül karakterini bulun\n2. Virgülün hemen sonrasına bir space ekleyin\n3. Örnek: "a,b,c" → "a, b, c"\n4. Bu kural liste, tuple ve fonksiyon parametreleri için geçerli'
      },
      'E241': {
        turkishExplanation: 'Virgül sonrası gereksiz boşluk',
        badExample: 'a,  b, c',
        goodExample: 'a, b, c',
        fixSuggestion: 'Virgül sonrası tek boşluk kullanın'
      },
      'E242': {
        turkishExplanation: 'Virgül sonrası gereksiz boşluk',
        badExample: 'a,  b, c',
        goodExample: 'a, b, c',
        fixSuggestion: 'Virgül sonrası tek boşluk kullanın'
      },
      'E251': {
        turkishExplanation: 'Fonksiyon parametresi çevresinde gereksiz boşluk',
        badExample: 'def func( a = 1 ):',
        goodExample: 'def func(a=1):',
        fixSuggestion: 'Fonksiyon parametrelerinde gereksiz boşlukları kaldırın'
      },
      'E261': {
        turkishExplanation: 'Satır içi yorumdan önce en az 2 boşluk olmalı',
        badExample: 'x = 5# Bu bir yorum',
        goodExample: 'x = 5  # Bu bir yorum',
        fixSuggestion: 'Yorumdan önce 2 boşluk ekleyin'
      },
      'E262': {
        turkishExplanation: 'Yorum başlangıcında gereksiz boşluk',
        badExample: '# Bu bir yorum',
        goodExample: '#Bu bir yorum',
        fixSuggestion: 'Yorum başlangıcında boşluk kullanmayın'
      },
      'E265': {
        turkishExplanation: 'Blok yorumundan önce boşluk eksik',
        badExample: '#Yorum\nif True:',
        goodExample: '# Yorum\nif True:',
        fixSuggestion: 'Blok yorumundan önce boşluk ekleyin'
      },
      'E266': {
        turkishExplanation: 'Yorumda gereksiz # karakteri',
        badExample: '## Bu bir yorum',
        goodExample: '# Bu bir yorum',
        fixSuggestion: 'Yorumda tek # karakteri kullanın'
      },
      'E271': {
        turkishExplanation: 'Import öncesi gereksiz boşluk',
        badExample: ' import os',
        goodExample: 'import os',
        fixSuggestion: 'Import öncesi boşlukları kaldırın'
      },
      'E272': {
        turkishExplanation: 'Import öncesi gereksiz boşluk',
        badExample: ' import os',
        goodExample: 'import os',
        fixSuggestion: 'Import öncesi boşlukları kaldırın'
      },
      'E273': {
        turkishExplanation: 'Import öncesi gereksiz boşluk',
        badExample: ' import os',
        goodExample: 'import os',
        fixSuggestion: 'Import öncesi boşlukları kaldırın'
      },
      'E274': {
        turkishExplanation: 'Import öncesi gereksiz boşluk',
        badExample: ' import os',
        goodExample: 'import os',
        fixSuggestion: 'Import öncesi boşlukları kaldırın'
      },
      'E275': {
        turkishExplanation: 'Import öncesi gereksiz boşluk',
        badExample: ' import os',
        goodExample: 'import os',
        fixSuggestion: 'Import öncesi boşlukları kaldırın'
      },
      'E301': {
        turkishExplanation: 'Fonksiyon tanımından önce 2 boş satır olmalı',
        badExample: 'def func1():\n    pass\ndef func2():',
        goodExample: 'def func1():\n    pass\n\n\ndef func2():',
        fixSuggestion: '1. Fonksiyon tanımını bulun\n2. Fonksiyondan önceki satırları sayın\n3. Eksik boş satırları ekleyin (toplam 2 olmalı)\n4. Sınıf tanımları için de aynı kural geçerli'
      },
      'E302': {
        turkishExplanation: 'Fonksiyon tanımından önce 2 boş satır olmalı',
        badExample: 'def func1():\n    pass\ndef func2():',
        goodExample: 'def func1():\n    pass\n\n\ndef func2():',
        fixSuggestion: 'Fonksiyonlar arasına 2 boş satır ekleyin'
      },
      'E303': {
        turkishExplanation: 'Çok fazla boş satır',
        badExample: 'def func1():\n    pass\n\n\n\n\ndef func2():',
        goodExample: 'def func1():\n    pass\n\n\ndef func2():',
        fixSuggestion: 'Gereksiz boş satırları kaldırın'
      },
      'E304': {
        turkishExplanation: 'Çok fazla boş satır',
        badExample: 'def func1():\n    pass\n\n\n\n\ndef func2():',
        goodExample: 'def func1():\n    pass\n\n\ndef func2():',
        fixSuggestion: 'Gereksiz boş satırları kaldırın'
      },
      'E305': {
        turkishExplanation: 'Çok fazla boş satır',
        badExample: 'def func1():\n    pass\n\n\n\n\ndef func2():',
        goodExample: 'def func1():\n    pass\n\n\ndef func2():',
        fixSuggestion: 'Gereksiz boş satırları kaldırın'
      },
      'E306': {
        turkishExplanation: 'Çok fazla boş satır',
        badExample: 'def func1():\n    pass\n\n\n\n\ndef func2():',
        goodExample: 'def func1():\n    pass\n\n\ndef func2():',
        fixSuggestion: 'Gereksiz boş satırları kaldırın'
      },
      'E401': {
        turkishExplanation: 'Import\'lar ayrı satırlarda olmalı',
        badExample: 'import os, sys',
        goodExample: 'import os\nimport sys',
        fixSuggestion: 'Her import\'u ayrı satırda yazın'
      },
      'E402': {
        turkishExplanation: 'Module docstring\'den önce import',
        badExample: 'import os\n"""Docstring"""',
        goodExample: '"""Docstring"""\nimport os',
        fixSuggestion: 'Module docstring\'i import\'lardan önce yazın'
      },
      'E501': {
        turkishExplanation: 'Satır çok uzun (79 karakterden fazla)',
        badExample: 'def very_long_function_name_with_many_parameters(param1, param2, param3, param4, param5):',
        goodExample: 'def very_long_function_name_with_many_parameters(\n    param1, param2, param3, param4, param5\n):',
        fixSuggestion: 'Satırı kırın veya değişken adlarını kısaltın'
      },
      'E502': {
        turkishExplanation: 'Operatör öncesi/sonrası gereksiz boşluk',
        badExample: 'a =  b',
        goodExample: 'a = b',
        fixSuggestion: 'Operatör çevresindeki boşlukları kontrol edin'
      },
      'E701': {
        turkishExplanation: 'Çok satırlı if ifadesi',
        badExample: 'if True: pass',
        goodExample: 'if True:\n    pass',
        fixSuggestion: 'Çok satırlı if ifadelerini düzgün formatlayın'
      },
      'E702': {
        turkishExplanation: 'Çok satırlı if ifadesi',
        badExample: 'if True: pass',
        goodExample: 'if True:\n    pass',
        fixSuggestion: 'Çok satırlı if ifadelerini düzgün formatlayın'
      },
      'E703': {
        turkishExplanation: 'Çok satırlı if ifadesi',
        badExample: 'if True: pass',
        goodExample: 'if True:\n    pass',
        fixSuggestion: 'Çok satırlı if ifadelerini düzgün formatlayın'
      },
      'E704': {
        turkishExplanation: 'Çok satırlı if ifadesi',
        badExample: 'if True: pass',
        goodExample: 'if True:\n    pass',
        fixSuggestion: 'Çok satırlı if ifadelerini düzgün formatlayın'
      },
      'E711': {
        turkishExplanation: 'None ile karşılaştırma için is/is not kullanın',
        badExample: 'if x == None:',
        goodExample: 'if x is None:',
        fixSuggestion: 'None karşılaştırmalarında is/is not kullanın'
      },
      'E712': {
        turkishExplanation: 'Boolean ile karşılaştırma için is/is not kullanın',
        badExample: 'if x == True:',
        goodExample: 'if x is True:',
        fixSuggestion: 'Boolean karşılaştırmalarında is/is not kullanın'
      },
      'E713': {
        turkishExplanation: 'Membership test için not in kullanın',
        badExample: 'if not x in y:',
        goodExample: 'if x not in y:',
        fixSuggestion: 'Membership test için not in kullanın'
      },
      'E714': {
        turkishExplanation: 'Membership test için not in kullanın',
        badExample: 'if not x in y:',
        goodExample: 'if x not in y:',
        fixSuggestion: 'Membership test için not in kullanın'
      },
      'E721': {
        turkishExplanation: 'Exception yakalama için as kullanın',
        badExample: 'except Exception, e:',
        goodExample: 'except Exception as e:',
        fixSuggestion: 'Exception yakalama için as kullanın'
      },
      'E722': {
        turkishExplanation: 'Bare except kullanmayın',
        badExample: 'except:',
        goodExample: 'except Exception:',
        fixSuggestion: 'Specific exception türleri kullanın'
      },
      'E731': {
        turkishExplanation: 'Lambda\'yı fonksiyon olarak tanımlayın',
        badExample: 'f = lambda x: x * 2',
        goodExample: 'def f(x):\n    return x * 2',
        fixSuggestion: 'Lambda yerine fonksiyon tanımlayın'
      },
      'E741': {
        turkishExplanation: 'Ambiguous variable name',
        badExample: 'l = [1, 2, 3]',
        goodExample: 'numbers = [1, 2, 3]',
        fixSuggestion: 'Daha açıklayıcı değişken adları kullanın'
      },
      'E742': {
        turkishExplanation: 'Ambiguous variable name',
        badExample: 'l = [1, 2, 3]',
        goodExample: 'numbers = [1, 2, 3]',
        fixSuggestion: 'Daha açıklayıcı değişken adları kullanın'
      },
      'E743': {
        turkishExplanation: 'Ambiguous variable name',
        badExample: 'l = [1, 2, 3]',
        goodExample: 'numbers = [1, 2, 3]',
        fixSuggestion: 'Daha açıklayıcı değişken adları kullanın'
      },
      'E901': {
        turkishExplanation: 'Syntax hatası',
        badExample: 'def func(\n    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Syntax hatasını düzeltin'
      },
      'E902': {
        turkishExplanation: 'IOError',
        badExample: 'open("nonexistent.txt")',
        goodExample: 'try:\n    with open("file.txt") as f:\n        pass\nexcept IOError:\n    pass',
        fixSuggestion: 'Dosya işlemlerinde hata yönetimi yapın'
      },

      // F kodları (pyflakes - kullanılmayan import'lar, tanımlanmamış değişkenler)
      'F401': {
        turkishExplanation: 'İçe aktarılan modül kullanılmıyor',
        badExample: 'import os\nimport sys\nprint("Merhaba")',
        goodExample: 'print("Merhaba")',
        fixSuggestion: '1. Import edilen modülün kodda kullanılıp kullanılmadığını kontrol edin\n2. Kullanılmıyorsa import satırını silin\n3. Gelecekte sadece ihtiyacınız olan modülleri import edin\n4. Bu kod temizliği ve performans için önemli'
      },
      'F402': {
        turkishExplanation: 'Import edilen modül kullanılmıyor',
        badExample: 'from os import path\nprint("Merhaba")',
        goodExample: 'print("Merhaba")',
        fixSuggestion: 'Kullanılmayan import\'ları kaldırın'
      },
      'F403': {
        turkishExplanation: 'Star import kullanılmıyor',
        badExample: 'from os import *\nprint("Merhaba")',
        goodExample: 'print("Merhaba")',
        fixSuggestion: 'Star import\'ları kaldırın'
      },
      'F404': {
        turkishExplanation: 'Import edilen modül kullanılmıyor',
        badExample: 'from os import path\nprint("Merhaba")',
        goodExample: 'print("Merhaba")',
        fixSuggestion: 'Kullanılmayan import\'ları kaldırın'
      },
      'F405': {
        turkishExplanation: 'Star import kullanılmıyor',
        badExample: 'from os import *\nprint("Merhaba")',
        goodExample: 'print("Merhaba")',
        fixSuggestion: 'Star import\'ları kaldırın'
      },
      'F406': {
        turkishExplanation: 'Star import kullanılmıyor',
        badExample: 'from os import *\nprint("Merhaba")',
        goodExample: 'print("Merhaba")',
        fixSuggestion: 'Star import\'ları kaldırın'
      },
      'F407': {
        turkishExplanation: 'Star import kullanılmıyor',
        badExample: 'from os import *\nprint("Merhaba")',
        goodExample: 'print("Merhaba")',
        fixSuggestion: 'Star import\'ları kaldırın'
      },
      'F601': {
        turkishExplanation: 'Dictionary key tekrarı',
        badExample: 'd = {"a": 1, "a": 2}',
        goodExample: 'd = {"a": 1, "b": 2}',
        fixSuggestion: 'Dictionary\'de tekrar eden key\'leri kaldırın'
      },
      'F602': {
        turkishExplanation: 'Dictionary key tekrarı',
        badExample: 'd = {"a": 1, "a": 2}',
        goodExample: 'd = {"a": 1, "b": 2}',
        fixSuggestion: 'Dictionary\'de tekrar eden key\'leri kaldırın'
      },
      'F621': {
        turkishExplanation: 'Çoklu assignment hatası',
        badExample: 'a, b = 1',
        goodExample: 'a, b = 1, 2',
        fixSuggestion: 'Çoklu assignment\'ta değer sayısını kontrol edin'
      },
      'F622': {
        turkishExplanation: 'Çoklu assignment hatası',
        badExample: 'a, b = 1',
        goodExample: 'a, b = 1, 2',
        fixSuggestion: 'Çoklu assignment\'ta değer sayısını kontrol edin'
      },
      'F631': {
        turkishExplanation: 'Çoklu assignment hatası',
        badExample: 'a, b = 1',
        goodExample: 'a, b = 1, 2',
        fixSuggestion: 'Çoklu assignment\'ta değer sayısını kontrol edin'
      },
      'F632': {
        turkishExplanation: 'Çoklu assignment hatası',
        badExample: 'a, b = 1',
        goodExample: 'a, b = 1, 2',
        fixSuggestion: 'Çoklu assignment\'ta değer sayısını kontrol edin'
      },
      'F701': {
        turkishExplanation: 'Break/continue hatası',
        badExample: 'for i in range(5):\n    if i == 3:\n        break\n    else:\n        break',
        goodExample: 'for i in range(5):\n    if i == 3:\n        break',
        fixSuggestion: 'Break/continue kullanımını kontrol edin'
      },
      'F702': {
        turkishExplanation: 'Break/continue hatası',
        badExample: 'for i in range(5):\n    if i == 3:\n        break\n    else:\n        break',
        goodExample: 'for i in range(5):\n    if i == 3:\n        break',
        fixSuggestion: 'Break/continue kullanımını kontrol edin'
      },
      'F703': {
        turkishExplanation: 'Break/continue hatası',
        badExample: 'for i in range(5):\n    if i == 3:\n        break\n    else:\n        break',
        goodExample: 'for i in range(5):\n    if i == 3:\n        break',
        fixSuggestion: 'Break/continue kullanımını kontrol edin'
      },
      'F704': {
        turkishExplanation: 'Break/continue hatası',
        badExample: 'for i in range(5):\n    if i == 3:\n        break\n    else:\n        break',
        goodExample: 'for i in range(5):\n    if i == 3:\n        break',
        fixSuggestion: 'Break/continue kullanımını kontrol edin'
      },
      'F705': {
        turkishExplanation: 'Break/continue hatası',
        badExample: 'for i in range(5):\n    if i == 3:\n        break\n    else:\n        break',
        goodExample: 'for i in range(5):\n    if i == 3:\n        break',
        fixSuggestion: 'Break/continue kullanımını kontrol edin'
      },
      'F706': {
        turkishExplanation: 'Break/continue hatası',
        badExample: 'for i in range(5):\n    if i == 3:\n        break\n    else:\n        break',
        goodExample: 'for i in range(5):\n    if i == 3:\n        break',
        fixSuggestion: 'Break/continue kullanımını kontrol edin'
      },
      'F707': {
        turkishExplanation: 'Break/continue hatası',
        badExample: 'for i in range(5):\n    if i == 3:\n        break\n    else:\n        break',
        goodExample: 'for i in range(5):\n    if i == 3:\n        break',
        fixSuggestion: 'Break/continue kullanımını kontrol edin'
      },
      'F721': {
        turkishExplanation: 'Syntax hatası',
        badExample: 'def func(\n    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Syntax hatasını düzeltin'
      },
      'F722': {
        turkishExplanation: 'Syntax hatası',
        badExample: 'def func(\n    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Syntax hatasını düzeltin'
      },
      'F731': {
        turkishExplanation: 'Syntax hatası',
        badExample: 'def func(\n    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Syntax hatasını düzeltin'
      },
      'F732': {
        turkishExplanation: 'Syntax hatası',
        badExample: 'def func(\n    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Syntax hatasını düzeltin'
      },
      'F741': {
        turkishExplanation: 'Syntax hatası',
        badExample: 'def func(\n    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Syntax hatasını düzeltin'
      },
      'F742': {
        turkishExplanation: 'Syntax hatası',
        badExample: 'def func(\n    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Syntax hatasını düzeltin'
      },
      'F743': {
        turkishExplanation: 'Syntax hatası',
        badExample: 'def func(\n    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Syntax hatasını düzeltin'
      },
      'F811': {
        turkishExplanation: 'Redefined while unused',
        badExample: 'def func():\n    pass\ndef func():\n    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Tekrar tanımlanan fonksiyonları kaldırın'
      },
      'F812': {
        turkishExplanation: 'Redefined while unused',
        badExample: 'def func():\n    pass\ndef func():\n    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Tekrar tanımlanan fonksiyonları kaldırın'
      },
      'F821': {
        turkishExplanation: 'Undefined name',
        badExample: 'print(undefined_var)',
        goodExample: 'var = "test"\nprint(var)',
        fixSuggestion: 'Tanımlanmamış değişkenleri tanımlayın'
      },
      'F822': {
        turkishExplanation: 'Undefined name',
        badExample: 'print(undefined_var)',
        goodExample: 'var = "test"\nprint(var)',
        fixSuggestion: 'Tanımlanmamış değişkenleri tanımlayın'
      },
      'F823': {
        turkishExplanation: 'Undefined name',
        badExample: 'print(undefined_var)',
        goodExample: 'var = "test"\nprint(var)',
        fixSuggestion: 'Tanımlanmamış değişkenleri tanımlayın'
      },
      'F831': {
        turkishExplanation: 'Undefined name',
        badExample: 'print(undefined_var)',
        goodExample: 'var = "test"\nprint(var)',
        fixSuggestion: 'Tanımlanmamış değişkenleri tanımlayın'
      },
      'F841': {
        turkishExplanation: 'Local variable assigned but never used',
        badExample: 'def func():\n    x = 5\n    return 10',
        goodExample: 'def func():\n    return 10',
        fixSuggestion: 'Kullanılmayan local değişkenleri kaldırın'
      },

      // W kodları (pycodestyle - uyarılar)
      'W191': {
        turkishExplanation: 'Indentation hatası - tab kullanımı',
        badExample: 'def func():\n\tpass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: '1. Editörünüzde "Show Whitespace" özelliğini açın\n2. Tab karakterlerini (\t) görün\n3. Tüm tab karakterlerini 4 space ile değiştirin\n4. Editörünüzde "Convert Tabs to Spaces" ayarını aktifleştirin'
      },
      'W291': {
        turkishExplanation: 'Satır sonunda gereksiz boşluk var',
        badExample: 'x = 5    ',
        goodExample: 'x = 5',
        fixSuggestion: '1. Satır sonundaki boşlukları görün (Show Whitespace açın)\n2. Satır sonundaki tüm space karakterlerini silin\n3. Editörünüzde "Trim Trailing Whitespace" ayarını aktifleştirin\n4. Bu hata genelde kopyala-yapıştır işlemlerinde oluşur'
      },
      'W292': {
        turkishExplanation: 'Dosya sonunda yeni satır karakteri eksik',
        badExample: 'print("Son satır")',
        goodExample: 'print("Son satır")\n',
        fixSuggestion: '1. Dosyanın son satırını bulun\n2. Son satırın sonuna Enter tuşuna basın\n3. Dosya sonunda boş bir satır oluşmalı\n4. Bu Unix/Linux standartları için zorunludur'
      },
      'W293': {
        turkishExplanation: 'Boş satırda boşluk karakteri var',
        badExample: 'x = 5\n    \ny = 10',
        goodExample: 'x = 5\n\ny = 10',
        fixSuggestion: 'Boş satırları tamamen temizleyin'
      },
      'W391': {
        turkishExplanation: 'Dosya sonunda çok fazla boş satır',
        badExample: 'print("Son satır")\n\n\n\n',
        goodExample: 'print("Son satır")\n',
        fixSuggestion: 'Dosya sonundaki gereksiz boş satırları kaldırın'
      },
      'W503': {
        turkishExplanation: 'Operatör öncesi satır sonu',
        badExample: 'if (a and\n    b):',
        goodExample: 'if (a\n    and b):',
        fixSuggestion: 'Operatörü satır sonuna taşıyın'
      },
      'W504': {
        turkishExplanation: 'Operatör sonrası satır sonu',
        badExample: 'if (a\n    and b):',
        goodExample: 'if (a and\n    b):',
        fixSuggestion: 'Operatörü satır başına taşıyın'
      },
      'W505': {
        turkishExplanation: 'Operatör öncesi/sonrası satır sonu',
        badExample: 'if (a and\n    b):',
        goodExample: 'if (a\n    and b):',
        fixSuggestion: 'Operatör konumunu kontrol edin'
      },
      'W601': {
        turkishExplanation: 'Operatör öncesi/sonrası satır sonu',
        badExample: 'if (a and\n    b):',
        goodExample: 'if (a\n    and b):',
        fixSuggestion: 'Operatör konumunu kontrol edin'
      },
      'W602': {
        turkishExplanation: 'Operatör öncesi/sonrası satır sonu',
        badExample: 'if (a and\n    b):',
        goodExample: 'if (a\n    and b):',
        fixSuggestion: 'Operatör konumunu kontrol edin'
      },
      'W603': {
        turkishExplanation: 'Operatör öncesi/sonrası satır sonu',
        badExample: 'if (a and\n    b):',
        goodExample: 'if (a\n    and b):',
        fixSuggestion: 'Operatör konumunu kontrol edin'
      },
      'W604': {
        turkishExplanation: 'Operatör öncesi/sonrası satır sonu',
        badExample: 'if (a and\n    b):',
        goodExample: 'if (a\n    and b):',
        fixSuggestion: 'Operatör konumunu kontrol edin'
      },
      'W605': {
        turkishExplanation: 'Operatör öncesi/sonrası satır sonu',
        badExample: 'if (a and\n    b):',
        goodExample: 'if (a\n    and b):',
        fixSuggestion: 'Operatör konumunu kontrol edin'
      },
      'W606': {
        turkishExplanation: 'Operatör öncesi/sonrası satır sonu',
        badExample: 'if (a and\n    b):',
        goodExample: 'if (a\n    and b):',
        fixSuggestion: 'Operatör konumunu kontrol edin'
      },
      'W607': {
        turkishExplanation: 'Operatör öncesi/sonrası satır sonu',
        badExample: 'if (a and\n    b):',
        goodExample: 'if (a\n    and b):',
        fixSuggestion: 'Operatör konumunu kontrol edin'
      },
      'W608': {
        turkishExplanation: 'Operatör öncesi/sonrası satır sonu',
        badExample: 'if (a and\n    b):',
        goodExample: 'if (a\n    and b):',
        fixSuggestion: 'Operatör konumunu kontrol edin'
      },
      'W609': {
        turkishExplanation: 'Operatör öncesi/sonrası satır sonu',
        badExample: 'if (a and\n    b):',
        goodExample: 'if (a\n    and b):',
        fixSuggestion: 'Operatör konumunu kontrol edin'
      },

      // C kodları (mccabe - kod karmaşıklığı)
      'C901': {
        turkishExplanation: 'Fonksiyon çok karmaşık (çok fazla dallanma)',
        badExample: 'def complex_function(x):\n    if x > 0:\n        if x < 10:\n            if x % 2 == 0:\n                return x * 2\n            else:\n                return x + 1\n        else:\n            return x - 1\n    else:\n        return 0',
        goodExample: 'def simple_function(x):\n    if x <= 0:\n        return 0\n    \n    if x >= 10:\n        return x - 1\n    \n    return x * 2 if x % 2 == 0 else x + 1',
        fixSuggestion: 'Fonksiyonu daha küçük parçalara bölün'
      },

      // N kodları (naming conventions)
      'N801': {
        turkishExplanation: 'Class adı PascalCase olmalı',
        badExample: 'class my_class:',
        goodExample: 'class MyClass:',
        fixSuggestion: 'Class adlarını PascalCase ile yazın'
      },
      'N802': {
        turkishExplanation: 'Function adı snake_case olmalı',
        badExample: 'def MyFunction():',
        goodExample: 'def my_function():',
        fixSuggestion: 'Function adlarını snake_case ile yazın'
      },
      'N803': {
        turkishExplanation: 'Argument adı snake_case olmalı',
        badExample: 'def func(MyArg):',
        goodExample: 'def func(my_arg):',
        fixSuggestion: 'Argument adlarını snake_case ile yazın'
      },
      'N804': {
        turkishExplanation: 'First argument adı snake_case olmalı',
        badExample: 'def func(self, MyArg):',
        goodExample: 'def func(self, my_arg):',
        fixSuggestion: 'First argument adlarını snake_case ile yazın'
      },
      'N805': {
        turkishExplanation: 'First argument adı snake_case olmalı',
        badExample: 'def func(self, MyArg):',
        goodExample: 'def func(self, my_arg):',
        fixSuggestion: 'First argument adlarını snake_case ile yazın'
      },
      'N806': {
        turkishExplanation: 'Variable adı snake_case olmalı',
        badExample: 'MyVariable = 5',
        goodExample: 'my_variable = 5',
        fixSuggestion: 'Variable adlarını snake_case ile yazın'
      },
      'N807': {
        turkishExplanation: 'Variable adı snake_case olmalı',
        badExample: 'MyVariable = 5',
        goodExample: 'my_variable = 5',
        fixSuggestion: 'Variable adlarını snake_case ile yazın'
      },
      'N811': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N812': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N813': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N814': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N815': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N816': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N817': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N818': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N819': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N820': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N821': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N822': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N823': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N824': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N825': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N826': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N827': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N828': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N829': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N830': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N831': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N832': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N833': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N834': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N835': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N836': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N837': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N838': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N839': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N840': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N841': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N842': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N843': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N844': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N845': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N846': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N847': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N848': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N849': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N850': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N851': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N852': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N853': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N854': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N855': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N856': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N857': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N858': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N859': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N860': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N861': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N862': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N863': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N864': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N865': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N866': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N867': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N868': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N869': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N870': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N871': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N872': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N873': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N874': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N875': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N876': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N877': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N878': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N879': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N880': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N881': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N882': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N883': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N884': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N885': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N886': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N887': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N888': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N889': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N890': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N891': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N892': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N893': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N894': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N895': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N896': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N897': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N898': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N899': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },
      'N900': {
        turkishExplanation: 'Import adı snake_case olmalı',
        badExample: 'import MyModule',
        goodExample: 'import my_module',
        fixSuggestion: 'Import adlarını snake_case ile yazın'
      },

      // Backend'deki özel hata kodları
      'E404': {
        turkishExplanation: 'Dosya bulunamadı',
        badExample: 'open("nonexistent.txt")',
        goodExample: 'if os.path.exists("file.txt"):\n    with open("file.txt") as f:\n        pass',
        fixSuggestion: 'Dosya yolunu kontrol edin ve dosyanın var olduğundan emin olun'
      },
      'E998': {
        turkishExplanation: 'flake8 bulunamadı',
        badExample: 'flake8 komutu çalışmıyor',
        goodExample: 'flake8 kurulu ve PATH\'de',
        fixSuggestion: 'flake8 paketini kurun: pip install flake8'
      },
      'E999': {
        turkishExplanation: 'Syntax hatası',
        badExample: 'def func(\n    pass',
        goodExample: 'def func():\n    pass',
        fixSuggestion: 'Syntax hatasını düzeltin'
      },
      'W000': {
        turkishExplanation: 'Hiçbir sorun tespit edilmedi',
        badExample: 'Kod analizi yapıldı',
        goodExample: 'Kod analizi yapıldı',
        fixSuggestion: 'Kodunuz temiz görünüyor!'
      }
    }

    return issueMap[code] || {
      turkishExplanation: 'Bilinmeyen kod hatası',
      badExample: 'Örnek kod bulunamadı',
      goodExample: 'Düzeltilmiş kod bulunamadı',
      fixSuggestion: 'Kodunuzu kontrol edin'
    }
  }

  // Severity için Türkçe açıklamalar
  static getSeverityTurkish(severity: string): string {
    const severityMap: Record<string, string> = {
      'error': 'Hata',
      'warning': 'Uyarı',
      'info': 'Bilgi',
      'convention': 'Kural',
      'naming': 'İsimlendirme'
    }
    return severityMap[severity] || severity
  }

  // Not için Türkçe açıklamalar
  static getGradeTurkish(grade: string): string {
    const gradeMap: Record<string, string> = {
      'A': 'Mükemmel',
      'B': 'İyi',
      'C': 'Orta',
      'D': 'Zayıf',
      'F': 'Kötü'
    }
    return gradeMap[grade] || grade
  }

  // Değerlendirme için Türkçe açıklamalar
  static getEvaluationTurkish(evaluation: string): string {
    const evaluationMap: Record<string, string> = {
      // Backend'den gelen evaluation'lar
      'Excellent code quality 🟢': 'Mükemmel kod kalitesi',
      'Very good 🟢': 'Çok iyi',
      'Good 🟡': 'İyi',
      'Satisfactory 🟡': 'Yeterli',
      'Needs improvement 🟠': 'İyileştirme gerekli',
      'Poor quality 🔴': 'Kötü kalite',
      'Critical issues ❌': 'Kritik sorunlar',
      
      // Eski İngilizce evaluation'lar (geriye uyumluluk için)
      'Excellent code quality! 🎉': 'Mükemmel kod kalitesi',
      'Good code quality 👍': 'İyi kod kalitesi',
      'Average code quality ⚠️': 'Orta kod kalitesi',
      'Below average code quality ❌': 'Ortalamanın altında kod kalitesi',
      'Critical issues ❌': 'Kritik sorunlar',
      
      // Alternatif İngilizce metinler
      'Excellent code quality': 'Mükemmel kod kalitesi',
      'Good code quality': 'İyi kod kalitesi',
      'Average code quality': 'Orta kod kalitesi',
      'Below average code quality': 'Ortalamanın altında kod kalitesi',
      'Critical issues': 'Kritik sorunlar',
      'Poor code quality': 'Kötü kod kalitesi',
      'Very good code quality': 'Çok iyi kod kalitesi',
      'Fair code quality': 'Orta kod kalitesi',
      
      // Türkçe metinler (zaten Türkçe ise olduğu gibi döndür)
      'Mükemmel kod kalitesi! 🎉': 'Mükemmel kod kalitesi',
      'İyi kod kalitesi 👍': 'İyi kod kalitesi',
      'Orta kod kalitesi ⚠️': 'Orta kod kalitesi',
      'Ortalamanın altında kod kalitesi ❌': 'Ortalamanın altında kod kalitesi',
      'Kritik sorunlar ❌': 'Kritik sorunlar'
    }
    return evaluationMap[evaluation] || evaluation
  }
}

export default TurkishCodeAnalyzer