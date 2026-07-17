import express from "express";
import { addShow, getManyShows, getNowPlayingMovies, getOneShow } from "../controllers/showControllers.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get('/now-playing',protectAdmin, getNowPlayingMovies)
showRouter.post('/add',protectAdmin, addShow)
showRouter.get('/all',getManyShows)
showRouter.get('/:movieId', getOneShow)
export default showRouter;