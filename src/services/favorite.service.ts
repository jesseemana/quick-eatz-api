import Favorite, { FavoriteModelType } from '../models/favorites';

async function findAll() {
  const bookmarks = await Favorite.find({});
  return bookmarks;
}

async function getUserFavorites(user: string) {
  const favorites = await Favorite.find({ user });
  return favorites;
}

async function findFavorite({ user, restaurant }: FavoriteModelType) {
  const favorite = await Favorite.findOne({ user, restaurant });
  return favorite;
}

async function createFave(data: FavoriteModelType) {
  const favorite = await Favorite.create(data);
  return favorite;
}

export default { 
  findFavorite, 
  createFave, 
  findAll, 
  getUserFavorites, 
}
