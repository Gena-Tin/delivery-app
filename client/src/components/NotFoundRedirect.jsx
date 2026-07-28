import { Navigate } from "react-router-dom";

export const NotFoundRedirect = () => {
  return <Navigate to="/" />;
};
