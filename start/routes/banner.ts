import Route from "@ioc:Adonis/Core/Route";

Route.resource("banner", "BannersController")
  .apiOnly()
  .middleware({
    index: "guest",
    store: ["auth", "bannerLimit"],
    update: "auth",
    destroy: "auth",
  });
Route.get("banner/all/list", "BannersController.allList").middleware("auth");
Route.delete("banner/:id/images", "BannersController.deleteImages").middleware(
  "auth"
);
