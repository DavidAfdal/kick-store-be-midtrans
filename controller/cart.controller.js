import Cart from '../models/cart.model.js';
import { Op } from 'sequelize';
import Shoe from '../models/shoe.model.js';
import Image from '../models/image.model.js';
import apiRespon from '../utils/apiRespon.js';
import sequelize from '../config/db.config.js';

const AddItemToCart = async (req, res, next) => {
  const { userId } = req.user;
  const { shoeId, cart_color, cart_size, price } = req.body;

  try {
    const exitedCartItem = await Cart.findOne({
      where: {
        [Op.and]: [{ shoe_id: shoeId }, { shoe_color: cart_color }, { shoe_size: cart_size }, { user_id: userId }],
      },
    });
    
    let data;
    if (exitedCartItem) {

      const cart = await Cart.findOne({ where: { id: exitedCartItem.id },  
      attributes: { exclude: ['createdAt', 'user_id' , 'updatedAt'] },
      include: [
        {
          model: Shoe,
          attributes: [
            'name',
            'category',
            'type',
            [
              sequelize.literal(`(
            SELECT url FROM images as image  WHERE image.shoe_id = shoe.id AND image.type = 'THUMBNAIL'
        )`),
              'thumbImg',
            ],
          ],
        },
      ],}, );
      cart.quantity +=1
      await cart.save();
      data = cart

    } else {
      const newCart = await Cart.create({
        shoe_id: shoeId,
        user_id: userId,
        shoe_color: cart_color,
        shoe_size: cart_size,
        quantity: 1,
        price: parseInt(price)
      });

      
      data = await Cart.findOne({ where: { id: newCart.id },  
        attributes: { exclude: ['createdAt', 'user_id' , 'updatedAt'] },
        include: [
          {
            model: Shoe,
            attributes: [
              'name',
              'category',
              'type',
              [
                sequelize.literal(`(
              SELECT url FROM images as image  WHERE image.shoe_id = shoe.id AND image.type = 'THUMBNAIL'
          )`),
                'thumbImg',
              ],
            ],
          },
        ],}, );
      
    }

    return res.json(apiRespon.StatusGetData("succes", data));
  } catch (error) {
    console.log(error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

const GetItemsInCart = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'user_id'] },
      include: [
        {
          model: Shoe,
          attributes: [
            'name',
            'category',
            'type',
            [
              sequelize.literal(`(
            SELECT url FROM images as image  WHERE image.shoe_id = shoe.id AND image.type = 'THUMBNAIL'
        )`),
              'thumbImg',
            ],
          ],
        },
      ],
    });

    res.json(apiRespon.StatusGetData('Sucess Get Items In Cart', cartItems));
  } catch (error) {
    console.log(error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

const IncrementQuantityCart = async(req, res, next) => {
  const {itemId} = req.params;

  try {
    const cartItem = await Cart.findByPk(parseInt(itemId));
    if(!cartItem) {
      return res.status(404).json(apiRespon.StatusNotFound("Data Not Found"));
    }
    cartItem.quantity += 1;
    await cartItem.save();
    return res.status(200).json(apiRespon.StatusGetData("Succes", cartItem))
  } catch (error) {
    console.log(error);
    return res.status(500).json(apiRespon.StatusIntervalServerError(error))
  }
};

const DecrementQuantityCart = async(req, res, next) => {
  const {itemId} = req.params;

  try {
    const cartItem = await Cart.findByPk(itemId);
    if(!cartItem) {
      return res.status(404).json(apiRespon.StatusNotFound("Data Not Found"));
    }

    if(cartItem.quantity < 1) {
      return res.status(400).json(apiRespon.StatusCostumRespon(`can't decrement quantity item`, 400, "bad request"))
    }
    cartItem.quantity -= 1;
    await cartItem.save();
    return res.status(200).json(apiRespon.StatusGetData("Succes", cartItem))
  } catch (error) {
    return res.status(500).json(apiRespon.StatusIntervalServerError(error))
  }
};  

const DeleteItemCart = async (req, res, next) => {
  const { cartId } = req.params;

  
  try {
    const findData = await Cart.findByPk(cartId)
    if(!findData) {
      return res.status(404).json(apiRespon.StatusNotFound("Data By this cart id not found"))
    }
   await Cart.destroy({ where: { id: cartId }});

    res.json(apiRespon.StatusGetData("Succes Delete Data", findData));
  } catch (error) {
    console.log(error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

export default {
  AddItemToCart,
  GetItemsInCart,
  DecrementQuantityCart,
  IncrementQuantityCart,
  DeleteItemCart,
};
