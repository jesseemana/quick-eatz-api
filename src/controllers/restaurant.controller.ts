import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

const getRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "restaurant not found" });

    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const { city } = req.params;

    const page = parseInt(String(req.query.page)) || 1;
    const searchQuery = String(req.query.searchQuery) || "";
    const selectedCuisines = String(req.query.selectedCuisines) || "";
    const sortOption = String(req.query.sortOption) || "lastUpdated";

    let query: any = {};

    query["city"] = new RegExp(city, "i");
    const found_cities = await Restaurant.countDocuments(query);

    if (found_cities === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines.split(",").map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const PAGE_SIZE = 10;
    const skip = (page - 1) * PAGE_SIZE;

    // sortOption = "lastUpdated"
    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean();

    const total = await Restaurant.countDocuments(query); // returns the total number of documents found in search

    res.json({
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / PAGE_SIZE),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  getRestaurant,
  searchRestaurant,
};
