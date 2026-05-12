import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Toaster position="bottom-left"
        toastOptions={{
          duration: 3000,
          style: {
            zIndex: 999999,
          },
        }} />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;