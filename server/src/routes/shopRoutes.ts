import express from 'express';
import ShopItem from '../models/ShopItem';

const router=express.Router();

//get api/shop/all

router.get('/all',async(req,res)=>{
    try {
    const items = await ShopItem.find({});

    // Group items by category
    const grouped = items.reduce((acc: Record<string, any[]>, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    res.status(200).json({ items: grouped });
  } catch (error) {
    console.error("Error fetching all shop items:", error);
    res.status(500).json({ error: "Failed to fetch shop items" });
  }
});

export default router;