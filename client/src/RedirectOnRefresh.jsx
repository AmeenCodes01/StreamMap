import {useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";

const RedirectOnRefresh = ({children}) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (
        location.pathname.includes("/leaderboard") ||
        location.pathname.includes("/sessions")
      ) {
        const parentPath = location.pathname
          .split("/")
          .slice(0, -1)
          .join("/");
        sessionStorage.setItem("redirectPath", parentPath);
      }
    };

    const redirectIfNeeded = () => {
      const redirectPath = sessionStorage.getItem("redirectPath");
      if (redirectPath) {
        sessionStorage.removeItem("redirectPath");
        navigate(redirectPath, {replace: true});
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    redirectIfNeeded();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate, location]);

  return children;
};

export default RedirectOnRefresh;
