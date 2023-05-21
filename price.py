def shopping(shop_file):
    shop_dict = {}

    with open(code_path / shop_file, mode='r', encoding='utf-8') as f:    
      for line in f:
        price_of_goods = line.strip().split() 
        if price_of_goods != []:      
          goods, price = price_of_goods 
        if price != shop_file[4]:
          shop_dict[goods] = int(price.rstrip('원'))

    return shop_dict
    
def item_price(shop_file, item):
  return shopping(shop_file)[item]
