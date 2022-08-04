import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id);
        toast.success('Created a new room');
    }
    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('Room Id and username is required');
            return;
        }
        // Redirect to editor page
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            }
        })
    }
    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    }
    return <div className="homePageWrapper">
        <div className="formWrapper">
            <img src="/code-sync.png" alt="code-sync-logo" className="HomePageLogo" />
            <h4 className="mainLabel">Paste Invitation Room Id</h4>
            <div className="inputGroup">
                <input type="text" className="inputBox" placeholder="Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} onKeyUp={handleInputEnter} />
                <input type="text" className="inputBox" placeholder="Username" onChange={(e) => setUsername(e.target.value)} onKeyDown={handleInputEnter} />
                <button className="btn joinBtn" onClick={joinRoom}>Join</button>
                <span className="createInfo">
                    If you don't have an invite then create &nbsp; <a onClick={createNewRoom}
                        href="/"
                        className="createNewBtn">new room</a>
                </span>
            </div>
        </div>
        <footer>
            <h4> Built with 💛 by &nbsp;<a href="https://github.com/J-Ankit2020">Ankit</a></h4>
        </footer>
    </div>
}
export default Home;