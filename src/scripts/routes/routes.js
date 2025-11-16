import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/login/login-page";
import RegisterPage from "../pages/register/register-page";
import AddStoryPage from "../pages/add/add-story-pages";
import BookmarkPage from "../pages/bookmark/bookmark-page";
import DetailPage from "../pages/detail/detail-page";

const routes = {
  "/": new LoginPage(),
  "/register": new RegisterPage(),
  "/home": new HomePage(),
  "/about": new AboutPage(),
  "/add": new AddStoryPage(),
  "/bookmark": new BookmarkPage(),
  "/stories/:id": new DetailPage(),
};

export default routes;
