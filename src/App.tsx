import { Route, Routes } from "react-router";
import Homepage from "./Pages/Homepage/Homepage";
import Chatpage from "./Pages/ChatPage/Chatpage";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/chats" element={<Chatpage/>}/>
      </Routes>
    </>
  )
}

export default App
