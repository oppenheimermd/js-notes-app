export default class NotesAPI{
    static getAllNotes(){ 
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]" );

        return notes.sort((a, b) => {
            return  new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    static saveNote(noteToSave){
        const notes = NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);

        //  Edit / Update
        if(existing){
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        }else{
            //  Insert
            noteToSave.id = Math.floor(Math.random() * 1000000);
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
        }

        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

    static deleteNote(id){
        const notes = NotesAPI.getAllNotes();
        //  Everthing but the id passed in
        const newNotes = notes.filter(note => note.id != id);

        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));        
    }

    //  clean up demo/testing notes
    static purgeNotes(){

        const notes = [];


        let newNote1 = {
            title: "Hello! I'm a note", 
            body: "Feel freed to edit me!", 
            updated: new Date().toISOString(), 
            id: Math.floor(Math.random() * 1000000) 
        };
        notes.push(newNote1);
        let newNote2 = {
            title: "Yeah, I'm anothe note!", 
            body: "Don't leave me out, feel free to edit me as well!", 
            updated: new Date().toISOString(), 
            id: Math.floor(Math.random() * 1000000) 
        };
        notes.push(newNote2);

        localStorage.setItem("notesapp-notes", JSON.stringify(notes)); 
    }

}