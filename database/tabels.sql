
CREATE TABLE company (
	company_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	address_id INT NOT NULL,
	category VARCHAR(100),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);

CREATE TABLE suppliers (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	phone VARCHAR(20),
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	address_id INT,
	company_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (address_id) REFERENCES addresses(address_id),
	FOREIGN KEY (company_id) REFERENCES company(company_id)
);

CREATE TABLE product (
    product_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    purchase_price NUMERIC(10,2) NOT NULL,
    selling_price NUMERIC(10,2) NOT NULL,
	company_id INT NOT NULL,
	color VARCHAR(50),
	image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (company_id) REFERENCES company(company_id)
);

CREATE TABLE product_inventory (
    product_inventory_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INT NOT NULL,
	quantity INT NOT NULL,
	FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE shopping_cart (
    shopping_cart_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    purchase_amount NUMERIC(10,2) NOT NULL,
    customer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE shopping_history(
	shopping_history_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	shopping_cart_id INT NOT NULL,
	date DATE NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (shopping_cart_id) REFERENCES shopping_cart(shopping_cart_id)

);

CREATE TABLE cart_items (
    cart_item_id INT NOT NULL,
    shopping_cart_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (shopping_cart_id, product_id),
    FOREIGN KEY (shopping_cart_id) REFERENCES shopping_cart(shopping_cart_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);


