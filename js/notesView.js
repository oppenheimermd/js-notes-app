export default class NotesView{
    // Constructor:
    //  - root element div id=app / class=notes. Called when we initialze  the app
    //
    //  - object, by default, an empty object if nothing is passed to it.  We'll be
    //    using object destructing here(second param) 
    //    see (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}){
        //  Save this data
        this.root = root;// root as in root element
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        //  This is where we are going to be using JavaScript to render out the view
        this.root.innerHTML = `
        <div class="notes__sidebar">
            <button class="notes__add" type="button">
                Add Note
            </button>
            <div class="notes__list">
            </div>
        </div>
        <div class="notes__preview">
            <input class="notes__title" type="text" placeholder="New note...">
            <textarea class="notes__body">
                Take note...
            </textarea>
        </div>
        `;

        //  Add click listner for addNewNote
        const btnAddNote = this.root.querySelector(".notes__add");
        const inputTitle = this.root.querySelector(".notes__title");
        const inputBody = this.root.querySelector(".notes__body");

        btnAddNote.addEventListener("click", ()=> {
            this.onNoteAdd();
        });

        //  Whenever the user exits out fo the input / textarea field, we need to fire off
        //  an onNoteEdit event.  We're going to grab both
        [inputTitle, inputBody].forEach(inputField => {
            //  Listen for the blur event
            inputField.addEventListener("blur", () => {
                const updatedTitle =  inputTitle.value.trim();
                const updatedBody =  inputBody.value.trim();

                //  Fire  onNoteEdit
                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

        //  Set default visibility of the preview pane, hidden by default
        this.updateNotePreviewVisibility(false);

    }

    //  "_" denotes this is, or should be used as a private method
    //  This creates the string for one of our sidebar items
    _createListItemHtml(id, title, body, updated){
        //  max length before ellipise shows to shorten our
        //   body length
        const MAX_BODY_LENGTH = 60;

        //  return the html
        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">
                    ${title}
                </div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : "" }
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, {dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    //  Update the list of notes in the sidebar
    updateNoteList(notes){
        //  list of notes container
        const notesListContainer = this.root.querySelector(".notes__list");

        //  Empty list
        notesListContainer.innerHTML = "";

        for(const note of notes){
            const html = this._createListItemHtml(
                note.id, 
                note.title, 
                note.body, 
                new Date(note.updated)
            );

            //  Insert the html before the end of our container(consecutively)
            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        //  Add the select/delete event for each list item(note)
        notesListContainer.querySelectorAll(".notes__list-item").forEach(
            noteListItem => {
                noteListItem.addEventListener("click", ()=> {
                    //  The dataset read-only property of the HTMLElement interface provides 
                    //  read/write access to custom data attributes (data-*) on elements. It 
                    //  exposes a map of strings (DOMStringMap) with an entry for each 
                    //  data-* attribute.
                    //  See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
                    //  
                    //  Also see" "<div class="notes__list-item" data-note-id="${id}">" in
                    //  _createListItemHtml() above.
                    this.onNoteSelect(noteListItem.dataset.noteId);
                });
                
               noteListItem.addEventListener("dblclick",  () => {
                    // confirm delete
                    const doDelete = confirm("Are you sure you wish to delete this note?");

                    if(doDelete)
                    {
                        this.onNoteDelete(noteListItem.dataset.noteId);
                    }

               });
            });
        
    }

    /**
     * Update the currently active note with the .selected class
     * @param {*} note - Active note instance.
     */
    updateActiveNote(note){
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        // get our notes
        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            //  If any of our noteListItems have the  class selected; remove it
            //  Element.classList - read-only property that returns a live 
            //  DOMTokenList collection of the class attributes of the element. 
            //  This can then be used to manipulate the class list.
            noteListItem.classList.remove("notes__list-item--selected");
        });

        //  Remember Document.querySelector() simply  returns the first Element within 
        //  the document that matches the specified selector, or group of selectors. 
        //  If no matches are found, null is returned.  Notice the difference in uss of
        //  it's similar method .querySelectorAll() used above
        //
        //  found it, use classList.add("notes__list-item--selected")
        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    //  
    /**
     * Set the notes preview CSS visibility Property.
     * @param {*} visible - bool
     */
    updateNotePreviewVisibility(visible){
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}