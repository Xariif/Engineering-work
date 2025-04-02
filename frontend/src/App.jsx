import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./page/Dashboard.jsx";
import Login from "./page/Login.jsx";
import NotFound from "./page/NotFound.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./components/Layout.jsx";
import Register from "./page/Register.jsx";
import Permissions from "./page/Permissions.jsx";
import Turnover from "./page/Turnover.jsx";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

function App() {
	return (
		<>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />
				<Routes>
					<Route element={<Layout />}>
						<Route path="/" element={<Dashboard />} />
						<Route path="/permissions" element={<Permissions />} />
						<Route path="/turnover" element={<Turnover />} />


					</Route>{" "}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="*" element={<NotFound />} />

				</Routes>{" "}
			</ThemeProvider>
		</>
	);
}

export default App;
