import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useParams, useNavigate, Navigate } from "react-router-dom";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
const EditorPage = () => {
    const [clients, setClients] = useState([]);
    const reactNavigator = useNavigate();
    const { roomId } = useParams();
    const location = useLocation();
    const codeRef = useRef(null);
    const socketRef = useRef(null);
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleError(err));
            socketRef.current.on('connect_failed', (err) => handleError(err));

            function handleError(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                username: location.state?.username,
                roomId
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);

                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: socketRef.current.code,
                    socketId,
                });
            });
            // Listening if user is disconnected
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => {
                    return prev.filter(client => client.socketId !== socketId)
                })
            })
        }
        init();
        return () => {
            // unsubscribe from socket events
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
            socketRef.current.disconnect();
        }
    }, []);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied to clipboard.');
        } catch (err) {
            toast.error('Could not copy room ID to clipboard.');
            console.log(err);
        }
    }

    const leaveRoom = () => {
        reactNavigator('/');

    }
    if (!location.state) {
        return <Navigate to="/" />
    }
    return <div className="mainWrap">
        <div className="aside">
            <div className="asideInner">
                <div className="logo">
                    <img src="/code-sync.png" alt="logo" className="logoImage" />
                </div>
                <h3>Connected</h3>
                <div className="clientsList">
                    {clients.map(client => <Client username={client.username} key={client.socketId} />)}
                </div>
            </div>
            <button className="btn copyBtn" onClick={copyRoomId}>Copy Room ID</button>
            <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>

        </div>
        <div className="editorWrap ">
            <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {
                codeRef.current = code;
            }} />
        </div>

    </div>
}
export default EditorPage;