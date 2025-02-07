import { html } from "lit";

import { HomeComponent } from "./pages/home";
import { SettingsComponent } from "./pages/settings";
import { UserDetailsComponent } from "./pages/user-details";
import { UsersComponent } from "./pages/users";

export const routes = [
  { path: "/", name: "home", component: HomeComponent },
  { path: "/settings", name: "settings", component: SettingsComponent },
  {
    path: "/users",
    name: "users",
    component: UsersComponent,
    children: [
      {
        path: "",
        render: () => html`<p>Select a user from the list</p>`,
      },
      {
        path: ":id",
        name: "user-detail",
        component: UserDetailsComponent,
      },
    ],
  },
];
