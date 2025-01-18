import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/home/home";
import Favorites from "./pages/favorites/favorites";
import MovieDetails from "./pages/movie-details/movie-details";
import PersonDetails from "./pages/person-details/person-details";
import Quiz from "./pages/quiz/quiz";

function MovieMap() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/details/:mediaType/:id" element={<MovieDetails />} />
        <Route path="/person/:id" element={<PersonDetails />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MovieMap />);
