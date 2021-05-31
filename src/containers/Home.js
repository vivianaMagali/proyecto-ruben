import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
export default function Home(props) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        console.log(notes.status)
        setNotes(notes.data);
        console.log("AQUI  NOTES")
        console.log(notes)
      } catch (e) {
        alert(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [props.isAuthenticated]);

  function loadNotes() {

    //   API.get("notes", "/notes").then(response => {
    //    console.log(response)
    // }).catch(error => {
    //     console.log(error.response)
    // });

    let apiName = 'notes';
    let path = '/notes';
    let myInit = { // OPTIONAL
      headers: {}, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {  // OPTIONAL
        name: 'param'
      }
    }
    // API.get(apiName, path, myInit).then(response => {
    //   console.log(response)
    //   console.log(response.data)
    //   return response.data
    // }).catch(error => {
    //   console.log(error.response)
    // });
    console.log(API.get("notes", "/notes"))
    return API.get("notes", "/notes",myInit);
  }
  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroupItem header={note.content.trim().split("\n")[0]}>
            {"Created: " + new Date(note.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
          <LinkContainer key="new" to="/notes/new">
            <ListGroupItem>
              <h4>
                <b>{"\uFF0B"}</b> Create a new note
            </h4>
            </ListGroupItem>
          </LinkContainer>
        )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          {!isLoading && renderNotesList(notes)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}