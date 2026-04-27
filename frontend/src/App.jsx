import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <BrowserRouter>
     <CssBaseline />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;