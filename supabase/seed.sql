-- Demo content. Safe to delete once the real catalogue is entered in /admin.

INSERT INTO categories (id, slug, name, sort) VALUES
 (1,'t-shirts','T-Shirts',1),(2,'shirts','Shirts',2),(3,'trousers','Trousers',3),(4,'dresses','Dresses',4),(5,'accessories','Accessories',5) ON CONFLICT DO NOTHING;
INSERT INTO products (id, slug, name, description, price, compare_price, category_id, is_featured, is_new) VALUES
 (1,'classic-heavy-tee','Classic Heavy Tee','240 GSM combed cotton with a boxy, structured fit. Pre-washed so it stays true to size.',3490,NULL,1,1,1),
 (2,'linen-resort-shirt','Linen Resort Shirt','Breathable pure linen made for Colombo humidity. Relaxed collar, coconut-shell buttons.',6990,7990,2,1,1),
 (3,'tailored-chino','Tailored Chino','Stretch cotton twill with a clean taper. Smart enough for the office, easy enough for the weekend.',7490,NULL,3,1,0),
 (4,'ceylon-wrap-dress','Ceylon Wrap Dress','Flowing viscose wrap dress with a fluid hem and adjustable tie waist.',8990,NULL,4,1,1),
 (5,'oversized-hoodie','Oversized Hoodie','Brushed-back fleece, dropped shoulders, double-lined hood.',8490,9990,1,0,1),
 (6,'canvas-tote','Everyday Canvas Tote','Heavy 12oz canvas, internal zip pocket, reinforced straps.',2990,NULL,5,0,0) ON CONFLICT DO NOTHING;
INSERT INTO product_variants (product_id, size, color, color_hex, stock) VALUES
 (1,'S','Black','#111111',12),(1,'M','Black','#111111',20),(1,'L','Black','#111111',15),(1,'XL','Black','#111111',6),
 (1,'S','Bone','#E7E0D3',8),(1,'M','Bone','#E7E0D3',14),(1,'L','Bone','#E7E0D3',10),
 (2,'S','Sand','#CDB891',6),(2,'M','Sand','#CDB891',10),(2,'L','Sand','#CDB891',8),(2,'M','Sage','#8A9A7B',5),(2,'L','Sage','#8A9A7B',4),
 (3,'30','Navy','#1F2A44',7),(3,'32','Navy','#1F2A44',9),(3,'34','Navy','#1F2A44',9),(3,'36','Navy','#1F2A44',4),
 (3,'32','Khaki','#A89A78',6),(3,'34','Khaki','#A89A78',6),
 (4,'S','Terracotta','#B5573A',5),(4,'M','Terracotta','#B5573A',8),(4,'L','Terracotta','#B5573A',3),
 (5,'M','Charcoal','#3A3A3C',10),(5,'L','Charcoal','#3A3A3C',12),(5,'XL','Charcoal','#3A3A3C',0),
 (6,'One size','Natural','#E9DFC8',30) ON CONFLICT DO NOTHING;
INSERT INTO settings (k, v) VALUES ('brand_name','Lanka Wear') ON CONFLICT DO NOTHING;
SELECT setval(pg_get_serial_sequence('categories','id'), (SELECT MAX(id) FROM categories));
SELECT setval(pg_get_serial_sequence('products','id'), (SELECT MAX(id) FROM products));
