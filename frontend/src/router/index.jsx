import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../common/DefaultLayout";
import LoginPage from "../pages/LoginPage";
import OrganizationPage from "../pages/OrganizationPage";
import ProfilePage from "../pages/ProfilePage";
import DevTypeTest from "../pages/DevTestPage.jsx";
import NewsPage from "../pages/NewsPage";
import PRCommentPage from "../pages/PRCommentPage.jsx";
import ChallengePage from "../pages/ChallengePage.jsx"
export const router = createBrowserRouter([
  {
    path: "/", // 로그인 페이지
    element: <LoginPage />,
  },
  {
    path: "/", // 루트 경로 그대로 유지
    element: <DefaultLayout />,
    errorElement: <div>에러</div>,
    children: [
      {
        path: "/org/:id/:name",
        element: <OrganizationPage />,
      },
      {
        path: "/org/:id/:name/:prid",
        element: <PRCommentPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },

      {
        path: "test",
        element: <DevTypeTest />,
      },
      {
        path: "news",
        element: <NewsPage />,
      },
      {
        path: "challenged",
        element: <ChallengePage />,
      },
    ],
  },
]);
