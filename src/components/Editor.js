import { useEffect, useRef, useState } from "react";
import React from "react";
import CodeMirror from "codemirror";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/tomorrow-night-bright.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/mode/clike/clike'
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/keymap/sublime';
import ACTIONS from "../Actions";
const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const themes = ['dracula', 'monokai', 'material', 'eclipse', 'tomorrow-night-bright', 'material-darker'];
    const editorRef = useRef();
    useEffect(() => {
        async function init() {
            editorRef.current = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
                mode: { name: 'text/x-java' },
                autoCloseTags: 'true',
                keyMap: 'sublime',
                theme: 'dracula',
                autoCloseBrackets: true,
                placeholder: 'Please enter the JavaScript code.',
                lineNumbers: true,
            })
            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code
                    });
                }
            });
        }
        init()
    }, []);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }
        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        }
    }, [socketRef.current])

    const selectThemes = (e) => {
        editorRef.current.setOption('theme', e.target.value);
    }
    return (<><textarea id="codeEditor">
    </textarea>
        <section id="header-container">
            <select id="themeOptions" onChange={selectThemes}>
                <option disabled selected>Theme</option>
                {themes.map(theme => <option key={theme} value={theme}>{theme}</option>)}
            </select>
        </section>
    </>)
}
export default Editor;