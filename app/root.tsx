import {
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "remix";
import type { MetaFunction } from "remix";
import clsx from "clsx";
import {
  NonFlashOfWrongThemeEls,
  Theme,
  ThemeProvider,
  useTheme,
} from "~/components/ThemeProvider";

export const meta: MetaFunction = ({ location }) => {
  const description =
    "JSON Hero makes reading and understand JSON files easy by giving you a clean and beautiful UI packed with extra features.";
  return {
    title: "JSON Viewer - JSON Hero",
    viewport: "width=device-width,initial-scale=1",
    description,
  };
};

import styles from "./tailwind.css";
import { getThemeSession } from "./theme.server";
import { getStarCount } from "./services/github.server";
import { StarCountProvider } from "./components/StarCountProvider";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export type LoaderData = {
  theme?: Theme;
  starCount?: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  const starCount = await getStarCount();

  const data: LoaderData = {
    theme: themeSession.getTheme(),
    starCount,
  };

  return data;
};

function App() {
  const [theme] = useTheme();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(theme)} />
      </head>
      <body className="overscroll-none">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const { theme, starCount } = useLoaderData<LoaderData>();

  const location = useLocation();

  // Force dark mode on the homepage
  const forceDarkMode = location.pathname === "/";

  return (
    <ThemeProvider
      specifiedTheme={theme}
      themeOverride={forceDarkMode ? "dark" : undefined}
    >
      <StarCountProvider starCount={starCount}>
        <App />
      </StarCountProvider>
    </ThemeProvider>
  );
}
