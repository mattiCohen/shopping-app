const pool = require("../db");

const createAddress = async (city, street, building_number) => {
    const addressResult = await pool.query(
        'INSERT INTO addresses (city, street, building_number) VALUES ($1, $2, $3) RETURNING address_id',
        [city, street, building_number]
    );
    return addressResult.rows[0].address_id;
};

const updateAddress = async ( addressId, { city, street, building_number }) => {
    await pool.query(
        'UPDATE addresses SET city = $1, street = $2, building_number = $3 WHERE address_id = $4',
        [city, street, building_number, addressId]
    );
    return addressId;
};  
const deleteAddress = async ( addressId) => {
  const result= await pool.query(
        'DELETE FROM addresses  WHERE address_id = $1',
        [addressId]
    );
    return result.rows[0];
}; 

module.exports = {
    createAddress,
    updateAddress,
    deleteAddress
};
