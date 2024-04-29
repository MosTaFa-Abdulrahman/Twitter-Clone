import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile/Profile";
import Notification from "./pages/notification/Notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}

      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <Notification /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>

      {authUser && <RightPanel />}

      <ToastContainer />
    </div>
  );
}

export default App;

// function App() {
//   const [data, setData] = useState([]);

//   const fetchData = async () => {
//     // Fetch data from your API or any source
//     try {
//       const response = await fetch('your-api-endpoint');
//       const fetchedData = await response.json();
//       setData(fetchedData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     // Code to delete item with id
//     try {
//       // Example: Delete item from your API
//       await fetch(`your-api-endpoint/${id}`, {
//         method: 'DELETE'
//       });
//       // After deletion, refetch data
//       fetchData();
//     } catch (error) {
//       console.error('Error deleting item:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []); // Runs only once on component mount

//   return (
//     <div>
//       {/* Render data */}
//       {data.map(item => (
//         <div key={item.id}>
//           <span>{item.name}</span>
//           <button onClick={() => handleDelete(item.id)}>Delete</button>
//         </div>
//       ))}
//     </div>
//   );
// }
