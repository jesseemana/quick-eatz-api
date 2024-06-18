import { Request, Response } from 'express';
import { RestaurantService } from '../services';
import { SearchType } from '../schema/restaurant.schema';
import { log } from '../utils';

async function getRestaurant(
  req: Request<SearchType, {}, {}>, 
  res: Response
) {
  try {
    const { restaurantId } = req.params;

    const restaurant = await RestaurantService.findRestauntById(restaurantId as string);
    if (!restaurant) return res.status(404).json({ message: 'restaurant not found' });

    res.status(200).send(restaurant);
  } catch (error) {
    log.error(`An error occurred. ${error}`);
    res.status(500).json({ message: 'Internal Server Error!' });
  }
};

async function searchRestaurant(
  req: Request<SearchType, {}, {}>, 
  res: Response
) {
  try {
    const { city } = req.params;

    // QUERIES
    const searchQuery = (req.query.searchQuery as string) || '';
    const selectedCuisines = (req.query.selectedCuisines as string) || '';
    const sortOption = (req.query.sortOption as string) || 'lastUpdated';

    // PAGINATION
    const page = parseInt(req.query.page as string) || 1;
    const limit = 30;
    const skip = (page - 1) * limit;

    let query: any = {};

    query['city'] = new RegExp(city as string, 'i');
    const city_check = await RestaurantService.countRestaurants(query);
    if (city_check === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          page: 1,
          pages: 1,
          total: 0,
        }
      });
    }

    if (selectedCuisines){ 
      const cuisines = selectedCuisines.split(',').map(cuisine => new RegExp(cuisine, 'i')); 
      query['cuisines'] = { $all: cuisines };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      query['$or'] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const restaurants = await RestaurantService.searchRestaurant({ limit, skip, query, sortOption });

    const total = await RestaurantService.countRestaurants(query);

    res.status(200).json({
      data: restaurants,
      pagination: {
        page: page,
        total: total,
        pages: Math.ceil(total/limit),
      },
    });
  } catch (error) {
    log.error(`An error occurred. ${error}`);
    return res.status(500).send('Internal Server Error!');
  }
};

export default { getRestaurant, searchRestaurant, };
